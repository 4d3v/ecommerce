package main

import (
	"fmt"
	"net/http"

	"github.com/4d3v/ecommerce/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func routes() http.Handler {
	mux := chi.NewRouter()

	mux.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

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
		mux.Get("/", handlers.Repo.AdminGetUsers)
		mux.Post("/", handlers.Repo.AdminCreateUser)
		mux.Patch("/{id}", handlers.Repo.AdminUpdateUser)
		mux.Post("/login", handlers.Repo.Login)
		mux.Get("/user", handlers.Repo.User)
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
