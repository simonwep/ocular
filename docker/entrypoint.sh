#!/bin/sh

# Generate app-config.json file
echo "{\"demo\": ${OCULAR_DEMO:-false}}" > /home/static/app-config.json

# Run default cmd
exec "$@"
