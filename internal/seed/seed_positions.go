package seed

import (
	"context"
	"fmt"
	"github.com/iota-uz/iota-sdk/modules/warehouse/domain/aggregates/position"
	"github.com/iota-uz/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/composables"
	"time"
)

func CreatePositions(ctx context.Context, app application.Application) error {
	unitRepository := persistence.NewUnitRepository()
	positionRepository := persistence.NewPositionRepository()

	units, err := unitRepository.GetAll(ctx)
	if err != nil {
		return err
	}

	for i := 1; i <= 1_000; i++ {
		if err := positionRepository.CreateOrUpdate(ctx, &position.Position{
			ID:        uint(i),
			Title:     fmt.Sprintf("Position %d", i),
			Barcode:   fmt.Sprintf("%d", i),
			UnitID:    units[i%len(units)].ID,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}); err != nil {
			return err
		}
	}
	tx, ok := composables.UseTx(ctx)
	if !ok {
		return composables.ErrNoTx
	}
	return tx.Exec("SELECT setval('public.warehouse_positions_id_seq', (SELECT MAX(id) FROM warehouse_positions));").Error
}
