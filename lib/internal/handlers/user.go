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
	if !checkUserRestriction(w, user) {
		return
	}

	users, err := repo.DB.AdminGetUsers()
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("usersjson", w, &options{users: users, stCode: http.StatusOK})
}

// AdminCreateUser creates a new user (PS normal users should use Signup instead)
func (repo *Repository) AdminCreateUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if !checkUserRestriction(w, user) {
		return
	}

	err = r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("name", "email", "password", "password_confirm")
	form.MinLength("name", 3)
	form.MinLength("password", 6)
	form.CheckPassword("password", "password_confirm")
	form.IsEmail("email")
	userActive := form.IsUserActive("active")

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
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
		Active:          userActive,
	}

	err = repo.DB.AdminInsertUser(newUser)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// AdminUpdateUser updates user's data, (PS normal users should instead use updateMe)
func (repo *Repository) AdminUpdateUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if !checkUserRestriction(w, user) {
		return
	}

	err = r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	user, err = repo.DB.GetUserById(id)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
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
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// AdminDeleteUser completely deletes the user and all it's data
func (repo *Repository) AdminDeleteUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}
	if !checkUserRestriction(w, user) {
		return
	}

	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		sendError(w, "invalid id parameter", http.StatusBadRequest)
		return
	}

	err = repo.DB.AdminDeleteUser(id)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// Signup sings up a new user
func (repo *Repository) SignUp(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("name", "email", "password", "password_confirm")
	form.MinLength("name", 3)
	form.MinLength("password", 6)
	form.CheckPassword("password", "password_confirm")
	form.IsEmail("email")

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
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
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{ok: true, msg: "Success", stCode: http.StatusOK})
}

// Login signs in the user into the application
func (repo *Repository) Login(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("email", "password")
	form.IsEmail("email")

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	email := r.Form.Get("email")
	password := r.Form.Get("password")

	user, token, err := repo.DB.Login(email, password)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusUnauthorized)
		return
	}

	jwtCookie := http.Cookie{
		Name:     "jwt",
		Value:    token,
		HttpOnly: true,
		Expires:  time.Now().Add(time.Hour * 24), // 1 day
		// Secure: false,	
	}

	http.SetCookie(w, &jwtCookie)
	sendJson("loginsuccess", w, &options{
		ok:     true,
		msg:    "Logged in succesfully",
		stCode: http.StatusOK,
		user:   user,
		token:  token,
	})
}

// Logout logs out the user
func (repo *Repository) Logout(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie("jwt")
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusUnauthorized)
		return
	}

	jwtCookie := http.Cookie{
		Name:     "jwt",
		Value:    "",
		HttpOnly: true,
		Expires:  time.Now().Add(-time.Hour),
	}

	http.SetCookie(w, &jwtCookie)
	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Logged out successfully",
		stCode: http.StatusOK,
	})
}

// User retrieves logged in user's info
func (repo *Repository) User(w http.ResponseWriter, r *http.Request) {
	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusUnauthorized)
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
		sendError(w, fmt.Sprintf("%s", err), http.StatusUnauthorized)
		return
	}

	claims := token.Claims.(*jwt.StandardClaims)
	userId, err := strconv.Atoi(claims.Issuer)
	if err != nil {
		sendError(
			w,
			"Error converting claims issuer (userId) to int",
			http.StatusUnauthorized,
		)
		return
	}

	user, err := repo.DB.GetUserById(userId)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("userjson", w, &options{user: user, stCode: http.StatusOK})
}

// UpdateMe Updates some user's general info
func (repo *Repository) UpdateMe(w http.ResponseWriter, r *http.Request) {
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

	form := forms.New(r.PostForm)

	if len(r.Form.Get("name")) > 0 {
		form.MinLength("name", 3)
		user.Name = r.Form.Get("name")
	}
	if len(r.Form.Get("email")) > 0 {
		form.IsEmail("email")
		user.Email = r.Form.Get("email")
	}

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	err = repo.DB.UpdateMe(user)
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "User updated successfully ",
		stCode: http.StatusOK,
	})
}

// ForgotPassword sends token to specified email so user can reset password
func (repo *Repository) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("email")
	form.IsEmail("email")

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	email, hash, err := repo.DB.ForgotPassword(r.Form.Get("email"))
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusNotFound)
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

	// fmt.Println("TOKEN", hash)
	repo.App.MailChan <- msg
	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Token sent to email",
		stCode: http.StatusOK,
	})
}

// ResetPassword resets the user password
func (repo *Repository) ResetPassword(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	form := forms.New(r.PostForm)
	form.Required("password", "password_confirm")
	form.MinLength("password", 6)
	form.MinLength("password_confirm", 6)
	form.CheckPassword("password", "password_confirm")

	if !form.Valid() {
		sendFormError(w, "Invalid form", http.StatusNotFound, form)
		return
	}

	user, err := repo.DB.GetUserByToken(chi.URLParam(r, "token"))
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	if timePassed := time.Since(user.PasswordResetExpires); timePassed.Minutes() > 0 {
		sendError(w, "reset token expired", http.StatusForbidden)
		return
	}

	err = repo.DB.ResetPassword(user.Id, r.Form.Get("password"))
	if err != nil {
		sendError(w, fmt.Sprintf("%s", err), http.StatusBadRequest)
		return
	}

	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "Password set successfully",
		stCode: http.StatusOK,
	})
}

func (repo *Repository) ActivateDisableUser(w http.ResponseWriter, r *http.Request) {
	user, err := repo.getUserByJwt(r)
	if err != nil { // Should already be handled on pre middleware
		fmt.Println("ERR GetUserByJwt", err)
		helpers.ServerError(w, err)
		return
	}

	if user.Role == owner || user.Role == admin {
		sendError(w, "Not appropiate for admins or owners", http.StatusBadRequest)
		return
	}

	err = repo.DB.ActivateDisableUser(user.Id, user.Active)
	if err != nil {
		sendError(w, "Not appropiate for admins or owners", http.StatusBadRequest)
		return
	}

	jwtCookie := http.Cookie{
		Name:     "jwt",
		Value:    "",
		HttpOnly: true,
		Expires:  time.Now().Add(-time.Hour),
	}

	http.SetCookie(w, &jwtCookie)
	sendJson("msgjson", w, &options{
		ok:     true,
		msg:    "User deleted successfully",
		stCode: http.StatusOK,
	})
}
