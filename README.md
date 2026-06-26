# DevFlow

DevFlow is a project-centered developer workspace designed to help individuals and small teams manage work, capture ideas, and stay focused without switching between a dozen disconnected tools. It combines task management, notes, prompts, links, Pomodoro tracking, and calendar integration in a single experience.

## What DevFlow does

DevFlow gives each project its own workspace with:

- A Kanban-style task board for planning and tracking work
- A dashboard that surfaces task progress, recent activity, and quick actions
- Markdown-based notes stored per project for technical documentation and ideas
- Prompt libraries for reusable AI or development prompts
- Resource collections for useful links, references, and documentation
- Pomodoro sessions for focused work intervals
- Google Calendar connectivity for task and schedule awareness

## Core product areas

- Dashboard: overview of a project at a glance
- Kanban: task creation, updates, status changes, and priority handling
- Notes: project-specific markdown notes with tag and file-style organization
- Prompts: reusable prompt templates for recurring workflows
- Links: curated project resources and reference URLs
- Pomodoro: session tracking tied to a selected project
- Calendar: Google Calendar authorization and integration hooks
- Settings: project configuration and lifecycle actions

## Tech stack

### Frontend
- React
- Vite
- Zustand for state management
- Tailwind CSS
- Motion and Lucide React for UI interaction
- React Router for navigation

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT-based authentication
- Zod for request validation
- Helmet, CORS, and rate limiting for API hardening

## Repository structure

```text
devflow/
├── backend/               # Express API, MongoDB models, services, and routes
├── frontend/              # React/Vite application shell and feature modules
├── design_template/       # Reference design assets and UI template (not part of the app runtime)
└── README.md              # Project overview and setup guide
```

## Prerequisites

Before running DevFlow locally, make sure you have:

- Node.js 18+ and npm
- MongoDB running locally or a reachable MongoDB URI
- Optional: a Google Cloud project for Calendar OAuth integration

## Getting started

1. Clone the repository and change into the project directory.
2. Install dependencies from the root workspace:

   ```bash
   npm install
   ```

3. Create environment files from the provided examples:

   ```bash
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env
   ```

4. Update the environment variables in the new files.
   - The backend uses values such as MongoDB connection details, JWT secrets, and optional Google OAuth credentials.
   - The frontend uses Vite-prefixed values such as VITE_API_URL and VITE_AUTH_ENABLED.

5. Start MongoDB locally if you are not using an external instance.

6. Launch the development environment:

   ```bash
   npm run dev
   ```

   This starts the backend API and the frontend dev server together.

## Environment configuration

### Backend
The backend reads variables from [backend/.env.example](backend/.env.example). The most important ones are:

- PORT: API port, default 4000
- NODE_ENV: development or production
- MONGODB_URI: MongoDB connection string
- JWT_ACCESS_SECRET and JWT_REFRESH_SECRET: signing keys for auth tokens
- CLIENT_URL: allowed frontend origins for CORS
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI: optional Calendar OAuth settings
- AUTH_DISABLED: convenience flag for local development

### Frontend
The frontend reads variables from [frontend/.env.example](frontend/.env.example). Values must be prefixed with VITE_ to be accessible in browser code.

## Available scripts

From the repository root:

- npm run dev: start backend and frontend together
- npm run build: build the frontend and backend artifacts
- npm run check: run backend syntax checks and frontend build validation
- npm run start: start the backend server

## Local development notes

- The backend exposes a health endpoint at /health.
- The API is mounted under /api and includes routes for auth, projects, tasks, prompts, notes, resources, Pomodoro sessions, calendar integration, search, and dashboard data.
- Notes are stored as markdown files under the backend storage area for each project.
- For local development, auth can be disabled with the backend AUTH_DISABLED flag if you want to test flows without a full login setup.

## Production considerations

Before deploying, review the following:

- Replace placeholder JWT secrets and OAuth credentials with real values.
- Configure trusted CORS origins instead of allowing broad local development defaults.
- Ensure MongoDB is reachable from the deployment environment.
- Use a production-grade reverse proxy or load balancer if exposing the app publicly.

## Contributing

Contributions are welcome. If you make changes, try to keep the app behavior consistent across the frontend and backend and update documentation when user-facing workflows change.

## License

This project is currently distributed as an internal/development workspace. Adjust licensing terms before public distribution or commercial use.
