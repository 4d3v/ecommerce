package dbrepo

import (
	"context"
	"errors"
	"math"
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

// InsertProduct inserts a new Product into the db
func (dbrepo *postgresDbRepo) InsertProduct(prod models.Product) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		INSERT INTO products(name, image, brand, category, description, price, count_in_stock, user_id)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8)
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
		prod.UserId,
	)

	if err != nil {
		return err
	}

	return nil
}

// GetProducts retrieves all the products from the db
func (dbrepo *postgresDbRepo) GetProducts(lt time.Time) ([]models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var products []models.Product
	var query string
	var fullCount int = 0

	// That means we did not pass query param for year
	if lt.Year() == 1 {
		lt = time.Now()
	}

	// If global variable is unset, run the heavier query. (Should be run only on the first time)
	if dbrepo.App.GlobalCounts["totalProds"] == 0 {
		query = `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock, user_id,
		created_at, updated_at, count(*) OVER()
		FROM products
		WHERE created_at < $1
		ORDER BY id DESC
		FETCH FIRST 6 ROWS ONLY
		`
	} else {
		query = `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock, user_id,
		created_at, updated_at
		FROM products
		WHERE created_at < $1
		ORDER BY id DESC
		FETCH FIRST 6 ROWS ONLY
		`
	}

	rows, err := dbrepo.DB.QueryContext(ctx, query, lt)
	if err != nil {
		return products, err
	}
	defer rows.Close()

	if dbrepo.App.GlobalCounts["totalProds"] == 0 {
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
				&prod.UserId,
				&prod.CreatedAt,
				&prod.UpdatedAt,
				&fullCount,
			)

			if err != nil {
				return products, err
			}

			products = append(products, prod)
		}
	} else {
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
				&prod.UserId,
				&prod.CreatedAt,
				&prod.UpdatedAt,
			)

			if err != nil {
				return products, err
			}

			products = append(products, prod)
		}
	}

	if err = rows.Err(); err != nil {
		return products, err
	}

	if fullCount > dbrepo.App.GlobalCounts["totalProds"] {
		dbrepo.App.GlobalCounts["totalProds"] = fullCount
	}

	if dbrepo.App.GlobalCounts["totalProdPages"] == 0 {
		p := float64(fullCount) / 6.0
		dbrepo.App.GlobalCounts["totalProdPages"] = int(math.Ceil(p))
	}

	return products, nil
}

// GetProductById retrieves a product based on the specified id
func (dbrepo *postgresDbRepo) GetProductById(id int) (models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		SELECT id, name, image, brand, category, description,
		rating, sum_reviews, num_reviews, price, count_in_stock, user_id,
		created_at, updated_at FROM products
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
		&prod.SumReviews,
		&prod.NumReviews,
		&prod.Price,
		&prod.CountInStock,
		&prod.UserId,
		&prod.CreatedAt,
		&prod.UpdatedAt,
	)

	if err != nil {
		return prod, err
	}

	return prod, nil
}

// UpdateProductById updates product's data based on the provided id
func (dbrepo *postgresDbRepo) UpdateProductById(prod models.Product) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE products SET name = $1, image = $2, brand = $3, category = $4,
		description = $5, price = $6, count_in_stock = $7, updated_at = $8
		WHERE id = $9
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
		time.Now(),
		&prod.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) UpdateProductCountInStock(productId, countInStock int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE products SET count_in_stock = $1, updated_at = $2 WHERE id = $3`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		countInStock,
		time.Now(),
		productId,
	)

	if err != nil {
		return err
	}

	return nil
}

func (dbrepo *postgresDbRepo) UpdateProductReviewRating(prod models.Product) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
		UPDATE products SET rating = $1, sum_reviews = $2, num_reviews = $3, updated_at = $4
		WHERE id = $5
	`

	_, err := dbrepo.DB.ExecContext(
		ctx,
		query,
		&prod.Rating,
		&prod.SumReviews,
		&prod.NumReviews,
		time.Now(),
		&prod.Id,
	)

	if err != nil {
		return err
	}

	return nil
}

// DeleteProductById deletes a product from the db based on the provided id
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

