package repository

import (
	"time"

	"github.com/4d3v/ecommerce/internal/models"
)

type DatabaseRepo interface {
	InsertProduct(models.Product) error
	GetProducts(lt time.Time) ([]models.Product, error)
	GetProductById(id int) (models.Product, error)
	UpdateProductReviewRating(prod models.Product) error
	UpdateProductCountInStock(productId, countInStock int) error
	UpdateProductById(prod models.Product) error
	DeleteProductById(id int) error
	GetProductReviews(productId int) ([]models.Review, error)
	InsertProductReview(review models.Review) error
	AdminGetProducts(lt time.Time, limit int, offset int) ([]models.Product, error)

	AdminInsertUser(usr models.User) error
	AdminGetUsers() ([]models.User, error)
	AdminUpdateUser(user models.User) error
	AdminDeleteUser(id int) error

	GetUserById(id int) (models.User, error)
	GetUserPass(id int) (string, error)
	GetUserByToken(token string) (models.User, error)

	SignUp(user models.User) (models.User, string, error)
	Login(email, password string) (models.User, string, error)
	UpdateMe(user models.User) error
	UpdatePassword(userDbPassword string, curPassword string, user models.User) error
	ForgotPassword(email string) (string, string, error)
	ResetPassword(id int, password string) error
	ActivateDisableUser(id int, active bool) error

	AdminGetOrders() ([]models.Order, error)
	AdminGetOrderById(orderId int) (models.Order, error)
	AdminUpdateOrderToPaid(id int) error
	AdminUpdateIsDelivered(id int) error

	GetOrders(userId int) ([]models.Order, error)
	GetOrderById(id, userId int) (models.Order, error)
	InsertOrder(order models.Order) (int, error)
	UpdateOrder(order models.Order) error
	PayOrder(order models.Order) error
	DeleteOrder(id int) error

	AdminGetOrderedProds(orderId int) ([]models.CustomOrderedProd, error)

	InsertOrderedProd(orderedProd models.OrderedProd) error
	GetOrderedProds(userId int, orderId int) ([]models.CustomOrderedProd, error)
}
