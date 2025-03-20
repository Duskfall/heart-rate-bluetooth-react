# Log heart rate from bluetooth heart rate monitors

A rudamentary example of using [Noble](https://github.com/sandeepmistry/noble) to listen to heart rate data heart rate sensors.
This project is implemented by using the backend along with a Websocket server to transmit the data it receives to a boilerplate react
application. 

## How to use this

- [Install node](https://nodejs.org/en/download/)
- Clone this repo
- In the root directory, run `npm install` to install noble
- While wearing the heart rate monitor, run `npm run start`
- Go to my-app directory
- Run `npm install`
- Run `npm run start`
- After a few seconds, you should see heart rate data logged in the website that is opened in the browser

## Notes
This _should_ function with all bluetooth heart rate sensors that broadcast the 180d service.

## Todo
Add redis for preserving heart rate monitor data across the application. This also will help when using 
multiple interfaces ( currently in Linux only ) which use the same script. This is because of the limitation of the bluetooth
adapter to 7-12 maximum connections. See more details here: https://github.com/sandeepmistry/noble#multiple-adapters


## Many thanks to
https://github.com/jakelear for helping me understand the process. It was a great start.

## Release Process

This repository includes automated GitHub Actions workflows for managing releases:

### Creating a Release

1. Go to GitHub Actions > Create Release > Run workflow
2. Enter the version number (e.g., `1.0.0`)
3. Select the release type (production or pre-release)
4. Click "Run workflow"

The workflow will:
- Create a release branch
- Generate a semantic version tag
- Create a GitHub release with automated release notes
- Open PRs to merge the release branch into develop and master

### Setting Up for Development

To set up the required branches for the release workflow, run:

```powershell
./setup-branches.ps1
```

This script will create the `master` and `develop` branches if they don't already exist, and add a test file for release testing.

See `.github/workflows/README.md` for more details on the automated release process.
