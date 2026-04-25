#!/bin/bash

# ClearPaste Mac Build Script
# This script builds the Electron app for macOS

echo "Starting ClearPaste build process for macOS..."

# Install dependencies if needed
echo "Installing dependencies..."
yarn install

# Build the Vite project
echo "Building web assets..."
yarn build

# Package the application for macOS
echo "Packaging .app and .dmg..."
yarn dist --mac

echo "Build complete! You can find your ClearPaste.app in the 'dist' folder."
