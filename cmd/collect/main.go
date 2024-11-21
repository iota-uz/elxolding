package main

import (
	"embed"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/commands"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates"
	"os"
	"path/filepath"
)

func main() {
	registry := modules.Load()
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	if err := commands.Collect([]*embed.FS{&assets.FS}, filepath.Join(wd, "static")); err != nil {
		panic(err)
	}
	if err := commands.Collect([]*embed.FS{&templates.FS}, filepath.Join(wd, "static")); err != nil {
		panic(err)
	}
	for _, mod := range registry.Modules() {
		assetsFs := mod.Assets()
		if assetsFs != nil {
			if err := commands.Collect([]*embed.FS{assetsFs}, filepath.Join(wd, "static", mod.Name())); err != nil {
				panic(err)
			}
		}

		templatesFs := mod.Templates()
		if templatesFs != nil {
			if err := commands.Collect([]*embed.FS{templatesFs}, filepath.Join(wd, "static", mod.Name())); err != nil {
				panic(err)
			}
		}
	}
}
