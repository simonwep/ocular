#!/bin/sh
set -eu

# Start backend
'/usr/local/bin/genesis' start &
BACKEND_PID=$!

# Start Caddy in the background
caddy run --config /etc/caddy/Caddyfile &
CADDY_PID=$!

terminate() {
  SIGNAL=$1

  if [ -n "${BACKEND_PID:-}" ]; then
    kill -s "$SIGNAL" "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${CADDY_PID:-}" ]; then
    kill -s "$SIGNAL" "$CADDY_PID" 2>/dev/null || true
  fi
}

trap 'terminate TERM' TERM
trap 'terminate INT' INT

# Wait for both processes to exit
wait "$BACKEND_PID"
wait "$CADDY_PID"
