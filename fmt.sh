#!/usr/bin/env bash
set -e

TARGET_DIR="src"

for arg in "$@"; do
  case "$arg" in
  -a | --all)
    TARGET_DIR="."
    ;;
  -h | --help)
    echo "Usage: $0 [-a|--all]"
    echo "  (default)   Format TypeScript/JavaScript inside src/ and all Markdown (.md) files"
    echo "  -a, --all   Format TypeScript/JavaScript and Markdown (.md) files in the entire repository"
    exit 0
    ;;
  *)
    echo "Unknown option: $arg" >&2
    echo "Usage: $0 [-a|--all]" >&2
    exit 1
    ;;
  esac
done

run_prettier_all() {
  find . \( -path "*/.*" -o -path "*/node_modules" \) -prune -o \
    \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.md" \) \
    -type f -exec "$@" --write {} +
}

run_prettier_src_and_md() {
  if [ -d "$TARGET_DIR" ]; then
    find "$TARGET_DIR" \( -path "*/.*" -o -path "*/node_modules" \) -prune -o \
      \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.cjs" \) \
      -type f -exec "$@" --write {} +
  else
    echo "⚠️  Directory '$TARGET_DIR' not found. Skipping TypeScript/JavaScript formatting."
  fi

  find . \( -path "*/.*" -o -path "*/node_modules" \) -prune -o \
    -name "*.md" -type f -exec "$@" --write {} +
}

# 1. Format TypeScript, JavaScript, and Markdown files with Prettier
if command -v prettier >/dev/null 2>&1; then
  PRETTIER_CMD=(prettier)
elif [ -x "./node_modules/.bin/prettier" ]; then
  PRETTIER_CMD=(./node_modules/.bin/prettier)
elif command -v npx >/dev/null 2>&1; then
  PRETTIER_CMD=(npx --yes prettier)
else
  PRETTIER_CMD=()
fi

if [ ${#PRETTIER_CMD[@]} -eq 0 ]; then
  echo "⚠️  Neither 'prettier' nor 'npx' found. Skipping TypeScript/JavaScript/Markdown formatting."
elif [ "$TARGET_DIR" = "." ]; then
  echo "✨ Formatting TypeScript, JavaScript, and Markdown files in entire repository with ${PRETTIER_CMD[*]}..."
  run_prettier_all "${PRETTIER_CMD[@]}"
else
  echo "✨ Formatting TypeScript/JavaScript in '$TARGET_DIR/' and all Markdown files with ${PRETTIER_CMD[*]}..."
  run_prettier_src_and_md "${PRETTIER_CMD[@]}"
fi

# 2. Format Shell scripts (prefers native shfmt from brew, falls back to uvx)
if command -v shfmt >/dev/null 2>&1; then
  echo "📜 Formatting shell scripts (shfmt)..."
  shopt -s globstar 2>/dev/null || true
  if shopt -q globstar 2>/dev/null; then
    shfmt -i 2 -w **/*.sh
  else
    find . -name "*.sh" -not -path "*/.*" -not -path "*/node_modules/*" -exec shfmt -i 2 -w {} +
  fi
elif command -v uvx >/dev/null 2>&1; then
  echo "📜 Formatting shell scripts (uvx shfmt-py)..."
  shopt -s globstar 2>/dev/null || true
  if shopt -q globstar 2>/dev/null; then
    uvx --from shfmt-py shfmt -i 2 -w **/*.sh
  else
    find . -name "*.sh" -not -path "*/.*" -not -path "*/node_modules/*" -exec uvx --from shfmt-py shfmt -i 2 -w {} +
  fi
else
  echo "⚠️  Neither 'shfmt' nor 'uvx' found. Install with: brew install shfmt"
fi

echo "✅ Done!"
