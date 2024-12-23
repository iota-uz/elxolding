package main

import (
	"github.com/iota-agency/elxolding-erp/internal"
	"github.com/iota-agency/elxolding-erp/internal/assets"
	"github.com/iota-agency/elxolding-erp/internal/templates/layouts"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/modules/core"
	"github.com/iota-agency/iota-sdk/modules/core/presentation/controllers"
	"github.com/iota-agency/iota-sdk/modules/warehouse"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/application/dbutils"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/constants"
	"github.com/iota-agency/iota-sdk/pkg/event"
	"github.com/iota-agency/iota-sdk/pkg/logging"
	"github.com/iota-agency/iota-sdk/pkg/middleware"
	"github.com/iota-agency/iota-sdk/pkg/server"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
	"log"
)

type DefaultOptions struct {
	DB            *gorm.DB
	Logger        *logrus.Logger
	Configuration *configuration.Configuration
	Application   application.Application
}

func ElxoldingServer(options *DefaultOptions) (*server.HttpServer, error) {
	app := options.Application

	app.RegisterMiddleware(
		middleware.WithLogger(options.Logger),
		middleware.Provide(constants.AppKey, app),
		middleware.Provide(constants.HeadKey, layouts.Head()),
		middleware.Provide(constants.LogoKey, layouts.Logo()),
		middleware.Provide(constants.DBKey, options.DB),
		middleware.Provide(constants.TxKey, options.DB),
		middleware.Cors("http://localhost:3000", "ws://localhost:3000"),
		middleware.RequestParams(),
		middleware.LogRequests(),
	)
	serverInstance := server.NewHttpServer(
		app.Controllers(), app.Middleware(),
		controllers.NotFound(options.Application), controllers.MethodNotAllowed(),
	)
	return serverInstance, nil
}

func main() {
	conf := configuration.Use()
	logFile, logger, err := logging.FileLogger(conf.LogrusLogLevel())
	if err != nil {
		log.Fatalf("failed to create logger: %v", err)
	}
	defer logFile.Close()

	db, err := dbutils.ConnectDB(
		conf.DBOpts,
		gormlogger.New(
			logger,
			gormlogger.Config{
				SlowThreshold:             0,
				LogLevel:                  conf.GormLogLevel(),
				IgnoreRecordNotFoundError: false,
				Colorful:                  true,
				ParameterizedQueries:      true,
			},
		),
	)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	app := application.New(db, event.NewEventPublisher())
	if err := modules.Load(app, internal.Modules...); err != nil {
		log.Fatalf("failed to load modules: %v", err)
	}
	app.RegisterNavItems(core.NavItems...)
	app.RegisterNavItems(internal.NavItems...)
	app.RegisterNavItems(warehouse.NavItems...)

	app.RegisterHashFsAssets(assets.HashFS)
	app.RegisterControllers(
		controllers.NewStaticFilesController(app.HashFsAssets()),
	)

	options := &DefaultOptions{
		Logger:        logger,
		Configuration: conf,
		DB:            db,
		Application:   app,
	}
	serverInstance, err := ElxoldingServer(options)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}
	if err := serverInstance.Start(conf.SocketAddress); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
