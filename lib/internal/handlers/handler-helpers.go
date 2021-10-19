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

		t := usersJsonOutput{
			Users: users,
			Data:  opts.dataMap,
		}

		resp, err := json.Marshal(t)
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

		t := productsJsonOutput{
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

		t := ordersJsonOutput{
			Orders: resp,
			Data:   opts.dataMap,
		}

		newJson, err := json.Marshal(t)
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

func getLimitOffset(r *http.Request) (int, int, error) {
	limit := r.URL.Query().Get("limit")
	offset := r.URL.Query().Get("offset")

	lmt, err := strconv.Atoi(limit)
	if err != nil {
		return 0, 0, fmt.Errorf("%s", err)
	}

	offs, err := strconv.Atoi(offset)
	if err != nil {
		return 0, 0, fmt.Errorf("%s", err)
	}

	if lmt < 0 || offs < 0 {
		return 0, 0, fmt.Errorf("limit or offset should not be negative")
	}

	return lmt, offs, nil
}
