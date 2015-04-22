package main

import (
	"flag"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

var (
	httpAddr = flag.String("addr", ":8080", "HTTP server address")
)

func main() {
	r := mux.NewRouter()
	r.Handle("/", handler(serveHome))
	r.Handle("/comments.json", handler(serveCommentsJSON))
	http.Handle("/static/", http.FileServer(http.Dir("public")))
	http.Handle("/", r)

	if err := http.ListenAndServe(*httpAddr, nil); err != nil {
		log.Fatalf("Error listening, %v", err)
	}
}
