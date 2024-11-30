package main

import (
	"context"
	"github.com/iota-agency/iota-erp/internal"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/composables"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	conf := configuration.Use()
	db, err := gorm.Open(postgres.Open(conf.DBOpts), &gorm.Config{}) //nolint:exhaustruct
	if err != nil {
		panic(err)
	}

	var seedFuncs []application.SeedFunc

	loadedModules := modules.Load(internal.NewModule())
	app := server.ConstructApp(db)
	for _, module := range loadedModules {
		if err := module.Register(app); err != nil {
			panic(err)
		}
		seedFuncs = append(seedFuncs, module.Seed)
	}
	if err := db.Transaction(func(tx *gorm.DB) error {
		ctx := composables.WithTx(context.Background(), tx)
		for _, seedFunc := range seedFuncs {
			if err := seedFunc(ctx, app); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		panic(err)
	}
}
