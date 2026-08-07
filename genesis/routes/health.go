package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Health(c *gin.Context) {

	// We assume, if the api is able to respond to this request, it is healthy.
	c.Status(http.StatusOK)
}
