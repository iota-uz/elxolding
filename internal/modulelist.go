package internal

import (
	"github.com/iota-uz/iota-sdk/modules/core"
	"github.com/iota-uz/iota-sdk/modules/warehouse"
	"github.com/iota-uz/iota-sdk/pkg/application"
)

var Modules = []application.Module{
	core.NewModule(),
	NewModule(),
	warehouse.NewModule(),
}
