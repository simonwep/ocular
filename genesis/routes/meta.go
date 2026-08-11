package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/simonwep/genesis/core"
)

func Version(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"version":   core.Config.AppBuildVersion,
		"commit":    core.Config.AppBuildCommit,
		"buildDate": core.Config.AppBuildDate,
	})
}
