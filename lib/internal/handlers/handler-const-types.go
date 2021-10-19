package handlers

import "github.com/4d3v/ecommerce/internal/models"

const (
	owner  = iota + 1 // 1
	admin             // 2
	normal            // 3
)

const (
	paypal = iota + 1 // 1
	stripe            // 2
)

const (
	timeFormatStr   = "2006-01-02 15:04:05.999999999 -0700 MST"
	MAX_UPLOAD_SIZE = 1024 * 1024 // 1MB
)

// timeFormatStr   = "2006-01-02 15:04:05"
// timeFormatStr   = "2006-01-02 15:04:05.999999999 -0700 MST"

type userJson struct {
	Id              int    `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Role            int    `json:"role"` // ENUM
	Password        string `json:"password"`
	PasswordConfirm string `json:"password_confirm"`
	Active          bool   `json:"active"`
	CreatedAt       string `json:"created_at"`
	UpdatedAt       string `json:"updated_at"`
}

type productJson struct {
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	Image        string  `json:"image"`
	Brand        string  `json:"brand"`
	Category     string  `json:"category"`
	Description  string  `json:"description"`
	Rating       float64 `json:"rating"`
	SumReviews   float64 `json:"sum_reviews"`
	NumReviews   int     `json:"num_reviews"`
	Price        int     `json:"price"`
	CountInStock int     `json:"count_in_stock"`
	UserId       int     `json:"user_id"`
	// User models.User
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type orderJson struct {
	Id                        int      `json:"id"`
	PostalCode                string   `json:"postal_code"`
	Address                   string   `json:"address"`
	Country                   string   `json:"country"`
	City                      string   `json:"city"`
	PaymentMethod             int      `json:"payment_method"`
	PaymentResultId           string   `json:"payment_result_id"`
	PaymentResultStatus       string   `json:"payment_result_status"`
	PaymentResultUpdateTime   string   `json:"payment_result_update_time"`
	PaymentResultEmailAddress string   `json:"payment_result_email_address "`
	TotalPrice                float64  `json:"total_price"`
	IsPaid                    bool     `json:"is_paid"`
	PaidAt                    string   `json:"paid_at"`
	IsDelivered               bool     `json:"is_delivered"`
	DeliveredAt               string   `json:"delivered_at"`
	UserId                    int      `json:"user_id"`
	User                      userJson `json:"user"`
	CreatedAt                 string   `json:"created_at"`
	UpdatedAt                 string   `json:"updated_at"`
	// Product models.Product
}

type customOrderedProdJson struct {
	Id               int    `json:"id"`
	ProdId           int    `json:"prod_id"`
	ProdName         string `json:"prod_name"`
	ProdImage        string `json:"prod_image"`
	ProdBrand        string `json:"prod_brand"`
	ProdPrice        int    `json:"prod_price"`
	ProdCountInStock int    `json:"prod_count_in_stock"`
	ProdQty          int    `json:"prod_qty"`
	UserId           int    `json:"user_id"`
	OrderId          int    `json:"order_id"`
	OpCreatedAt      string `json:"op_created_at"`
	OpUpdatedAt      string `json:"op_updated_at"`
}

type prodReviewsJson struct {
	Id        int     `json:"id"`
	Name      string  `json:"name"`
	Comment   string  `json:"comment"`
	Rating    float64 `json:"rating"`
	UserId    int     `json:"user_id"`
	ProductId int     `json:"product_id"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	UserName  string  `json:"username"`
}

type logsignupdateSuccess struct {
	User    userJson `json:"user"`
	Ok      bool     `json:"ok"`
	Message string   `json:"message"`
}

type msgJson struct {
	Ok      bool                   `json:"ok"`
	Message string                 `json:"message"`
	Data    map[string]interface{} `json:"data"`
	Error   string                 `json:"error"`
	Errors  map[string][]string    `json:"errors"`
}

type productsJsonOutput struct {
	Products []productJson          `json:"products"`
	Data     map[string]interface{} `json:"data"`
}

type ordersJsonOutput struct {
	Orders []orderJson            `json:"orders"`
	Data   map[string]interface{} `json:"data"`
}

type usersJsonOutput struct {
	Users []userJson             `json:"users"`
	Data  map[string]interface{} `json:"data"`
}

type options struct {
	users       []models.User
	user        models.User
	prods       []models.Product
	prod        models.Product
	prodReviews []models.Review
	order       models.Order
	orders      []models.Order
	cops        []models.CustomOrderedProd
	ok          bool
	msg         string
	err         string
	errs        map[string][]string
	stCode      int
	dataMap     map[string]interface{}
}
