package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/go-chi/chi"
)

// GetProducts get all products and return as json
func (repo *Repository) GetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := repo.DB.GetProducts()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	sendJson("prodsjson", w, &options{prods: products})
}

// CreateProduct creates a new product
func (repo *Repository) CreateProduct(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:  true,
		msg: "Success",
	}

	price, _ := strconv.Atoi(r.Form.Get("price"))                 // TODO handle error
	countInStock, _ := strconv.Atoi(r.Form.Get("count_in_stock")) // TODO handle error

	product := models.Product{
		Name:         r.Form.Get("name"),
		Image:        r.Form.Get("image"),
		Brand:        r.Form.Get("brand"),
		Category:     r.Form.Get("category"),
		Description:  r.Form.Get("description"),
		Price:        price,
		CountInStock: countInStock,
	}

	err = repo.DB.InsertProduct(product)
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)

		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// GetProductById retrieves the product with specified id
func (repo *Repository) GetProductById(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println(err)
		sendJson("msgjson", w, &options{
			ok:  false,
			msg: "Fail",
			err: fmt.Sprintf("%s", err),
		})
		return
	}

	sendJson("prodjson", w, &options{prod: prod})
}

// UpdateProduct updates a product
func (repo *Repository) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:  true,
		msg: "Success",
		err: "",
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		sendJson("msgjson", w, opts)
		return
	}

	if len(r.Form.Get("name")) > 0 {
		prod.Name = r.Form.Get("name")
	}
	if len(r.Form.Get("image")) > 0 {
		prod.Image = r.Form.Get("image")
	}
	if len(r.Form.Get("brand")) > 0 {
		prod.Brand = r.Form.Get("brand")
	}
	if len(r.Form.Get("category")) > 0 {
		prod.Category = r.Form.Get("category")
	}
	if len(r.Form.Get("descrition")) > 0 {
		prod.Description = r.Form.Get("description")
	}
	if r.Form.Get("price") != "" {
		tmp, err := strconv.Atoi(r.Form.Get("price"))
		if err != nil {
			fmt.Println("Error converting price to int")
			return
		}
		prod.Price = tmp
	}
	if r.Form.Get("count_in_stock") != "" {
		tmp, err := strconv.Atoi(r.Form.Get("count_in_stock"))
		if err != nil {
			fmt.Println("Error converting count_in_stock to int")
			return
		}
		prod.CountInStock = tmp
	}

	err = repo.DB.UpdateProductById(prod)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	sendJson("msgjson", w, opts)
}

// DeleteProduct deletes a product
func (repo *Repository) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		fmt.Println("Error converting parameter to int")
		return
	}

	opts := &options{
		ok:  true,
		msg: "Success",
		err: "",
	}

	err = repo.DB.DeleteProductById(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Printf("ERR: %s", err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// func removeElement(prods []models.Product, id int) ([]models.Product, error) {
// 	for i, prop := range tempDb {
// 		if prop.Id == id {
// 			prods[i] = prods[len(prods)-1]
// 			return prods[:len(prods)-1], nil
// 		}
// 	}

// 	return nil, fmt.Errorf("did not find item with id %d", id)
// }
