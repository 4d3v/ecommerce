package dbrepo

import (
	"context"
	"errors"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

func (dbrepo *postgresDbRepo) InsertProduct(prod models.Product) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO products(name, image, brand, category, description, price, count_in_stock)
		VALUES($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		prod.Name,
		prod.Image,
		prod.Brand,
		prod.Category,
		prod.Description,
		prod.Price,
		prod.CountInStock,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) GetProducts() ([]models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var products []models.Product

	query := `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock FROM products
	` // ORDER BY id ASC

	rows, err := dbrepo.DB.QueryContext(ctx, query)
	if err != nil {
		return products, err
	}
	defer rows.Close()

	for rows.Next() {
		var prod models.Product
		err := rows.Scan(
			&prod.Id,
			&prod.Name,
			&prod.Image,
			&prod.Brand,
			&prod.Category,
			&prod.Description,
			&prod.Rating,
			&prod.NumReviews,
			&prod.Price,
			&prod.CountInStock,
		)

		if err != nil {
			return products, err
		}

		products = append(products, prod)
	}

	if err = rows.Err(); err != nil {
		return products, err
	}

	return products, nil
}

func (dbrepo *postgresDbRepo) GetProductById(id int) (models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock FROM products
		WHERE id = $1
	`

	var prod models.Product

	row := dbrepo.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&prod.Id,
		&prod.Name,
		&prod.Image,
		&prod.Brand,
		&prod.Category,
		&prod.Description,
		&prod.Rating,
		&prod.NumReviews,
		&prod.Price,
		&prod.CountInStock,
	)

	if err != nil {
		return prod, err
	}

	return prod, nil
}

func (dbrepo *postgresDbRepo) UpdateProductById(prod models.Product) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE products SET name = $1, image = $2, brand = $3, category = $4,
		description = $5, price = $6, count_in_stock = $7 WHERE id = $8
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&prod.Name,
		&prod.Image,
		&prod.Brand,
		&prod.Category,
		&prod.Description,
		&prod.Price,
		&prod.CountInStock,
		&prod.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) DeleteProductById(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM products WHERE id = $1`

	res, err := dbrepo.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	found, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if found < 1 {
		return errors.New("there is no product with specified id")
	}

	return nil
}
