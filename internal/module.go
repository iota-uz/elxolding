package internal

import (
	"github.com/iota-agency/elxolding-erp/internal/controllers"
	"github.com/iota-agency/elxolding-erp/internal/interfaces/graph"
	"github.com/iota-agency/elxolding-erp/internal/seed"
	"github.com/iota-agency/elxolding-erp/internal/services"
	"github.com/iota-agency/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-agency/iota-sdk/pkg/application"
)

//go:generate go run github.com/99designs/gqlgen generate

func NewModule() application.Module {
	return &Module{}
}

type Module struct {
}

func (m *Module) Register(app application.Application) error {
	dashboardService := services.NewDashboardService(
		persistence.NewPositionRepository(),
		persistence.NewProductRepository(),
		persistence.NewOrderRepository(),
	)
	app.RegisterServices(dashboardService)
	app.RegisterControllers(
		controllers.NewDashboardController(app),
		controllers.NewAccountController(app),
		controllers.NewLoginController(app),
		controllers.NewUsersController(app),
	)
	app.RegisterSeedFuncs(
		seed.CreateUnits,
		seed.CreateUser,
		seed.CreatePositions,
		seed.CreateProducts,
	)
	app.RegisterLocaleFiles(&localeFiles)
	app.RegisterGraphSchema(application.GraphSchema{
		Value: graph.NewExecutableSchema(graph.Config{
			Resolvers: graph.NewResolver(app),
		}),
		BasePath: "/elxolding",
	})
	return nil
}

func (m *Module) Name() string {
	return "elxolding"
}
