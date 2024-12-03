package main

import (
	"embed"
	"github.com/iota-agency/elxolding-erp/internal"
	"github.com/iota-agency/iota-sdk/components"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/commands"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"github.com/iota-agency/iota-sdk/pkg/utils/random"
	"gorm.io/gorm"
	"log"
	"os"
	"path/filepath"
)

type item struct {
	dest   string
	assets []*embed.FS
}

func main() {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	app := server.ConstructApp(&gorm.DB{})
	if err := modules.Load(app, internal.Modules...); err != nil {
		log.Fatalf("failed to load modules: %v", err)
	}
	collected := []item{
		{
			dest:   filepath.Join(wd, "static/assets"),
			assets: []*embed.FS{&assets.FS},
		},
		{
			dest:   filepath.Join(wd, "static/templates"),
			assets: []*embed.FS{&templates.FS},
		},
		{
			dest:   filepath.Join(wd, "static/components"),
			assets: []*embed.FS{&components.FS},
		},
		{
			dest:   filepath.Join(wd, "static", random.String(8, random.LowerCharSet), "assets"),
			assets: app.Assets(),
		},
		{
			dest:   filepath.Join(wd, "static", random.String(8, random.LowerCharSet), "templates"),
			assets: app.Templates(),
		},
	}
	for _, item := range collected {
		if err := commands.Collect(item.dest, item.assets...); err != nil {
			panic(err)
		}
	}
}
