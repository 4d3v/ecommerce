package dbrepo

import (
	"context"
	"errors"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

func (dbrepo *postgresDbRepo) AdminGetOrders(limit, offset int) ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var orders []models.Order
	var fullCount int

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_status, total_price, is_paid, is_delivered, 
		user_id, count(*) OVER() 
		FROM orders 
		ORDER BY id DESC
		LIMIT $1
		OFFSET $2
	`

	rows, err := dbrepo.DB.QueryContext(ctx, query, limit, offset)
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
			&order.UserId,
			&fullCount,
		)

		if err != nil {
			return orders, err
		}

		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return orders, err
	}

	if fullCount > dbrepo.App.GlobalCounts["adminTotalOrders"] {
		dbrepo.App.GlobalCounts["adminTotalOrders"] = fullCount
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

	query := `UPDATE orders SET is_delivered = $1, delivered_at = $2, updated_at = $3 WHERE id = $4`

	// TEMP TODO second parameter should come from frontend
	res, err := dbrepo.DB.ExecContext(ctx, query, true, time.Now(), time.Now(), id)
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

func (dbrepo *postgresDbRepo) AdminGetOrderById(orderId int) (models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, postal_code, address, country, city, payment_method,
		payment_result_id, payment_result_status, payment_result_update_time,
		payment_result_email_address, total_price, is_paid, paid_at,
		is_delivered, delivered_at, user_id, created_at, updated_at
		FROM orders WHERE id = $1
	` // ORDER BY id ASC

	var order models.Order
	row := dbrepo.DB.QueryRowContext(ctx, query, orderId)
	err := row.Scan(
		&order.Id,
		&order.PostalCode,
		&order.Address,
		&order.Country,
		&order.City,
		&order.PaymentMethod,
		&order.PaymentResultId,
		&order.PaymentResultStatus,
		&order.PaymentResultUpdateTime,
		&order.PaymentResultEmailAddress,
		&order.TotalPrice,
		&order.IsPaid,
		&order.PaidAt,
		&order.IsDelivered,
		&order.DeliveredAt,
		&order.UserId,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return order, err
	}

	return order, nil
}

func (dbrepo *postgresDbRepo) GetOrders(userId, limit, offset int) ([]models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var (
		orders    []models.Order
		fullCount int = 0
	)

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_id, payment_result_status, payment_result_update_time, 
		payment_result_email_address, total_price, is_paid, paid_at, 
		is_delivered, delivered_at, user_id, created_at, updated_at,
		count(*) OVER() FROM orders
		WHERE user_id = $1
		ORDER BY id DESC
		LIMIT $2
		OFFSET $3
	`

	rows, err := dbrepo.DB.QueryContext(ctx, query, userId, limit, offset)
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
			&order.PaymentResultId,
			&order.PaymentResultStatus,
			&order.PaymentResultUpdateTime,
			&order.PaymentResultEmailAddress,
			&order.TotalPrice,
			&order.IsPaid,
			&order.PaidAt,
			&order.IsDelivered,
			&order.DeliveredAt,
			&order.UserId,
			&order.CreatedAt,
			&order.UpdatedAt,
			&fullCount,
		)

		if err != nil {
			return orders, err
		}

		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return orders, err
	}

	if fullCount > dbrepo.App.GlobalCounts["myTotalOrders"] {
		dbrepo.App.GlobalCounts["myTotalOrders"] = fullCount
	}

	return orders, nil
}

func (dbrepo *postgresDbRepo) GetOrderById(id, userId int) (models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, postal_code, address, country, city, payment_method, 
		payment_result_id, payment_result_status, payment_result_update_time, 
		payment_result_email_address, total_price, is_paid, paid_at,
		is_delivered, delivered_at, user_id, created_at, updated_at 
		FROM orders WHERE id = $1 AND user_id = $2 
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
		&order.PaymentResultId,
		&order.PaymentResultStatus,
		&order.PaymentResultUpdateTime,
		&order.PaymentResultEmailAddress,
		&order.TotalPrice,
		&order.IsPaid,
		&order.PaidAt,
		&order.IsDelivered,
		&order.DeliveredAt,
		&order.UserId,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return order, err
	}

	return order, nil
}

func (dbrepo *postgresDbRepo) InsertOrder(order models.Order) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var newId int

	query := `
		INSERT INTO orders(
		postal_code, address, country, city,
		payment_method, total_price, user_id)
		VALUES($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`

	err := dbrepo.DB.QueryRowContext(
		ctx,
		query,
		order.PostalCode,
		order.Address,
		order.Country,
		order.City,
		order.PaymentMethod,
		order.TotalPrice,
		order.UserId,
	).Scan(&newId)

	if err != nil {
		return newId, err
	}

	return newId, nil
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

func (dbrepo *postgresDbRepo) PayOrder(order models.Order) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE orders SET is_paid = $1, updated_at = $2, payment_result_id = $3,
		payment_result_status = $4, payment_result_update_time = $5,
		payment_result_email_address = $6 WHERE id = $7 AND user_id = $8
	`

	sqlRes, err := dbrepo.DB.ExecContext(ctx, query,
		true,
		time.Now(),
		&order.PaymentResultId,
		&order.PaymentResultStatus,
		&order.PaymentResultUpdateTime,
		&order.PaymentResultEmailAddress,
		&order.Id,
		&order.UserId,
	)

	if err != nil {
		return err
	}

	rows, err := sqlRes.RowsAffected() // Should affect a row
	if err != nil || rows == 0 {
		return errors.New("no orders found with specified id")
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
