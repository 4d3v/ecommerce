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

// GetOrders gets all orders for a specific user
func (repo *Repository) GetOrders(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	orders, err := repo.DB.GetOrders(user.Id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
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

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
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

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
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

	// Fields bellow should already be checked for int above
	var payMethod int
	switch r.Form.Get("payMethod") {
	case "cash":
		payMethod = cash
	case "credit":
		payMethod = credit
	case "debit":
		payMethod = debit
	default:
		payMethod = cash
	}
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

// DeleteOrder deletes and order
func (repo *Repository) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
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
