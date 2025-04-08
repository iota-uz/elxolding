# Variables
TAILWIND_INPUT := internal/assets/css/main.css
TAILWIND_OUTPUT := internal/assets/css/main.min.css

# Install dependencies
deps:
	go get ./...

# Seed database
seed:
	go run cmd/seed/main.go

generate:
	go generate ./... && templ generate

# Upgrade iota-sdk version && push
release:
	make upgrade-sdk && git add . && git commit -m "chore: upgrade sdk to the lastest version" && git push

migrate:
	go run cmd/migrate/main.go $(filter-out $@,$(MAKECMDGOALS))

# Run PostgreSQL
localdb:
	docker compose -f compose.dev.yml up db

clear-localdb:
	rm -rf volumes/postgres-data/

# Compile TailwindCSS (with watch)
css-watch:
	tailwindcss -c tailwind.config.js -i $(TAILWIND_INPUT) -o $(TAILWIND_OUTPUT) --minify --watch

# Compile TailwindCSS (without watch)
css:
	tailwindcss -c tailwind.config.js -i $(TAILWIND_INPUT) -o $(TAILWIND_OUTPUT) --minify

# Run linter
lint:
	golangci-lint run ./...

# Clean build artifacts
clean:
	rm -rf $(TAILWIND_OUTPUT)

# Upgrade iota-sdk version
upgrade-sdk:
	chmod +x upgrade.sh && ./upgrade.sh

# Full setup
setup: deps migrate-up css lint

# Prevents make from treating the argument as an undefined target
%:
	@:

.PHONY: deps localdb migrate-up migrate-down dev css-watch css lint clean setup
