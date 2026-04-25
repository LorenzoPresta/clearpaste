#!/bin/bash

# ClearPaste Release Helper Script
# This script helps bump the version, create a tag, and trigger the GitHub Action

# Exit on any error
set -e

# Ensure we're on the main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Warning: You are currently on branch '$CURRENT_BRANCH'."
    read -p "Do you want to continue creating a release from this branch? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Release cancelled."
        exit 1
    fi
fi

# Ensure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: Your working directory is not clean. Please commit or stash changes before releasing."
    exit 1
fi

# Read current version from package.json
CURRENT_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo "Current version is: v$CURRENT_VERSION"

# Ask for new version
read -p "Enter new version (e.g., 1.0.1, without 'v'): " NEW_VERSION

if [[ -z "$NEW_VERSION" ]]; then
    echo "Version cannot be empty. Aborting."
    exit 1
fi

if [[ "$NEW_VERSION" == v* ]]; then
    echo "Please enter the version without the 'v' prefix. (e.g. 1.0.1)"
    exit 1
fi

echo "Updating package.json to version $NEW_VERSION..."
# Use node to update the version safely without messing up JSON formatting
node -e "let pkg=require('./package.json'); pkg.version='$NEW_VERSION'; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');"

echo "Committing version bump..."
git add package.json
git commit -m "chore: bump version to v$NEW_VERSION"

echo "Creating tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo "Pushing commit and tag to GitHub..."
git push origin "$CURRENT_BRANCH"
git push origin "v$NEW_VERSION"

echo "✅ Release v$NEW_VERSION initiated successfully!"
echo "GitHub Actions will now build and publish the release."
echo "You can monitor the progress at: https://github.com/LorenzoPresta/clearpaste/actions"
