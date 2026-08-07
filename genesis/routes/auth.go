package routes

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/simonwep/genesis/core"
	"go.uber.org/zap"
)

type loginBody struct {
	User     string `json:"user" validate:"required"`
	Password string `json:"password" validate:"required"`
}

const cookieName = "gt"

func Login(c *gin.Context) {
	validate := validator.New()
	user := authenticateUser(c)

	if user != nil {
		c.JSON(http.StatusOK, core.PublicUser{
			Name:  user.Name,
			Admin: user.Admin,
		})

		return
	}

	var body loginBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid json"})
		return
	} else if err := validate.Struct(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation of json failed, must contain user and password"})
		return
	}

	// Check if rate limiting is enabled
	rateLimitingEnabled := core.Config.LoginMaxAttempts > 0 && len(core.Config.LoginLockDurations) > 0

	if rateLimitingEnabled {
		// Only enforce for existing users to avoid enumeration signal on non-existent
		if exists, _ := core.GetUser(body.User); exists != nil {
			if locked, retryAfter := core.IsLockedOut(body.User); locked {
				c.JSON(http.StatusTooManyRequests, gin.H{
					"error":           "account temporarily locked",
					"retry_after":     int64(retryAfter / time.Second),
					"retry_timestamp": time.Now().Unix(),
				})
				return
			}
		}
	}

	user, err := core.AuthenticateUser(body.User, body.Password)
	if user == nil || err != nil {
		if rateLimitingEnabled {
			if exists, _ := core.GetUser(body.User); exists != nil {
				core.ApplyFailedAttempt(body.User)
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"error": "username or password incorrect"})
		return
	}

	if rateLimitingEnabled {
		core.ResetFailedLoginAttempts(user.Name)
	}

	if refreshToken, err := core.CreateAuthToken(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create auth token"})
		core.Logger.Error("failed to create auth token", zap.Error(err))
	} else {
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     cookieName,
			Value:    refreshToken,
			Path:     "/",
			Expires:  time.Now().Add(core.Config.JWTExpiration),
			Secure:   !core.Config.JWTCookieAllowHTTP,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
		})

		c.JSON(http.StatusOK, core.PublicUser{
			Name:  user.Name,
			Admin: user.Admin,
		})
	}
}

func Logout(c *gin.Context) {
	refreshToken, err := c.Cookie(cookieName)

	if err != nil || len(refreshToken) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh token not found"})
	} else if parsed, err := core.ParseAuthToken(refreshToken); err != nil || parsed == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
	} else if err := core.StoreInvalidatedToken(parsed.ID, parsed.ExpiresAt.Sub(time.Now())); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to store invalidated token"})
	} else {
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     cookieName,
			Value:    "",
			Path:     "/",
			Expires:  time.Now(),
			Secure:   !core.Config.JWTCookieAllowHTTP,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
		})

		c.Status(http.StatusOK)
	}
}

func authenticateUser(c *gin.Context) *core.User {
	refreshToken, err := c.Cookie(cookieName)

	if err != nil || len(refreshToken) == 0 {
		return nil
	} else if parsed, err := core.ParseAuthToken(refreshToken); err != nil || parsed == nil {
		return nil
	} else if user, err := core.GetUser(parsed.User); err != nil {
		return nil
	} else {
		return user
	}
}
