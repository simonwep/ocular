package commands

import (
	"errors"
	"fmt"
	"strings"

	"github.com/simonwep/genesis/core"
	"github.com/urfave/cli/v2"
)

func ListUsers(_ *cli.Context) error {
	if users, err := core.GetAllUsers(); err != nil {
		return err
	} else {

		// Print users
		for _, user := range users {
			fmt.Printf("Name: %v, Admin: %v\n", user.Name, user.Admin)
		}
	}

	return nil
}

func RemoveUser(ctx *cli.Context) error {
	return core.DeleteUser(ctx.Args().Get(0))
}

func AddUser(ctx *cli.Context) error {
	username, password := ctx.Args().Get(0), ctx.Args().Get(1)
	admin := strings.HasSuffix(username, "!")

	err := core.CreateUser(core.User{
		Name:     strings.TrimSuffix(username, "!"),
		Admin:    admin,
		Password: password,
	})

	if errors.Is(err, core.ErrUserAlreadyExists) {
		fmt.Println("User already exists")
		return nil
	}

	return err
}

func UpdateUser(ctx *cli.Context) error {
	username := ctx.Args().Get(0)
	newPassword := ctx.String("password")

	if newPassword == "" {
		fmt.Println("No password provided")
		return nil
	}

	err := core.UpdateUser(username, core.PartialUser{
		Password: &newPassword,
	})

	if errors.Is(err, core.ErrUserNotFound) {
		fmt.Println("User not found")
		return nil
	}

	return err
}
