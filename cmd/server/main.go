package main

import (
	"github.com/iota-agency/iota-erp/elxolding"
	"github.com/iota-agency/iota-sdk/pkg/configuration"
	"github.com/iota-agency/iota-sdk/pkg/modules"
	"github.com/iota-agency/iota-sdk/pkg/setup"
	"log"
)

func main() {
	modules.RegisterModule(elxolding.NewModule())
	conf := configuration.Use()
	serverInstance, err := setup.NewServer(conf)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}
	log.Printf("starting server on %s", conf.SocketAddress)
	if err := serverInstance.Start(conf.SocketAddress); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
