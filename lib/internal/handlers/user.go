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

func (repo *Repository) GetUsers(w http.ResponseWriter, r *http.Request) {

	users, err := repo.DB.AdminGetUsers()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	var resp []userJson

	for _, prop := range users {
		p := userJson{
			Id:     prop.Id,
			Name:   prop.Name,
			Email:  prop.Email,
			Role:   prop.Role,
			Active: prop.Active,
		}

		resp = append(resp, p)
	}

	w.Header().Set("Content-Type", "application/json")

	newJson, err := json.MarshalIndent(resp, "", "    ")
	if err != nil {
		fmt.Println("Error marshaling json")

		resp := jsonMsg{
			Ok:      false,
			Message: "Internal server error",
		}

		out, _ := json.Marshal(resp)
		w.Write(out)
		return
	}

	w.Write(newJson)
}

func (repo *Repository) CreateUser(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	role, err := strconv.Atoi(r.Form.Get("role")) // TODO handle error
	if err != nil {
		fmt.Println("Error parsing user role property into int")
		return
	}

	usr := models.User{
		Name:            r.Form.Get("name"),
		Email:           r.Form.Get("email"),
		Role:            role,
		Password:        r.Form.Get("password"),
		PasswordConfirm: r.Form.Get("password_confirm"),
	}

	resp := jsonMsg{
		Ok:      true,
		Message: "Success!",
	}

	err = repo.DB.AdminInsertUser(usr) // TODO handle error #Err0

	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		helpers.ServerError(w, err) // #Err0

		resp.Ok = false
		resp.Message = "Fail!"

		out, err := json.MarshalIndent(resp, "", "    ")
		if err != nil {
			fmt.Println("Error marshalling json")
			return
		}

		w.Write(out)
		return
	}

	out, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("error marshalling", err)
		return
	}

	w.Write(out)
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
		fmt.Println("Error converting parameter to int")
		return
	}

	resp := jsonMsg{
		Ok:      true,
		Message: "Success!",
	}

	w.Header().Set("Content-Type", "application/json")

	user, err := repo.DB.AdminGetUserById(id)
	if err != nil {
		fmt.Printf("ERROR: %s", err)

		resp.Ok = false
		resp.Message = "Fail!"

		out, err := json.Marshal(resp)
		if err != nil {
			fmt.Println("Error marshaling json")
			return
		}

		w.Write(out)
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
			fmt.Println("Error converting active to boolean")
			return
		}
		user.Active = tmp
	}

	err = repo.DB.AdminUpdateUser(user)
	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	out, err := json.Marshal(resp)
	if err != nil {
		fmt.Println("Error marshaling json")
		return
	}

	w.Write(out)
}
