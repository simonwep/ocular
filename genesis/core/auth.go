package core

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTClaim struct {
	User string `json:"user"`
	jwt.RegisteredClaims
}

func CreateAuthToken(user *User) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, JWTClaim{
		User: user.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(Config.JWTExpiration)),
			ID:        uuid.NewString(),
		},
	}).SignedString(Config.JWTSecret)
}

func ParseAuthToken(token string) (*JWTClaim, error) {
	var claims JWTClaim

	_, err := jwt.ParseWithClaims(token, &claims,
		func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return Config.JWTSecret, nil
		},
		jwt.WithValidMethods([]string{"HS256"}),
	)

	if len(claims.ID) != 0 {
		blacklisted, err := IsTokenBlacklisted(claims.ID)

		if blacklisted || err != nil {
			return nil, err
		}
	}

	return &claims, err
}
