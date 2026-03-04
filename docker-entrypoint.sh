#!/bin/sh
set -e

# Generate runtime config from environment variables
# config.template.js is copied to dist/ during build (from public/)
if [ -f /app/dist/config.template.js ]; then
  envsubst < /app/dist/config.template.js > /app/dist/config.js
  echo "Runtime config generated at /app/dist/config.js"
else
  echo "Warning: config.template.js not found, skipping runtime config generation"
fi

exec "$@"
