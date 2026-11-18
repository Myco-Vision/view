#!/bin/bash
# switch-env.sh — Switch Nuxt Frontend between Local API and Vercel Cloud API
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

TARGET="$1"

if [ "$TARGET" = "local" ]; then
    if [ ! -f ".env.local" ]; then
        echo "❌ Error: .env.local not found."
        exit 1
    fi
    cp .env.local .env
    echo "=========================================================="
    echo "✅ Switched View to LOCAL mode"
    echo "   • API Base: http://127.0.0.1:8000/api"
    echo "=========================================================="
elif [ "$TARGET" = "cloud" ]; then
    if [ ! -f ".env.cloud" ]; then
        echo "❌ Error: .env.cloud not found."
        exit 1
    fi
    cp .env.cloud .env
    echo "=========================================================="
    echo "☁️  Switched View to CLOUD mode"
    echo "   • API Base: https://mycovision-api-one.vercel.app/api"
    echo "=========================================================="
else
    echo "Usage: ./switch-env.sh [local|cloud]"
    echo "   ./switch-env.sh local  -> Point to local Laravel (127.0.0.1:8000)"
    echo "   ./switch-env.sh cloud  -> Point to Vercel API"
    exit 1
fi

