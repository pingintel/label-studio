import os
import site
import subprocess
import click
import sys


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
site.addsitedir(SCRIPT_DIR)

from shared import log_message, execute

IS_WINDOWS = sys.platform == 'win32'

if IS_WINDOWS:
    def quote(s):
        return s

def build_frontend(message, branch, push):
    """Build the frontend"""
    log_message("Starting Frontend build")

    log_message("Switching branches")
    cmd = f"git switch {branch} || git switch -c {branch}"
    execute(cmd)
    
    web_dir = os.path.join(SCRIPT_DIR, "../web")
    abs_dir = os.path.abspath(web_dir)
    log_message(f"Changing directory to {abs_dir}")
    os.chdir(abs_dir)
    log_message("Running 'yarn run build'")
    execute("yarn run build")

    if push:
        log_message("*** Committing and Pushing to Github ***")

        cmd = f"git rev-parse HEAD"
        latest_commit = subprocess.check_output(cmd, shell=True, text=True).strip()

        cmd = f"git add ."
        execute(cmd)

        commit_message = f"Build Frontend from commit: {latest_commit}"
        
        if message is not "default":
            commit_message = message

        cmd = f'git commit -m "{commit_message}"'
        execute(cmd)

        cmd = f"git push origin {branch}"
        execute(cmd)
    
    log_message("Done!")


@click.command()
@click.option("--message", help="Github commit message. Defaults to 'Build Frontend from commit:latest_commit_hash'", default="default")
@click.option("--branch", help="Github branch to push to. Defaults to 'develop'", default="develop")
@click.option("--push", "-p", help="Flag to enable github commit and push, defaults to False", is_flag=True, default=False)
def run(message, branch ,push):
    build_frontend(message, branch, push)

if __name__ == "__main__":
    run()