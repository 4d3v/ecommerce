package dbrepo

import (
	"database/sql"

	"github.com/4d3v/ecommerce/internal/config"
	"github.com/4d3v/ecommerce/internal/repository"
)

type postgresDbRepo struct {
	App *config.AppConfig
	DB  *sql.DB
}

func NewPostgresRepo(a *config.AppConfig, conn *sql.DB) repository.DatabaseRepo {
	return &postgresDbRepo{
		App: a,
		DB:  conn,
	}
}
