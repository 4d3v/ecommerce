package repository

import "github.com/4d3v/ecommerce/internal/models"

type DatabaseRepo interface {
	InsertProduct(models.Product) error
	GetProducts() ([]models.Product, error)
	GetProductById(id int) (models.Product, error)
	UpdateProductById(prod models.Product) error
	DeleteProductById(id int) error

	AdminInsertUser(usr models.User) error
	AdminGetUsers() ([]models.User, error)
	AdminUpdateUser(user models.User) error

	GetUserById(id int) (models.User, error)
	GetUserByToken(token string) (models.User, error)

	SignUp(user models.User) error
	Login(email, password string) (string, error)
	UpdateMe(user models.User) error
	ForgotPassword(email string) (string, string, error)
	ResetPassword(id int, password string) error
}
