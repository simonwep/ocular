package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUnauthorizedAccess(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/user", AuthorizedBodyConfig{
		Body:  "{\"name\": \"test\", \"password\": \"foobar1234\", \"admin\": false}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})

	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Body:  "{\"name\": \"test\", \"password\": \"foobar1234\", \"admin\": false}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})

	tryAuthorizedGet("/user", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})

	tryAuthorizedDelete("/user/foo", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})
}

func TestRetrieveUsers(t *testing.T) {
	token := loginAdmin(t)

	tryAuthorizedGet("/user", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			baz := "{\"name\":\"baz\",\"admin\":false}"
			foo := "{\"name\":\"foo\",\"admin\":false}"
			assert.Equal(t, "["+baz+","+foo+"]", response.Body.String())
		},
	})
}

func TestDeleteUser(t *testing.T) {
	token := loginAdmin(t)

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedDelete("/user/foo", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"foo\", \"password\": \"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})
}

func TestCreateUser(t *testing.T) {
	token := loginAdmin(t)

	tryAuthorizedPost("/user", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"name\":\"test2\",\"password\":\"foobar1235\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusCreated, response.Code)
		},
	})

	tryAuthorizedPost("/user", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"name\":\"test2\",\"password\":\"foobar1235\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusConflict, response.Code)
		},
	})

	tryAuthorizedPost("/user", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"name\":\"test//2\",\"password\":\"foobar1235\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"test2\", \"password\": \"foobar1235\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}

func TestUpdateUser(t *testing.T) {
	token := loginAdmin(t)

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\":\"foo\", \"password\":\"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	// invalid password
	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"password\":\"\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})

	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"password\":\"wK8iVkRO\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\":\"foo\", \"password\":\"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\":\"foo\", \"password\":\"wK8iVkRO\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}

func TestDeleteItself(t *testing.T) {
	token := loginAdmin(t)

	tryAuthorizedDelete("/user/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})

	// Ensure the admin can still log in afterwards
	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\": \"bar\", \"password\": \"EczUR8dn\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}

func TestUpdateItself(t *testing.T) {
	token := loginAdmin(t)

	tryAuthorizedPost("/user/bar", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"password\":\"wK8iVkRO\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})
}

func TestPartialUpdate(t *testing.T) {
	token := loginAdmin(t)

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\":\"foo\", \"password\":\"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"admin\":true",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})

	tryUnauthorizedPost("/login", UnauthorizedBodyConfig{
		Body: "{\"user\":\"foo\", \"password\":\"hgEiPCZP\"}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/user/foo", AuthorizedBodyConfig{
		Token: token,
		Body:  "{\"password\":\"JNYwKmzh\",\"admin\":true}",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}
