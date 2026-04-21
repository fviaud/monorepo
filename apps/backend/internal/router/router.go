package router

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func New(h *handler.Handler) *gin.Engine {
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", h.Health)
		v1.GET("/items", h.ListItems)
		v1.POST("/items", h.CreateItem)
		v1.GET("/items/:id", h.GetItem)
		v1.PUT("/items/:id", h.UpdateItem)
		v1.DELETE("/items/:id", h.DeleteItem)
	}

	return r
}
