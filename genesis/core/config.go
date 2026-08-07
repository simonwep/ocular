package core

import (
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"go.uber.org/zap"
)

type AppConfig struct {
	DbPath             string
	BaseUrl            string
	JWTSecret          []byte
	JWTExpiration      time.Duration
	JWTCookieAllowHTTP bool
	AppBuildVersion    string
	AppBuildDate       string
	AppBuildCommit     string
	AppGinMode         string
	AppPort            string
	AppUsersToCreate   []User
	AppUserPattern     *regexp.Regexp
	AppKeyPattern      *regexp.Regexp
	AppDataMaxSize     int64
	AppKeysPerUser     int64
	LoginMaxAttempts   int64
	LoginLockDurations []time.Duration
}

var Config = func() AppConfig {
	config := AppConfig{
		DbPath:             resolvePath(env("GENESIS_DB_PATH")),
		BaseUrl:            env("GENESIS_BASE_URL"),
		JWTSecret:          []byte(env("GENESIS_JWT_SECRET")),
		JWTExpiration:      time.Duration(parseInt(env("GENESIS_JWT_TOKEN_EXPIRATION"))) * time.Minute,
		JWTCookieAllowHTTP: env("GENESIS_JWT_COOKIE_ALLOW_HTTP") == "true",
		AppGinMode:         env("GENESIS_GIN_MODE"),
		AppPort:            env("GENESIS_PORT"),
		AppUsersToCreate:   parseInitialUserList(env("GENESIS_CREATE_USERS")),
		AppUserPattern:     regexp.MustCompile(env("GENESIS_USERNAME_PATTERN")),
		AppKeyPattern:      regexp.MustCompile(env("GENESIS_KEY_PATTERN")),
		AppDataMaxSize:     parseInt(env("GENESIS_DATA_MAX_SIZE")) * 1000,
		AppKeysPerUser:     parseInt(env("GENESIS_KEYS_PER_USER")),
		LoginMaxAttempts:   parseInt(env("GENESIS_LOGIN_MAX_ATTEMPTS")),
		LoginLockDurations: parseDurations(env("GENESIS_LOGIN_LOCKOUT_DURATIONS")),
	}

	if len(config.JWTSecret) == 0 {
		Logger.Error("GENESIS_JWT_SECRET must be set")
	}

	return config
}()

func parseInitialUserList(raw string) []User {
	list := make([]User, 0)

	if len(raw) == 0 {
		return list
	}

	for _, item := range strings.Split(raw, ",") {
		user := strings.Split(item, ":")

		if len(user) != 2 {
			Logger.Warn("invalid pattern for allowed users", zap.String("user", item))
		} else {
			list = append(list, User{
				Name:     strings.TrimSuffix(user[0], "!"),
				Admin:    strings.HasSuffix(user[0], "!"),
				Password: user[1],
			})
		}
	}

	return list
}

func parseInt(str string) int64 {
	raw := strings.ReplaceAll(str, "_", "")
	if value, err := strconv.ParseInt(raw, 10, 64); err != nil {
		panic(err)
	} else {
		return value
	}
}

func parseDurations(raw string) []time.Duration {
	list := make([]time.Duration, 0)

	if len(strings.TrimSpace(raw)) == 0 {
		return list
	}

	for _, item := range strings.Split(raw, ",") {
		trimmed := strings.TrimSpace(item)

		if len(trimmed) == 0 {
			continue
		}

		d, err := time.ParseDuration(trimmed)
		if err != nil {
			Logger.Warn("invalid duration entry in GENESIS_LOGIN_LOCKOUT_DURATIONS", zap.String("value", trimmed), zap.Error(err))
			continue
		}

		list = append(list, d)
	}

	return list
}

func env(key string) string {
	if v := os.Getenv(key + "_FILE"); v != "" {
		data, err := os.ReadFile(v)

		if err != nil {
			Logger.Warn("failed to read env file", zap.String("key", key), zap.String("path", v), zap.Error(err))
			return ""
		}

		return strings.TrimSpace(string(data))
	}

	return os.Getenv(key)
}

func resolvePath(path string) string {
	return filepath.Join(currentDir(), path)
}

func currentDir() string {
	workdir, _ := os.Getwd()
	return workdir
}
