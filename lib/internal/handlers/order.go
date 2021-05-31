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

func (repo *Repository) GetOrders(w http.ResponseWriter, r *http.Request) {
	user, _ := repo.getUserByJwt(r)

	opts := &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	}

	orders, err := repo.DB.GetOrders(user.Id)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts.orders = orders

	sendJson("ordersjson", w, opts)
}

func (repo *Repository) CreateOrder(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	}

	user, _ := repo.getUserByJwt(r)

	form := forms.New(r.PostForm)
	form.Required("shipping_address", "payment_method")
	form.MinLength("shipping_address", 7)
	form.IsUint("payment_method")

	if !form.Valid() {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}
	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		fmt.Println(err)
		sendJson("msgjson", w, &options{
			ok:     false,
			msg:    "Fail",
			err:    fmt.Sprintf("%s", err),
			stCode: http.StatusNotFound,
		})
		return
	}

	// PayMethod should already be checked for int above
	payMethod, _ := strconv.Atoi(r.Form.Get("payment_method"))

	order := models.Order{
		ShippingAddres: r.Form.Get("shipping_address"),
		PaymentMethod:  payMethod,
		TotalPrice:     200,
		IsPaid:         false,
		IsDelivered:    false,
		UserId:         user.Id,
		ProductId:      prod.Id,
	}

	err = repo.DB.InsertOrder(order)
	if err != nil {
		fmt.Println(err)
		sendJson("msgjson", w, &options{
			ok:     false,
			msg:    "Fail",
			err:    fmt.Sprintf("%s", err),
			stCode: http.StatusNotFound,
		})
		return
	}

	sendJson("msgjson", w, opts)
}
