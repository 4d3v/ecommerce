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

// CreateOrder creates a new order
func (repo *Repository) CreateOrderedProd(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, _ := repo.getUserByJwt(r)

	form := forms.New(r.PostForm)
	form.Required("product_id", "order_id")
	form.IsUint("product_id")
	form.IsUint("order_id")

	if !form.Valid() {
		fmt.Println(err)
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	prodId, _ := strconv.Atoi(r.Form.Get("product_id"))
	orderId, _ := strconv.Atoi(r.Form.Get("order_id"))

	orderedProd := models.OrderedProd{
		UserId:    user.Id,
		ProductId: prodId,
		OrderId:   orderId,
	}

	err = repo.DB.InsertOrderedProd(orderedProd)
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

// GetOrders gets all orders for a specific user
func (repo *Repository) GetOrderedProds(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	orderId, err := strconv.Atoi(chi.URLParam(r, "orderid"))
	if err != nil {
		fmt.Println(err)
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	orderedProds, err := repo.DB.GetOrderedProds(user.Id, orderId)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("orderedprodsjson", w, &options{
		ok:     true,
		msg:    "Success",
		cops:   orderedProds,
		stCode: http.StatusOK,
	})
}
