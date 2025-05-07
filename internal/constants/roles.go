package constants

import (
	"time"

	"github.com/iota-uz/iota-sdk/modules/core/domain/aggregates/role"
	"github.com/iota-uz/iota-sdk/modules/core/domain/entities/permission"
	"github.com/iota-uz/iota-sdk/modules/warehouse/permissions"
)

var (
	CEO = role.New(
		"Руко́водитель",
		role.WithID(1),
		role.WithDescription("Руко́водитель"),
		role.WithPermissions([]*permission.Permission{
			permissions.PositionCreate,
			permissions.PositionRead,
			permissions.PositionUpdate,
			permissions.PositionDelete,
			permissions.ProductCreate,
			permissions.ProductRead,
			permissions.ProductUpdate,
			permissions.ProductDelete,
			permissions.OrderCreate,
			permissions.OrderRead,
			permissions.OrderUpdate,
			permissions.OrderDelete,
			permissions.UnitCreate,
			permissions.UnitRead,
			permissions.UnitUpdate,
			permissions.UnitDelete,
		}),
		role.WithCreatedAt(time.Now()),
		role.WithUpdatedAt(time.Now()),
	)

	Admin = role.New("Администратор",
		role.WithID(2),
		role.WithDescription("Администратор"),
		role.WithPermissions(append(
			[]*permission.Permission{}, // Changed from permission.Permissions
			permissions.PositionCreate,
			permissions.PositionRead,
			permissions.PositionUpdate,
			permissions.PositionDelete,
			permissions.ProductCreate,
			permissions.ProductRead,
			permissions.ProductUpdate,
			permissions.ProductDelete,
			permissions.OrderCreate,
			permissions.OrderRead,
			permissions.OrderUpdate,
			permissions.OrderDelete,
			permissions.UnitCreate,
			permissions.UnitRead,
			permissions.UnitUpdate,
			permissions.UnitDelete,
		)),
		role.WithCreatedAt(time.Now()),
		role.WithUpdatedAt(time.Now()),
	)

	Printing = role.New(
		"Полиграфия",
		role.WithID(3),
		role.WithDescription("Полиграфия"),
		role.WithPermissions(append(
			[]*permission.Permission{}, // Changed from permission.Permissions
			permissions.PositionCreate,
			permissions.PositionRead,
			permissions.PositionUpdate,
			permissions.PositionDelete,
			permissions.ProductCreate,
			permissions.ProductRead,
			permissions.ProductUpdate,
			permissions.ProductDelete,
			permissions.OrderCreate,
			permissions.OrderRead,
			permissions.OrderUpdate,
			permissions.OrderDelete,
			permissions.UnitCreate,
			permissions.UnitRead,
			permissions.UnitUpdate,
			permissions.UnitDelete,
		)),
		role.WithCreatedAt(time.Now()),
		role.WithUpdatedAt(time.Now()),
	)

	QualityAssurance = role.New("ОТК",
		role.WithID(4),
		role.WithDescription("Отдел технического контроля"),
		role.WithPermissions([]*permission.Permission{}), // Changed from permission.Permissions
		role.WithCreatedAt(time.Now()),
		role.WithUpdatedAt(time.Now()),
	)

	WarehouseEmployee = role.New("Склад",
		role.WithID(5),
		role.WithDescription("Склад"),
		role.WithPermissions([]*permission.Permission{}), // Changed from permission.Permissions
		role.WithCreatedAt(time.Now()),
		role.WithUpdatedAt(time.Now()),
	)
)

var (
	Roles = []role.Role{
		CEO,
		Admin,
		Printing,
		QualityAssurance,
		WarehouseEmployee,
	}
)
