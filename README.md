# EuroHop

EuroHop is a multi-page React + TypeScript + Vite app for finding cheap European getaways by flight/train/bus and exploring destination mobility options.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Build production bundle:
   ```bash
   npm run build
   ```

## Routes

- `/` Home (search + recommendation input)
- `/recommendation` Best destination result
- `/transport/:from/:to` Route listings with tabs, sorting, filters
- `/explore` Destination browsing filters
- `/destination/:city` Destination details
- `/saved` Saved trips (localStorage)
- `/settings` Settings and data-mode toggle

## Recommendation logic

1. Collect candidate destinations from local data.
2. Fetch all routes from selected departure city for enabled transport modes.
3. Compute cheapest route per destination.
4. Pick top destination by lowest price; tie-break by duration then transfers.
5. Explain result via `whyThisPick` breakdown.

Stay-duration heuristic:

- 0–5 attractions: 1–2 days
- 6–12: 3–4 days
- 13+: 5–7 days
- +1 day if travel time > 6h
- +1 day if transfers > 1

## Data providers and mock mode

- Mock source: `src/data/mockRoutes.json`
- Destination metadata: `src/data/destinations.ts`
- Transport service abstraction: `src/services/transportService.ts`

`Settings` includes `Use mock data` toggle. Real providers can be added by replacing the placeholder block in `getRoutes` with API clients.

## Add a new data provider

1. Create a provider client in `src/services/` (e.g., `amadeusProvider.ts`).
2. Normalize output to `RouteOption` shape (`src/types/index.ts`).
3. Call provider in `getRoutes` when `useMockData` is false.
4. Keep mock fallback for offline / rate-limit resilience.
