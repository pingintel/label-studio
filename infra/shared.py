import datetime
import click
import subprocess
from timeit import default_timer as timer

start_time = timer()

def log_message(msg):
    timestamp = datetime.datetime.utcnow().strftime(format="%Y/%m/%d %H:%M:%S")
    elapsed = timer() - start_time
    click.echo(f"{timestamp} {elapsed:.1f}s: {msg}")
    
def execute(cmd):
    """Execute a shell command and print the output"""
    errorlevel = 0
    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

    try:
        output = []
        for line in process.stdout:
            click.echo(line, nl=False)
            output.append(line)
        process.wait()

        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, cmd, output="".join(output))
    except KeyboardInterrupt:
        process.terminate()
        click.echo("\nAborted!")
    except subprocess.CalledProcessError as exc:
        errorlevel = exc.returncode
        error_message = exc.output
        if "Cannot connect to the Docker daemon" in error_message:
            click.echo("[ERROR]: Cannot connect to the Docker daemon.")
            click.echo("[HINT]: Make sure Docker is running.")
        elif "Unable to locate credentials" in error_message:
            click.echo("[ERROR]: Unable to locate credentials.")
            click.echo("[HINT]: Make sure you assume the 'pingintel-ml' role using Granted.")
        elif "denied:" in error_message:
            click.echo("[ERROR]: Permission Denied")
            click.echo("[HINT]: Make sure you assume the role 'pingintel-ml' using Granted. Your current role doesn't have the permissions required.")
        else:
            click.echo(f"Command failed (err {errorlevel}): {cmd}\n{error_message}")

    if errorlevel != 0:
        click.echo("Command failed (err %d): %s" % (errorlevel, cmd))
