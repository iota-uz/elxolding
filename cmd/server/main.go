package main

import (
	"github.com/benbjohnson/hashfs"
	"github.com/iota-agency/elxolding-erp/internal"
	internalassets "github.com/iota-agency/elxolding-erp/internal/assets"
	"github.com/iota-agency/elxolding-erp/internal/templates/layouts"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/application/dbutils"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/constants"
	"github.com/iota-agency/iota-sdk/pkg/logging"
	"github.com/iota-agency/iota-sdk/pkg/middleware"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/controllers"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"github.com/iota-agency/iota-sdk/pkg/services"
	"github.com/iota-agency/iota-sdk/pkg/types"
	_ "github.com/lib/pq"
	gormlogger "gorm.io/gorm/logger"
	"log"
)

func head() types.HeadComponent {
	return layouts.Head
}

func ElxoldingServer(options *server.DefaultOptions) (*server.HttpServer, error) {
	db := options.Db
	app := options.Application

	authService := app.Service(services.AuthService{}).(*services.AuthService)
	tabService := app.Service(services.TabService{}).(*services.TabService)
	bundle, err := app.Bundle()
	if err != nil {
		return nil, err
	}
	app.RegisterMiddleware(
		middleware.Provide(constants.HeadKey, head()),
		middleware.Provide(constants.LogoKey, layouts.Logo()),
		middleware.Cors([]string{"http://localhost:3000", "ws://localhost:3000"}),
		middleware.RequestParams(middleware.DefaultParamsConstructor),
		middleware.WithLogger(options.Logger),
		middleware.LogRequests(),
		middleware.Transactions(db),
		middleware.Authorization(authService),
		middleware.WithLocalizer(bundle),
		middleware.Tabs(tabService),
		middleware.NavItems(app),
	)
	serverInstance := &server.HttpServer{
		Middlewares: app.Middleware(),
		Controllers: app.Controllers(),
	}
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

	app := server.ConstructApp(db)
	if err := modules.Load(app, internal.Modules...); err != nil {
		panic(err)
	}
	assetsFs := append([]*hashfs.FS{internalassets.HashFS, assets.HashFS}, app.HashFsAssets()...)
	app.RegisterControllers(
		controllers.NewStaticFilesController(assetsFs),
	)
	options := &server.DefaultOptions{
		Configuration: conf,
		Db:            db,
		Application:   app,
		Logger:        logger,
	}
	serverInstance, err := ElxoldingServer(options)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}
	log.Printf("starting server on %s", conf.SocketAddress)
	if err := serverInstance.Start(conf.SocketAddress); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
