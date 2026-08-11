package routes

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/simonwep/genesis/core"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type versionResponse struct {
	Version   string `json:"version"`
	Commit    string `json:"commit"`
	BuildDate string `json:"buildDate"`
}

func TestVersion(t *testing.T) {
	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/meta/version", nil)

	SetupRoutes().ServeHTTP(response, request)

	assert.Equal(t, http.StatusOK, response.Code)

	var body versionResponse
	require.NoError(t, json.NewDecoder(response.Body).Decode(&body))
	assert.Equal(t, core.Config.AppBuildVersion, body.Version)
	assert.Equal(t, core.Config.AppBuildCommit, body.Commit)
	assert.Equal(t, core.Config.AppBuildDate, body.BuildDate)
}
