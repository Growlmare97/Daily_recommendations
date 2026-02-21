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

## What’s new

- **Large city coverage**: 80+ European cities (`src/data/cities.ts`) with generated route options so most city-to-city combinations work in mock mode.
- **Provider architecture**: pluggable providers in `src/services/providers/`.
- **Skyscanner integration scaffold**: `skyscannerProvider.ts` wired via RapidAPI environment variables with automatic mock fallback.
- **Refined UI**: upgraded visual design (glass/gradient cards, better hierarchy, more readable controls).

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

- Cities source: `src/data/cities.ts`
- Mock seed routes: `src/data/mockRoutes.json`
- Destination metadata: `src/data/destinations.ts`
- Service abstraction: `src/services/transportService.ts`
- Providers:
  - `src/services/providers/mockProvider.ts`
  - `src/services/providers/skyscannerProvider.ts`

`Settings` includes provider selection and `Force mock data` toggle.

## Skyscanner API setup

Create `.env` in project root:

```bash
VITE_RAPIDAPI_KEY=your_key_here
# optional override
VITE_SKYSCANNER_HOST=skyscanner89.p.rapidapi.com
```

Then in Settings:

1. Select provider = **Skyscanner**
2. Turn off **Force mock data**

If API limits or parsing fails, EuroHop automatically falls back to mock routes.

## Add a new data provider

1. Create provider client in `src/services/providers/` implementing `TransportProvider`.
2. Normalize output to `RouteOption` shape (`src/types/index.ts`).
3. Register/select provider in `transportService.ts`.
4. Keep mock fallback for resilience.

## Deploy to Netlify

Yes — you can deploy EuroHop to Netlify.

- Build command: `npm run build`
- Publish directory: `dist`

SPA rewrites are included via both `public/_redirects` and `netlify.toml`.
