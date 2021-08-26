package main

import (
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
		AllowedOrigins: []string{"https://localhost:3000", "http://localhost:3000"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	mux.Use(middleware.Recoverer)
	// mux.Use(NoSurf) // Disable when working with postman
	mux.Use(setContentType)

	mux.Post("/signup", handlers.Repo.SignUp)
	mux.Post("/forgotpassword", handlers.Repo.ForgotPassword)
	mux.Post("/resetpassword/{token}", handlers.Repo.ResetPassword)
	mux.Post("/login", handlers.Repo.Login)
	mux.Get("/logout", handlers.Repo.Logout)
	mux.Get("/user", handlers.Repo.User)
	mux.Get("/me/{id}", handlers.Repo.Me)
	mux.Patch("/updateme", handlers.Repo.UpdateMe)
	mux.Patch("/updatepassword", handlers.Repo.UpdatePassword)
	mux.Get("/actdis", handlers.Repo.ActivateDisableUser)

	mux.Get("/config/paypal", handlers.Repo.GetPaypalConfigId)

	mux.Route("/products", func(mux chi.Router) {
		mux.Get("/", handlers.Repo.GetProducts)
		mux.Get("/{id}", handlers.Repo.GetProductById)
		mux.Patch("/uploadimage/{productid}", handlers.Repo.UploadProductImg)
	})

	mux.Route("/admproducts", func(mux chi.Router) {
		mux.Use(Auth)
		mux.Post("/", handlers.Repo.CreateProduct)
		mux.Patch("/{id}", handlers.Repo.UpdateProduct)
		mux.Delete("/{id}", handlers.Repo.DeleteProduct)
	})

	mux.Route("/users", func(mux chi.Router) {
		mux.Use(Auth)
		mux.Get("/", handlers.Repo.AdminGetUsers)
		mux.Post("/", handlers.Repo.AdminCreateUser)
		mux.Patch("/{id}", handlers.Repo.AdminUpdateUser)
		mux.Delete("/{id}", handlers.Repo.AdminDeleteUser)
	})

	mux.Route("/orders", func(mux chi.Router) {
		mux.Use(Auth)
		mux.Get("/", handlers.Repo.GetOrders)
		mux.Post("/", handlers.Repo.CreateOrder)
		mux.Get("/{id}", handlers.Repo.GetOrderById)
		mux.Patch("/{id}", handlers.Repo.UpdateOrder)
		mux.Patch("/{orderid}/pay", handlers.Repo.PayOrder)
		mux.Delete("/{id}", handlers.Repo.DeleteOrder)
	})

	mux.Route("/orderedprods", func(mux chi.Router) {
		mux.Use(Auth)
		mux.Post("/", handlers.Repo.CreateOrderedProd)
		mux.Get("/{orderid}", handlers.Repo.GetOrderedProds)
	})

	mux.Route("/adminorders", func(mux chi.Router) {
		mux.Use(Auth)
		mux.Get("/", handlers.Repo.AdminGetOpenedOrders)
		mux.Patch("/paid/{id}", handlers.Repo.AdminUpdateOrderToPaid)
		mux.Patch("/delivered/{id}", handlers.Repo.AdminUpdateIsDelivered)
	})

	return mux
}
