# VentureLab Mobile Dev Server Launcher
cd "C:\Users\gardn\VentureLab\apps\mobile"
Write-Host "Starting Expo Dev Server for VentureLab Mobile..." -ForegroundColor Green
Write-Host "Keep this terminal open while testing!" -ForegroundColor Yellow
Write-Host ""
Write-Host "When the QR code appears:" -ForegroundColor Cyan
Write-Host "  iPhone: Open Camera app -> Scan QR code -> Tap notification" -ForegroundColor Gray
Write-Host "  Android: Open Expo Go app -> Scan QR code" -ForegroundColor Gray
Write-Host ""
npm start
