# Variables
TAILWIND_INPUT := internal/assets/css/main.css
TAILWIND_OUTPUT := internal/assets/css/main.min.css

# Install dependencies
deps:
	go get -u ./...

# Seed database
seed:
	go run cmd/seed/main.go

# Run tests
test:
	go test -v ./... -coverprofile=./coverage/coverage.out

# Run tests with file watching
test-watch:
	gow test -v ./...

# Run tests inside docker
test-docker:
	docker compose -f docker-compose.testing.yml up --build erp_local

coverage-score:
	go tool cover -func ./coverage/coverage.out | grep "total:" | awk '{print ((int($$3) > 80) != 1) }'

report:
	go tool cover -html=coverage.out -o ./coverage/cover.html

# Run PostgreSQL
localdb:
	docker compose -f docker-compose.dev.yml up

# Apply database migrations (up)
migrate-up:
	go run cmd/migrate/main.go up

# Downgrade database migrations (down)
migrate-down:
	go run cmd/migrate/main.go down

# Compile TailwindCSS (with watch)
css-watch:
	tailwindcss -c tailwind.config.js -i $(TAILWIND_INPUT) -o $(TAILWIND_OUTPUT) --minify --watch

# Compile TailwindCSS (without watch)
css:
	tailwindcss -c tailwind.config.js -i $(TAILWIND_INPUT) -o $(TAILWIND_OUTPUT) --minify

# Generate templ files
templ:
	templ generate

# Run linter
lint:
	golangci-lint run ./...

# Clean build artifacts
clean:
	rm -rf $(TAILWIND_OUTPUT)

# Full setup
setup: deps localdb migrate-up css lint

.PHONY: default deps test test-watch localdb migrate-up migrate-down dev css-watch css templ lint clean setup
