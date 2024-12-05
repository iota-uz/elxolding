package seed

import (
	"context"
	"github.com/iota-agency/elxolding-erp/internal/constants"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/composables"
	"github.com/iota-agency/iota-sdk/pkg/domain/aggregates/role"
	"github.com/iota-agency/iota-sdk/pkg/domain/aggregates/user"
	"github.com/iota-agency/iota-sdk/pkg/domain/entities/tab"
	"github.com/iota-agency/iota-sdk/pkg/infrastructure/persistence"
	"github.com/iota-agency/iota-sdk/pkg/types"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

func navItems2Tabs(navItems []types.NavigationItem) []*tab.Tab {
	tabs := make([]*tab.Tab, len(navItems))
	for i, navItem := range navItems {
		tabs[i] = &tab.Tab{
			Href: navItem.Href,
		}
		tabs = append(tabs, navItems2Tabs(navItem.Children)...)
	}
	return tabs
}

func CreateUser(ctx context.Context, app application.Application) error {
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
	tabs := navItems2Tabs(app.NavigationItems(localizer))
	for i, t := range tabs {
		t.ID = uint(i + 1)
		t.UserID = usr.ID
		t.Position = uint(i + 1)
		if err := tabsRepository.CreateOrUpdate(ctx, t); err != nil {
			return err
		}
	}
	tx, ok := composables.UseTx(ctx)
	if !ok {
		return composables.ErrNoTx
	}
	db, err := tx.DB()
	if err != nil {
		return err
	}
	_, err = db.Exec("SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM users));")
	if err != nil {
		return err
	}
	_, err = db.Exec("SELECT setval('public.roles_id_seq', (SELECT MAX(id) FROM roles));")
	if err != nil {
		return err
	}
	_, err = db.Exec("SELECT setval('public.tabs_id_seq', (SELECT MAX(id) FROM tabs));")
	if err != nil {
		return err
	}
	return nil
}
