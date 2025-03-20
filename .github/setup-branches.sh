#!/bin/bash

# Script to set up the required branches for the release workflow

# Check if .git directory exists (if this is a git repository)
if [ ! -d ".git" ]; then
    echo "This directory is not a Git repository. Initializing Git..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Find the default branch
DEFAULT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $DEFAULT_BRANCH"

# Check if master branch exists, create if not
MASTER_EXISTS=$(git branch --list master)
if [ -z "$MASTER_EXISTS" ]; then
    echo "Creating 'master' branch..."
    git branch master
    echo "Branch 'master' created."
else
    echo "Branch 'master' already exists."
fi

# Check if develop branch exists, create if not
DEVELOP_EXISTS=$(git branch --list develop)
if [ -z "$DEVELOP_EXISTS" ]; then
    echo "Creating 'develop' branch..."
    git branch develop
    echo "Branch 'develop' created."
else
    echo "Branch 'develop' already exists."
fi

# Creating a dummy commit for testing
echo "Creating a dummy commit for testing..."
if [ ! -f "test-release.md" ]; then
    echo "# Test Release" > test-release.md
    git add test-release.md
    git commit -m "chore: add test file for release workflow"
    git push origin $DEFAULT_BRANCH
    
    # Push branches if they're not already pushed
    git push origin master
    git push origin develop
    
    echo "Test file created and pushed to all branches."
else
    echo "Test file already exists."
fi

echo "Repository is now set up for release workflow testing."
echo "You can now go to GitHub Actions and run the 'Create Release' workflow." 