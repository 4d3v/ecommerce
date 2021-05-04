package config

import (
	"log"
)

// AppConfig holds the application config
type AppConfig struct {
	InProduction bool
	UseCache     bool
	InfoLog      *log.Logger
	ErrorLog     *log.Logger
	// MailChan     chan models.MailData
}
