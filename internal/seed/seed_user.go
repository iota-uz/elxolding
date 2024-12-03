package seed

import (
	"context"
	"github.com/iota-agency/elxolding-erp/internal/constants"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/domain/aggregates/role"
	"github.com/iota-agency/iota-sdk/pkg/domain/aggregates/user"
	"github.com/iota-agency/iota-sdk/pkg/domain/entities/tab"
	"github.com/iota-agency/iota-sdk/pkg/infrastructure/persistence"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

func SeedUser(ctx context.Context, app application.Application) error {
	userRepository := persistence.NewUserRepository()
	roleRepository := persistence.NewRoleRepository()
	tabsRepository := persistence.NewTabRepository()

	for _, r := range constants.Roles {
		if err := roleRepository.CreateOrUpdate(ctx, &r); err != nil {
			return err
		}
	}
	usr := &user.User{
		//nolint:exhaustruct
		ID:         1,
		FirstName:  "Admin",
		LastName:   "User",
		Email:      "test@gmail.com",
		UILanguage: user.UILanguageRU,
		Roles: []*role.Role{
			&constants.CEO,
		},
	}
	if err := usr.SetPassword("TestPass123!"); err != nil {
		return err
	}
	if err := userRepository.CreateOrUpdate(ctx, usr); err != nil {
		return err
	}

	bundle, err := app.Bundle()
	if err != nil {
		return err
	}
	localizer := i18n.NewLocalizer(bundle, "ru")
	for i, navItem := range app.NavigationItems(localizer) {
		if err := tabsRepository.CreateOrUpdate(ctx, &tab.Tab{
			ID:       uint(i),
			Href:     navItem.Href,
			UserID:   usr.ID,
			Position: uint(i),
		}); err != nil {
			return err
		}
	}
	return nil
}
