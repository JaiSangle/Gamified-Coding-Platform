# Gamified Learning Platform

A full-stack web application for learning programming through gamified challenges.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/          # Express.js backend application
├── init-repo.sh      # Repository initialization script
└── README.md         # Project documentation
```

## Prerequisites

- Git installed on your system
- GitHub account with a new repository created
- Node.js (v18 or higher)
- MongoDB

## Getting Started

### 1. Initialize the Repository

First, create a new repository on GitHub. Then, run the initialization script:

```bash
# Make the script executable
chmod +x init-repo.sh

# Run the script with your GitHub repository URL
./init-repo.sh https://github.com/yourusername/gamified-learning-platform.git
```

The script will:
- Initialize a Git repository
- Create a comprehensive .gitignore file
- Add all project files
- Create an initial commit
- Push to the remote repository

### 2. Handle Merge Conflicts

If the script detects merge conflicts, you'll need to resolve them manually:

1. Open the conflicted files
2. Look for conflict markers (<<<<<<, =======, >>>>>>>)
3. Choose the correct version or combine them
4. Save the files
5. Run the following commands:
   ```bash
   git add .
   git commit -m "Resolve merge conflicts"
   git push -u origin main
   ```

### 3. Environment Setup

1. Backend Setup:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm install
   ```

### 4. Development

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Features

- Interactive coding challenges
- Real-time code evaluation
- Gamification system with points and badges
- User progress tracking
- Leaderboard system
- AI-powered hints

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

ISC 