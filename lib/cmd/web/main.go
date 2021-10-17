package main

import (
	"log"
	"net/http"
	"os"

	"github.com/4d3v/ecommerce/internal/config"
	"github.com/4d3v/ecommerce/internal/driver"
	"github.com/4d3v/ecommerce/internal/handlers"
	"github.com/4d3v/ecommerce/internal/helpers"
	"github.com/4d3v/ecommerce/internal/models"
	"github.com/joho/godotenv"
)

// Temporary Postgres container for development
// docker run --name ecommerce-dev -e POSTGRES_USER=tmpusr
// -e POSTGRES_PASSWORD=secret -d -p 5432:5432 postgres
const (
	port = ":8080"
	dsn  = "host=localhost port=5432 dbname=ecommerce user=postgres password=admin"
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

	defer close(app.MailChan)
	app.InfoLog.Printf("starting mail listener...")
	listenForMail()

	app.InfoLog.Printf("Starting application on port %s", port)

	srv := &http.Server{
		Addr:    port,
		Handler: routes(),
	}

	err = srv.ListenAndServe()
	app.ErrorLog.Println(err)
	os.Exit(1)
}

func run() (*driver.DB, error) {
	mailChan := make(chan models.MailData)
	app.MailChan = mailChan

	app.GlobalCounts = make(map[string]int)
	app.GlobalCounts["totalUsers"] = 0
	app.GlobalCounts["totalProds"] = 0
	app.GlobalCounts["totalProdPages"] = 0
	app.GlobalCounts["adminTotalOrders"] = 0

	app.InProduction = false
	app.InfoLog = log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	app.ErrorLog = log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime)

	var envMap map[string]string
	envMap, err := godotenv.Read()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app.Env = envMap

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

	return db, nil
}
