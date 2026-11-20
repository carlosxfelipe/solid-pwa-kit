#!/usr/bin/env bash
set -e

usage() {
  echo "Usage: $0 <slug> [display-name] [short-name]"
  echo ""
  echo "Rename this starter template to a new project name."
  echo ""
  echo "Arguments:"
  echo "  slug          Package/storage slug (lowercase, letters/numbers/hyphens, e.g. my-app)"
  echo "  display-name  Human-readable app name (default: Title Case of slug)"
  echo "  short-name    Short PWA name, <= 12 chars recommended (default: compact display-name)"
  echo ""
  echo "Examples:"
  echo "  $0 my-app"
  echo "  $0 habit-tracker \"Habit Tracker\" \"Habits\""
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

SLUG="${1:-}"
DISPLAY_NAME="${2:-}"
SHORT_NAME="${3:-}"

if [ -z "$SLUG" ]; then
  read -r -p "Project slug (e.g. my-app): " SLUG
fi

if ! echo "$SLUG" | grep -Eq '^[a-z0-9][a-z0-9-]*$'; then
  echo "Error: slug must start with a lowercase letter or digit and contain only [a-z0-9-]." >&2
  exit 1
fi

if [ -z "$DISPLAY_NAME" ]; then
  DEFAULT_DISPLAY=$(node -e '
    const slug = process.argv[1];
    console.log(slug.split("-").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" "));
  ' "$SLUG")
  if [ $# -eq 0 ]; then
    read -r -p "Display name [$DEFAULT_DISPLAY]: " DISPLAY_NAME
  fi
  DISPLAY_NAME="${DISPLAY_NAME:-$DEFAULT_DISPLAY}"
fi

if [ -z "$SHORT_NAME" ]; then
  DEFAULT_SHORT=$(node -e '
    const name = process.argv[1].replace(/\s+/g, "");
    console.log(name.slice(0, 12));
  ' "$DISPLAY_NAME")
  if [ $# -eq 0 ]; then
    read -r -p "PWA short name [$DEFAULT_SHORT]: " SHORT_NAME
  fi
  SHORT_NAME="${SHORT_NAME:-$DEFAULT_SHORT}"
fi

echo "Renaming project:"
echo "  slug:         $SLUG"
echo "  display-name: $DISPLAY_NAME"
echo "  short-name:   $SHORT_NAME"

node -e '
const fs = require("fs");
const path = require("path");

const [slug, displayName, shortName] = process.argv.slice(1);

function replaceInFile(relPath, replacer) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) return;
  const before = fs.readFileSync(fullPath, "utf8");
  const after = replacer(before);
  if (after !== before) {
    fs.writeFileSync(fullPath, after, "utf8");
    console.log("  updated:", relPath);
  }
}

// 1. package.json & package-lock.json
replaceInFile("package.json", (s) => {
  const pkg = JSON.parse(s);
  pkg.name = slug;
  return JSON.stringify(pkg, null, 2) + "\n";
});

replaceInFile("package-lock.json", (s) => {
  const lock = JSON.parse(s);
  lock.name = slug;
  if (lock.packages && lock.packages[""]) {
    lock.packages[""].name = slug;
  }
  return JSON.stringify(lock, null, 2) + "\n";
});

// 2. vite.config.ts (PWA manifest)
replaceInFile("vite.config.ts", (s) =>
  s
    .replace(/name:\s*"Solid PWA Kit"/g, `name: ${JSON.stringify(displayName)}`)
    .replace(/short_name:\s*"SolidPWA"/g, `short_name: ${JSON.stringify(shortName)}`)
);

// 3. src/Document.tsx
replaceInFile("src/Document.tsx", (s) =>
  s
    .replace(/content="SolidPWA"/g, `content=${JSON.stringify(shortName)}`)
    .replace(/Solid PWA Kit/g, displayName)
);

// 4. src/App.tsx
replaceInFile("src/App.tsx", (s) =>
  s
    .replace(/>Solid PWA</g, `>${displayName}<`)
    .replace(/Solid PWA Kit/g, displayName)
);

// 5. localStorage prefixes
for (const file of [
  "src/auth/auth-context.tsx",
  "src/components/Counter.tsx",
  "src/theme/theme-context.tsx",
]) {
  replaceInFile(file, (s) => s.replaceAll("solid-pwa-kit:", `${slug}:`));
}

// 6. Routes & README
const routeFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) routeFiles.push(p);
  }
}
walk("src/routes");

for (const file of routeFiles) {
  replaceInFile(file, (s) => s.replace(/Solid PWA Kit/g, displayName));
}

replaceInFile("README.md", (s) => s.replace(/^# Solid PWA Kit/m, `# ${displayName}`));
' "$SLUG" "$DISPLAY_NAME" "$SHORT_NAME"

echo ""
echo "Done! Next steps you may want to run:"
echo "  - Replace icons in public/ and src/logo.svg"
echo "  - Update repository links in src/routes/index.tsx and README.md"
echo "  - Reset git history if starting fresh: rm -rf .git && git init"
