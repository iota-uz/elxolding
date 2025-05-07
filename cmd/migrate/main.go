package main

import (
	"github.com/iota-uz/elxolding-erp/internal"
	"github.com/iota-uz/iota-sdk/pkg/commands"
)

func main() {
	err := commands.Migrate(internal.Modules...)
	if err != nil {
		panic(err)
	}
}
