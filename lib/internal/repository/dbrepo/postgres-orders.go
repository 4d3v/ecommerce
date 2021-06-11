package dbrepo

import (
	"context"
	"errors"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

func (dbrepo *postgresDbRepo) AdminGetOpenedOrders() ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var orders []models.Order

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_status, total_price, is_paid, is_delivered, 
		product_id, user_id FROM orders
		WHERE is_delivered = $1
	` // ORDER BY id ASC

	rows, err := dbrepo.DB.QueryContext(ctx, query, false)
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

func (dbrepo *postgresDbRepo) AdminUpdateOrderToPaid(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE orders SET is_paid = $1 WHERE id = $2`

	res, err := dbrepo.DB.ExecContext(ctx, query, true, id)
	if err != nil {
		return err
	}

	found, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if found < 1 {
		return errors.New("there is no orders with specified id")
	}

	return nil
}

func (dbrepo *postgresDbRepo) AdminUpdateIsDelivered(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE orders SET is_delivered = $1 WHERE id = $2`

	res, err := dbrepo.DB.ExecContext(ctx, query, true, id)
	if err != nil {
		return err
	}

	found, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if found < 1 {
		return errors.New("there is no orders with specified id")
	}

	return nil
}

func (dbrepo *postgresDbRepo) GetOrders(userId int) ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var orders []models.Order

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_status, payment_result_update_time, total_price, 
		is_paid, paid_at, is_delivered, delivered_at, user_id, product_id,
		created_at, updated_at FROM orders WHERE user_id = $1
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
			&order.PaymentResultUpdateTime,
			&order.TotalPrice,
			&order.IsPaid,
			&order.PaidAt,
			&order.IsDelivered,
			&order.DeliveredAt,
			&order.ProductId,
			&order.UserId,
			&order.CreatedAt,
			&order.UpdatedAt,
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

func (dbrepo *postgresDbRepo) GetOrderById(id, userId int) (models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_status, payment_result_update_time, total_price, 
		is_paid, paid_at, is_delivered, delivered_at, user_id, product_id,
		created_at, updated_at FROM orders WHERE id = $1 AND user_id = $2 
	` // ORDER BY id ASC

	var order models.Order
	row := dbrepo.DB.QueryRowContext(ctx, query, id, userId)
	err := row.Scan(
		&order.Id,
		&order.PostalCode,
		&order.Address,
		&order.Country,
		&order.City,
		&order.PaymentMethod,
		&order.PaymentResultStatus,
		&order.PaymentResultUpdateTime,
		&order.TotalPrice,
		&order.IsPaid,
		&order.PaidAt,
		&order.IsDelivered,
		&order.DeliveredAt,
		&order.UserId,
		&order.ProductId,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return order, err
	}

	return order, nil
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

func (dbrepo *postgresDbRepo) UpdateOrder(order models.Order) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE orders SET postal_code = $1, address = $2, country = $3,
		city = $4, payment_method = $5 WHERE id = $6
	`

	_, err := dbrepo.DB.ExecContext(ctx, query,
		&order.PostalCode,
		&order.Address,
		&order.Country,
		&order.City,
		&order.PaymentMethod,
		&order.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) DeleteOrder(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM orders WHERE id = $1`

	res, err := dbrepo.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	found, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if found < 1 {
		return errors.New("there is no order with specified id")
	}

	return nil
}
