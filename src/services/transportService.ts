import rawRoutes from '../data/mockRoutes.json';
import { destinations } from '../data/destinations';
import { AppSettings, Destination, RouteOption, SearchParams, TransportMode } from '../types';

const routeCache = new Map<string, RouteOption[]>();
const allRoutes = rawRoutes as RouteOption[];

const cacheKey = (from: string, to: string, modes: TransportMode[]) => `${from}-${to}-${modes.sort().join(',')}`;

export async function getRoutes(from: string, to: string, modes: TransportMode[], settings: AppSettings): Promise<RouteOption[]> {
  const key = cacheKey(from, to, modes);
  if (routeCache.has(key)) return routeCache.get(key)!;

  if (!settings.useMockData) {
    // Real provider slot (intentionally simple): swap this with API integration later.
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  const data = allRoutes.filter((route) => route.from === from && route.to === to && modes.includes(route.mode));
  routeCache.set(key, data);
  return data;
}

export function listDestinations(): Destination[] {
  return destinations;
}

export async function candidateRoutes(search: SearchParams, settings: AppSettings) {
  const candidates = destinations.filter((dest) => dest.city !== search.from);
  const results = await Promise.all(
    candidates.map(async (dest) => {
      const routes = await getRoutes(search.from, dest.city, search.modes, settings);
      return { destination: dest, routes };
    })
  );
  return results.filter((item) => item.routes.length > 0);
}
