package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
)

const (
	owner  = iota + 1 // 1
	admin             // 2
	normal            // 3
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

type msgJson struct {
	Ok      bool                `json:"ok"`
	Message string              `json:"message"`
	Error   string              `json:"error"`
	Errors  map[string][]string `json:"errors"`
}

type options struct {
	users []models.User
	user  models.User
	prods []models.Product
	prod  models.Product
	ok    bool
	msg   string
	err   string
	errs  map[string][]string
}

func sendJson(jsonType string, w http.ResponseWriter, opts *options) error {
	switch jsonType {
	case "usersjson":
		var users []userJson

		for _, prop := range opts.users {
			p := userJson{
				Id:     prop.Id,
				Name:   prop.Name,
				Email:  prop.Email,
				Role:   prop.Role,
				Active: prop.Active,
			}

			users = append(users, p)
		}

		resp, err := json.Marshal(users)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(resp)

	case "userjson":
		resp := userJson{
			Id:     opts.user.Id,
			Name:   opts.user.Name,
			Email:  opts.user.Email,
			Role:   opts.user.Role,
			Active: opts.user.Active,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "prodjson":
		resp := productJson{
			Id:           opts.prod.Id,
			Name:         opts.prod.Name,
			Image:        opts.prod.Image,
			Brand:        opts.prod.Brand,
			Category:     opts.prod.Category,
			Description:  opts.prod.Description,
			Rating:       opts.prod.Rating,
			NumReviews:   opts.prod.NumReviews,
			Price:        opts.prod.Price,
			CountInStock: opts.prod.CountInStock,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "prodsjson":
		var resp []productJson
		for _, prod := range opts.prods {
			p := productJson{
				Id:           prod.Id,
				Name:         prod.Name,
				Image:        prod.Image,
				Brand:        prod.Brand,
				Category:     prod.Category,
				Description:  prod.Description,
				Rating:       prod.Rating,
				NumReviews:   prod.NumReviews,
				Price:        prod.Price,
				CountInStock: prod.CountInStock,
			}
			resp = append(resp, p)
		}

		newJson, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(newJson)

	case "msgjson":
		resp := msgJson{
			Ok:      opts.ok,
			Message: opts.msg,
			Error:   opts.err,
			Errors:  opts.errs,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	default:
		return nil
	}

	return nil
}
