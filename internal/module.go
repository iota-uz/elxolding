package internal

import (
	"github.com/iota-uz/elxolding-erp/internal/controllers"
	"github.com/iota-uz/elxolding-erp/internal/interfaces/graph"
	"github.com/iota-uz/elxolding-erp/internal/services"
	"github.com/iota-uz/iota-sdk/modules/warehouse/infrastructure/persistence"
	"github.com/iota-uz/iota-sdk/pkg/application"
)

//go:generate go run github.com/99designs/gqlgen generate

func NewModule() application.Module {
	return &Module{}
}

type Module struct {
}

func (m *Module) Register(app application.Application) error {
	positionRepo := persistence.NewPositionRepository()
	productRepo := persistence.NewProductRepository()
	dashboardService := services.NewDashboardService(
		positionRepo,
		productRepo,
		persistence.NewOrderRepository(productRepo),
	)
	app.RegisterServices(dashboardService)
	app.RegisterControllers(
		controllers.NewDashboardController(app),
		controllers.NewLoginController(app),
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
