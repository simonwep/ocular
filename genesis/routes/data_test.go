package routes

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAllData(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedGet("/data", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{}", response.Body.String())
		},
	})

	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/data/foo", AuthorizedBodyConfig{
		Body:  "{\"test\": 200}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{\"bar\":{\"hello\":\"world!\"},\"foo\":{\"test\":200}}", response.Body.String())
		},
	})
}

func TestInvalidJSON(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})
}

func TestSingleObject(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "{\"hello\": 1e5}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{\"hello\":1e5}", response.Body.String())
		},
	})
}

func TestEmpty(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedGet("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusNoContent, response.Code)
		},
	})
}

func TestSingleArray(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "[1, 2, 3, 4, 5, 6]",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "[1,2,3,4,5,6]", response.Body.String())
		},
	})
}

func TestInvalidKeys(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/HsRLrSgCFylAK77aJmvRon0ubjXjzPFtd", AuthorizedBodyConfig{ // too long
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})

	tryAuthorizedPost("/data/🦧", AuthorizedBodyConfig{ // invalid characters
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})
}

func TestInvalidKeysAllEndpoints(t *testing.T) {
	token := loginUser(t)

	invalidKeys := []string{
		"HsRLrSgCFylAK77aJmvRon0ubjXjzPFtd",
		"🦧",
		"foo bar",
		"foo.bar",
		"foo$",
	}

	expectBadRequest := func(response *httptest.ResponseRecorder) {
		assert.Equal(t, http.StatusBadRequest, response.Code)
		assert.Contains(t, response.Body.String(), "key must match")
	}

	for _, key := range invalidKeys {
		path := "/data/" + url.PathEscape(key)

		tryAuthorizedPost(path, AuthorizedBodyConfig{
			Body:    "{\"hello\": \"world!\"}",
			Token:   token,
			Handler: expectBadRequest,
		})

		tryAuthorizedPatch(path, AuthorizedBodyConfig{
			Body:    `[{"op":"add","path":"/hello","value":"world"}]`,
			Token:   token,
			Handler: expectBadRequest,
		})

		tryAuthorizedGet(path, AuthorizedConfig{
			Token:   token,
			Handler: expectBadRequest,
		})

		tryAuthorizedDelete(path, AuthorizedConfig{
			Token:   token,
			Handler: expectBadRequest,
		})
	}
}

func TestPatchData(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/patch", AuthorizedBodyConfig{
		Body:  `{"name":"old","items":[1,2],"nested":{"keep":true}}`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPatch("/data/patch", AuthorizedBodyConfig{
		Body: `[
			{"op":"replace","path":"/name","value":"new"},
			{"op":"add","path":"/items/-","value":3},
			{"op":"remove","path":"/nested/keep"},
			{"op":"add","path":"/nested/added","value":"yes"},
			{"op":"copy","from":"/name","path":"/copied"},
			{"op":"move","from":"/copied","path":"/moved"},
			{"op":"test","path":"/moved","value":"new"}
		]`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/patch", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.JSONEq(t, `{"name":"new","items":[1,2,3],"nested":{"added":"yes"},"moved":"new"}`, response.Body.String())
		},
	})
}

func TestPatchDataCreatesMissingKeyFromEmptyObject(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPatch("/data/new", AuthorizedBodyConfig{
		Body:  `[{"op":"add","path":"/created","value":{"nested":true}},{"op":"add","path":"/created/also","value":42}]`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/new", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.JSONEq(t, `{"created":{"nested":true,"also":42}}`, response.Body.String())
		},
	})
}

func TestPatchDataCreatesMissingKeyForEmptyPatch(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPatch("/data/new", AuthorizedBodyConfig{
		Body:  `[]`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/new", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{}", response.Body.String())
		},
	})
}

func TestPatchDataFailureDoesNotPersistChanges(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/atomic", AuthorizedBodyConfig{
		Body:  `{"value":1}`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPatch("/data/atomic", AuthorizedBodyConfig{
		Body:  `[{"op":"replace","path":"/value","value":2},{"op":"remove","path":"/missing"}]`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})

	tryAuthorizedGet("/data/atomic", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.JSONEq(t, `{"value":1}`, response.Body.String())
		},
	})
}

func TestPatchDataResultTooBig(t *testing.T) {
	token := loginUser(t)
	value := strings.Repeat("x", 600)

	tryAuthorizedPost("/data/size", AuthorizedBodyConfig{
		Body:  `{"value":"` + value + `"}`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPatch("/data/size", AuthorizedBodyConfig{
		Body:  `[{"op":"add","path":"/another","value":"` + value + `"}]`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusRequestEntityTooLarge, response.Code)
		},
	})

	tryAuthorizedGet("/data/size", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.JSONEq(t, `{"value":"`+value+`"}`, response.Body.String())
		},
	})
}

func TestInvalidJSONPatches(t *testing.T) {
	token := loginUser(t)

	patches := []string{
		``,
		`{}`,
		`[{"op":"replace","path":"/missing","value":1}]`,
		`[{"op":"unsupported","path":"/foo","value":1}]`,
		`[{"op":"test","path":"/foo","value":1}]`,
	}

	for _, body := range patches {
		tryAuthorizedPatch("/data/new", AuthorizedBodyConfig{
			Body:  body,
			Token: token,
			Handler: func(response *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusBadRequest, response.Code, "body: %s", body)
			},
		})
	}

	tryAuthorizedPatch("/data/new", AuthorizedBodyConfig{
		Body:  `[{"op":"add","path":"/foo","value":1}`,
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusBadRequest, response.Code)
		},
	})
}

func TestPatchDataUnauthorized(t *testing.T) {
	tryRequest("/data/foo", "PATCH", `[{"op":"add","path":"/hello","value":"world"}]`, AuthorizedConfig{
		Token: "",
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusUnauthorized, response.Code)
		},
	})
}

func TestDeleteData(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
			assert.Equal(t, "{\"hello\":\"world!\"}", response.Body.String())
		},
	})

	tryAuthorizedDelete("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedGet("/data/bar", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusNoContent, response.Code)
		},
	})
}

func tryAuthorizedPatch(url string, config AuthorizedBodyConfig) {
	tryRequest(url, "PATCH", config.Body, AuthorizedConfig{
		Token:   config.Token,
		Handler: config.Handler,
	})
}

func TestTooBig(t *testing.T) {
	token := loginUser(t)

	body1 := strings.Repeat("{\"hello\": \"world!\"},", 10)
	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "[" + body1[:len(body1)-1] + "]",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	body2 := strings.Repeat("{\"hello\": \"world!\"},", 50)
	tryAuthorizedPost("/data/bar", AuthorizedBodyConfig{
		Body:  "[" + body2[:len(body2)-1] + "]",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusRequestEntityTooLarge, response.Code)
		},
	})
}

func TestTooMany(t *testing.T) {
	token := loginUser(t)

	tryAuthorizedPost("/data/bar1", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/data/bar2", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/data/bar3", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	// this one should fail
	tryAuthorizedPost("/data/bar4", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusForbidden, response.Code)
		},
	})

	// make it succeed
	tryAuthorizedDelete("/data/bar3", AuthorizedConfig{
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})

	tryAuthorizedPost("/data/bar4", AuthorizedBodyConfig{
		Body:  "{\"hello\": \"world!\"}",
		Token: token,
		Handler: func(response *httptest.ResponseRecorder) {
			assert.Equal(t, http.StatusOK, response.Code)
		},
	})
}
