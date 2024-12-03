package internal

import "embed"

//go:embed locales/*.json
var localeFiles embed.FS
