package internal

import (
	"context"
	"github.com/iota-agency/elxolding-erp/internal/controllers"
	"github.com/iota-agency/elxolding-erp/internal/seed"
	"github.com/iota-agency/elxolding-erp/internal/services"
	"github.com/iota-agency/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates/icons"
	"github.com/iota-agency/iota-sdk/pkg/types"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

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
	app.RegisterService(dashboardService)
	app.RegisterControllers(
		controllers.NewDashboardController(app),
		controllers.NewAccountController(app),
		controllers.NewLoginController(app),
		controllers.NewUsersController(app),
	)
	app.RegisterLocaleFiles(&localeFiles)
	app.RegisterModule(m)
	return nil
}

func (m *Module) Seed(ctx context.Context, app application.Application) error {
	seedFuncs := []application.SeedFunc{
		seed.SeedUser,
		seed.SeedPositions,
		seed.SeedProducts,
	}
	for _, seedFunc := range seedFuncs {
		if err := seedFunc(ctx, app); err != nil {
			return err
		}
	}
	return nil
}

func (m *Module) Name() string {
	return "elxolding"
}

func (m *Module) NavigationItems(localizer *i18n.Localizer) []types.NavigationItem {
	return []types.NavigationItem{
		{
			Name:     localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "NavigationLinks.Dashboard"}),
			Children: nil,
			Icon:     icons.CirclesThreePlus(icons.Props{Size: "20"}),
			Href:     "/",
		},
		{
			Name:     localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "NavigationLinks.Users"}),
			Children: nil,
			Icon:     icons.Users(icons.Props{Size: "20"}),
			Href:     "/users",
		},
	}
}
