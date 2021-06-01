package dbrepo

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
	"github.com/dchest/uniuri"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

// AdminInsertUser inserts a new user into the database. Only for admins
// Normal users should use Signin method
func (dbrepo *postgresDbRepo) AdminInsertUser(usr models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usr.Password), 12)
	if err != nil {
		fmt.Println("[bcrypt]:", err)
		return err
	}
	usr.Password = string(hashedPassword)
	usr.PasswordConfirm = string(hashedPassword)

	query := `
		INSERT INTO users(name, email, role, password, password_confirm, active)
		VALUES($1, $2, $3, $4, $5, $6)
	`

	_, err = dbrepo.DB.ExecContext(
		ctx,
		query,
		&usr.Name,
		&usr.Email,
		&usr.Role,
		&usr.Password,
		&usr.PasswordConfirm,
		&usr.Active,
	)

	if err != nil {
		return err
	}

	return nil
}

// AdminGetUsers retrieves all users and info
func (dbrepo *postgresDbRepo) AdminGetUsers() ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var users []models.User

	query := `SELECT id, name, email, role, active FROM users`

	rows, err := dbrepo.DB.QueryContext(ctx, query)
	if err != nil {
		return users, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err = rows.Scan(
			&user.Id,
			&user.Name,
			&user.Email,
			&user.Role,
			&user.Active,
		)

		if err != nil {
			return users, err
		}

		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return users, err
	}

	return users, nil
}

// AdminUpdateUser updates user's data, should be used only by admins
// Can mutate critical properties such as user's role
func (dbrepo *postgresDbRepo) AdminUpdateUser(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE users SET name = $1, email = $2, role = $3,
		active = $4, updated_at = $5 WHERE id = $6
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.Active,
		time.Now(),
		&user.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

// AdminDeleteUser deletes all user's data, should be used only by admins
func (dbrepo *postgresDbRepo) AdminDeleteUser(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM users WHERE id = $1`

	res, err := dbrepo.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	found, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if found < 1 {
		return errors.New("there is no user with specified id")
	}

	return nil
}

// GetUserById retrieves user's info
func (dbrepo *postgresDbRepo) GetUserById(id int) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT id, name, email, role, active FROM users WHERE id = $1`

	var user models.User

	row := dbrepo.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&user.Id,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.Active,
	)

	if err != nil {
		return user, err
	}

	return user, nil
}

// SignUp signs a user up
func (dbrepo *postgresDbRepo) SignUp(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		fmt.Println("[bcrypt]:", err)
		return err
	}
	user.Password = string(hashedPassword)
	user.PasswordConfirm = string(hashedPassword)

	query := `
		INSERT INTO users(name, email, password, password_confirm)
		VALUES($1, $2, $3, $4)
	`

	_, err = dbrepo.DB.ExecContext(
		ctx,
		query,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.PasswordConfirm,
	)

	if err != nil {
		return err
	}

	return nil
}

// Login logs in the user
func (dbrepo *postgresDbRepo) Login(email, password string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var (
		id             int
		hashedPassword string
	)

	row := dbrepo.DB.QueryRowContext(
		ctx,
		"SELECT id, password from users where email = $1",
		email,
	)

	err := row.Scan(&id, &hashedPassword)
	if err != nil {
		return "", errors.New("incorrect email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return "", errors.New("incorrect email or password")
	} else if err != nil {
		return "", err
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(id),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day
	})

	const secretKey = "secret"

	token, err := claims.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return token, nil
}

// UpdateMe updates user's data
func (dbrepo *postgresDbRepo) UpdateMe(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE users SET name = $1, email = $2, updated_at = $3 WHERE id = $4`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&user.Name,
		&user.Email,
		time.Now(),
	)

	if err != nil {
		return err
	}

	return nil
}

// ForgotPassword sets a user's reset token and expiration time so the user can
// reset the password if expiration is still valid
func (dbrepo *postgresDbRepo) ForgotPassword(email string) (string, string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE users SET password_reset_token = $1, password_reset_expires = $2
		WHERE email = $3
		RETURNING email
	`

	var userEmail string
	hash := uniuri.New()

	err := dbrepo.DB.QueryRowContext(
		ctx,
		query,
		hash,
		time.Now().Add(time.Minute*10),
		email,
	).Scan(&userEmail)

	if err != nil {
		return "", "", err
	}

	return userEmail, hash, nil
}

// ResetPassword resets the user's password with the new provided one
func (dbrepo *postgresDbRepo) ResetPassword(id int, password string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		fmt.Println("[bcrypt]:", err)
		return err
	}
	password = string(hashedPassword)

	query := `
		UPDATE users SET password_reset_token = $1, password_reset_expires = $2,
		password = $3, password_confirm = $4
		WHERE id = $5
	`

	_, err = dbrepo.DB.ExecContext(
		ctx,
		query,
		"",
		time.Now(),
		password,
		password, // passwordConfirm should be equal to password cos of previous check
		id,
	)

	if err != nil {
		return err
	}

	return nil
}

// GetUserByToken retrieves the user based on the token
func (dbrepo *postgresDbRepo) GetUserByToken(token string) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, name, email, role, active, password_reset_token, password_reset_expires
		FROM users WHERE password_reset_token = $1
	`

	var user models.User

	row := dbrepo.DB.QueryRowContext(ctx, query, token)
	err := row.Scan(
		&user.Id,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.Active,
		&user.PasswordResetToken,
		&user.PasswordResetExpires,
	)

	if err != nil {
		return user, err
	}

	// if user.PasswordResetToken != token && user.PasswordResetExpires has expired {
	// return user, err
	// }
	if user.PasswordResetToken != token {
		return user, err
	}

	return user, nil
}

func (dbrepo *postgresDbRepo) ActivateDisableUser(id int, active bool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE users SET active = $1 WHERE id = $2`
	_, err := dbrepo.DB.ExecContext(ctx, query, !active, id)
	if err != nil {
		return err
	}

	return nil
}
