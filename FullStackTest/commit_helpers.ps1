# Helper Functions for Frequent Commits
# Usage: . ./commit_helpers.ps1

function gbranch([string]$name) {
    if (-not $name) { Write-Host "Usage: gbranch <branch-name>" -ForegroundColor Red; return }
    git checkout -b $name
}

function gcam([string]$msg) {
    if (-not $msg) { Write-Host "Usage: gcam <commit-message>" -ForegroundColor Red; return }
    git add -A
    git commit -m $msg
}

function gpush([string]$remote="origin", [string]$branch="") {
    if (-not $branch) { $branch = git rev-parse --abbrev-ref HEAD }
    git push -u $remote $branch
}

function gflow([string]$branch, [string]$msg) {
    if (-not $branch -or -not $msg) { Write-Host "Usage: gflow <branch-name> <commit-message>" -ForegroundColor Red; return }
    gbranch $branch
    gcam $msg
    gpush
}

Write-Host "Git Helper Functions Loaded!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  gbranch <name>       : Create and checkout a new branch"
Write-Host "  gcam <msg>           : Add all files and commit"
Write-Host "  gpush [remote] [br]  : Push to remote (default origin current-branch)"
Write-Host "  gflow <br> <msg>     : Create branch, commit, and push in one go"
