# Setup MongoDB for Laragon
$ErrorActionPreference = "Stop"

$MongoVersion = "7.0.28"
$Url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$MongoVersion.zip"
$LaragonBin = "D:\laragon\bin\mongodb"
$ZipPath = "$LaragonBin\mongodb.zip"
$DataPath = "D:\laragon\data\mongodb"

Write-Host "Checking directories..."
if (!(Test-Path $LaragonBin)) {
    New-Item -ItemType Directory -Force -Path $LaragonBin | Out-Null
    Write-Host "Created $LaragonBin"
}

if (!(Test-Path $DataPath)) {
    New-Item -ItemType Directory -Force -Path $DataPath | Out-Null
    Write-Host "Created $DataPath"
}

Write-Host "Downloading MongoDB $MongoVersion..."
# Using .NET client to avoid progress bar performance issues in some shells, but Invoke-WebRequest is simpler
Invoke-WebRequest -Uri $Url -OutFile $ZipPath
Write-Host "Download complete."

Write-Host "Extracting MongoDB..."
Expand-Archive -Path $ZipPath -DestinationPath $LaragonBin -Force
Write-Host "Extraction complete."

# Cleanup
Remove-Item $ZipPath -Force

# Rename/Organize if needed (Laragon just picks up folders in bin/mongodb)
# The zip usually extracts to a folder named mongodb-win32-x86_64-windows-7.0.28
# We leave it as is.

Write-Host "MongoDB installed successfully!"
Write-Host "Please restart Laragon or Click 'Menu > MongoDB > Start MongoDB'"
