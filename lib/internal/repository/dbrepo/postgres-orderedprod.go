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
		INSERT INTO orderedprods(user_id, product_id, order_id)
		VALUES($1, $2, $3) 
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&orderedProd.UserId,
		&orderedProd.ProductId,
		&orderedProd.OrderId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) GetOrderedProds(userId int, orderId int) ([]models.CustomOrderedProd, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// var orderedProds []models.OrderedProd
	var customOrderedProds []models.CustomOrderedProd

	query := `
        SELECT p.name, p.image, p.brand, p.price, p.count_in_stock, 
		o.id, o.total_price, u.name, u.email, op.created_at, op.updated_at 
		FROM orderedprods AS op
		JOIN products AS p ON p.id = op.product_id
		JOIN users AS u ON u.id = op.user_id
		JOIN orders AS o ON o.id = op.order_id
		WHERE op.user_id = $1 AND op.order_id = $2
    `

	rows, err := dbrepo.DB.QueryContext(ctx, query, userId, orderId)
	if err != nil {
		// return orderedProds, err
		return customOrderedProds, err
	}
	defer rows.Close()

	for rows.Next() {
		var customOrderedProd models.CustomOrderedProd

		err := rows.Scan(
			&customOrderedProd.ProdName,
			&customOrderedProd.ProdImage,
			&customOrderedProd.ProdBrand,
			&customOrderedProd.ProdPrice,
			&customOrderedProd.ProdCountInStock,
			&customOrderedProd.OrderId,
			&customOrderedProd.OrderTotalPrice,
			&customOrderedProd.UserName,
			&customOrderedProd.UserEmail,
			&customOrderedProd.OpCreated_At,
			&customOrderedProd.OpUpdatedAt,
		)

		if err != nil {
			// return orderedProds, err
			return customOrderedProds, err
		}

		customOrderedProds = append(customOrderedProds, customOrderedProd)
	}

	if err = rows.Err(); err != nil {
		// return orderedProds, err
		return customOrderedProds, err
	}

	return customOrderedProds, nil
	// return orderedProds, nil
}
