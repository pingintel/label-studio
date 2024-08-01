# Ping Data Intelligence Infra Scripts

## Introduction

Welcome to the Ping Data Intelligence Label Studio fork.
This folder has all the required scripts to build, push and commit frontend changes and create a docker image to be pushed to ECR.

## build_frontend

To build the frontend you can run `python infra/build_frontend.py` in the root folder. This runs the yarn run build command to create frontend static files.

This command can also be used to commit and push the changes in the develop repo so it recreates the static files for the frontend. 

For this, run the command with `python infra/build_frontend.py -p` which pushes to the remote repository develop branch with a new commit with the message `Build Frontend from commit:latest_commit_hash` using the latest commit hash of the develop branch.

This command can be further configured with two more options.

`--message` : Changes the github commit message if you are using the command to push to github. Defaults to `Build Frontend from commit:latest_commit_hash'` with the latest commit hash in the develop branch.

`--branch` : Changes the current branch and the branch this commit should be pushed to. This command switches to the given branch, builds the frontend and pushes to the same branch if this option is used. Defaults to `develop`

## build_image

Used to build a docker image and optionally push it to ECR. To create a docker image just run `python infra/build_image.py`.

To push it to ECR you can supply it with the optional parameter `--push` or `-p`. This requires you to assume the role `pingintel-ml` using Granted. After assuming the correct role you can run `python infra/build_image.py -p`

Script is configured to push to Ping Intelligence repository by default. But this can be configured using the following options when running the command.

`--aws-acount`: Controls which account the image should be pushed to. 
`--ecr-repo`: Configures which ECR repo it should push to. Defaults to `label-studio`
`--aws-region`: Configures which AWS region the command should push. Defaults to `us-east-1`
`--docker-image-tag`: Configures the name of the docker-image. Defaults to `pingintel/label-studio`