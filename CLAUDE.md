# CLAUDE.md - IOTA SDK Guide

## Overview
This is a project built on [IOTA-SDK](https://github.com/iota-uz/iota-sdk).
To lookup IOTA SDK documentation, please refer `LLMS.md` file.

The project follows DDD principles. The project is divided into 3 main layers:
- Domain: Contains the business logic and domain models
- Infrastructure: Contains the database and other external services
- Presentation: Contains the UI components and controllers

## Build/Lint/Test Commands
- After changes to Go code: `go vet ./...`
- Run all tests: `make test` or `go test -v ./...` 
- Run single test: `go test -v ./path/to/package -run TestName`
- Run specific subtest: `go test -v ./path/to/package -run TestName/SubtestName`
- JSON linting: `make build-iota-linter && make run-iota-linter`
- Apply migrations: `make migrate up`
- After changing `.templ` files DO NOT run generate commands, it is automatically done in background

## Code Style Guidelines
- DO NOT COMMENT EXECESSIVELY. Instead, write clear and concise code that is self-explanatory
- DO NOT DIRECTLY EDIT FILES under `migrations/`
- DO NOT EDIT *_templ.go files, they are generated automatically from .templ files
- NEVER include yourself as an author in commit messages
- For package aliases use flat case (e.g. `import useraggregate "github.com/iota-uz/iota-sdk/domain/user"`)
- Use Go v1.23.2 and follow standard Go idioms
- File organization: group related functionality in modules/ or pkg/ directories
- Naming: use camelCase for variables, PascalCase for exported functions/types
- Testing: table-driven tests with descriptive names (TestFunctionName_Scenario)
- Error handling: use pkg/serrors for standard error types
- Type safety: use strong typing and avoid interface{} where possible
- Follow existing patterns for database operations with jmoiron/sqlx

## UI Component Guidelines
- Use templ for HTML templating (*.templ files)
- Follow existing patterns for forms, drawers, and modals
- Use composables.UsePageCtx(ctx) for accessing page context and translations
- For UI components, follow the IOTA SDK patterns:
  - Use button.Primary/Secondary for buttons
  - Use input.Text/Date/etc for form inputs
  - Use radio.RadioGroup and radio.CardItem for radio button groups
  - Use dialog.StdViewDrawer for drawer components
  - Use HTMX for form submission (hx-post, hx-swap, hx-indicator)
  - Use Alpine.js for client-side interactivity (x-data, x-model, @click)
- Always use translations through pageCtx.T() rather than hardcoded strings
- When creating a new page:
  1. Create a .templ file in the appropriate module/presentation/templates/pages directory
  2. Add necessary translations to locales/en.toml and locales/ru.toml
  3. Create appropriate structs for passing data to templates
  4. Implement the main component and any sub-components needed
- Form field naming:
  - Use PascalCase for all form field names (e.g., `name="Company"` not `name="company"`)
  - Keep error keys consistent with field names (e.g., `props.Errors["Company"]`)
  - Ensure label `for` attributes match field names (e.g., `for="Company"`)
- Form submission pattern:
  ```
  <form
    hx-post="/path/to/endpoint"
    hx-swap="outerHTML"
    hx-indicator="#loading-indicator"
  >
  ```
- Drawer component pattern:
  ```
  @dialog.StdViewDrawer(dialog.StdDrawerProps{
    Action: "action-name",
    Title: pageCtx.T("Translation.Key"),
  }) {
    // Drawer content
  }
  ```
