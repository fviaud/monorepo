package main

import (
	"log"

	"backend/internal/handler"
	"backend/internal/router"
)

func main() {
	h := handler.New()
	r := router.New(h)

	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
