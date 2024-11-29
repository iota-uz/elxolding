package main

import (
	"context"
	"github.com/iota-agency/iota-erp/internal"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/composables"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/event"
	"github.com/iota-agency/iota-sdk/pkg/shared"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	conf := configuration.Use()
	db, err := gorm.Open(postgres.Open(conf.DBOpts), &gorm.Config{}) //nolint:exhaustruct
	if err != nil {
		panic(err)
	}

	var seedFuncs []shared.SeedFunc
	registry := modules.Load()
	// TODO: proper solution
	registry.RegisterModules(internal.NewModule())
	for _, module := range registry.Modules() {
		seedFuncs = append(seedFuncs, module.Seed)
	}

	app := application.New(db, event.NewEventPublisher())
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
