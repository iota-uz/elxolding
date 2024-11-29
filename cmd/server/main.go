package main

import (
	"github.com/benbjohnson/hashfs"
	"github.com/iota-agency/iota-erp/elxolding"
	internalassets "github.com/iota-agency/iota-erp/internal/assets"
	"github.com/iota-agency/iota-erp/internal/templates/layouts"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/application/dbutils"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/constants"
	"github.com/iota-agency/iota-sdk/pkg/middleware"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/controllers"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"github.com/iota-agency/iota-sdk/pkg/services"
	"github.com/iota-agency/iota-sdk/pkg/types"
	_ "github.com/lib/pq"
	"gorm.io/gorm/logger"
	"log"
)

func head() types.HeadComponent {
	return layouts.Head
}

func ElxoldingServer(options *server.DefaultOptions) (*server.HttpServer, error) {
	db := options.Db
	app := options.Application

	if err := dbutils.CheckModels(db, server.RegisteredModels); err != nil {
		return nil, err
	}
	authService := app.Service(services.AuthService{}).(*services.AuthService)
	bundle, err := app.Bundle()
	if err != nil {
		return nil, err
	}
	app.RegisterMiddleware(
		middleware.Provide(constants.HeadKey, head()),
		middleware.Provide(constants.LogoKey, layouts.Logo()),
		middleware.Cors([]string{"http://localhost:3000", "ws://localhost:3000"}),
		middleware.RequestParams(middleware.DefaultParamsConstructor),
		middleware.WithLogger(log.Default()),
		middleware.LogRequests(),
		middleware.Transactions(db),
		middleware.Authorization(authService),
		middleware.WithLocalizer(bundle),
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
	db, err := dbutils.ConnectDB(conf.DBOpts, logger.Error)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	loadedModules := modules.Load(elxolding.NewModule())
	app := server.ConstructApp(db)
	assetsFs := append([]*hashfs.FS{internalassets.HashFS, assets.HashFS}, app.HashFsAssets()...)
	for _, module := range loadedModules {
		if err := module.Register(app); err != nil {
			log.Fatalf("failed to register \"%s\" module: %v", module.Name(), err)
		} else {
			log.Printf("\"%s\" module registered", module.Name())
		}
	}
	app.RegisterControllers(
		controllers.NewGraphQLController(app),
		controllers.NewLogoutController(app),
		controllers.NewStaticFilesController(assetsFs),
		controllers.NewUploadController(app),
	)
	options := &server.DefaultOptions{
		Configuration: conf,
		Db:            db,
		Application:   app,
		LoadedModules: loadedModules,
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
