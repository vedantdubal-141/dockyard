#!/bin/bash

# --- DockForge Cleanup Script ---
# Removes containers, networks, and volumes for the forged environments.

set -e

log() {
    echo -e "\033[1;34m[DockForge Cleanup]\033[0m $1"
}

APP_TYPE=$1

cleanup_java() {
    log "Cleaning up Java environment..."
    cd app/atsea-sample-shop-app
    docker compose -f docker-compose-dev.yml down -v
    rm -rf certs
}

cleanup_rust() {
    log "Cleaning up Rust environment..."
    cd app/rust_dashboard_app
    docker compose down -v
}

if [[ -z "$APP_TYPE" ]]; then
    echo "Usage: ./scripts/cleanup.sh [java|rust|all]"
    exit 1
fi

case "$APP_TYPE" in
    java)
        cleanup_java
        ;;
    rust)
        cleanup_rust
        ;;
    all)
        cleanup_java
        cd ../.. # Back to root
        cleanup_rust
        ;;
    *)
        echo "Unknown application type: $APP_TYPE"
        exit 1
        ;;
esac

log "Cleanup complete."
