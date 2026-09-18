# Liberty Books Clone

A responsive React storefront demo with original placeholder content and a small Express API foundation.

## Run locally

```bash
npm install --prefix frontend
npm install --prefix backend
npm run dev
```

The storefront runs at `http://localhost:5173` and the API health endpoint runs at `http://localhost:5000/api/health`.

The frontend currently uses local mock data so it is fully browsable without MongoDB. The backend is ready for the catalog and auth routes to be expanded as the client data model is finalized.