# Liberty Books Clone

A responsive React storefront demo with original placeholder content and a small Express API foundation.

## Run locally

```bash
npm install
npm run install:all
npm run dev
```

The storefront runs at `http://localhost:5173` and the API health endpoint runs at `http://localhost:5000/api/health`.

## Vercel layout

- `client/` is the Vite frontend.
- `server/` is the Express API entrypoint at `server/index.js`.
- `vercel.json` routes `/api/*` to the API and serves the Vite build for all other paths.

For a Vercel project, keep the project root at the repository root and add the server environment variables from `server/.env.example` in the Vercel dashboard.

The frontend currently uses local mock data so it is fully browsable without MongoDB. The backend is ready for the catalog and auth routes to be expanded as the client data model is finalized.