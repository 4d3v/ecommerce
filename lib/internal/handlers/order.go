package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/4d3v/ecommerce/internal/forms"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/go-chi/chi"
)

// AdminGetOpenedOrders gets all the opened orders should be used only by owners and admins
func (repo *Repository) AdminGetOpenedOrders(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	orders, err := repo.DB.AdminGetOpenedOrders()
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
		msg:    "Success",
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

	sendJson("orderjson", w, &options{
		ok:     true,
		msg:    "Success",
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
	form.IsUint("total_price")

	if !form.Valid() {
		fmt.Println(err)
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	// Fields bellow should already be checked for int
	payMethod := checkPaymentMethod(form)
	totalPrice, _ := strconv.Atoi(r.Form.Get("total_price"))

	order := models.Order{
		PostalCode:    r.Form.Get("postal_code"),
		Address:       r.Form.Get("address"),
		Country:       r.Form.Get("country"),
		City:          r.Form.Get("city"),
		PaymentMethod: payMethod,
		TotalPrice:    totalPrice,
		UserId:        user.Id,
		ProductId:     prod.Id,
	}

	err = repo.DB.InsertOrder(order)
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