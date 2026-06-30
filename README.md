# DevFlow

DevFlow is a project workspace for developers who want tasks, notes, prompts, useful links, focus sessions, and calendar-aware planning in one place. It is built around projects: each project gets its own dashboard, Kanban board, markdown notes, prompt library, resource list, Pomodoro timer, and settings.

## What It Is Used For

Use DevFlow to:

- Plan and track work on a Kanban board.
- Create, preview, edit, reorder, and delete project tasks.
- Set task due dates and deadline times.
- Store project notes in markdown.
- Save reusable prompts for coding, debugging, documentation, and planning.
- Keep important links and technical references close to the project.
- Run Pomodoro focus sessions and track completed sessions.
- View project progress from a dashboard.
- Connect Google Calendar if you want calendar integration.

## Tech Stack

Frontend:

- React
- Vite
- Zustand
- Tailwind CSS
- Lucide React
- Motion
- dnd-kit

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Zod validation

## Project Structure

```text
devflow/
|-- backend/          Express API, MongoDB models, routes, services, and storage
|-- frontend/         React and Vite frontend app
|-- design_template/  Reference design files
|-- package.json      Root workspace scripts
`-- README.md         Setup and usage guide
```

## Requirements

Install these before setting up the project:

- Node.js 18 or newer
- npm
- MongoDB, either installed locally or available through a MongoDB connection string

Optional:

- Google Cloud OAuth credentials, only needed for Google Calendar integration

## Setup

1. Clone or download the project.

2. Open a terminal in the project root:

   ```bash
   cd devflow
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create environment files:

   On Windows PowerShell:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   Copy-Item frontend\.env.example frontend\.env
   ```

   On macOS or Linux:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

5. Check the backend environment file at `backend/.env`.

   The default local values are enough for development if MongoDB is running locally:

   ```env
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/devflow
   AUTH_DISABLED=true
   ```

   For a real login setup, set `AUTH_DISABLED=false` and replace the JWT secrets with strong private values.

6. Check the frontend environment file at `frontend/.env`.

   The default local values are:

   ```env
   VITE_API_URL=/api
   VITE_DEV_SERVER_HOST=127.0.0.1
   VITE_DEV_SERVER_PORT=5173
   VITE_DEV_PROXY_TARGET=http://127.0.0.1:4000
   VITE_APP_NAME=DevFlow
   VITE_AUTH_ENABLED=false
   ```

7. Start MongoDB.

   If you installed MongoDB locally, make sure the MongoDB service is running. If you use MongoDB Atlas or another hosted database, update `MONGODB_URI` in `backend/.env`.

8. Start the app:

   ```bash
   npm run dev
   ```

   This starts both the backend API and the frontend dev server.

9. Open the frontend in your browser:

   ```text
   http://127.0.0.1:5173
   ```

   If that port is already in use, Vite may choose another port. Check the terminal output for the exact URL.

## Available Scripts

Run these from the project root:

```bash
npm run dev
```

Starts the backend and frontend together.

```bash
npm run build
```

Builds the frontend and checks the backend build script.

```bash
npm run check
```

Runs backend checks and a frontend production build.

```bash
npm run start
```

Starts the backend server.

Backend-only helper:

```bash
npm run free-port --workspace backend
```

Frees port `4000` if another backend process is already using it.

## API and Local URLs

Default local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:4000`
- API base path: `/api`
- Health check: `http://127.0.0.1:4000/health`

Main API areas:

- `/api/auth`
- `/api/projects`
- `/api/tasks`
- `/api/prompts`
- `/api/notes`
- `/api/resources`
- `/api/pomodoro`
- `/api/calendar`
- `/api/search`
- `/api/dashboard`

## How To Use The App

1. Create or select a project.
2. Use the dashboard to see task progress and project activity.
3. Open the Kanban board to create tasks, preview task details, edit tasks, set due dates and deadline times, delete tasks with confirmation, and drag tasks between columns.
4. Use Notes for markdown project documentation.
5. Use Prompts to save reusable AI or development prompts.
6. Use Links to collect references, documentation, and useful URLs.
7. Use Pomodoro to run focus sessions tied to the current project.
8. Use Calendar to schedule tasks on a weekly time grid. Tasks at the same day and time are displayed side by side so they remain readable.
9. Configure Google OAuth credentials if you want Google Calendar sync.

## Google Calendar Setup

Calendar integration is optional.

To enable it:

1. Create OAuth credentials in Google Cloud.
2. Add the credentials to `backend/.env`:

   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://127.0.0.1:4000/api/calendar/oauth/callback
   ```

3. Make sure the same redirect URI is registered in Google Cloud.
4. Restart the backend.

## Troubleshooting

If the backend fails to start:

- Make sure MongoDB is running.
- Confirm `MONGODB_URI` is correct.
- Check whether port `4000` is already in use.

If the frontend cannot reach the API:

- Confirm the backend is running on `http://127.0.0.1:4000`.
- Confirm `VITE_DEV_PROXY_TARGET` points to the backend URL.
- Restart the frontend after changing `frontend/.env`.

If login/auth behavior is confusing during local development:

- Keep `AUTH_DISABLED=true` in `backend/.env`.
- Keep `VITE_AUTH_ENABLED=false` in `frontend/.env`.

If you change environment files:

- Stop and restart `npm run dev`.

## Production Notes

Before deploying:

- Set strong JWT secrets.
- Set `AUTH_DISABLED=false`.
- Use a production MongoDB connection string.
- Configure trusted CORS origins in `CLIENT_URL`.
- Configure real Google OAuth credentials if Calendar is enabled.
- Build and verify the app with `npm run check`.
