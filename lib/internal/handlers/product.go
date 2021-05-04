package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
)

type productsJson struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	Image        string `json:"image"`
	Brand        string `json:"brand"`
	Category     string `json:"category"`
	Description  string `json:"description"`
	Rating       int    `json:"rating"`
	NumReviews   int    `json:"num_reviews"`
	Price        int    `json:"price"`
	CountInStock int    `json:"count_in_stock"`
}

type jsonMsg struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}

// GetProducts get all products and return as json
func (repo *Repository) GetProducts(w http.ResponseWriter, r *http.Request) {
	products, err := repo.DB.GetProducts()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	var resp []productsJson
	for _, prod := range products {
		p := productsJson{
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

	id, _ := strconv.Atoi(r.Form.Get("id"))                       // TODO handle error
	price, _ := strconv.Atoi(r.Form.Get("price"))                 // TODO handle error
	countInStock, _ := strconv.Atoi(r.Form.Get("count_in_stock")) // TODO handle error

	product := models.Product{
		Id:           id,
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

// DeleteProduct deletes a product
func (repo *Repository) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	// body, _ := ioutil.ReadAll(r.Body) // check for errors
	// keyVal := make(map[string]interface{})
	// json.Unmarshal(body, &keyVal) // check for errors
	// fmt.Println(keyVal)           // has populated data

	// id, err := strconv.Atoi(chi.URLParam(r, "id"))
	// if err != nil {
	// 	fmt.Println(fmt.Errorf("error converting id to int, %s", err))
	// 	return
	// }

	// tempDb, err = removeElement(tempDb, id)
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
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
