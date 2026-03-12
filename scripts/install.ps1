Write-Host "== LifePilot AI Windows installer ==" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js nije instaliran. Instaliraj LTS sa https://nodejs.org" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "package.json")) {
  Write-Host "Pokreni skriptu iz root foldera LifePilot AI web aplikacije." -ForegroundColor Red
  exit 1
}

Write-Host "Proveravam Node i npm..." -ForegroundColor Yellow
node -v
npm -v

Write-Host "Instaliram pakete..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ((Test-Path ".env.example") -and (-not (Test-Path ".env"))) {
  Copy-Item ".env.example" ".env"
  Write-Host ".env je kreiran iz .env.example" -ForegroundColor Green
}

if (Test-Path "prisma\schema.prisma") {
  Write-Host "Pokrecem Prisma generate..." -ForegroundColor Yellow
  npx prisma generate
}

Write-Host "Pokrecem aplikaciju..." -ForegroundColor Green
npm run dev
