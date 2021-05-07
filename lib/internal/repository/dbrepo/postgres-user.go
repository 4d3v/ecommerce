package dbrepo

import (
	"context"
	"fmt"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func (dbrepo *postgresDbRepo) InsertUser(usr models.User) error {
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

func (dbrepo *postgresDbRepo) GetUsers() ([]models.User, error) {
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
