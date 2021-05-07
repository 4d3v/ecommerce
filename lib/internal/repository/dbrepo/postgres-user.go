package dbrepo

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
	"golang.org/x/crypto/bcrypt"
)

// AdminInsertUser inserts a new user into the database. Only for admins
// Normal users should use Signin method
func (dbrepo *postgresDbRepo) AdminInsertUser(usr models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usr.Password), 12)
	if err != nil {
		fmt.Println(err)
		return err
	}
	usr.Password = string(hashedPassword)
	usr.PasswordConfirm = string(hashedPassword)

	query := `
		INSERT INTO users(name, email, role, password, password_confirm)
		VALUES($1, $2, $3, $4, $5)
	`

	_, err = dbrepo.DB.ExecContext(
		ctx,
		query,
		&usr.Name,
		&usr.Email,
		&usr.Role,
		&usr.Password,
		&usr.PasswordConfirm,
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

// AdminGetUserById retrieves user's info
func (dbrepo *postgresDbRepo) AdminGetUserById(id int) (models.User, error) {
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

// TODO see how to implement JWT
// TODO func (dbrepo *postgresDbRepo) SignUp(){}
// TODO func (dbrepo *postgresDbRepo) ForgotPassword(){}
// TODO func (dbrepo *postgresDbRepo) ResetPassword(){}
// TODO func (dbrepo *postgresDbRepo) GetMyProfile(){}

// Login
func (dbrepo *postgresDbRepo) Login(email, password string) (int, error) {
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
		return id, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return 0, errors.New("incorrect password")
	} else if err != nil {
		return 0, err
	}

	return id, nil
}

// UpdateMe updates some user's data
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
