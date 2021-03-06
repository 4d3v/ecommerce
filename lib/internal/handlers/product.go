package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/4d3v/ecommerce/internal/forms"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/go-chi/chi"
)

// GetProducts get all products
func (repo *Repository) GetProducts(w http.ResponseWriter, r *http.Request) {
	var lt time.Time
	if r.URL.Query().Get("lt") != "" {
		t, err := time.Parse(timeFormatStr, r.URL.Query().Get("lt"))
		if err != nil {
			sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
			return
		}
		lt = t
	}

	products, err := repo.DB.GetProducts(lt)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	dtMap := make(map[string]interface{})
	dtMap["total_prods"] = repo.App.GlobalCounts["totalProds"]
	dtMap["total_prod_pages"] = repo.App.GlobalCounts["totalProdPages"]

	sendJson("prodsjson", w, &options{prods: products, dataMap: dtMap, stCode: http.StatusOK})
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

func (repo *Repository) UploadProductImg(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PATCH" {
		sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, MAX_UPLOAD_SIZE)
	if err := r.ParseMultipartForm(MAX_UPLOAD_SIZE); err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	// The argument to FormFile must match the name attribute
	// of the file input on the frontend
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		sendError(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	buff := make([]byte, 512)
	_, err = file.Read(buff)
	if err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	filetype := http.DetectContentType(buff)
	if filetype != "image/jpeg" && filetype != "image/png" {
		sendError(w, "The provided file format is not allowed. Please upload a JPEG or PNG image", http.StatusBadRequest)
		return
	}

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create the uploads folder if it doesn't already exist
	err = os.MkdirAll("./../fe/public/images", os.ModePerm)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	// Create a new file in the uploads directory
	// dst, err := os.Create(fmt.Sprintf("./uploads/%d%s", time.Now().UnixNano(), filepath.Ext(fileHeader.Filename)))
	timeNow := time.Now().UnixNano()
	dst, err := os.Create(fmt.Sprintf("./../fe/public/images/%d-%s", timeNow, fileHeader.Filename))
	if err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the filesystem at the specified destination
	_, err = io.Copy(dst, file)
	if err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	productId, err := strconv.Atoi(chi.URLParam(r, "productid"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	prod, err := repo.DB.GetProductById(productId)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	prod.Image = fmt.Sprintf("%d-%s", timeNow, fileHeader.Filename)

	err = repo.DB.UpdateProductById(prod)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Image uploaded with success", stCode: http.StatusOK})
}

// CreateProductReview creates a new product
func (repo *Repository) CreateProductReview(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	productId, err := strconv.Atoi(chi.URLParam(r, "productid"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("name", "rating", "comment")
	form.MinLength("name", 3)
	form.MinLength("comment", 7)

	rating, err := strconv.ParseFloat(r.Form.Get("rating"), 64) // Validated above
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	review := models.Review{
		Name:      r.Form.Get("name"),
		Rating:    rating,
		Comment:   r.Form.Get("comment"),
		UserId:    user.Id,
		ProductId: productId,
	}

	err = repo.DB.InsertProductReview(review)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	repo.UpdateProductReviewRating(w, r, productId, rating)

	sendJson("msgjson", w, &options{ok: true, msg: "Review created with success", stCode: http.StatusOK})
}

// UpdateProduct updates a product
func (repo *Repository) UpdateProductReviewRating(w http.ResponseWriter, r *http.Request, productId int, rating float64) {
	prod, err := repo.DB.GetProductById(productId)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	prod.SumReviews = prod.SumReviews + rating
	prod.NumReviews++
	prod.Rating = prod.SumReviews / float64(prod.NumReviews)

	err = repo.DB.UpdateProductReviewRating(prod)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}
}

func (repo *Repository) UpdateProductCountInStock(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	productId, err := strconv.Atoi(chi.URLParam(r, "productid"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	_, err = repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("count_in_stock", "qty")
	form.IsUint("count_in_stock")
	form.IsUint("qty")

	countInStock, _ := strconv.Atoi(r.Form.Get("count_in_stock")) // Validated above
	qty, _ := strconv.Atoi(r.Form.Get("qty"))                     // Validated above
	countInStock = countInStock - qty

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	if countInStock < 0 {
		sendError(w, "No products available", http.StatusBadRequest)
		return
	}

	err = repo.DB.UpdateProductCountInStock(productId, countInStock)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Product count in stock updated with success", stCode: http.StatusOK})
}

func (repo *Repository) GetProductReviews(w http.ResponseWriter, r *http.Request) {
	productId, err := strconv.Atoi(chi.URLParam(r, "productid"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	prodReviews, err := repo.DB.GetProductReviews(productId)

	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("prodreviewsjson", w, &options{prodReviews: prodReviews, stCode: http.StatusOK})
}

// AdmGetProducts gets all products (for admins)
func (repo *Repository) AdmGetProducts(w http.ResponseWriter, r *http.Request) {
	var lt time.Time
	if r.URL.Query().Get("lt") != "" {
		t, err := time.Parse(timeFormatStr, r.URL.Query().Get("lt"))
		if err != nil {
			sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
			return
		}
		lt = t
	}

	limit, offset, err := getLimitOffset(r)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	products, err := repo.DB.AdminGetProducts(lt, limit, offset)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	dtMap := make(map[string]interface{})
	dtMap["total_prods"] = repo.App.GlobalCounts["totalProds"]

	sendJson("prodsjson", w, &options{prods: products, dataMap: dtMap, stCode: http.StatusOK})
}
