package routes

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
)

type UnauthorizedConfig struct {
	Handler func(*httptest.ResponseRecorder)
}

type UnauthorizedBodyConfig struct {
	Body    string
	Handler func(*httptest.ResponseRecorder)
}

type AuthorizedConfig struct {
	Token   string
	Handler func(*httptest.ResponseRecorder)
}

type AuthorizedBodyConfig struct {
	Body    string
	Token   string
	Handler func(*httptest.ResponseRecorder)
}

func tryRequest(url, method, body string, config AuthorizedConfig) {
	router := SetupRoutes()

	response := httptest.NewRecorder()
	request, _ := http.NewRequest(method, url, strings.NewReader(body))

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Content-Length", strconv.FormatInt(int64(len(body)), 10))
	request.Header.Set("Cookie", config.Token)

	router.ServeHTTP(response, request)
	config.Handler(response)
}

func tryUnauthorizedPost(url string, config UnauthorizedBodyConfig) {
	tryRequest(url, "POST", config.Body, AuthorizedConfig{
		Token:   "",
		Handler: config.Handler,
	})
}

func tryUnauthorizedGet(url string, config UnauthorizedConfig) {
	tryRequest(url, "GET", "", AuthorizedConfig{
		Token:   "",
		Handler: config.Handler,
	})
}

func tryAuthorizedPost(url string, config AuthorizedBodyConfig) {
	tryRequest(url, "POST", config.Body, AuthorizedConfig{
		Token:   config.Token,
		Handler: config.Handler,
	})
}

func tryAuthorizedDelete(url string, config AuthorizedConfig) {
	tryRequest(url, "DELETE", "", config)
}

func tryAuthorizedGet(url string, config AuthorizedConfig) {
	tryRequest(url, "GET", "", config)
}
