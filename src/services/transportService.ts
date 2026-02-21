import { cities } from '../data/cities';
import { destinations } from '../data/destinations';
import { AppSettings, Destination, RouteOption, SearchParams, TransportMode } from '../types';
import { mockProvider } from './providers/mockProvider';
import { skyscannerProvider } from './providers/skyscannerProvider';

const routeCache = new Map<string, RouteOption[]>();

const cacheKey = (from: string, to: string, modes: TransportMode[], provider: string) => `${provider}-${from}-${to}-${[...modes].sort().join(',')}`;

const getProvider = (settings: AppSettings) => {
  if (settings.useMockData || settings.provider === 'mock') return mockProvider;
  return skyscannerProvider;
};

export async function getRoutes(from: string, to: string, modes: TransportMode[], settings: AppSettings, startDate = '', endDate = ''): Promise<RouteOption[]> {
  const provider = getProvider(settings);
  const key = cacheKey(from, to, modes, provider.name);
  if (routeCache.has(key)) return routeCache.get(key)!;

  try {
    const providerData = await provider.searchRoutes(from, to, modes, startDate, endDate);
    const fallback = provider.name === 'mock' ? [] : await mockProvider.searchRoutes(from, to, modes, startDate, endDate);
    const merged = [...providerData, ...fallback].filter((route, idx, arr) => idx === arr.findIndex((r) => r.mode === route.mode && r.operator === route.operator && r.price === route.price));
    routeCache.set(key, merged);
    return merged;
  } catch {
    const fallback = await mockProvider.searchRoutes(from, to, modes, startDate, endDate);
    routeCache.set(key, fallback);
    return fallback;
  }
}

export function listDestinations(): Destination[] {
  return destinations;
}

export function listCities() {
  return cities;
}

export async function candidateRoutes(search: SearchParams, settings: AppSettings) {
  const candidates = destinations.filter((dest) => dest.city !== search.from);
  const results = await Promise.all(
    candidates.map(async (dest) => {
      const routes = await getRoutes(search.from, dest.city, search.modes, settings, search.startDate, search.endDate);
      return { destination: dest, routes };
    })
  );
  return results.filter((item) => item.routes.length > 0);
}
