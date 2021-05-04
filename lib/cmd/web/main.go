package main

import (
	"log"
	"net/http"
	"os"

	"github.com/4d3v/ecommerce/internal/config"
	"github.com/4d3v/ecommerce/internal/driver"
	"github.com/4d3v/ecommerce/internal/handlers"
	"github.com/4d3v/ecommerce/internal/helpers"
)

// Temporary Postgres container for development
// docker run --name ecommerce-dev -e POSTGRES_USER=tmpusr
// -e POSTGRES_PASSWORD=secret -d -p 5432:5432 postgres
const (
	port = ":8080"
	dsn  = "host=localhost port=5432 dbname=ecommerce user=tmpusr password=secret"
)

var (
	app config.AppConfig
)

func main() {
	db, err := run()
	if err != nil {
		log.Fatal(err)
	}
	defer db.SQL.Close()
}

func run() (*driver.DB, error) {
	app.InProduction = false
	app.InfoLog = log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	app.ErrorLog = log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime)

	// connect to database
	log.Println("Connecting to database...")
	db, err := driver.ConnectSQL(dsn)
	if err != nil {
		log.Fatal("Cannot connect to database! Dying...")
	}
	log.Println("Connected to database!")

	app.UseCache = false

	repo := handlers.NewRepo(&app, db)
	handlers.NewHandlers(repo)
	helpers.NewLoggers(&app)

	app.InfoLog.Printf("Starting application on port %s", port)

	srv := &http.Server{
		Addr:    port,
		Handler: routes(),
	}

	err = srv.ListenAndServe()
	app.ErrorLog.Println(err)
	os.Exit(1)

	return db, nil
}
