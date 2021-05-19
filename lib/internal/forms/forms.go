package forms

import (
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/asaskevich/govalidator"
)

// Form creates a custom form struct, embeds a url.Values object
type Form struct {
	url.Values
	Errors errors
}

// New initializes a form struct
func New(data url.Values) *Form {
	return &Form{
		data,
		errors(map[string][]string{}),
	}
}

// Valid returns true if there are no errors, otherwise false
func (f *Form) Valid() bool {
	return len(f.Errors) == 0
}

// Required checks for required fields
func (f *Form) Required(fields ...string) {
	for _, field := range fields {
		value := f.Get(field)
		if strings.TrimSpace(value) == "" {
			f.Errors.Add(field, "This field cannot be blank")
		}
	}
}

// Has checks if form field is in post and not empty
func (f *Form) Has(field string) bool {
	return f.Get(field) != ""
}

// MinLength checks for string minimum length
func (f *Form) MinLength(field string, length int) bool {
	x := f.Get(field)
	if len(x) < length {
		f.Errors.Add(field, fmt.Sprintf("This field must be at least %d characters long", length))
		return false
	}
	return true
}

func (f *Form) CheckPassword(pass, passConfirm string) {
	if f.Get(pass) != f.Get(passConfirm) {
		f.Errors.Add(passConfirm, "Passwords does not match")
	}
}

// IsEmail checks for valid email address
func (f *Form) IsEmail(field string) {
	if !govalidator.IsEmail(f.Get(field)) {
		f.Errors.Add(field, "Invalid email address")
	}
}

func (f *Form) IsInt(field string) {
	if !govalidator.IsInt(f.Get(field)) {
		f.Errors.Add(field, "Field %s should be an integer")
	}
}

func (f *Form) IsUint(field string) {
	num, err := strconv.Atoi(f.Get(field))
	if err != nil {
		fmt.Println("[isUint]:", err)
		f.Errors.Add(
			field,
			fmt.Sprintf("Field %s should be an integer and greater or equal than 0", field),
		)
	}
	if num < 0 {
		f.Errors.Add(
			field,
			fmt.Sprintf("Field %s should be an integer and greater or equal than 0", field),
		)
	}
}
