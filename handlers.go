package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"text/template"
	"time"
)

type handler func(http.ResponseWriter, *http.Request) error

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	defer func() {
		if rerr := recover(); rerr != nil {
			log.Printf("Recovering from panic")
			err, ok := rerr.(error)
			if !ok {
				err = fmt.Errorf("recovering from panic with value %+v", rerr)
				handleError(w, r, err)
				return
			}
			handleError(w, r, err)
		}
	}()

	err := h(w, r)
	if err != nil {
		handleError(w, r, err)
	}
}

// serveAngularHome is an example of a handler function for serving a template
func serveHome(w http.ResponseWriter, r *http.Request) error {
	return renderTemplate(w, nil, "templates/index.tmpl")
}

// serveUserJson is an example of a hander function that returns a JSON response
// instead of a response with Content-Type: text/html
func serveUserJson(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	username, ok := vars["username"]
	if !ok {
		return fmt.Errorf("Username not provided")
	}

	// Create a struct that should be returned
	// This could be a database lookup
	user := struct {
		Username  string
		CreatedAt int64
	}{username, time.Now().Unix()}

	serveJson(w, r, user)
	return nil
}

// renderAngularTemplate renders the provided template(s) using the provided data(if any)
// It buffers the write operation so partial writes do not happen in case of errors
func renderTemplate(w http.ResponseWriter, data interface{}, filenames ...string) error {
	t := template.New("base")
	s1, err := t.ParseFiles(append(filenames, "templates/base.tmpl")...)
	if err != nil {
		return err
	}

	// Write to a temporary buffer when executing the template
	// Otherwise, if ExecuteTemplate causes an error, partially-written content may be sent
	b := bytes.NewBuffer([]byte{})
	err = s1.ExecuteTemplate(b, "base", data)
	if err != nil {
		return err
	}
	w.Write(b.Bytes())
	return nil
}

// handleError specifies the behavior when a handler function (controller)
// encounters a runtime panic
func handleError(w http.ResponseWriter, r *http.Request, err error) {
	log.Print(err)
	http.Error(w, "An unexpected server error has occurred", http.StatusInternalServerError)
}

func serveCommentsJSON(w http.ResponseWriter, r *http.Request) error {
	type comment struct {
		Text   string `json:"text"`
		Author string `json:"author"`
	}

	return serveJson(w, r, []comment{comment{"jkl;", "Ms. Baz"}})
}

// serveJson serves the JSON representation of arbitrary data
// Useful for serving api.example.com/users/1
func serveJson(w http.ResponseWriter, r *http.Request, data interface{}) error {
	bts, err := json.Marshal(data)
	if err != nil {
		return err
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(bts)
	return nil
}

var logins = map[string][]byte{
	"user@example.com": []byte("$2a$12$4263qyI6GKANbunG0BtRAu9va3CRVcNPwTsFVUU3Eg69/HfrYgaLC"), // password is "password"
}

func serveLogin(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		return renderTemplate(w, nil, "templates/login.tmpl")
	case "POST":
		r.ParseForm()
		email := r.Form.Get("email")
		password := []byte(r.Form.Get("password"))
		if len(email) == 0 {
			return fmt.Errorf("invalid email")
		}
		hashedPassword := logins[email]
		err := bcrypt.CompareHashAndPassword(hashedPassword, password)
		if err != nil {
			log.Print("wrong pass")
			return renderTemplate(w, "Invalid login", "templates/login.tmpl")
		}
		http.Redirect(w, r, "/dashboard", http.StatusTemporaryRedirect)
		return nil
	}
	return fmt.Errorf("Invalid method")
}

func serveDashboard(w http.ResponseWriter, r *http.Request) error {
	return renderTemplate(w, nil, "templates/dashboard.tmpl")
}
