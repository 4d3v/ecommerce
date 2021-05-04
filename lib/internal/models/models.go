package models

// Product is the product model
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
}
