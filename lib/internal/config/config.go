package config

import (
	"log"

	"github.com/4d3v/ecommerce/internal/models"
)

// AppConfig holds the application config
type AppConfig struct {
	Env          map[string]string
	InProduction bool
	UseCache     bool
	InfoLog      *log.Logger
	ErrorLog     *log.Logger
	MailChan     chan models.MailData
}
