Write-Host "🔍 Scanning project for ALL package.json files..." -ForegroundColor Cyan

# Store all package.json files
$allPacks = Get-ChildItem -Recurse -Filter package.json | Select-Object FullName

Write-Host "`n📄 Found the following package.json files:`n" -ForegroundColor Yellow
$allPacks | ForEach-Object { Write-Host $_.FullName }

# Path to keep
$keep = (Resolve-Path "./frontend/package.json").Path

Write-Host "`n✔ Keeping ONLY this package.json:`n$keep" -ForegroundColor Green

# Delete all others
foreach ($file in $allPacks) {
    if ($file.FullName -ne $keep) {
        Write-Host "🗑️ Deleting extra package.json: $($file.FullName)" -ForegroundColor Red
        Remove-Item -Force $file.FullName
    }
}

Write-Host "`n🧹 Cleaning node_modules and package-lock.json..." -ForegroundColor Cyan

# Delete node_modules + lock file
if (Test-Path "./frontend/node_modules") {
    Remove-Item -Recurse -Force "./frontend/node_modules"
}

if (Test-Path "./frontend/package-lock.json") {
    Remove-Item -Force "./frontend/package-lock.json"
}

Write-Host "`n📦 Installing clean dependencies..." -ForegroundColor Cyan

# Install fresh packages
Set-Location "./frontend"
npm install

Write-Host "`n📦 Installing correct drag-and-drop package..." -ForegroundColor Cyan
npm install @hello-pangea/dnd@13.1.1

Write-Host "`n🚀 Starting your React frontend..." -ForegroundColor Green
npm start
