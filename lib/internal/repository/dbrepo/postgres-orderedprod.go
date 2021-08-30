package dbrepo

import (
	"context"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

func (dbrepo *postgresDbRepo) InsertOrderedProd(orderedProd models.OrderedProd) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO orderedprods(user_id, product_id, order_id, qty)
		VALUES($1, $2, $3, $4) 
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&orderedProd.UserId,
		&orderedProd.ProductId,
		&orderedProd.OrderId,
		&orderedProd.Qty,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) AdminGetOrderedProds(orderId int) ([]models.CustomOrderedProd, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var customOrderedProds []models.CustomOrderedProd

	query := `
        SELECT op.id, p.name, p.image, p.brand, p.price, p.count_in_stock, 
		u.id, o.id, op.qty, op.created_at, op.updated_at FROM orderedprods AS op
		JOIN products AS p ON p.id = op.product_id
		JOIN users AS u ON u.id = op.user_id
		JOIN orders AS o ON o.id = op.order_id
		WHERE op.order_id = $1
    `

	rows, err := dbrepo.DB.QueryContext(ctx, query, orderId)
	if err != nil {
		return customOrderedProds, err
	}
	defer rows.Close()

	for rows.Next() {
		var customOrderedProd models.CustomOrderedProd

		err := rows.Scan(
			&customOrderedProd.Id,
			&customOrderedProd.ProdName,
			&customOrderedProd.ProdImage,
			&customOrderedProd.ProdBrand,
			&customOrderedProd.ProdPrice,
			&customOrderedProd.ProdCountInStock,
			&customOrderedProd.UserId,
			&customOrderedProd.OrderId,
			&customOrderedProd.ProdQty,
			&customOrderedProd.OpCreated_At,
			&customOrderedProd.OpUpdatedAt,
		)

		if err != nil {
			return customOrderedProds, err
		}

		customOrderedProds = append(customOrderedProds, customOrderedProd)
	}

	if err = rows.Err(); err != nil {
		return customOrderedProds, err
	}

	return customOrderedProds, nil
}

func (dbrepo *postgresDbRepo) GetOrderedProds(userId int, orderId int) ([]models.CustomOrderedProd, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var customOrderedProds []models.CustomOrderedProd

	query := `
        SELECT op.id, p.name, p.image, p.brand, p.price, p.count_in_stock, 
		u.id, o.id, op.qty, op.created_at, op.updated_at FROM orderedprods AS op
		JOIN products AS p ON p.id = op.product_id
		JOIN users AS u ON u.id = op.user_id
		JOIN orders AS o ON o.id = op.order_id
		WHERE op.user_id = $1 AND op.order_id = $2
    `

	rows, err := dbrepo.DB.QueryContext(ctx, query, userId, orderId)
	if err != nil {
		return customOrderedProds, err
	}
	defer rows.Close()

	for rows.Next() {
		var customOrderedProd models.CustomOrderedProd

		err := rows.Scan(
			&customOrderedProd.Id,
			&customOrderedProd.ProdName,
			&customOrderedProd.ProdImage,
			&customOrderedProd.ProdBrand,
			&customOrderedProd.ProdPrice,
			&customOrderedProd.ProdCountInStock,
			&customOrderedProd.UserId,
			&customOrderedProd.OrderId,
			&customOrderedProd.ProdQty,
			&customOrderedProd.OpCreated_At,
			&customOrderedProd.OpUpdatedAt,
		)

		if err != nil {
			return customOrderedProds, err
		}

		customOrderedProds = append(customOrderedProds, customOrderedProd)
	}

	if err = rows.Err(); err != nil {
		return customOrderedProds, err
	}

	return customOrderedProds, nil
}
