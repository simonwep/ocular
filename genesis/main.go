package main

import (
	"os"

	"github.com/simonwep/genesis/commands"
	"github.com/simonwep/genesis/core"
	"github.com/urfave/cli/v2"
	"go.uber.org/zap"
)

func main() {
	app := &cli.App{
		Name:  "genesis",
		Usage: "A tiny server for all your json needs",
		Authors: []*cli.Author{
			{Name: "Simon Reinisch", Email: "contact@reinisch.io"},
		},
		Commands: []*cli.Command{
			{
				Name:   "start",
				Usage:  "Start the server",
				Action: commands.Start,
			},
			{
				Name:  "users",
				Usage: "Manage users",
				Subcommands: []*cli.Command{
					{
						Name:      "ls",
						Aliases:   []string{"list"},
						Usage:     "Lists all users",
						UsageText: "genesis user ls",
						Action:    commands.ListUsers,
					},
					{
						Name:      "rm",
						Aliases:   []string{"remove"},
						Usage:     "Removes a user",
						UsageText: "genesis user rm [username]",
						Action:    commands.RemoveUser,
					},
					{
						Name:      "add",
						Usage:     "Adds a user, add ! at the end of the username to make the user an admin",
						UsageText: "genesis user add [username] [password]",
						Action:    commands.AddUser,
					},
					{
						Name:      "update",
						Usage:     "Updates a user",
						UsageText: "genesis user update [flags] [username]",
						Flags: []cli.Flag{
							&cli.StringFlag{
								Name:  "password",
								Usage: "Sets a new password",
							},
						},
						Action: commands.UpdateUser,
					},
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		core.Logger.Fatal("failed to run command", zap.Error(err))
	}
}
