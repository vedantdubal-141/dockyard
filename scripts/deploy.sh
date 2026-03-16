#!/bin/bash

# --- DockForge Main Deployment Script ---
# ᡕᠵデᡁ᠊╾━ Interactive Environment Orchestrator

set -e

# --- Configuration & Variables ---
MIN_RAM_GB=16
DOCS_DIR="docs"
CONFIG_FILE="config/dockforge.yml"
BLUEPRINT_DIR="dockerfiles"
APP_DIR="app"

# --- Emojis (The Fancy & Human Collection) ---
EMOJI_BANNER="┌[ ∵ ]┘ DOCKFORGE DEPLOYMENT ENGINE └[ ∵ ]┐"
EMOJI_FORGE="ᡕᠵデᡁ᠊╾━"
EMOJI_CHECK="≽(◕ ‿ ◕)≼"
EMOJI_SUCCESS="≽(•⩊ •マ≼"
EMOJI_ERROR="(╯°□°）╯︵ ┻━┻"
EMOJI_WAIT="(❍ᴥ❍ʋ)"
EMOJI_SURPRISE="щ(ºДºщ)"
EMOJI_HAMMER="🔨 (•ㅅ•) 🔨"
EMOJI_SPARKLES="✨"
EMOJI_COFFEE="☕"
EMOJI_FIRE="🔥"
EMOJI_RADAR="📡"

# --- Global State ---
APP_NAMES=()
APP_PATHS=()
APP_COMPOSE=()
APP_ENDPOINTS=()
APP_BLUEPRINTS=()

# --- Utility Functions ---

log() {
    echo -e "\n\033[1;36m[Forge]\033[0m $1"
}

log_fancy() {
    echo -e "\033[1;35m$1\033[0m $2"
}

error_exit() {
    echo -e "\033[1;31m[CRITICAL]\033[0m $1 $EMOJI_ERROR"
    exit 1
}

cleanup_on_interrupt() {
    echo -e "\n\n\033[1;33m$EMOJI_FIRE Shutdown signal received! Initiating emergency cooldown...\033[0m"
    if [ -n "$CURRENT_DEPLOY_DIR" ]; then
        cd "$CURRENT_DEPLOY_DIR"
        docker compose down > /dev/null 2>&1
        echo -e "\033[1;32m$EMOJI_SUCCESS Environment disassembled successfully.\033[0m"
    fi
    exit 0
}

trap cleanup_on_interrupt SIGINT SIGTERM

check_requirements() {
    echo -e "\n$EMOJI_SPARKLES Starting system diagnostics..."
    log_fancy "$EMOJI_CHECK" "Scanning your battle station for compatibility..."
    
    if ! [ -x "$(command -v docker)" ]; then
        log_fancy "$EMOJI_SURPRISE" "Docker is missing! Attempting auto-installation..."
        if [ -f "./scripts/install-docker.sh" ]; then
            bash ./scripts/install-docker.sh
        else
            error_exit "Docker engine not found!"
        fi
    fi

    if ! docker compose version >/dev/null 2>&1; then
        error_exit "Docker Compose V2 is required."
    fi

    TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}' || echo 0)
    if [ "$TOTAL_RAM" -lt "$MIN_RAM_GB" ]; then
        log_fancy "$EMOJI_WAIT" "Detected ${TOTAL_RAM}GB RAM. Recommended is ${MIN_RAM_GB}GB+."
    fi
}

