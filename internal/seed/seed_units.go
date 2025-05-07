package seed

import (
	"context"
	"github.com/iota-uz/iota-sdk/modules/warehouse/domain/entities/unit"
	"github.com/iota-uz/iota-sdk/modules/warehouse/infrastructure/persistence"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/composables"
)

func CreateUnits(ctx context.Context, app application.Application) error {
	unitRepository := persistence.NewUnitRepository()

	units := []unit.Unit{
		{
			ID:         1,
			Title:      "Сантиметр",
			ShortTitle: "cm",
		},
		{
			ID:         2,
			Title:      "Метр",
			ShortTitle: "m",
		},
		{
			ID:         3,
			Title:      "Килограмм",
			ShortTitle: "kg",
		},
		{
			ID:         4,
			Title:      "Грамм",
			ShortTitle: "g",
		},
		{
			ID:         5,
			Title:      "Литр",
			ShortTitle: "l",
		},
	}

	for _, u := range units {
		if err := unitRepository.CreateOrUpdate(ctx, &u); err != nil {
			return err
		}
	}

	tx, err := composables.UseTx(ctx)
	if err != nil {
		return err
	}
	_, err = tx.Exec(context.Background(), "SELECT setval('public.warehouse_units_id_seq', (SELECT MAX(id) FROM warehouse_units));")
	return err
}
