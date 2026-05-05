# TeamSync - Role-Based Task Management System

TeamSync is a production-ready, full-stack task management platform built to handle complex workflows with Role-Based Access Control (RBAC). 

## Features
- **Secure Authentication**: JWT-based auth with strict `Admin` and `Member` access boundaries.
- **Project & Task Delegation**: Admins create projects and issue tasks; Members update their progress.
- **Dynamic Dashboard**: Real-time aggregated metrics on task distribution and overdue logic tracking.
- **Premium UI**: Glassmorphism aesthetic built with Tailwind CSS.

## Tech Stack
- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Zod, bcrypt, jsonwebtoken
- **Deployment Strategy**: Railway (Monorepo configuration)

## Local Setup

### 1. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
PORT=5000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 2. Installation
Run the following from the root directory to install both backend and frontend dependencies:
```bash
npm run postinstall
```

### 3. Running Locally
Start the backend server:
```bash
cd backend && npm start
```
Start the frontend development server:
```bash
cd frontend && npm run dev
```

## API Endpoint Reference

### Auth
- `POST /api/auth/signup`: Create a new account.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/auth/me`: Validate the current session token.

### Projects (Requires Admin Role)
- `POST /api/projects`: Generate a new project.
- `GET /api/projects`: Fetch all system projects.

### Tasks
- `POST /api/tasks`: Issue a task (Admin only).
- `GET /api/tasks`: Retrieve tasks (Admins see all; Members see assigned).
- `PATCH /api/tasks/:taskId/status`: Modify task status (Todo, In-Progress, Done).

### Dashboard
- `GET /api/dashboard/metrics`: Get aggregated stats and overdue counts.
