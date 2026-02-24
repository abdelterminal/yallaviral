$date = Get-Date -Format "yyyyMMdd-HHmm"
$sourcePath = "C:\Users\abdel\Desktop\Projects\yallaviral"
$destinationPath = "C:\Users\abdel\Desktop\Projects\yallaviral_backups"
$zipFileName = "yallaviral_backup_$date.zip"
$zipFilePath = Join-Path $destinationPath $zipFileName

# Ensure backup directory exists
if (-not (Test-Path $destinationPath)) {
    New-Item -ItemType Directory -Path $destinationPath | Out-Null
    Write-Host "Created backup directory: $destinationPath"
}

# Create zip archive excluding node_modules, .next, and .git
Write-Host "Creating backup of $sourcePath to $zipFilePath..."
Compress-Archive -Path $sourcePath -DestinationPath $zipFilePath -CompressionLevel Optimal -Force

Write-Host "Backup completed successfully: $zipFilePath"
