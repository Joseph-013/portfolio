#!/usr/bin/env bash
# Start the dev container and the Angular dev server (http://localhost:4200).
# Usage: ./dev.sh [stop|logs]
set -euo pipefail
cd "$(dirname "$0")"

case "${1:-start}" in
  stop)
    docker compose down
    ;;
  logs)
    docker compose exec app tail -f /tmp/ng.log
    ;;
  start)
    docker compose up -d --build
    # Restart the server cleanly if it is already running
    docker compose exec app pkill -f "ng serve" 2>/dev/null || true
    docker compose exec -d app sh -c "[ -d node_modules ] || npm install; ng serve --host 0.0.0.0 > /tmp/ng.log 2>&1"
    echo "Starting... http://localhost:4200 (./dev.sh logs to follow, ./dev.sh stop to shut down)"
    ;;
  *)
    echo "Usage: $0 [start|stop|logs]" >&2
    exit 1
    ;;
esac
