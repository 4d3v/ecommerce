package handlers

import (
	"encoding/json"
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

	var resp []productJson
	for _, prod := range products {
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
		}
		resp = append(resp, p)
	}

	newJson, err := json.MarshalIndent(resp, "", "    ")
	if err != nil {
		fmt.Println("error marshalling", err)

		resp := jsonMsg{
			Ok:      false,
			Message: "Internal server error",
		}

		out, _ := json.MarshalIndent(resp, "", "     ")
		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(newJson)
}

// CreateProduct creates a new product
func (repo *Repository) CreateProduct(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
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

	err = repo.DB.InsertProduct(product) // TODO handle error #Err0
	if err != nil {
		helpers.ServerError(w, err) // #Err0

		resp := jsonMsg{
			Ok:      false,
			Message: "Fail!",
		}

		out, err := json.MarshalIndent(resp, "", "    ")
		if err != nil {
			fmt.Println("error marshalling", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)
		return
	}

	resp := jsonMsg{
		Ok:      true,
		Message: "Success!",
	}

	out, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("error marshalling", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
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
		fmt.Println("Error converting parameter to int")
		return
	}

	var resp jsonMsg = jsonMsg{
		Ok:      true,
		Message: "Success!",
	}

	prod, err := repo.DB.GetProductById(id)
	if err != nil {
		fmt.Printf("ERR: %s", err)

		resp.Ok = false
		resp.Message = fmt.Sprintf("ERR: %s", err)

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("error marshalling", err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)

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

	out, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("error marshalling", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
}

// DeleteProduct deletes a product
func (repo *Repository) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		fmt.Println("Error converting parameter to int")
		return
	}

	var resp jsonMsg = jsonMsg{
		Ok:      true,
		Message: "Success!",
	}

	err = repo.DB.DeleteProductById(id)
	if err != nil {
		fmt.Printf("ERR: %s", err)

		resp.Ok = false
		resp.Message = fmt.Sprintf("ERR: %s", err)

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("error marshalling", err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(out)

		return
	}

	out, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("error marshalling", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
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
