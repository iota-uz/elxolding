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
	var branch, containerName, imageName string
	branch = runner.Branch
	containerName = fmt.Sprintf("%s-app-%s", projectName, branch)
	imageName = fmt.Sprintf("%s-app:%s", projectName, branch)
	runner.Pipeline(
		docker.Build(imageName, "./app").Target("prod"),
		docker.RmContainer(containerName, true),
		docker.Run(containerName, imageName).Config(
			docker.Expose(fmt.Sprintf("%s-%s.apollos.studio", branch, projectName), "80"),
		),
	)

}
