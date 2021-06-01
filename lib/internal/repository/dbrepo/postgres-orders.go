package dbrepo

import (
	"context"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

func (dbrepo *postgresDbRepo) GetOrders(userId int) ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var orders []models.Order

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_status, total_price, 
		is_paid, is_delivered, product_id, user_id
		FROM orders WHERE user_id = $1
	` // ORDER BY id ASC

	rows, err := dbrepo.DB.QueryContext(ctx, query, userId)
	if err != nil {
		return orders, err
	}
	defer rows.Close()

	for rows.Next() {
		var order models.Order

		err := rows.Scan(
			&order.Id,
			&order.PostalCode,
			&order.Address,
			&order.Country,
			&order.City,
			&order.PaymentMethod,
			&order.PaymentResultStatus,
			&order.TotalPrice,
			&order.IsPaid,
			// &order.PaidAt,
			&order.IsDelivered,
			// &order.DeliveredAt,
			&order.ProductId,
			&order.UserId,
		)

		if err != nil {
			return orders, err
		}

		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return orders, err
	}

	return orders, nil
}

func (dbrepo *postgresDbRepo) InsertOrder(order models.Order) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO orders(
		postal_code, address, country, city, payment_method, 
		total_price, user_id, product_id
		)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8)
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		order.PostalCode,
		order.Address,
		order.Country,
		order.City,
		order.PaymentMethod,
		order.TotalPrice,
		order.UserId,
		order.ProductId,
	)

	if err != nil {
		return err
	}

	return nil
}
