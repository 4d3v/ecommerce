package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/dgrijalva/jwt-go"
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
	UserId       int    `json:"user_id"`
}

type msgJson struct {
	Ok      bool                `json:"ok"`
	Message string              `json:"message"`
	Error   string              `json:"error"`
	Errors  map[string][]string `json:"errors"`
}

type options struct {
	users  []models.User
	user   models.User
	prods  []models.Product
	prod   models.Product
	ok     bool
	msg    string
	err    string
	errs   map[string][]string
	stCode int
}

func sendJson(jsonType string, w http.ResponseWriter, opts *options) error {
	w.WriteHeader(opts.stCode)

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
			UserId:       opts.prod.UserId,
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
				UserId:       opts.prod.UserId,
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

func (repo *Repository) getUserByJwt(r *http.Request) (models.User, error) {
	var user models.User

	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		fmt.Println("Unauthenticated")
		return user, err
	}

	token, err := jwt.ParseWithClaims(
		jwtCookie.Value,
		&jwt.StandardClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(repo.App.Env["JWT_SECRET"]), nil
		},
	)
	if err != nil {
		fmt.Println("Unauthenticated, ParseWithClaims...")
		return user, err
	}

	claims := token.Claims.(*jwt.StandardClaims)
	userId, err := strconv.Atoi(claims.Issuer)
	if err != nil {
		fmt.Println("Error converting claims issuer (userId) to int")
		return user, err
	}

	user, err = repo.DB.GetUserById(userId)
	if err != nil {
		fmt.Printf("ERROR: %s", err)
		return user, err
	}

	return user, nil
}

func checkUserRestriction(w http.ResponseWriter, user models.User) bool {
	if user.Role != owner && user.Role != admin {
		fmt.Println("ERR user doesn't have permission")
		sendJson("msgjson", w, &options{
			ok:     false,
			msg:    "User does not have the permission for that operation",
			stCode: http.StatusForbidden,
		})
		return false
	}
	return true
}
