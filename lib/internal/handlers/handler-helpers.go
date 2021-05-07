package handlers

import "time"

const (
	owner = iota + 1 // 1
	admin            // 2
	user             // 3
)

type userJson struct {
	Id              int       `json:"id"`
	Name            string    `json:"name"`
	Email           string    `json:"email"`
	Role            int       `json:"role"` // ENUM
	Password        string    `json:"password"`
	PasswordConfirm string    `json:"password_confirm"`
	Active          bool      `json:"active"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type productJson struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	Image        string `json:"image"`
	Brand        string `json:"brand"`
	Category     string `json:"category"`
	Description  string `json:"description"`
	Rating       int    `json:"rating"`
	NumReviews   int    `json:"num_reviews"`
	Price        int    `json:"price"`
	CountInStock int    `json:"count_in_stock"`
}

type jsonMsg struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}
