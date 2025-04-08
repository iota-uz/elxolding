package internal

import (
	icons "github.com/iota-uz/icons/phosphor"
	"github.com/iota-uz/iota-sdk/pkg/types"
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
