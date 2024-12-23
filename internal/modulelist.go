package internal

import (
	"github.com/iota-agency/iota-sdk/modules/core"
	"github.com/iota-agency/iota-sdk/modules/warehouse"
	"github.com/iota-agency/iota-sdk/pkg/application"
)

var Modules = []application.Module{
	core.NewModule(),
	NewModule(),
	warehouse.NewModule(),
}
