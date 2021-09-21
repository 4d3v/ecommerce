package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/4d3v/ecommerce/internal/forms"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/go-chi/chi"
)

// AdminGetOpenedOrders gets all the opened orders should be used only by owners and admins
func (repo *Repository) AdminGetOrders(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	orders, err := repo.DB.AdminGetOrders()
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("ordersjson", w, &options{
		ok:     true,
		msg:    "Success",
		orders: orders,
		stCode: http.StatusOK,
	})
}

// AdminGetOrderById retrieves the order by id
func (repo *Repository) AdminGetOrderById(w http.ResponseWriter, r *http.Request) {
	userAdmin, _ := repo.getUserByJwt(r)

	if userOk := checkUserRestriction(w, userAdmin); !userOk {
		return
	}

	orderId, err := strconv.Atoi(chi.URLParam(r, "orderid"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	order, err := repo.DB.AdminGetOrderById(orderId)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	user, err := repo.DB.GetUserById(order.UserId)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return

	}

	order.User = user

	sendJson("orderjson", w, &options{
		ok:     true,
		order:  order,
		stCode: http.StatusOK,
	})
}

// AdminUpdateOrderToPaid sets a specific order to paid should be used only by owners and admins
func (repo *Repository) AdminUpdateOrderToPaid(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	err = repo.DB.AdminUpdateOrderToPaid(id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	})
}

// AdminUpdateIsDelivered sets a specific order to delivered should be used only by owners and admins
func (repo *Repository) AdminUpdateIsDelivered(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	err = repo.DB.AdminUpdateIsDelivered(id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	})
}

// GetOrders gets all orders for a specific user
func (repo *Repository) GetOrders(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	orders, err := repo.DB.GetOrders(user.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("ordersjson", w, &options{
		ok:     true,
		orders: orders,
		stCode: http.StatusOK,
	})
}

// GetOrderById retrieves the order by id
func (repo *Repository) GetOrderById(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	order, err := repo.DB.GetOrderById(id, user.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	order.User = user

	sendJson("orderjson", w, &options{
		ok:     true,
		order:  order,
		stCode: http.StatusOK,
	})
}

// CreateOrder creates a new order
func (repo *Repository) CreateOrder(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, _ := repo.getUserByJwt(r)

	form := forms.New(r.PostForm)
	form.Required("postal_code", "address", "country", "city",
		"payment_method", "total_price")
	// form.IsUFloat("total_price")

	if !form.Valid() {
		fmt.Println(err)
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	// Fields bellow should already be checked for int
	payMethod := checkPaymentMethod(form)
	totalPrice, _ := strconv.ParseFloat(r.Form.Get("total_price"), 64)

	order := models.Order{
		PostalCode:    r.Form.Get("postal_code"),
		Address:       r.Form.Get("address"),
		Country:       r.Form.Get("country"),
		City:          r.Form.Get("city"),
		PaymentMethod: payMethod,
		TotalPrice:    totalPrice,
		UserId:        user.Id,
	}

	orderId, err := repo.DB.InsertOrder(order)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	dtMap := make(map[string]interface{})
	dtMap["order_id"] = orderId

	sendJson("msgjson", w, &options{
		ok:      true,
		msg:     "Order created with success",
		dataMap: dtMap,
		stCode:  http.StatusOK,
	})
}

// UpdateOrder updates an existing order
func (repo *Repository) UpdateOrder(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, _ := repo.getUserByJwt(r)

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	order, err := repo.DB.GetOrderById(id, user.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	form := forms.New(r.PostForm)
	if len(r.Form.Get("postal_code")) > 0 {
		form.MinLength("postal_code", 3)
		order.PostalCode = r.Form.Get("postal_code")
	}
	if len(r.Form.Get("address")) > 0 {
		order.Address = r.Form.Get("address")
	}
	if len(r.Form.Get("country")) > 0 {
		order.Country = r.Form.Get("country")
	}
	if len(r.Form.Get("city")) > 0 {
		order.City = r.Form.Get("city")
	}
	if len(r.Form.Get("payment_method")) > 0 {
		if order.IsPaid {
			sendError(
				w,
				"cannot change payment method, order is already paid",
				http.StatusBadRequest,
			)
			return
		}
		order.PaymentMethod = checkPaymentMethod(form)
	}

	// TODO bring it up after set form validations
	if !form.Valid() {
		fmt.Println(err)
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	// Fields bellow should already be checked for int above
	err = repo.DB.UpdateOrder(order)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	})
}

// PayOrder update to paid and set some new details to an existing order
func (repo *Repository) PayOrder(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, _ := repo.getUserByJwt(r)

	orderId, err := strconv.Atoi(chi.URLParam(r, "orderid"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("payment_result_id", "payment_result_status",
		"payment_result_update_time", "payment_result_email_address")
	form.IsEmail("payment_result_email_address")

	if !form.Valid() {
		fmt.Println(err)
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	order := models.Order{
		Id:                  orderId,
		PaymentResultId:     r.Form.Get("payment_result_id"),
		PaymentResultStatus: r.Form.Get("payment_result_status"),
		// PaymentResultUpdateTime: r.Form.Get("payment_result_update_time"), // TEMP
		PaymentResultUpdateTime:   time.Now(), // TEMP
		PaymentResultEmailAddress: r.Form.Get("payment_result_email_address"),
		UserId:                    user.Id,
	}

	err = repo.DB.PayOrder(order)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	})
}

// DeleteOrder deletes and order
func (repo *Repository) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	order, err := repo.DB.GetOrderById(id, user.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	if order.IsDelivered {
		sendError(w, "cannot delete a delivered order", http.StatusForbidden)
		return
	}

	err = repo.DB.DeleteOrder(order.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	})
}
