package main

import (
	"github.com/benbjohnson/hashfs"
	"github.com/go-faster/errors"
	"github.com/gorilla/mux"
	"github.com/iota-agency/iota-erp/elxolding"
	"github.com/iota-agency/iota-sdk/modules"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/dbutils"
	"github.com/iota-agency/iota-sdk/pkg/middleware"
	"github.com/iota-agency/iota-sdk/pkg/presentation/assets"
	"github.com/iota-agency/iota-sdk/pkg/presentation/controllers"
	"github.com/iota-agency/iota-sdk/pkg/registry"
	"github.com/iota-agency/iota-sdk/pkg/server"
	"github.com/iota-agency/iota-sdk/pkg/services"
	"github.com/iota-agency/iota-sdk/pkg/shared"
	"gorm.io/gorm/logger"
	"log"
)

func NewServer(conf *configuration.Configuration) (*server.HttpServer, error) {
	db, err := dbutils.ConnectDB(conf.DBOpts, logger.Error)
	if err != nil {
		return nil, err
	}
	if err := dbutils.CheckModels(db, server.RegisteredModels); err != nil {
		return nil, err
	}

	moduleRegistry := modules.Load()
	app := registry.ConstructApp(db)

	assetsFs := append([]*hashfs.FS{assets.FS}, moduleRegistry.Assets()...)
	controllerInstances := []shared.Controller{
		controllers.NewAccountController(app),
		controllers.NewEmployeeController(app),
		controllers.NewGraphQLController(app),
		controllers.NewLogoutController(app),
		controllers.NewStaticFilesController(assetsFs),
	}

	for _, module := range moduleRegistry.Modules() {
		if err := module.Register(app); err != nil {
			return nil, errors.Wrapf(err, "failed to register module %s", module.Name())
		}
	}

	for _, c := range moduleRegistry.Controllers() {
		controllerInstances = append(controllerInstances, c(app))
	}

	bundle := modules.LoadBundle(moduleRegistry)
	authService := app.Service(services.AuthService{}).(*services.AuthService)
	serverInstance := &server.HttpServer{
		Middlewares: []mux.MiddlewareFunc{
			middleware.Cors([]string{"http://localhost:3000", "ws://localhost:3000"}),
			middleware.RequestParams(middleware.DefaultParamsConstructor),
			middleware.WithLogger(log.Default()),
			middleware.LogRequests(),
			middleware.Transactions(db),
			middleware.Authorization(authService),
			middleware.WithLocalizer(bundle),
			middleware.NavItems(),
		},
		Controllers: controllerInstances,
	}
	return serverInstance, nil
}

func main() {
	modules.RegisterModule(elxolding.NewModule())
	conf := configuration.Use()
	serverInstance, err := NewServer(conf)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}
	log.Printf("starting server on %s", conf.SocketAddress)
	if err := serverInstance.Start(conf.SocketAddress); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
