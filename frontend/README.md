# Frontend (React + Tailwind)

A minimal Vite + React + Tailwind UI for selecting cities and listing routes.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app

## Setup

1. Start the backend API on port 5000.
2. Install frontend deps and run dev server:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173).

The UI loads cities from `/api/cities` and falls back to deriving them from `/api/routes` if needed. Route search calls `/api/routes/by-cities?from=..&to=..`.
