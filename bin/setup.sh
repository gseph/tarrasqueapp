#!/bin/bash
set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Identify operating system
IS_MAC=false
IS_LINUX=false
IS_WINDOWS=false

if [[ "$OSTYPE" == "darwin"* ]]; then
  IS_MAC=true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  IS_LINUX=true
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  IS_WINDOWS=true
else
  echo "🚨 Unrecognized OS. Please install dependencies manually."
  exit 1
fi

# Function to check if command exists
command_exists() {
  command -v "$@" > /dev/null 2>&1
}

do_install() {
  # Check that Docker is installed
  if ! command_exists docker; then
    echo "🚨 Docker is not installed. Please install Docker and try again."
    echo "See https://docs.docker.com/get-docker/ for instructions."
    exit 1
  fi

  # Check that Node.js is installed
  if ! command_exists node; then
    echo "🚨 Node.js is not installed. Please install Node.js and try again."
    # Automatic installation of Node.js
    if ! IS_WINDOWS; then
      read -p "Do you want to install Node.js? [y/N] " -n 1 -r
      echo
      # Check if user wants to install Node.js
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        if IS_MAC; then
          brew install node
        elif IS_LINUX; then
          curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
          sudo apt-get install nodejs
        fi
      # Exit if user doesn't want to install Node.js
      else
        echo "🚨 Node.js is required to install this program."
        exit 1
      fi
    # Exit if Node.js is not installed on Windows
    else
      echo "See https://nodejs.org/en/download/"
      exit 1
    fi
  fi

  # Check that pnpm is installed
  if ! command_exists pnpm; then
    echo "🚨 pnpm is not installed. Please install pnpm and try again."
    # Automatic installation of pnpm
    if ! IS_WINDOWS; then
      read -p "Do you want to install pnpm? [y/N] " -n 1 -r
      echo
      # Check if user wants to install pnpm
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        if IS_MAC; then
          brew install pnpm
        elif IS_LINUX; then
          curl -fsSL https://get.pnpm.io/install.sh | sh -
        fi
      # Exit if user doesn't want to install pnpm
      else
        echo "🚨 pnpm is required to install this program."
        exit 1
      fi
    # Exit if pnpm is not installed on Windows
    else
      echo "See https://pnpm.io/installation"
      exit 1
    fi
  fi

  source $SCRIPT_DIR/install-deps.sh
}

do_install
