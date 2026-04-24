package handler

import (
	"fmt"
	"net/http"
	"sync"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TodoHandler struct {
	mu    sync.RWMutex
	items map[string]models.Todo
}

func NewTodoHandler() *TodoHandler {
	return &TodoHandler{
		items: make(map[string]models.Todo),
	}
}

func (h *TodoHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (h *TodoHandler) ListItems(c *gin.Context) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	items := make([]models.Todo, 0, len(h.items))
	for _, item := range h.items {
		items = append(items, item)
	}
	c.JSON(http.StatusOK, items)
}

func (h *TodoHandler) CreateItem(c *gin.Context) {
	var newTodo models.Todo
	if err := c.ShouldBindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	id := uuid.New()
	newTodo.ID = id
	h.items[id.String()] = newTodo
	c.JSON(http.StatusCreated, newTodo)
}

func (h *TodoHandler) GetItem(c *gin.Context) {
	id := c.Param("id")

	h.mu.RLock()
	defer h.mu.RUnlock()

	item, ok := h.items[id]
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *TodoHandler) UpdateItem(c *gin.Context) {
	id := c.Param("id")

	var item models.Todo
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	fmt.Printf("Received update for fred ID %s: %+v\n", id, item)

	parsedID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}
	item.ID = parsedID

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.items[id]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}
	h.items[id] = item
	c.JSON(http.StatusOK, item)
}

func (h *TodoHandler) DeleteItem(c *gin.Context) {
	id := c.Param("id")

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.items[id]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
		return
	}
	delete(h.items, id)
	c.Status(http.StatusNoContent)
}
