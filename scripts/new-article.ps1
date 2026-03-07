param(
  [Parameter(Mandatory = $true)]
  [string]$Title
)

$root = Split-Path -Parent $PSScriptRoot
$articlesDir = Join-Path $root "content/articles"
$templatePath = Join-Path $articlesDir "_articleTemplate.md"

if (-not (Test-Path $templatePath)) {
  Write-Error "Template file not found: $templatePath"
  exit 1
}

$slug = $Title.ToLowerInvariant() -replace "[^a-z0-9]+", "-"
$slug = $slug.Trim("-")
if ([string]::IsNullOrWhiteSpace($slug)) {
  Write-Error "Could not generate a valid filename from title: $Title"
  exit 1
}

$date = Get-Date -Format "yyyy-MM-dd"
$fileName = "$date-$slug.md"
$outputPath = Join-Path $articlesDir $fileName

if (Test-Path $outputPath) {
  Write-Error "Article already exists: $outputPath"
  exit 1
}

$content = Get-Content -Raw $templatePath
$escapedTitle = $Title.Replace('"', '\"')
$content = $content -replace 'title:\s*"[^"]*"', ('title: "' + $escapedTitle + '"')
$content = $content -replace 'date:\s*\d{4}-\d{2}-\d{2}', ('date: ' + $date)
$content = $content -replace 'summary:\s*"[^"]*"', 'summary: "Write a short summary for this article."'

[System.IO.File]::WriteAllText($outputPath, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Created article: $outputPath"
