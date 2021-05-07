package main

import (
	"fmt"
	"net/http"

	"github.com/4d3v/ecommerce/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	// mux.Use(NoSurf) // Disable when working with postman

	mux.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("This is the about page"))
	})

	mux.Get("/about", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("This is the about page"))
	})

	mux.Get("/test/{id}", func(w http.ResponseWriter, r *http.Request) {
		param := chi.URLParam(r, "id")
		w.Write([]byte(fmt.Sprintf("test page %s", param)))
	})

	mux.Route("/users", func(mux chi.Router) {
		mux.Get("/", handlers.Repo.GetUsers)
		mux.Post("/", handlers.Repo.CreateUser)
		mux.Patch("/{id}", handlers.Repo.AdminUpdateUser)
	})

	mux.Route("/products", func(mux chi.Router) {
		mux.Get("/", handlers.Repo.GetProducts)

		// mux.Use(Auth)
		// mux.Get("/xyz/{src}/{id}", handlers.Repo.Xyz)
		mux.Post("/", handlers.Repo.CreateProduct)
		mux.Patch("/{id}", handlers.Repo.UpdateProduct)
		mux.Delete("/{id}", handlers.Repo.DeleteProduct)
	})

	return mux
}
