#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if git is installed
if ! command_exists git; then
    print_message "Git is not installed. Please install Git first." "$RED"
    exit 1
fi

# Check if repository URL is provided
if [ -z "$1" ]; then
    print_message "Please provide the GitHub repository URL as an argument." "$RED"
    print_message "Usage: ./init-repo.sh <repository-url>" "$YELLOW"
    exit 1
fi

REPO_URL=$1

# Initialize git repository
print_message "Initializing Git repository..." "$GREEN"
git init

# Create .gitignore in root directory
print_message "Creating root .gitignore file..." "$GREEN"
cat > .gitignore << EOL
# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOL

# Add all files
print_message "Adding files to Git..." "$GREEN"
git add .

# Create initial commit
print_message "Creating initial commit..." "$GREEN"
git commit -m "Initial commit: Gamified Learning Platform

- Frontend setup with Next.js and TypeScript
- Backend setup with Express and MongoDB
- Environment configuration
- Project structure and dependencies
- Basic components and services"

# Add remote repository
print_message "Adding remote repository..." "$GREEN"
git remote add origin "$REPO_URL"

# Check if main branch exists
if git ls-remote --heads origin main | grep -q main; then
    print_message "Main branch exists remotely. Pulling latest changes..." "$YELLOW"
    git pull origin main --allow-unrelated-histories
    
    # Check for merge conflicts
    if git status | grep -q "both modified"; then
        print_message "Merge conflicts detected. Please resolve them manually." "$RED"
        print_message "After resolving conflicts:" "$YELLOW"
        print_message "1. git add ." "$YELLOW"
        print_message "2. git commit -m 'Resolve merge conflicts'" "$YELLOW"
        print_message "3. git push -u origin main" "$YELLOW"
        exit 1
    fi
fi

# Push to remote repository
print_message "Pushing to remote repository..." "$GREEN"
git push -u origin main

# Verify push
if [ $? -eq 0 ]; then
    print_message "Successfully pushed to GitHub repository!" "$GREEN"
    print_message "Repository URL: $REPO_URL" "$GREEN"
else
    print_message "Failed to push to GitHub repository." "$RED"
    print_message "Please check your repository URL and try again." "$YELLOW"
    exit 1
fi 