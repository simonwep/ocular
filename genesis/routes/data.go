package routes

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/dgraph-io/badger/v4"
	jsonpatch "github.com/evanphx/json-patch/v5"
	"github.com/gin-gonic/gin"
	"github.com/simonwep/genesis/core"
	"go.uber.org/zap"
)

func Data(c *gin.Context) {
	user := authenticateUser(c)

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	} else if data, err := core.GetAllDataFromUser(user.Name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve data"})
		core.Logger.Error("failed to retrieve data", zap.Error(err))
	} else {
		c.Data(http.StatusOK, "application/json; charset=utf-8", data)
	}
}

func DataByKey(c *gin.Context) {
	key := c.Param("key")
	user := authenticateUser(c)

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	} else if !core.Config.AppKeyPattern.MatchString(key) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key must match " + core.Config.AppKeyPattern.String()})
	} else if data, err := core.GetDataFromUser(user.Name, key); err != nil {
		if errors.Is(err, badger.ErrKeyNotFound) {
			c.Status(http.StatusNoContent)
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve unit of data"})
			core.Logger.Error("failed to retrieve unit of data", zap.Error(err))
		}
	} else {
		c.Data(http.StatusOK, "application/json; charset=utf-8", data)
	}
}

func SetData(c *gin.Context) {
	if user, key, valid := validateDataRequest(c); !valid {
		return
	} else if body, err := c.GetRawData(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
	} else if !json.Valid(body) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body must be valid JSON"})
	} else if err := core.SetDataForUser(user.Name, key, body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set data"})
		core.Logger.Error("failed to set data", zap.Error(err))
	} else {
		c.Status(http.StatusOK)
	}
}

func PatchData(c *gin.Context) {
	if user, key, valid := validateDataRequest(c); !valid {
		return
	} else if body, err := c.GetRawData(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
	} else if !json.Valid(body) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body must be valid JSON"})
	} else if patch, err := jsonpatch.DecodePatch(body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body must be a valid JSON patch"})
	} else {
		options := jsonpatch.NewApplyOptions()
		options.AccumulatedCopySizeLimit = core.Config.AppDataMaxSize

		var errPatchedDataTooLarge = errors.New("patched data exceeds configured maximum size")
		var patchErr error

		err := core.UpdateDataForUser(user.Name, key, func(data []byte) ([]byte, error) {
			patchErr = nil
			patched, err := patch.ApplyWithOptions(data, options)

			if err != nil {
				patchErr = err
				return nil, err
			}

			if int64(len(patched)) > core.Config.AppDataMaxSize {
				return nil, errPatchedDataTooLarge
			}

			return patched, nil
		})

		if errors.Is(err, errPatchedDataTooLarge) {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "request entity too large, limit is " + strconv.FormatInt(core.Config.AppDataMaxSize, 10) + " kilobytes"})
		} else if patchErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to apply JSON patch: " + patchErr.Error()})
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update data"})
			core.Logger.Error("failed to update data", zap.Error(err))
		} else {
			c.Status(http.StatusOK)
		}
	}
}

func DeleteData(c *gin.Context) {
	key := c.Param("key")
	user := authenticateUser(c)

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	} else if !core.Config.AppKeyPattern.MatchString(key) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key must match " + core.Config.AppKeyPattern.String()})
	} else if err := core.DeleteDataFromUser(user.Name, key); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete data"})
		core.Logger.Error("failed to delete data", zap.Error(err))
	} else {
		c.Status(http.StatusOK)
	}
}

func validateDataRequest(c *gin.Context) (*core.User, string, bool) {
	key := c.Param("key")
	user := authenticateUser(c)

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return nil, key, false
	} else if !core.Config.AppKeyPattern.MatchString(key) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key must match " + core.Config.AppKeyPattern.String()})
		return nil, key, false
	} else if count := core.GetDataCountForUser(user.Name, key); count > core.Config.AppKeysPerUser {
		c.JSON(http.StatusForbidden, gin.H{"error": "too many keys, limit is " + strconv.FormatInt(core.Config.AppKeysPerUser, 10)})
		return nil, key, false
	} else if size, err := getContentLength(c); err != nil || size > core.Config.AppDataMaxSize {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "request entity too large, limit is " + strconv.FormatInt(core.Config.AppDataMaxSize, 10) + " kilobytes"})
		return nil, key, false
	}

	return user, key, true
}

func getContentLength(c *gin.Context) (int64, error) {
	if v := c.GetHeader("Content-Length"); v != "" {
		return strconv.ParseInt(v, 10, 64)
	}

	return -1, nil
}