// InsertProductReview inserts a new Product into the db
func (dbrepo *postgresDbRepo) InsertProductReview(review models.Review) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var rev models.Review

	query := `
		SELECT id, name, comment, rating FROM reviews as r WHERE r.product_id = $1 AND r.user_id = $2
	`

	row := dbrepo.DB.QueryRowContext(ctx, query, review.ProductId, review.UserId)
	err := row.Scan(
		&rev.Id,
		&rev.Name,
		&rev.Comment,
		&rev.Rating,
	)

	if err != nil && err.Error() == "sql: no rows in result set" {
		var op models.CustomOrderedProd

		query = `
				SELECT op.id, op.product_id, op.order_id, o.is_delivered 
				FROM orderedprods AS op
				JOIN orders AS o ON o.id = op.order_id
				WHERE op.product_id = $1 AND op.user_id = $2
			`

		row = dbrepo.DB.QueryRowContext(ctx, query, review.ProductId, review.UserId)
		err = row.Scan(
			&op.Id,
			&op.ProdId,
			&op.OrderId,
			&op.OrderIsDelivered,
		)

		if err != nil && err.Error() == "sql: no rows in result set" {
			return errors.New("you need to first order this product before posting a review")
		}

		if op.Id <= 0 && !op.OrderIsDelivered {
			return errors.New("you can only review the order after it was delivered")
		}

		query = `
				INSERT INTO reviews(name, comment, rating, product_id, user_id)
				VALUES($1, $2, $3, $4, $5)
			`

		_, err := dbrepo.DB.ExecContext(
			ctx,
			query,
			&review.Name,
			&review.Comment,
			&review.Rating,
			&review.ProductId,
			&review.UserId,
		)

		if err != nil {
			return err
		}
	}

	if rev.Id > 0 {
		return errors.New("user already reviewed this product")
	}

	return nil
}

// GetProductReviews gets a list of reviews for a specific product
func (dbrepo *postgresDbRepo) GetProductReviews(productId int) ([]models.Review, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var prodReviews []models.Review

	query := `
		SELECT r.id, r.name, r.comment, r.rating, r.user_id, r.product_id,
		r.created_at, r.updated_at, u.name FROM reviews AS r 
		JOIN users AS u ON u.id = r.user_id
		WHERE product_id = $1
	` // ORDER BY id ASC

	rows, err := dbrepo.DB.QueryContext(ctx, query, productId)
	if err != nil {
		return prodReviews, err
	}
	defer rows.Close()

	for rows.Next() {
		var prodReview models.Review
		err := rows.Scan(
			&prodReview.Id,
			&prodReview.Name,
			&prodReview.Comment,
			&prodReview.Rating,
			&prodReview.UserId,
			&prodReview.ProductId,
			&prodReview.CreatedAt,
			&prodReview.UpdatedAt,
			&prodReview.User.Name,
		)

		if err != nil {
			return prodReviews, err
		}

		prodReviews = append(prodReviews, prodReview)
	}

	if err = rows.Err(); err != nil {
		return prodReviews, err
	}

	return prodReviews, nil
}

// AdminGetProducts retrieves all the products from the db
func (dbrepo *postgresDbRepo) AdminGetProducts(lt time.Time, limit int, offset int) ([]models.Product, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var products []models.Product
	var fullCount int = 0
	var query string

	// That means we did not pass query param for year
	if lt.Year() == 1 {
		lt = time.Now()
	}

	// If global variable is unset, run the heavier query. (Should be run only on the first time)
	if dbrepo.App.GlobalCounts["totalProds"] == 0 {
		query = `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock, user_id,
		created_at, updated_at, count(*) OVER()
		FROM products
		WHERE created_at < $1
		LIMIT $2
		OFFSET $3
		`
	} else {
		query = `
		SELECT id, name, image, brand, category, description,
		rating, num_reviews, price, count_in_stock, user_id,
		created_at, updated_at
		FROM products
		WHERE created_at < $1
		LIMIT $2
		OFFSET $3
		`
	}

	rows, err := dbrepo.DB.QueryContext(ctx, query, lt, limit, offset)
	if err != nil {
		return products, err
	}
	defer rows.Close()

	if dbrepo.App.GlobalCounts["totalProds"] == 0 {
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
				&prod.UserId,
				&prod.CreatedAt,
				&prod.UpdatedAt,
				&fullCount,
			)

			if err != nil {
				return products, err
			}

			products = append(products, prod)
		}
	} else {
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
				&prod.UserId,
				&prod.CreatedAt,
				&prod.UpdatedAt,
			)

			if err != nil {
				return products, err
			}

			products = append(products, prod)
		}
	}

	if err = rows.Err(); err != nil {
		return products, err
	}

	if fullCount > dbrepo.App.GlobalCounts["totalProds"] {
		dbrepo.App.GlobalCounts["totalProds"] = fullCount
	}

	if dbrepo.App.GlobalCounts["totalProdPages"] == 0 {
		p := float64(fullCount) / 6.0
		dbrepo.App.GlobalCounts["totalProdPages"] = int(math.Ceil(p))
	}

	return products, nil
}
