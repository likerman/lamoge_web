#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$ROOT_DIR/site-src"
DIST_DIR="$SRC_DIR/dist"
BUILD_TIMEOUT_SECONDS="${BUILD_TIMEOUT_SECONDS:-180}"

sanitize_html_tree() {
  local target_dir="$1"
  [ -d "$target_dir" ] || return 0

  while IFS= read -r -d '' file; do
    perl -0pi -e 's/"email":"lamoge\@idean\.uba\.ar",//g' "$file"
    perl -0pi -e 's/mailto:lamoge\@idean\.uba\.ar/#/g' "$file"
    perl -0pi -e 's/mailto:claracorrealu\@gmail\.com/#/g' "$file"
    perl -0pi -e 's/lamoge\@idean\.uba\.ar/lamoge [at] idean.uba.ar/g' "$file"
    perl -0pi -e 's/claracorrealu\@gmail\.com/claracorrealu [at] gmail.com/g' "$file"
  done < <(find "$target_dir" -type f -name '*.html' -print0)
}

build_completed_after() {
  local started_at="$1"
  local probe_files=(
    "$DIST_DIR/index.html"
    "$DIST_DIR/es/index.html"
    "$DIST_DIR/en/index.html"
  )

  for file in "${probe_files[@]}"; do
    if [ ! -f "$file" ]; then
      return 1
    fi

    local modified_at
    modified_at="$(stat -c %Y "$file")"
    if [ "$modified_at" -lt "$started_at" ]; then
      return 1
    fi
  done

  return 0
}

echo "Building LaMoGe site from $SRC_DIR"
build_started_at="$(date +%s)"
if timeout --foreground "${BUILD_TIMEOUT_SECONDS}s" env ASTRO_TELEMETRY_DISABLED=1 npm --prefix "$SRC_DIR" run build; then
  echo "Build completed"
else
  build_status=$?
  if [ "$build_status" -eq 124 ] && build_completed_after "$build_started_at"; then
    echo "Build command timed out after generating fresh artifacts; continuing with publish"
  else
    exit "$build_status"
  fi
fi

echo "Publishing generated routes and assets to $ROOT_DIR"
for path in _astro brand es en icons images; do
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

if [ -f "$DIST_DIR/404.html" ]; then
  if cp "$DIST_DIR/404.html" "$ROOT_DIR/404.html" 2>/dev/null; then
    echo "Updated root 404.html"
  else
    cp "$DIST_DIR/404.html" "$ROOT_DIR/lamoge-404.html"
    echo "Could not overwrite root 404.html; wrote $ROOT_DIR/lamoge-404.html instead"
  fi
fi

sanitize_html_tree "$DIST_DIR"
sanitize_html_tree "$ROOT_DIR"
echo "Sanitized published HTML to obfuscate public email addresses"

echo "Deployment complete"
