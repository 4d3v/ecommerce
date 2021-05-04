package dbrepo

import (
	"context"
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
