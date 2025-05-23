## About

ELXOLDING ERP - ERP system for tracking inventory using RFID technology.

## Overview

* [Architecture](https://app.excalidraw.com/s/3x4l1qRpK2w/ADYN81ksZsd)
* [Database schema](https://dbdiagram.io/d/ERP-SDK-65fd8cb4ae072629ceb7f50e)

## Glossary

* UHR - Unified Hourly Rate

## Prerequisites

* [Go](https://golang.org/doc/install)
* [Air](https://github.com/cosmtrek/air#Installation)
* [Docker](https://docs.docker.com/get-docker/)
* [SQL-Migrate](https://github.com/rubenv/sql-migrate)
* [Templ](https://templ.guide/)
* [Tailwindcss](https://tailwindcss.com/docs/installation)
* [golangcli-lint](https://golangci-lint.run/welcome/install/)

## Development

Clone the repository

```shell
git clone https://github.com/iota-uz/iota-erp.git
```

Install dependencies

```shell
go get -u ./...
```

Install tailwindcss globally

```shell
pnpm install -g tailwindcss
# or
npm install -g tailwindcss
```

Run postgres

```shell
docker compose -f docker-compose.dev.yml up -d
```

Run migrations

```shell
sql-migrate up
```

Run in watch mode (hot reload)

```shell
air
```

Run templ in watch mode

```shell
templ generate -watch
```

Run tailwindcss in watch mode

```shell
tailwindcss -c tailwind.config.js -i internal/assets/css/main.css -o internal/assets/css/main.min.css --minify --watch
```

Now open postman and explore the GraphQL schema at http://localhost:3200/query

## Examples

Get all employees and their positions

```graphql
query Users {
    users(limit: 10, offset: 0) {
        total
        data {
            id
            email
            firstName
            lastName
            avatar {
                id
                size
            }
        }
    }
}
```

## Reference commands

Run linter

```shell
golangci-lint run
```

Regenerate from GraphQL schema

```shell
go generate ./...
```

Running migrations

```shell
go run cmd/migrate/main.go up
```

Rolling back migrations

```shell
go run cmd/migrate/main.go down
```

Redoing migrations (useful for development)

```shell
sql-migrate redo
```

Making a migration

```shell
sql-migrate new <migration-name>
```

Running tests

```shell
go test -v ./...
```

Running tests with coverage

```shell
go test -coverprofile coverage/coverage.out ./... 
go tool cover -html=coverage/coverage.out
```

Running the server

```shell
go run cmd/server/main.go
```

Format templ files

```shell
templ fmt .
```

## Conventions

* [Naming](CONVENTIONS.MD#naming)
* [Code style](CONVENTIONS.MD#code-style)

## Dev stand (staging) 

[URL](https://elxolding-erp.ci.iota.uz/login)

User: **Admin User**

Password
```text
TestPass123!
```

To connect to staging db:

```text
Hostname: elxolding-erp.ci.iota.uz
Port: 17899
Database: elxolding_db
Username: postgres
Password: EU4n3y8XeK8hia0L
```
