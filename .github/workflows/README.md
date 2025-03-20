# GitHub Release Automation

This directory contains GitHub Actions workflows for automating the release process.

## Workflows

### 1. Create Release (`create-release.yml`)

This workflow creates a new release with a semantic version tag, generates automated release notes, creates a release branch, and opens PRs to both develop and master branches.

**How to use:**
1. Go to Actions > Create Release > Run workflow
2. Enter the version number (e.g., `1.0.0`)
3. Select the release type (production or pre-release)
4. Click "Run workflow"

The workflow will:
- Create a release branch named `release/v{version}`
- Add a dummy commit for testing
- Create a semver tag `v{version}`
- Create a GitHub release with automated release notes
- Open PRs to merge the release branch into develop and master

### 2. Merge Release to Master (`merge-release-to-master.yml`)

This workflow automatically finds release PRs targeting the master branch and merges them.

**How to use:**
- Automatically runs every hour
- Can also be manually triggered via Actions > Merge Release to Master > Run workflow

### 3. Merge Release to Develop (`merge-release-to-develop.yml`)

This workflow automatically finds release PRs targeting the develop branch and merges them.

**How to use:**
- Automatically runs every hour
- Can also be manually triggered via Actions > Merge Release to Develop > Run workflow

## Testing the Release Process

To test the complete release process:

1. Run the setup script from the root directory: `./setup-branches.ps1`
2. Run the "Create Release" workflow
3. Once complete, manually run both merge workflows to merge the release PRs

## Requirements

- The repository needs both `develop` and `master` branches
- GitHub Actions needs permission to create branches, PRs, and releases
- The `GITHUB_TOKEN` is used for all operations

## Implementation Details

These workflows are implemented using GitHub Actions and shell scripts:
- The Create Release workflow uses the `softprops/action-gh-release` action to generate automated release notes
- All workflows use standard GitHub Actions features and bash shell commands
- The GitHub CLI (`gh`) is used for creating PRs and merging them
- All workflows run on Ubuntu runners 