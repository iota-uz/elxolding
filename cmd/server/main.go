package main

import (
	"context"
	"log"
	"os"
	"runtime/debug"
	"time"

	"github.com/iota-uz/elxolding-erp/internal"
	"github.com/iota-uz/elxolding-erp/internal/assets"
	"github.com/iota-uz/elxolding-erp/internal/templates/layouts"
	"github.com/iota-uz/iota-sdk/modules"
	"github.com/iota-uz/iota-sdk/modules/core"
	"github.com/iota-uz/iota-sdk/modules/core/presentation/controllers"
	"github.com/iota-uz/iota-sdk/modules/warehouse"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/configuration"
	"github.com/iota-uz/iota-sdk/pkg/constants"
	"github.com/iota-uz/iota-sdk/pkg/eventbus"
	"github.com/iota-uz/iota-sdk/pkg/logging"
	"github.com/iota-uz/iota-sdk/pkg/middleware"
	"github.com/iota-uz/iota-sdk/pkg/server"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

type DefaultOptions struct {
	Pool          *pgxpool.Pool
	Logger        *logrus.Logger
	Configuration *configuration.Configuration
	Application   application.Application
}

func ElxoldingServer(options *DefaultOptions) (*server.HTTPServer, error) {
	app := options.Application

	// Core middleware stack with tracing capabilities
	app.RegisterMiddleware(
		middleware.WithLogger(options.Logger),
		middleware.Provide(constants.AppKey, app),
		middleware.Provide(constants.HeadKey, layouts.Head()),
		middleware.Provide(constants.LogoKey, layouts.Logo()),
		middleware.Provide(constants.PoolKey, options.Pool),
		middleware.Cors("http://localhost:3000", "ws://localhost:3000"),
		middleware.RequestParams(),
	)

	serverInstance := server.NewHTTPServer(
		app,
		controllers.NotFound(options.Application),
		controllers.MethodNotAllowed(),
	)
	return serverInstance, nil
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			configuration.Use().Unload()
			log.Println(r)
			debug.PrintStack()
			os.Exit(1)
		}
	}()

	conf := configuration.Use()
	logger := conf.Logger()

	// Set up OpenTelemetry if enabled
	var tracingCleanup func()
	if conf.OpenTelemetry.Enabled {
		tracingCleanup = logging.SetupTracing(
			context.Background(),
			conf.OpenTelemetry.ServiceName,
			conf.OpenTelemetry.TempoURL,
		)
		defer tracingCleanup()
		logger.Info("OpenTelemetry tracing enabled, exporting to Tempo at " + conf.OpenTelemetry.TempoURL)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	pool, err := pgxpool.New(ctx, conf.Database.Opts)
	if err != nil {
		panic(err)
	}
	app := application.New(pool, eventbus.NewEventPublisher(logger))
	if err := modules.Load(app, modules.BuiltInModules...); err != nil {
		log.Fatalf("failed to load modules: %v", err)
	}
	app.RegisterNavItems(modules.NavLinks...)
	app.RegisterHashFsAssets(assets.HashFS)
	app.RegisterControllers(
		controllers.NewStaticFilesController(app.HashFsAssets()),
		controllers.NewGraphQLController(app),
	)
	app.RegisterNavItems(core.DashboardLink)
	app.RegisterNavItems(internal.NavItems...)
	app.RegisterNavItems(warehouse.NavItems...)

	app.RegisterHashFsAssets(assets.HashFS)
	app.RegisterControllers(
		controllers.NewStaticFilesController(app.HashFsAssets()),
		controllers.NewGraphQLController(app),
	)

	options := &DefaultOptions{
		Logger:        logger,
		Configuration: conf,
		Pool:          pool,
		Application:   app,
	}
	serverInstance, err := ElxoldingServer(options)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}
	log.Printf("Listening on: %s\n", conf.Address())
	if err := serverInstance.Start(conf.SocketAddress); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
