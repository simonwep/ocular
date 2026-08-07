package core

import (
	"log"
	"os"
	"path"
	"runtime"
	"testing"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

var Logger = func() *zap.Logger {
	_, filename, _, _ := runtime.Caller(0)
	var root = path.Join(path.Dir(filename), "..")

	envFile := path.Join(root, ".env")
	if testing.Testing() {
		envFile = path.Join(root, ".env.test")
	}

	envSkipped := godotenv.Load(envFile)

	var cfg zap.Config
	if os.Getenv("GENESIS_LOG_MODE") == "production" {
		cfg = zap.NewProductionConfig()
	} else {
		cfg = zap.NewDevelopmentConfig()
	}

	logger, err := cfg.Build(zap.AddCallerSkip(1))
	if err != nil {
		log.Fatal(err)
	}

	if envSkipped != nil {
		logger.Debug(".env file skipped")
	}

	return logger
}()
