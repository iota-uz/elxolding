package seed

import (
	"context"
	"github.com/iota-agency/iota-sdk/modules/warehouse/domain/entities/unit"
	"github.com/iota-agency/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"github.com/iota-agency/iota-sdk/pkg/composables"
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

	tx, ok := composables.UseTx(ctx)
	if !ok {
		return composables.ErrNoTx
	}
	db, err := tx.DB()
	if err != nil {
		return err
	}
	_, err = db.Exec("SELECT setval('public.warehouse_units_id_seq', (SELECT MAX(id) FROM warehouse_units));")
	if err != nil {
		return err
	}
	return nil
}
