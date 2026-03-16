#!/usr/bin/env bash

set -e

echo "Dockyard dependency check"
echo "Checking Docker installation..."

# -----------------------------
# Check if Docker CLI exists
# -----------------------------
if command -v docker >/dev/null 2>&1; then
    echo "Docker CLI already installed"
else
    echo "Docker not found."

    read -p "Install Docker now? (y/N): " answer
    if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
        echo "Docker installation skipped."
        exit 1
    fi

    echo "Detecting package manager..."

    if command -v pacman >/dev/null 2>&1; then
        echo "Arch-based system detected"
        sudo pacman -Sy --noconfirm docker

    elif command -v apt >/dev/null 2>&1; then
        echo "Debian-based system detected"
        sudo apt update
        sudo apt install -y docker.io

    elif command -v dnf >/dev/null 2>&1; then
        echo "Fedora/RHEL-based system detected"
        sudo dnf install -y docker

    elif command -v yum >/dev/null 2>&1; then
        echo "RHEL/CentOS-based system detected"
        sudo yum install -y docker

    elif command -v apk >/dev/null 2>&1; then
        echo "Alpine system detected"
        sudo apk add docker

    elif command -v nix-env >/dev/null 2>&1; then
        echo "NixOS detected."
        echo "Please enable Docker via configuration.nix:"
        echo "  virtualisation.docker.enable = true;"
        exit 1

    else
        echo "Unsupported package manager."
        echo "Please install Docker manually."
        exit 1
    fi
fi

# -----------------------------
# Detect init system
# -----------------------------
echo ""
echo "Detecting init system..."

if command -v systemctl >/dev/null 2>&1; then
    echo "systemd detected"

    if ! systemctl is-active --quiet docker; then
        echo "Starting Docker daemon..."
        sudo systemctl start docker
    else
        echo "Docker daemon already running"
    fi

elif command -v rc-service >/dev/null 2>&1; then
    echo "OpenRC detected"

    echo "Starting Docker daemon..."
    sudo rc-service docker start

elif ps -p 1 -o comm= | grep -qi "init"; then
    echo "Generic init system detected"
    echo "Please start Docker daemon manually."

else
    echo "Unknown init system."
    echo "You may need to start Docker manually."
fi

# -----------------------------
# BSD detection
# -----------------------------
OS=$(uname)

if [[ "$OS" == *"BSD"* ]]; then
    echo ""
    echo "BSD system detected."
    echo "Docker support varies across BSD systems."
    echo "Please consult your system documentation."
fi

echo ""
echo "Docker environment ready."# runtime update
# cross-platform support
# system boot update
# system boot update v1
