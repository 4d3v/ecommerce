package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/4d3v/ecommerce/internal/forms"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
)

func (repo *Repository) AdminGetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := repo.DB.AdminGetUsers()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		users: users,
	}

	sendJson("usersjson", w, opts)
}

func (repo *Repository) AdminCreateUser(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:  true,
		msg: "Success",
	}

	form := forms.New(r.PostForm)
	form.Required("name", "email", "password", "password_confirm")
	form.MinLength("name", 3)
	form.MinLength("password", 6)
	form.CheckPassword("password", "password_confirm")
	form.IsEmail("email")

	if !form.Valid() {
		w.WriteHeader(http.StatusBadRequest)

		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors

		sendJson("msgjson", w, opts)
		return
	}

	var role int
	switch r.Form.Get("role") {
	case "owner":
		role = owner
	case "admin":
		role = admin
	case "normal":
		role = normal
	default:
		role = normal
	}

	user := models.User{
		Name:            r.Form.Get("name"),
		Email:           r.Form.Get("email"),
		Role:            role,
		Password:        r.Form.Get("password"),
		PasswordConfirm: r.Form.Get("password_confirm"),
	}

	err = repo.DB.AdminInsertUser(user)
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

func (repo *Repository) AdminUpdateUser(w http.ResponseWriter, r *http.Request) {
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

	user, err := repo.DB.GetUserById(id)
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		sendJson("msgjson", w, opts)
		return
	}

	if len(r.Form.Get("name")) > 0 {
		user.Name = r.Form.Get("name")
	}
	if len(r.Form.Get("email")) > 0 {
		user.Email = r.Form.Get("email")
	}
	if len(r.Form.Get("role")) > 0 {
		switch r.Form.Get("role") {
		case "owner":
			user.Role = owner
		case "admin":
			user.Role = admin
		case "normal":
			user.Role = normal
		default:
			break
		}
	}
	if len(r.Form.Get("active")) > 0 {
		tmp, err := strconv.ParseBool(r.Form.Get("active"))
		if err != nil {
			helpers.ServerError(w, err)
			return
		}
		user.Active = tmp
	}

	err = repo.DB.AdminUpdateUser(user)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	sendJson("msgjson", w, opts)
}

func (repo *Repository) Login(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	email := r.Form.Get("email")
	password := r.Form.Get("password")

	token, err := repo.DB.Login(email, password)
	if err != nil {
		resp := jsonMsg{
			Ok:      false,
			Message: fmt.Sprintf("Err: %s", err),
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			return
		}

		w.Write(out)
		return
	}

	jwtCookie := http.Cookie{
		Name:     "jwt",
		Value:    token,
		HttpOnly: true,
		Expires:  time.Now().Add(time.Hour * 24), // 1 day
	}

	http.SetCookie(w, &jwtCookie)

	sendJson("msgjson", w, &options{ok: true, msg: "Logged in succesfully"})
}

func (repo *Repository) User(w http.ResponseWriter, r *http.Request) {
	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		sendJson("msgjson", w, &options{
			ok:  false,
			err: "Unauthenticated",
		})
		return
	}

	token, err := jwt.ParseWithClaims(
		jwtCookie.Value,
		&jwt.StandardClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(repo.App.Env["JWT_SECRET"]), nil
		},
	)
	if err != nil {
		fmt.Println("Unauthenticated, ParseWithClaims...")
		sendJson("msgjson", w, &options{
			ok:  false,
			err: "Unauthenticated",
		})
		return
	}

	claims := token.Claims.(*jwt.StandardClaims)
	userId, err := strconv.Atoi(claims.Issuer)
	if err != nil {
		fmt.Println("Error converting claims issuer (userId) to int")
		return
	}

	user, err := repo.DB.GetUserById(userId)
	if err != nil {
		fmt.Printf("ERROR: %s", err)

		resp := jsonMsg{
			Ok:      false,
			Message: fmt.Sprintf("Err: %s", err),
		}

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			return
		}

		w.Write(out)
		return
	}

	opts := &options{
		user: user,
	}

	sendJson("userjson", w, opts)
}
