package seed

import (
	"context"
	"fmt"
	"github.com/iota-uz/iota-sdk/modules/warehouse/domain/aggregates/product"
	"github.com/iota-uz/iota-sdk/modules/warehouse/persistence"
	"github.com/iota-uz/iota-sdk/pkg/application"
	"github.com/iota-uz/iota-sdk/pkg/composables"
	"time"
)

func CreateProducts(ctx context.Context, app application.Application) error {
	positionRepository := persistence.NewPositionRepository()
	productRepository := persistence.NewProductRepository()

	positions, err := positionRepository.GetAll(ctx)
	if err != nil {
		return err
	}

	for i := 1; i <= 20000; i++ {
		if err := productRepository.CreateOrUpdate(ctx, &product.Product{
			ID:         uint(i),
			PositionID: positions[i%len(positions)].ID,
			Rfid:       fmt.Sprintf("EPS:%d", i),
			Status:     product.InStock,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}); err != nil {
			return err
		}
	}
	tx, ok := composables.UseTx(ctx)
	if !ok {
		return composables.ErrNoTx
	}
	return tx.Exec("SELECT setval('public.warehouse_products_id_seq', (SELECT MAX(id) FROM warehouse_products));").Error
}
