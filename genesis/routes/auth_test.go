package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/simonwep/genesis/core"
	"github.com/stretchr/testify/assert"
)

func loginUser(t *testing.T) string {
	core.ResetDatabase()
	var token string

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{\"name\":\"foo\",\"admin\":false}", response.Body.String())
			token = response.Header().Get("Set-Cookie")
		},
	})

	return token
}

func loginAdmin(t *testing.T) string {
	core.ResetDatabase()
	var token string

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"bar\", \"password\": \"EczUR8dn\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{\"name\":\"bar\",\"admin\":true}", response.Body.String())
			token = response.Header().Get("Set-Cookie")
		},
	})

	return token
}

func TestInvalidLogin(t *testing.T) {
	core.ResetDatabase()

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo123\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})
}

func TestLogin(t *testing.T) {
	core.ResetDatabase()

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"123456\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})
}

func TestLogout(t *testing.T) {
	core.ResetDatabase()
	token := loginUser(t)

	tryAuthorizedPost("/logout", AuthorizedBodyConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})
}

func TestReLogin(t *testing.T) {
	core.ResetDatabase()
	token := loginUser(t)

	tryAuthorizedPost("/login", AuthorizedBodyConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/login", AuthorizedBodyConfig{
		Token: "",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})
}

func TestLoginRateLimitExistingUser(t *testing.T) {
	core.ResetDatabase()

	for i := 0; i < int(core.Config.LoginMaxAttempts); i++ {
		tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
			Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
			Handler: func(response *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusUnauthorized, response.Code)
			},
		})
	}

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusTooManyRequests, response.Code)
			body := response.Body.String()
			assert.Contains(t, body, "retry_after")
		},
	})
}

func TestLoginRateLimitDoesNotLeakForNonExistingUser(t *testing.T) {
	core.ResetDatabase()

	for i := 0; i < int(core.Config.LoginMaxAttempts)+2; i++ { // even more attempts
		tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
			Body: "{\"user\": \"unknown\", \"password\": \"wrong\"}",
			Handler: func(response *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusUnauthorized, response.Code)
			},
		})
	}
}

func TestLoginLockResetsAfterSuccessAndDurationProgression(t *testing.T) {
	core.ResetDatabase()

	maxLoginAttempts := int(core.Config.LoginMaxAttempts)

	// Fail until first lock
	for i := 0; i < maxLoginAttempts; i++ {
		tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
			Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
			Handler: func(response *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusUnauthorized, response.Code)
			},
		})
	}

	// First lock
	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusTooManyRequests, response.Code)
			body := response.Body.String()
			assert.Contains(t, body, "retry_after")
		},
	})

	// Fail again to reach second lock duration
	time.Sleep(2100 * time.Millisecond)
	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusTooManyRequests, response.Code)
			body := response.Body.String()
			assert.Contains(t, body, "retry_after")
		},
	})

	// Respond with correct retry_after
	time.Sleep(1100 * time.Millisecond)
	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusTooManyRequests, response.Code)
			body := response.Body.String()
			assert.Contains(t, body, "retry_after")
		},
	})

	// Successful login resets the lockout
	time.Sleep(4100 * time.Millisecond)
	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	for i := 0; i < maxLoginAttempts; i++ {
		tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
			Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
			Handler: func(response *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusUnauthorized, response.Code)
			},
		})
	}

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"wrong\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusTooManyRequests, response.Code)
		},
	})
}
