package seed

import (
	"context"
	"fmt"
	"github.com/iota-uz/iota-sdk/modules/warehouse/domain/aggregates/product"
	"github.com/iota-uz/iota-sdk/modules/warehouse/infrastructure/persistence"
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
		// Create product using constructor pattern instead of direct struct initialization
		prod := product.New(
			positions[i%len(positions)].ID,
			fmt.Sprintf("EPS:%d", i),
			product.InStock,
			product.WithID(uint(i)),
			product.WithCreatedAt(time.Now()),
			product.WithUpdatedAt(time.Now()),
		)
		
		if err := productRepository.CreateOrUpdate(ctx, prod); err != nil {
			return err
		}
	}
	tx, err := composables.UseTx(ctx)
	if err != nil {
		return err
	}
	_, err = tx.Exec(context.Background(), "SELECT setval('public.warehouse_products_id_seq', (SELECT MAX(id) FROM warehouse_products));")
	return err
}
