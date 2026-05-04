package handler

import (
	"backend/internal/models"
	"fmt"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TodoHandler struct {
	mu    sync.RWMutex
	items map[string]models.Todo
	db    *gorm.DB
}

func NewTodoHandler(db *gorm.DB) *TodoHandler {
	return &TodoHandler{
		items: make(map[string]models.Todo),
		db:    db,
	}
}

func (h *TodoHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (h *TodoHandler) ListItems(c *gin.Context) {
	// h.mu.RLock()
	// defer h.mu.RUnlock()

	var todos []models.Todo
	if err := h.db.Find(&todos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch todos"})
		return
	}

	c.JSON(http.StatusOK, todos)
}

func (h *TodoHandler) CreateItem(c *gin.Context) {
	var newTodo models.Todo
	if err := c.ShouldBindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// h.mu.Lock()
	// defer h.mu.Unlock()

	// id := uuid.New()
	newTodo.ID = uuid.New()
	if err := h.db.Create(&newTodo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create todo"})
		return
	}
	c.JSON(http.StatusCreated, newTodo)
}

func (h *TodoHandler) GetItem(c *gin.Context) {
	id := c.Param("id")

	// h.mu.RLock()
	// defer h.mu.RUnlock()

	// item, ok := h.items[id]
	// if !ok {
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "item not found"})
	// 	return
	// }

	var item models.Todo
	if err := h.db.First(&item, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch todo"})
		}
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *TodoHandler) UpdateItem(c *gin.Context) {
	id := c.Param("id")

	var item models.UpdateTodoInput
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	fmt.Printf("Received update for ID %s: %+v\n", id, item)

	// updates := map[string]interface{}{
	// 	"title":     item.Title,
	// 	"completed": item.Completed,
	// }

	result := h.db.Model(&models.Todo{}).Where("id = ?", id).Updates(item)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update todo"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
		return
	}

	var updated models.Todo
	h.db.First(&updated, "id = ?", id)
	c.JSON(http.StatusOK, updated)
}

func (h *TodoHandler) DeleteItem(c *gin.Context) {
	id := c.Param("id")

	_, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	if err := h.db.Delete(&models.Todo{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete todo"})
		return
	}
	c.Status(http.StatusNoContent)
}