discovery_engine() {
    log_fancy "$EMOJI_RADAR" "Initializing discovery engine... Scanning for forgeable payloads."
    
    # 1. Load from config file if available (using python3 for robust YAML parsing)
    if [ -f "$CONFIG_FILE" ]; then
        # This python script extracts app info into a bash-friendly format: name|path|compose|endpoint|blueprint
        while IFS='|' read -r name path compose endpoint blueprint; do
            APP_NAMES+=("$name")
            APP_PATHS+=("$path")
            APP_COMPOSE+=("$compose")
            APP_ENDPOINTS+=("$endpoint")
            APP_BLUEPRINTS+=("$blueprint")
        done < <(python3 -c "
import yaml, sys
try:
    with open('$CONFIG_FILE', 'r') as f:
        data = yaml.safe_load(f)
        for app in data.get('applications', []):
            print(f\"{app.get('name')}|{app.get('path')}|{app.get('compose_file')}|{app.get('endpoint')}|{app.get('blueprint')}\")
except Exception as e:
    pass
" 2>/dev/null)
    fi

    # 2. Automated Scanning (Orphan Detection)
    # Detect apps that exist in /app and have a matching .Dockerfile in /dockerfiles
    for blueprint in "$BLUEPRINT_DIR"/*.Dockerfile; do
        [ -e "$blueprint" ] || continue
        base_name=$(basename "$blueprint" .Dockerfile)
        
        # Check if already added via config
        match=0
        for bp in "${APP_BLUEPRINTS[@]}"; do
            if [ "$bp" == "$(basename "$blueprint")" ]; then match=1; break; fi
        done
        [ $match -eq 1 ] && continue

        # If a directory exists in app/ with the same name, we found an orphan
        if [ -d "$APP_DIR/$base_name" ]; then
            log "Discovered unlisted payload: $base_name"
            # Try to find a compose file
            compose="docker-compose.yml"
            [ -f "$APP_DIR/$base_name/docker-compose-dev.yml" ] && compose="docker-compose-dev.yml"
            
            APP_NAMES+=("Auto-Detected: $base_name")
            APP_PATHS+=("$APP_DIR/$base_name")
            APP_COMPOSE+=("$compose")
            APP_ENDPOINTS+=("http://localhost:8080") # Default fallback
            APP_BLUEPRINTS+=("$(basename "$blueprint")")
        fi
    done
}

setup_java_secrets() {
    log_fancy "$EMOJI_HAMMER" "Constructing secure communication layer..."
    local java_dir="app/atsea-sample-shop-app"
    mkdir -p "$java_dir/certs"
    
    if [ ! -f "$java_dir/certs/domain.key" ]; then
        log "Minting RSA-4096 digital signatures... $EMOJI_COFFEE"
        openssl req -newkey rsa:4096 -nodes -sha256 -keyout "$java_dir/certs/domain.key" \
                -x509 -days 365 -out "$java_dir/certs/domain.crt" \
                -subj "/C=US/ST=Dev/L=Dev/O=DockForge/CN=localhost"
    fi

    mkdir -p "$java_dir/devsecrets"
    if [ ! -f "$java_dir/devsecrets/postgres_password" ]; then
        log "Initializing database authentication tokens..."
        echo "atsea_password" > "$java_dir/devsecrets/postgres_password"
    fi
}

validate_health() {
    local url=$1
    echo ""
    log_fancy "$EMOJI_WAIT" "Initiating long-range scanners for $url..."
    until $(curl --output /dev/null --silent --head --fail "$url"); do
        echo -ne "  Forging in progress... Negotiating environment stabilization \r"
        sleep 5
    done
    echo ""
    log_fancy "$EMOJI_SUCCESS" "Target environment is MISSION READY! (200 OK)"
}

deploy_app() {
    local index=$1
    local name="${APP_NAMES[$index]}"
    local directory="${APP_PATHS[$index]}"
    local compose_file="${APP_COMPOSE[$index]}"
    local endpoint="${APP_ENDPOINTS[$index]}"

    BASE_DIR=$(pwd)
    CURRENT_DEPLOY_DIR="$BASE_DIR/$directory"

    log_fancy "$EMOJI_FORGE" "Starting assembly sequence for: $name"
    
    if [[ "$name" == *"Shop"* || "$name" == *"Java"* ]]; then
        setup_java_secrets
    fi

    log "Warping into directory: $directory"
    cd "$CURRENT_DEPLOY_DIR"
    
    log "Synthesizing containers from blueprint... This may take a moment."
    docker compose -f "$compose_file" up --build -d
    
    log "Exiting target directory..."
    cd "$BASE_DIR"
    
    validate_health "$endpoint"

    echo ""
    echo "----------------------------------------------------------------"
    log_fancy "$EMOJI_SUCCESS" "FORGE PROCESS COMPLETE!"
    echo -e "\033[1;32m🚀 Your application is LIVE and humming at: \033[1;34m$endpoint\033[0m"
    echo -e "Press \033[1;31mCtrl+C\033[0m at any time to disassemble the environment and exit."
    echo "----------------------------------------------------------------"
    
    while true; do sleep 1; done
}

# --- Main Logic ---
clear
echo -e "\033[1;33m$EMOJI_BANNER\033[0m"
echo "----------------------------------------------------------------"
check_requirements
discovery_engine

if [ ${#APP_NAMES[@]} -eq 0 ]; then
    error_exit "No forgeable payloads detected. The forge remains cold."
fi

echo ""
echo "Select a Blueprint Cluster to Forging:"
echo "----------------------------------------------------------------"
for i in "${!APP_NAMES[@]}"; do
    printf "%2d) %-30s [%s]\n" $((i+1)) "${APP_NAMES[$i]}" "${APP_BLUEPRINTS[$i]}"
done
echo " q) Abort Flight"

echo ""
read -p "Your selection (1-${#APP_NAMES[@]}): " choice

if [[ "$choice" == "q" ]]; then
    log "Aborted. See you in the next cycle!"
    exit 0
fi

idx=$((choice-1))
if [[ -n "${APP_NAMES[$idx]}" ]]; then
    deploy_app "$idx"
else
    error_exit "Invalid selection: $choice"
fi
# feature: discovery engine logic added for zero-config payloads
# engine update
# payload discovery logic
# signal trap for clean exit
# radar logic
# radar logic v2
