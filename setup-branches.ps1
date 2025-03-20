# Script to set up the required branches for the release workflow

# Check if .git directory exists (if this is a git repository)
if (-not (Test-Path ".git")) {
    Write-Host "This directory is not a Git repository. Initializing Git..."
    git init
    git add .
    git commit -m "Initial commit"
}

# Find the default branch
$defaultBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $defaultBranch"

# Check if master branch exists, create if not
$masterExists = git branch --list master
if (-not $masterExists) {
    Write-Host "Creating 'master' branch..."
    git branch master
    Write-Host "Branch 'master' created."
} else {
    Write-Host "Branch 'master' already exists."
}

# Check if develop branch exists, create if not
$developExists = git branch --list develop
if (-not $developExists) {
    Write-Host "Creating 'develop' branch..."
    git branch develop
    Write-Host "Branch 'develop' created."
} else {
    Write-Host "Branch 'develop' already exists."
}

# Creating a dummy commit for testing
Write-Host "Creating a dummy commit for testing..."
if (-not (Test-Path "test-release.md")) {
    "# Test Release" | Out-File -FilePath "test-release.md" -Encoding utf8
    git add "test-release.md"
    git commit -m "chore: add test file for release workflow"
    git push origin $defaultBranch
    
    # Push branches if they're not already pushed
    git push origin master
    git push origin develop
    
    Write-Host "Test file created and pushed to all branches."
} else {
    Write-Host "Test file already exists."
}

Write-Host "Repository is now set up for release workflow testing."
Write-Host "You can now go to GitHub Actions and run the 'Create Release' workflow." 