package seed

import (
	"context"
	"fmt"
	"github.com/iota-agency/iota-sdk/modules/warehouse/domain/aggregates/position"
	"github.com/iota-agency/iota-sdk/modules/warehouse/domain/entities/unit"
	"github.com/iota-agency/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-agency/iota-sdk/pkg/application"
	"time"
)

func SeedPositions(ctx context.Context, app application.Application) error {
	unitRepository := persistence.NewUnitRepository()
	positionRepository := persistence.NewPositionRepository()

	if err := unitRepository.CreateOrUpdate(ctx, &unit.Unit{
		ID:         1,
		Title:      "Centimeter",
		ShortTitle: "cm",
	}); err != nil {
		return err
	}

	for i := 1; i <= 20_000; i++ {
		if err := positionRepository.CreateOrUpdate(ctx, &position.Position{
			ID:        uint(i),
			Title:     fmt.Sprintf("Position %d", i),
			Barcode:   fmt.Sprintf("%d", i),
			UnitID:    1,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}); err != nil {
			return err
		}
	}
	return nil
}
