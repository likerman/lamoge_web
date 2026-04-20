#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$ROOT_DIR/site-src"
DIST_DIR="$SRC_DIR/dist"

echo "Building LaMoGe site from $SRC_DIR"
ASTRO_TELEMETRY_DISABLED=1 npm --prefix "$SRC_DIR" run build

echo "Publishing generated routes and assets to $ROOT_DIR"
for path in _astro es en icons images; do
  if [ -e "$DIST_DIR/$path" ]; then
    mkdir -p "$ROOT_DIR/$path"
    rsync -rl --delete --omit-dir-times --no-perms --no-owner --no-group "$DIST_DIR/$path/" "$ROOT_DIR/$path/"
  fi
done

if cp "$DIST_DIR/index.html" "$ROOT_DIR/index.html" 2>/dev/null; then
  echo "Updated root index.html"
else
  cp "$DIST_DIR/index.html" "$ROOT_DIR/lamoge-index.html"
  echo "Could not overwrite root index.html; wrote $ROOT_DIR/lamoge-index.html instead"
fi

echo "Deployment complete"
