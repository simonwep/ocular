package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/simonwep/genesis/core"
	"github.com/simonwep/genesis/middleware"
)

func SetupRoutes() *gin.Engine {

	// Set mode
	gin.SetMode(core.Config.AppGinMode)

	// Create router
	root := gin.New()

	// Middleware
	root.Use(gin.Recovery())

	// Wrap routes under common path
	router := root.Group(core.Config.BaseUrl)

	// Auth and account endpoints
	router.POST("/login", Login)
	router.POST("/account/update", UpdateAccount)
	router.POST("/logout", Logout)

	// User endpoints
	router.GET("/user", GetUser)
	router.POST("/user", CreateUser)
	router.POST("/user/:name", UpdateUser)
	router.DELETE("/user/:name", DeleteUser)

	// Data endpoints
	router.POST("/data/:key", middleware.LimitBodySize(core.Config.AppDataMaxSize), middleware.MinifyJson(), SetData)
	router.DELETE("/data/:key", DeleteData)
	router.GET("/data/:key", DataByKey)
	router.GET("/data", Data)

	// Heal check endpoints
	router.GET("/health", Health)

	return root
}
