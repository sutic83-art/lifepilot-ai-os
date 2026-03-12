#!/usr/bin/env bash
set -e

echo "== LifePilot AI macOS/Linux installer =="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nije instaliran. Instaliraj LTS sa https://nodejs.org"
  exit 1
fi

if [ ! -f package.json ]; then
  echo "Pokreni skriptu iz root foldera LifePilot AI web aplikacije."
  exit 1
fi

echo "Node: $(node -v)"
echo "npm: $(npm -v)"

echo "Instaliram pakete..."
npm install

if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo ".env je kreiran iz .env.example"
fi

if [ -f prisma/schema.prisma ]; then
  echo "Pokrecem Prisma generate..."
  npx prisma generate
fi

echo "Pokrecem aplikaciju..."
npm run dev
