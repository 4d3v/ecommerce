package handlers

import (
	"github.com/4d3v/ecommerce/internal/config"
	"github.com/4d3v/ecommerce/internal/driver"
	"github.com/4d3v/ecommerce/internal/repository"
	"github.com/4d3v/ecommerce/internal/repository/dbrepo"
)

// Repo is the repository used by the handlers
var Repo *Repository

// Repository is the repository type
type Repository struct {
	App *config.AppConfig
	DB  repository.DatabaseRepo
}

// NewRepo creates a new repository
func NewRepo(a *config.AppConfig, db *driver.DB) *Repository {
	return &Repository{
		App: a,
		DB:  dbrepo.NewPostgresRepo(a, db.SQL),
	}
}

// NewHandlers sets the repository for the handlers
func NewHandlers(repo *Repository) {
	Repo = repo
}
