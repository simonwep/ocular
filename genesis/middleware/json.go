package middleware

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/json"
	"github.com/tdewolff/parse/v2"
)

func MinifyJson() gin.HandlerFunc {
	return func(c *gin.Context) {
		if (c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "PATCH") && c.ContentType() == "application/json" {

			m := minify.New()
			m.AddFunc("application/json", json.Minify)

			bodyReader := c.Request.Body
			defer bodyReader.Close()

			minifyReader, minifyWriter := io.Pipe()

			c.Request.Body = minifyReader
			c.Request.ContentLength = -1
			c.Request.Header.Set("Content-Length", "-1")

			go func() {
				defer minifyWriter.Close()

				err := m.Minify("application/json", minifyWriter, bodyReader)

				if _, ok := err.(*parse.Error); ok {
					c.AbortWithStatus(http.StatusBadRequest)
				} else if _, ok = err.(*http.MaxBytesError); ok {
					c.AbortWithStatus(http.StatusRequestEntityTooLarge)
				} else if err != nil {
					c.AbortWithStatus(http.StatusInternalServerError)
				}
			}()
		}

		c.Next()
	}
}
