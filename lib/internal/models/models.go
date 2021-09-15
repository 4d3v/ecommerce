package models

import "time"

// User is the User model
type User struct {
	Id                   int
	Name                 string
	Email                string
	Role                 int // ENUM
	Password             string
	PasswordConfirm      string
	Active               bool
	PasswordResetToken   string
	PasswordResetExpires time.Time
	CreatedAt            time.Time
	UpdatedAt            time.Time
}

// Product is the Product model
type Product struct {
	Id           int
	Name         string
	Image        string
	Brand        string
	Category     string
	Description  string
	Rating       float64
	SumReviews   float64
	NumReviews   int
	Price        int
	CountInStock int
	UserId       int
	User         User
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// Order is the Order model
type Order struct {
	Id                        int
	PostalCode                string
	Address                   string
	Country                   string
	City                      string
	PaymentMethod             int // Enum
	PaymentResultId           string
	PaymentResultStatus       string
	PaymentResultUpdateTime   time.Time
	PaymentResultEmailAddress string
	TotalPrice                float64
	IsPaid                    bool
	PaidAt                    time.Time
	IsDelivered               bool
	DeliveredAt               time.Time
	UserId                    int
	User                      User
	CreatedAt                 time.Time
	UpdatedAt                 time.Time
	// ShippingPrice int
}

// OrderedProd is the OrderedProd model
type OrderedProd struct {
	Id        int
	UserId    int
	ProductId int
	OrderId   int
	Qty       int
	CreatedAt time.Time
	UpdatedAt time.Time
}

// CustomOrderedProd is used on the GET request for /orderedprods/{orderid}
type CustomOrderedProd struct {
	Id               int
	ProdId           int
	ProdName         string
	ProdImage        string
	ProdBrand        string
	ProdPrice        int
	ProdCountInStock int
	ProdQty          int
	UserId           int
	OrderId          int
	OrderTotalPrice  int
	OrderIsDelivered bool
	OpCreated_At     time.Time
	OpUpdatedAt      time.Time
}

// Review is the Review model
type Review struct {
	Id        int
	Name      string
	Rating    float64
	Comment   string
	UserId    int
	User      User
	ProductId int
	CreatedAt time.Time
	UpdatedAt time.Time
}

// MailData holds an email message
type MailData struct {
	To       string
	From     string
	Subject  string
	Content  string
	Template string
}
