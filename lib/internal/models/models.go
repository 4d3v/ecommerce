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
	Rating       int
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
	Id             int
	ShippingAddres string // TODO address
	PaymentMethod  int    // Enum
	PaymentResult  string
	// ShippingPrice int
	TotalPrice  int
	IsPaid      bool
	PaidAt      time.Time
	IsDelivered bool
	DeliveredAt time.Time
	UserId      int
	User        User
	ProductId   int
	OrderItem   Product
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// address is the Order's address struct
type address struct {
	PostalCode string
	Country    string
	City       string
	Address    string
}

// paymentResult is the Order's paymentResult struct
type paymentResult struct {
	Status     int
	UpdateTime time.Time
}

// MailData holds an email message
type MailData struct {
	To       string
	From     string
	Subject  string
	Content  string
	Template string
}
