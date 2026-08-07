package commands

import (
	"github.com/simonwep/genesis/core"
	"github.com/simonwep/genesis/routes"
	"github.com/urfave/cli/v2"
)

func Start(*cli.Context) error {
	router := routes.SetupRoutes()
	core.InitializeUsers()

	if err := router.SetTrustedProxies(nil); err != nil {
		return err
	} else if err = router.Run("0.0.0.0:" + core.Config.AppPort); err != nil {
		return err
	}

	return nil
}
