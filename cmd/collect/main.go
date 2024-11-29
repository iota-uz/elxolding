package main

import (
	"embed"
	"github.com/iota-agency/iota-erp/elxolding"
	"github.com/iota-agency/iota-sdk/components"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/application/dbutils"
	"github.com/iota-agency/iota-sdk/pkg/commands"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"github.com/iota-agency/iota-sdk/pkg/utils/random"
	"gorm.io/gorm/logger"
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

	conf := configuration.Use()
	db, err := dbutils.ConnectDB(conf.DBOpts, logger.Error)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	loadedModules := modules.Load(elxolding.NewModule())
	app := server.ConstructApp(db)
	for _, module := range loadedModules {
		if err := module.Register(app); err != nil {
			log.Fatalf("failed to register \"%s\" module: %v", module.Name(), err)
		} else {
			log.Printf("\"%s\" module registered", module.Name())
		}
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
