package internal

import (
	"slices"

	"github.com/iota-uz/iota-sdk/modules/core"
	"github.com/iota-uz/iota-sdk/modules/warehouse"
	"github.com/iota-uz/iota-sdk/pkg/types"
)

var (
	NavItems = slices.Concat(
		[]types.NavigationItem{
			core.DashboardLink,
			core.UsersLink,
			core.GroupsLink,
			core.RolesLink,
		},
		warehouse.Item.Children,
	)
)
