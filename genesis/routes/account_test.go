package routes

import (
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUpdatePassword(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/account/update", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"currentPassword\": \"hgEiPCZP\",\"newPassword\": \"6sBX4AZb\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/account/update", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"currentPassword\": \"hgEiPCZP\",\"newPassword\": \"6sBX4AZb\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"6sBX4AZb\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}
