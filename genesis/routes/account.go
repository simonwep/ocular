package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/simonwep/genesis/core"
)

type updateBody struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword" validate:"required,gte=8,lte=64"`
}

func UpdateAccount(c *gin.Context) {
	validate := validator.New()
	user := authenticateUser(c)

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body updateBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	} else if _, err := core.AuthenticateUser(user.Name, body.CurrentPassword); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "current password incorrect"})
		return
	}

	if err := validate.Struct(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed, must contain currentPassword and newPassword"})
	} else if err := core.UpdateUser(user.Name, core.PartialUser{
		Admin:    nil,
		Password: &body.NewPassword,
	}); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to update user"})
	} else {
		c.Status(http.StatusOK)
	}
}
