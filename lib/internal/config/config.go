package config

import (
	"log"
)

// AppConfig holds the application config
type AppConfig struct {
	Env          map[string]string
	InProduction bool
	UseCache     bool
	InfoLog      *log.Logger
	ErrorLog     *log.Logger
	// MailChan     chan models.MailData
}
