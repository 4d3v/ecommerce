package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/4d3v/ecommerce/internal/forms"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/dgrijalva/jwt-go"
)

const (
	owner  = iota + 1 // 1
	admin             // 2
	normal            // 3
)

const (
	paypal = iota + 1 // 1
	stripe            // 2
)

const (
	timeFormatStr   = "2006-01-02 15:04:05.999999999 -0700 MST"
	MAX_UPLOAD_SIZE = 1024 * 1024 // 1MB
)

// timeFormatStr   = "2006-01-02 15:04:05"
// timeFormatStr   = "2006-01-02 15:04:05.999999999 -0700 MST"

type userJson struct {
	Id              int    `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Role            int    `json:"role"` // ENUM
	Password        string `json:"password"`
	PasswordConfirm string `json:"password_confirm"`
	Active          bool   `json:"active"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
}

type productJson struct {
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	Image        string  `json:"image"`
	Brand        string  `json:"brand"`
	Category     string  `json:"category"`
	Description  string  `json:"description"`
	Rating       float64 `json:"rating"`
	SumReviews   float64 `json:"sum_reviews"`
	NumReviews   int     `json:"num_reviews"`
	Price        int     `json:"price"`
	CountInStock int     `json:"count_in_stock"`
	UserId       int     `json:"user_id"`
	// User models.User
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type testtt struct {
	Products []productJson          `json:"products"`
	Data     map[string]interface{} `json:"data"`
}

type orderJson struct {
	Id                        int      `json:"id"`
	PostalCode                string   `json:"postal_code"`
	Address                   string   `json:"address"`
	Country                   string   `json:"country"`
	City                      string   `json:"city"`
	PaymentMethod             int      `json:"payment_method"`
	PaymentResultId           string   `json:"payment_result_id"`
	PaymentResultStatus       string   `json:"payment_result_status"`
	PaymentResultUpdateTime   string   `json:"payment_result_update_time"`
	PaymentResultEmailAddress string   `json:"payment_result_email_address "`
	TotalPrice                float64  `json:"total_price"`
	IsPaid                    bool     `json:"is_paid"`
	PaidAt                    string   `json:"paid_at"`
	IsDelivered               bool     `json:"is_delivered"`
	DeliveredAt               string   `json:"delivered_at"`
	UserId                    int      `json:"user_id"`
	User                      userJson `json:"user"`
	CreatedAt                 string   `json:"created_at"`
	UpdatedAt                 string   `json:"updated_at"`
	// Product models.Product
}

type customOrderedProdJson struct {
	Id               int    `json:"id"`
	ProdId           int    `json:"prod_id"`
	ProdName         string `json:"prod_name"`
	ProdImage        string `json:"prod_image"`
	ProdBrand        string `json:"prod_brand"`
	ProdPrice        int    `json:"prod_price"`
	ProdCountInStock int    `json:"prod_count_in_stock"`
	ProdQty          int    `json:"prod_qty"`
	UserId           int    `json:"user_id"`
	OrderId          int    `json:"order_id"`
	OpCreatedAt      string `json:"op_created_at"`
	OpUpdatedAt      string `json:"op_updated_at"`
}

type prodReviewsJson struct {
	Id        int     `json:"id"`
	Name      string  `json:"name"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
	UserId    int     `json:"user_id"`
	ProductId int     `json:"product_id"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	UserName  string  `json:"username"`
}

type logsignupdateSuccess struct {
	User    userJson `json:"user"`
	Ok      bool     `json:"ok"`
	Message string   `json:"message"`
}

type msgJson struct {
	Ok      bool                   `json:"ok"`
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
	Error   string                 `json:"error"`
	Errors  map[string][]string    `json:"errors"`
}

type options struct {
	users       []models.User
	user        models.User
	prods       []models.Product
	prod        models.Product
	prodReviews []models.Review
	order       models.Order
	orders      []models.Order
	cops        []models.CustomOrderedProd
	ok          bool
	msg         string
	err         string
	errs        map[string][]string
	stCode      int
	dataMap     map[string]interface{}
}

func sendJson(jsonType string, w http.ResponseWriter, opts *options) error {
	w.WriteHeader(opts.stCode)

	switch jsonType {
	case "usersjson":
		var users []userJson

		for _, prop := range opts.users {
			p := userJson{
				Id:        prop.Id,
				Name:      prop.Name,
				Email:     prop.Email,
				Role:      prop.Role,
				Active:    prop.Active,
				CreatedAt: prop.CreatedAt.Format(timeFormatStr),
				UpdatedAt: prop.UpdatedAt.Format(timeFormatStr),
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
			Id:        opts.user.Id,
			Name:      opts.user.Name,
			Email:     opts.user.Email,
			Role:      opts.user.Role,
			Active:    opts.user.Active,
			CreatedAt: opts.user.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.user.UpdatedAt.Format(timeFormatStr),
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
			// User: opts.prod.User
			CreatedAt: opts.prod.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.prod.UpdatedAt.Format(timeFormatStr),
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
				UserId:       prod.UserId,
				// User: prod.User
				CreatedAt: prod.CreatedAt.Format(timeFormatStr),
				UpdatedAt: prod.UpdatedAt.Format(timeFormatStr),
			}
			resp = append(resp, p)
		}

		t := testtt{
			Products: resp,
			Data:     opts.dataMap,
		}

		newJson, err := json.Marshal(t)
		// newJson, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(newJson)

	case "prodreviewsjson":
		var prodReviews []prodReviewsJson

		for _, prop := range opts.prodReviews {
			p := prodReviewsJson{
				Id:        prop.Id,
				Name:      prop.Name,
				Comment:   prop.Comment,
				Rating:    prop.Rating,
				UserId:    prop.UserId,
				ProductId: prop.ProductId,
				CreatedAt: prop.CreatedAt.Format(timeFormatStr),
				UpdatedAt: prop.UpdatedAt.Format(timeFormatStr),
				UserName:  prop.User.Name,
			}
			prodReviews = append(prodReviews, p)
		}

		resp, err := json.Marshal(prodReviews)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(resp)

	case "orderjson":
		usr := userJson{
			Id:        opts.order.User.Id,
			Name:      opts.order.User.Name,
			Email:     opts.order.User.Email,
			Role:      opts.order.User.Role,
			Active:    opts.order.User.Active,
			CreatedAt: opts.order.User.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.order.User.UpdatedAt.Format(timeFormatStr),
		}

		resp := orderJson{
			Id:                        opts.order.Id,
			PostalCode:                opts.order.PostalCode,
			Address:                   opts.order.Address,
			Country:                   opts.order.Country,
			City:                      opts.order.City,
			PaymentMethod:             opts.order.PaymentMethod,
			PaymentResultId:           opts.order.PaymentResultId,
			PaymentResultStatus:       opts.order.PaymentResultStatus,
			PaymentResultUpdateTime:   opts.order.PaymentResultUpdateTime.Format(timeFormatStr),
			PaymentResultEmailAddress: opts.order.PaymentResultEmailAddress,
			TotalPrice:                opts.order.TotalPrice,
			IsPaid:                    opts.order.IsPaid,
			PaidAt:                    opts.order.PaidAt.Format(timeFormatStr),
			IsDelivered:               opts.order.IsDelivered,
			DeliveredAt:               opts.order.DeliveredAt.Format(timeFormatStr),
			UserId:                    opts.order.UserId,
			User:                      usr,
			CreatedAt:                 opts.order.CreatedAt.Format(timeFormatStr),
			UpdatedAt:                 opts.order.UpdatedAt.Format(timeFormatStr),
			// Product: opts.order.Product
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "ordersjson":
		var resp []orderJson
		for _, order := range opts.orders {
			p := orderJson{
				Id:                        order.Id,
				PostalCode:                order.PostalCode,
				Address:                   order.Address,
				Country:                   order.Country,
				City:                      order.City,
				PaymentMethod:             order.PaymentMethod,
				PaymentResultId:           order.PaymentResultId,
				PaymentResultStatus:       order.PaymentResultStatus,
				PaymentResultUpdateTime:   order.PaymentResultUpdateTime.Format(timeFormatStr),
				PaymentResultEmailAddress: order.PaymentResultEmailAddress,
				TotalPrice:                order.TotalPrice,
				IsPaid:                    order.IsPaid,
				PaidAt:                    order.PaidAt.Format(timeFormatStr),
				IsDelivered:               order.IsDelivered,
				DeliveredAt:               order.DeliveredAt.Format(timeFormatStr),
				UserId:                    order.UserId,
				CreatedAt:                 order.CreatedAt.Format(timeFormatStr),
				UpdatedAt:                 order.UpdatedAt.Format(timeFormatStr),
				// User: opts.order.User
				// Product: opts.order.Product
			}

			resp = append(resp, p)
		}

		newJson, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(newJson)

	case "orderedprodsjson":
		var resp []customOrderedProdJson
		for _, cop := range opts.cops {
			copJson := customOrderedProdJson{
				Id:               cop.Id,
				ProdId:           cop.ProdId,
				ProdName:         cop.ProdName,
				ProdImage:        cop.ProdImage,
				ProdBrand:        cop.ProdBrand,
				ProdPrice:        cop.ProdPrice,
				ProdCountInStock: cop.ProdCountInStock,
				ProdQty:          cop.ProdQty,
				UserId:           cop.UserId,
				OrderId:          cop.OrderId,
				OpCreatedAt:      cop.OpCreated_At.Format(timeFormatStr),
				OpUpdatedAt:      cop.OpUpdatedAt.Format(timeFormatStr),
			}

			resp = append(resp, copJson)
		}

		newJson, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(newJson)

	case "loginsuccess":
		user := userJson{
			Id:        opts.user.Id,
			Name:      opts.user.Name,
			Email:     opts.user.Email,
			Role:      opts.user.Role,
			Active:    opts.user.Active,
			CreatedAt: opts.user.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.user.UpdatedAt.Format(timeFormatStr),
		}

		resp := logsignupdateSuccess{
			User:    user,
			Ok:      opts.ok,
			Message: opts.msg,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "signupsuccess":
		user := userJson{
			Id:        opts.user.Id,
			Name:      opts.user.Name,
			Email:     opts.user.Email,
			Role:      opts.user.Role,
			Active:    opts.user.Active,
			CreatedAt: opts.user.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.user.UpdatedAt.Format(timeFormatStr),
		}

		resp := logsignupdateSuccess{
			User:    user,
			Ok:      opts.ok,
			Message: opts.msg,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "updatesuccess":
		user := userJson{
			Id:        opts.user.Id,
			Name:      opts.user.Name,
			Email:     opts.user.Email,
			Role:      opts.user.Role,
			Active:    opts.user.Active,
			CreatedAt: opts.user.CreatedAt.Format(timeFormatStr),
			UpdatedAt: opts.user.UpdatedAt.Format(timeFormatStr),
		}

		resp := logsignupdateSuccess{
			User:    user,
			Ok:      opts.ok,
			Message: opts.msg,
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			helpers.ServerError(w, err)
		}

		w.Write(out)

	case "msgjson":
		resp := msgJson{
			Ok:      opts.ok,
			Message: opts.msg,
			Data:    opts.dataMap,
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

func (repo *Repository) GetPaypalConfigId(w http.ResponseWriter, r *http.Request) {
	dtMap := make(map[string]interface{})
	dtMap["paypal_client_id"] = repo.App.Env["PAYPAL_CLIENT_ID"]
	sendJson("msgjson", w, &options{
		ok:      true,
		msg:     "Success",
		stCode:  http.StatusOK,
		dataMap: dtMap,
	})
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

func checkPaymentMethod(f *forms.Form) int {
	var payMethod int

	switch f.Get("payment_method") {
	case "paypal":
		payMethod = paypal
	case "stripe":
		payMethod = stripe
	default:
		payMethod = paypal
	}

	return payMethod
}

func sendError(w http.ResponseWriter, errMsg string, stCode int) {
	sendJson("msgjson", w, &options{
		ok:     false,
		msg:    "Fail",
		err:    errMsg,
		stCode: stCode,
	})
}

func sendFormError(w http.ResponseWriter, errMsg string, stCode int, f *forms.Form) {
	sendJson("msgjson", w, &options{
		ok:     false,
		msg:    "Fail",
		err:    errMsg,
		errs:   f.Errors,
		stCode: stCode,
	})
}
