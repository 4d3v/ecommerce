package handlers

import (
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

// AdminGetUsers retrieves all the users on the database
func (repo *Repository) AdminGetUsers(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	users, err := repo.DB.AdminGetUsers()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		users:  users,
		stCode: http.StatusOK,
	}

	sendJson("usersjson", w, opts)
}

// AdminCreateUser creates a new user (PS normal users should use Signup instead)
func (repo *Repository) AdminCreateUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	err = r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	}

	form := forms.New(r.PostForm)
	form.Required("name", "email", "password", "password_confirm")
	form.MinLength("name", 3)
	form.MinLength("password", 6)
	form.CheckPassword("password", "password_confirm")
	form.IsEmail("email")

	if !form.Valid() {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors
		opts.stCode = http.StatusBadRequest
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

	newUser := models.User{
		Name:            r.Form.Get("name"),
		Email:           r.Form.Get("email"),
		Role:            role,
		Password:        r.Form.Get("password"),
		PasswordConfirm: r.Form.Get("password_confirm"),
	}

	err = repo.DB.AdminInsertUser(newUser)
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// AdminUpdateUser updates user's data, (PS normal users should instead use updateMe)
func (repo *Repository) AdminUpdateUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if userOk := checkUserRestriction(w, user); !userOk {
		return
	}

	err = r.ParseForm()
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
		ok:     true,
		msg:    "Success",
		err:    "",
		stCode: http.StatusOK,
	}

	user, err = repo.DB.GetUserById(id)
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusNotFound
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
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// AdminDeleteUser completely deletes the user and all it's data
func (repo *Repository) AdminDeleteUser(w http.ResponseWriter, r *http.Request) {
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

	opts := &options{
		ok:     true,
		msg:    "Success",
		err:    "",
		stCode: http.StatusOK,
	}

	err = repo.DB.AdminDeleteUser(id)
	if err != nil {
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusNotFound
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// Signup sings up a new user
func (repo *Repository) SignUp(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:     true,
		msg:    "Success",
		stCode: http.StatusOK,
	}

	form := forms.New(r.PostForm)
	form.Required("name", "email", "password", "password_confirm")
	form.MinLength("name", 3)
	form.MinLength("password", 6)
	form.CheckPassword("password", "password_confirm")
	form.IsEmail("email")

	if !form.Valid() {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	user := models.User{
		Name:            r.Form.Get("name"),
		Email:           r.Form.Get("email"),
		Password:        r.Form.Get("password"),
		PasswordConfirm: r.Form.Get("password_confirm"),
	}

	err = repo.DB.SignUp(user)
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}

// Login signs in the user into the application
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
		sendJson("msgjson", w, &options{
			ok:     false,
			msg:    fmt.Sprintf("%s", err),
			stCode: http.StatusUnauthorized,
		})
		return
	}

	jwtCookie := http.Cookie{
		Name:     "jwt",
		Value:    token,
		HttpOnly: true,
		Expires:  time.Now().Add(time.Hour * 24), // 1 day
	}

	http.SetCookie(w, &jwtCookie)
	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Logged in succesfully",
		stCode: http.StatusOK,
	})
}

// User retrieves logged in user's info
func (repo *Repository) User(w http.ResponseWriter, r *http.Request) {
	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		sendJson("msgjson", w, &options{
			ok:     false,
			err:    "Unauthenticated",
			stCode: http.StatusUnauthorized,
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
		sendJson("msgjson", w,
			&options{ok: false,
				err:    "Unauthenticated",
				stCode: http.StatusUnauthorized,
			})
		return
	}

	claims := token.Claims.(*jwt.StandardClaims)
	userId, err := strconv.Atoi(claims.Issuer)
	if err != nil {
		fmt.Println("Error converting claims issuer (userId) to int", err)
		helpers.ServerError(w, err)
		return
	}

	user, err := repo.DB.GetUserById(userId)
	if err != nil {
		fmt.Println(err)
		sendJson("msgjson", w, &options{
			ok:     false,
			err:    fmt.Sprintf("%s", err),
			stCode: http.StatusNotFound,
		})
		return
	}

	sendJson("userjson", w, &options{user: user, stCode: http.StatusOK})
}

// ForgotPassword sends token to specified email so user can reset password
func (repo *Repository) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:     true,
		msg:    "Token sent to email",
		stCode: http.StatusOK,
	}

	form := forms.New(r.PostForm)
	form.Required("email")
	form.IsEmail("email")

	if !form.Valid() {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	email, hash, err := repo.DB.ForgotPassword(r.Form.Get("email"))
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusNotFound
		sendJson("msgjson", w, opts)
		return
	}

	msg := models.MailData{
		To:      email,
		From:    "admin@test.com",
		Subject: "Reset Your Password",
		Content: fmt.Sprintf( // (TEMPORARY) TODO setup url properly
			`<a>http://localhost:8080/users/resetpassword/%s</a>`,
			hash,
		),
	}

	repo.App.MailChan <- msg
	sendJson("msgjson", w, opts)
}

// ResetPassword resets the user password
func (repo *Repository) ResetPassword(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	opts := &options{
		ok:     true,
		msg:    "Password set successfully",
		stCode: http.StatusOK,
	}

	form := forms.New(r.PostForm)
	form.Required("password", "password_confirm")
	form.MinLength("password", 6)
	form.MinLength("password_confirm", 6)
	form.CheckPassword("password", "password_confirm")

	if !form.Valid() {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = "Invalid form"
		opts.errs = form.Errors
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	user, err := repo.DB.GetUserByToken(chi.URLParam(r, "token"))
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	err = repo.DB.ResetPassword(user.Id, r.Form.Get("password"))
	if err != nil {
		fmt.Println(err)
		opts.ok = false
		opts.msg = "Fail"
		opts.err = fmt.Sprintf("%s", err)
		opts.stCode = http.StatusBadRequest
		sendJson("msgjson", w, opts)
		return
	}

	sendJson("msgjson", w, opts)
}
