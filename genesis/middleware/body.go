package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func LimitBodySize(n int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "PATCH" {
			c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, n)
		}

		c.Next()
	}
}
