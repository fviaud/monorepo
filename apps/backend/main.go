package main

import (
	"log"

	"backend/internal/router"
)

func main() {

	r := router.New()

	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
