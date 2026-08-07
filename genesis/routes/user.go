package routes

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/simonwep/genesis/core"
	"go.uber.org/zap"
)

func CreateUser(c *gin.Context) {
	validate := validator.New()
	user := authenticateUser(c)
	var body core.User

	if user == nil || !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can create users"})
	} else if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
	} else if !core.Config.AppUserPattern.MatchString(body.Name) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user name, must match " + core.Config.AppUserPattern.String()})
	} else if err := validate.Struct(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation of json failed, must contain name, password and admin"})
	} else if err := core.CreateUser(body); err != nil {
		if errors.Is(err, core.ErrUserAlreadyExists) {
			c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			core.Logger.Error("failed to create user", zap.Error(err))
		}
	} else {
		c.JSON(http.StatusCreated, gin.H{"message": "user created"})
	}
}

func UpdateUser(c *gin.Context) {
	user := authenticateUser(c)
	validate := validator.New()
	name := c.Param("name")
	var body core.PartialUser

	if user == nil || !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "user not found or you are not an admin"})
	} else if name == user.Name {
		c.JSON(http.StatusForbidden, gin.H{"error": "you cannot update yourself"})
	} else if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
	} else if err := validate.Struct(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation of json failed, may contain admin or password"})
	} else if _, err := core.GetUser(name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve user"})
		core.Logger.Error("failed to retrieve user", zap.Error(err))
	} else if err := core.UpdateUser(name, body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "update failed"})
	} else {
		c.Status(http.StatusOK)
	}
}

func DeleteUser(c *gin.Context) {
	name := c.Param("name")
	user := authenticateUser(c)

	if user == nil || !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
	} else if name == user.Name {
		c.JSON(http.StatusForbidden, gin.H{"error": "you cannot delete yourself"})
	} else {
		if err := core.DeleteUser(name); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete user"})
			core.Logger.Error("Failed to delete user", zap.String("name", name), zap.Error(err))
		} else {
			c.Status(http.StatusOK)
		}
	}
}

func GetUser(c *gin.Context) {
	user := authenticateUser(c)

	if user == nil || !user.Admin {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
	} else if list, err := core.GetUsers(user.Name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve users"})
		core.Logger.Error("failed to retrieve users", zap.Error(err))
	} else {
		c.JSON(http.StatusOK, list)
	}
}
