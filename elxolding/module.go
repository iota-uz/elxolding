package elxolding

import (
	"context"
	"embed"
	"github.com/iota-agency/iota-erp/internal/assets"
	"github.com/iota-agency/iota-erp/internal/controllers"
	"github.com/iota-agency/iota-erp/internal/seed"
	"github.com/iota-agency/iota-erp/internal/services"
	"github.com/iota-agency/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates/icons"
	"github.com/iota-agency/iota-sdk/pkg/types"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

//go:embed locales/*.json
var localeFiles embed.FS

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
	)
	app.RegisterLocaleFiles(&localeFiles)
	return nil
}

func (m *Module) MigrationDirs() *embed.FS {
	return nil
}

func (m *Module) Assets() *embed.FS {
	return &assets.FS
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
			Name:     localizer.MustLocalize(&i18n.LocalizeConfig{MessageID: "NavigationLinks.Users"}),
			Children: nil,
			Icon:     icons.Users(icons.Props{Size: "20"}),
			Href:     "/users",
		},
	}
}
