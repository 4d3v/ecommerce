package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/justinas/nosurf"
)

// NoSurf adds CSRF protection to all POST requests
func NoSurf(next http.Handler) http.Handler {
	csrfHandler := nosurf.New(next)

	csrfHandler.SetBaseCookie(http.Cookie{
		HttpOnly: true,
		Path:     "/",
		Secure:   app.InProduction,
		SameSite: http.SameSiteLaxMode,
	})

	return csrfHandler
}

func setContentType(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		// w.Header().Add("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
}

func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := r.Cookie("jwt")
		if err != nil {
			fmt.Println(err)

			type msgErrJson struct {
				Ok    bool   `json:"ok"`
				Error string `json:"error"`
			}

			resp := msgErrJson{
				Ok:    false,
				Error: fmt.Sprintf("Unauthenticated! %s", err),
			}

			out, err := json.Marshal(resp)
			if err != nil {
				fmt.Println("Error marshaling json")
				helpers.ServerError(w, err)
			}

			w.Write(out)
			return
		}

		next.ServeHTTP(w, r)
	})
}
