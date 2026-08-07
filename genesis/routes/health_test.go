package routes

import (
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedGet("/health", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryUnauthorizedGet("/health", UnauthorizedConfig{
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}
