import os
import site
import click
import sys


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
site.addsitedir(SCRIPT_DIR)

from shared import log_message, execute

IS_WINDOWS = sys.platform == 'win32'

if IS_WINDOWS:
    def quote(s):
        return s

def build_docker_image(aws_account, aws_region, ecr_repo, push, docker_image_tag):
    """Build the Docker image"""
    
    log_message("*** Starting Docker Image build process ***")

    web_dir = os.path.join(SCRIPT_DIR, "../")
    abs_dir = os.path.abspath(web_dir)
    log_message(F"Changing directory to {abs_dir}")

    os.chdir(abs_dir)
    log_message("Running 'docker build'")
    cmd = f"docker build -t {docker_image_tag} --platform linux/amd64 ."
    execute(cmd)

    if push:
        log_message("*** Pushing to AWS ECR ***")

        log_message("Logging in to ECR")
        cmd = f"docker login -u AWS -p $(aws ecr get-login-password --region {aws_region}) {aws_account}.dkr.ecr.{aws_region}.amazonaws.com"
        execute(cmd)

        log_message("Tagging the image")
        cmd = f"docker tag {docker_image_tag}:latest {aws_account}.dkr.ecr.{aws_region}.amazonaws.com/{ecr_repo}:latest"
        execute(cmd)

        log_message("Pushing")
        cmd = f"docker push {aws_account}.dkr.ecr.{aws_region}.amazonaws.com/{ecr_repo}:latest"
        execute(cmd)

        log_message("Done!")
      
@click.command()
@click.option("--push", "-p", help="Flag to enable ECR push, defaults to False", is_flag=True, default=False)
@click.option("--docker-image-tag", default="pingintel/label-studio")
@click.option("--aws-account", default="654654387973")
@click.option("--ecr-repo", default="label-studio")
@click.option("--aws-region", help="Region, defaults to us-east-1", default="us-east-1")
def run(push, aws_account, aws_region, ecr_repo, docker_image_tag):
     build_docker_image(aws_account, aws_region, ecr_repo, push, docker_image_tag)

if __name__ == "__main__":
    run()