package internal

import (
	"github.com/iota-agency/iota-sdk/pkg/presentation/templates/icons"
	"github.com/iota-agency/iota-sdk/pkg/types"
)

var (
	UsersItem = types.NavigationItem{
		Name:     "NavigationLinks.Users",
		Children: nil,
		Icon:     icons.Users(icons.Props{Size: "20"}),
		Href:     "/users",
	}
	NavItems = []types.NavigationItem{UsersItem}
)
