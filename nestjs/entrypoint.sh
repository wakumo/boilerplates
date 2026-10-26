#!/bin/sh
set -e

# Run migrations
yarn db:migrate:up:prod

# Start the application using the command passed as arguments to this script
exec "$@"
