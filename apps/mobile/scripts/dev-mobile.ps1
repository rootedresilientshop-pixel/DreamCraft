param(
  [switch]$Clean,
  [switch]$NoStart
)

# Ensure nvm environment and Node 20.19.4 are active for this session
$env:NVM_HOME = "C:\Users\gardn\AppData\Local\nvm"
$env:NVM_SYMLINK = "C:\nvm4w\nodejs"
if (-not (Test-Path $env:NVM_SYMLINK)) { New-Item -ItemType Directory -Path $env:NVM_SYMLINK -Force | Out-Null }
$env:PATH = "C:\nvm4w\nodejs;" + $env:PATH

& "$env:NVM_HOME\nvm.exe" use 20.19.4 | Out-Null

# Re-prepend symlink path to ensure newly selected Node is first on PATH
$env:PATH = "C:\nvm4w\nodejs;" + $env:PATH

# Verify toolchain using absolute paths to avoid PATH flakiness
$nodeExe = Join-Path $env:NVM_SYMLINK "node.exe"
$npmCmd  = Join-Path $env:NVM_SYMLINK "npm.cmd"
$npxCmd  = Join-Path $env:NVM_SYMLINK "npx.cmd"

$nodeVer = ""
if (Test-Path $nodeExe) { $nodeVer = & $nodeExe --version }
Write-Host "Node: $nodeVer | npm: $(& $npmCmd --version) | npx: $(& $npxCmd --version)"

# Always work from project root
Set-Location "$PSScriptRoot\..\"

if ($Clean) {
  Write-Host "Cleaning node_modules, lockfile, and caches..."
  cmd /c rmdir /s /q node_modules 2>$null
  if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
  Remove-Item -Recurse -Force .expo, "node_modules\.cache" -ErrorAction SilentlyContinue
}

# Install deps (respect .npmrc legacy-peer-deps)
Write-Host "Installing dependencies..."
& $npmCmd install

if (-not $NoStart) {
  # Start Expo with a clean cache (no --verbose flag)
  $env:DEBUG='*'
  Write-Host "Starting Expo with --clear..."
  # Run diagnostics optionally, then reset location to root to avoid path changes
  try { & $npxCmd expo diagnostics } catch { }
  Set-Location "$PSScriptRoot\..\"
  & $npxCmd expo start --clear
}
