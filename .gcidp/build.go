package main

import (
	"fmt"
	"github.com/apollo-studios/gcidp-agent/docker"
	"github.com/apollo-studios/gcidp-agent/pipeline"
)

var BuildServerVersion = "0.4.0"

const projectName = "elxolding"

func Cleanup(runner *pipeline.Runner) {
	branch := runner.Branch
	containerName := fmt.Sprintf("%s-app-%s", projectName, branch)
	imageName := fmt.Sprintf("%s-app:%s", projectName, branch)
	runner.Pipeline(
		docker.RmContainer(containerName, true),
		docker.RmImage(imageName, true),
	)
}

func Build(runner *pipeline.Runner) {
	if runner.Branch != "staging" {
		return
	}
	var branch, containerName, imageName, apiHost, dbName string
	branch = runner.Branch

	containerName = fmt.Sprintf("%s-back-%s", projectName, branch)
	imageName = fmt.Sprintf("%s-back:%s", projectName, branch)
	apiHost = fmt.Sprintf("api-%s-%s.apollos.studio", branch, projectName)
	dbName = fmt.Sprintf("%s-postgres-%s", projectName, branch)

	runner.Pipeline(
		docker.RmContainer(dbName, true),
		docker.Run(dbName, "postgres:15.1").Config(
			docker.Volume(fmt.Sprintf("%s-%s-postgres-data", projectName, branch), "/var/lib/postgresql/data"),
			docker.Env("POSTGRES_DB", "elxolding"),
			docker.Env("POSTGRES_PASSWORD", "postgres"),
			docker.Hostname("elxolding_db"),
		),
        docker.Build(imageName, "./back").Target("prod"),
        docker.RmContainer(containerName, true),
        docker.Run(containerName, imageName).Config(
			docker.Expose(apiHost, "3030"),
			docker.Volume(fmt.Sprintf("%s-%s-uploads-data", branch, projectName), "/app/uploads"),
			docker.Env("NODE_ENV", "gcidp"),
        ),
	)
	containerName = fmt.Sprintf("%s-app-%s", projectName, branch)
	imageName = fmt.Sprintf("%s-app:%s", projectName, branch)
	runner.Pipeline(
		docker.Build(imageName, "./app").Target("prod"),
		docker.RmContainer(containerName, true),
		docker.Run(containerName, imageName).Config(
			docker.Expose(fmt.Sprintf("%s-%s.apollos.studio", branch, projectName), "80"),
			docker.Env("NUXT_PUBLIC_API_URL", fmt.Sprintf("https://%s", apiHost)),
			docker.Env("NUXT_PUBLIC_SSR_API_URL", ssrUrl),
		),
	)

}
