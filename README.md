# CampusHive

A campus community app: events, clubs and a shared feed.

- **client/** — React + Vite frontend
- **server/** — Node + Express + MongoDB API (JWT login)

## Run it locally

1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
   npm run dev
   ```
   API runs on http://localhost:5000 (check `/api/health`).

2. **Frontend** (new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```
   App runs on http://localhost:5173. Vite proxies `/api` to the backend.

## Deploy
- Frontend: Netlify (build `npm run build`, publish `dist`, set `VITE_API_URL` to your API URL)
- Backend: Render (root `server`, start `npm start`, add the `.env` values)
