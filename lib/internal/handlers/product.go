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

// GetProducts get all products
func (repo *Repository) GetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := repo.DB.GetProducts()
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("prodsjson", w, &options{prods: products, stCode: http.StatusOK})
}

// CreateProduct creates a new product
func (repo *Repository) CreateProduct(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	form := forms.New(r.PostForm)
	form.Required("name", "brand", "category", "description")
	form.MinLength("name", 3)
	form.MinLength("brand", 1)
	form.MinLength("category", 3)
	form.MinLength("description", 10)
	form.IsUint("price")
	form.IsUint("count_in_stock")

	if len(r.Form.Get("image")) > 0 {
		form.MinLength("image", 5)
	}

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	price, _ := strconv.Atoi(r.Form.Get("price"))                 // Validated above
	countInStock, _ := strconv.Atoi(r.Form.Get("count_in_stock")) // Validated above

	product := models.Product{
		Name:         r.Form.Get("name"),
		Image:        r.Form.Get("image"),
		Brand:        r.Form.Get("brand"),
		Category:     r.Form.Get("category"),
		Description:  r.Form.Get("description"),
		Price:        price,
		CountInStock: countInStock,
		UserId:       user.Id, // Testing
	}

	err = repo.DB.InsertProduct(product)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// GetProductById retrieves the product with specified id
func (repo *Repository) GetProductById(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		fmt.Println(err)
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("prodjson", w, &options{
		prod:   prod,
		stCode: http.StatusOK,
	})
}

// UpdateProduct updates a product
func (repo *Repository) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}

	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	form := forms.New(r.PostForm)

	if len(r.Form.Get("name")) > 0 {
		form.MinLength("name", 3)
		prod.Name = r.Form.Get("name")
	}
	if len(r.Form.Get("image")) > 0 {
		form.MinLength("image", 5)
		prod.Image = r.Form.Get("image")
	}
	if len(r.Form.Get("brand")) > 0 {
		form.MinLength("brand", 1)
		prod.Brand = r.Form.Get("brand")
	}
	if len(r.Form.Get("category")) > 0 {
		form.MinLength("category", 3)
		prod.Category = r.Form.Get("category")
	}
	if len(r.Form.Get("descrition")) > 0 {
		form.MinLength("description", 10)
		prod.Description = r.Form.Get("description")
	}
	if r.Form.Get("price") != "" {
		form.IsUint("price")
		tmp, _ := strconv.Atoi(r.Form.Get("price"))
		prod.Price = tmp
	}
	if r.Form.Get("count_in_stock") != "" {
		form.IsUint("count_in_stock")
		tmp, _ := strconv.Atoi(r.Form.Get("count_in_stock"))
		prod.CountInStock = tmp
	}

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	err = repo.DB.UpdateProductById(prod)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// DeleteProduct deletes a product
func (repo *Repository) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	err = repo.DB.DeleteProductById(id)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
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
