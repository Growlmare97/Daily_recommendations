import { Destination, Preference, RouteOption } from '../types';

const valueScore = (route: RouteOption) => route.price + route.durationMinutes * 0.12 + route.transfers * 15;

export function sortRoutes(routes: RouteOption[], preference: Preference): RouteOption[] {
  const sorted = [...routes];
  sorted.sort((a, b) => {
    if (preference === 'fastest') return a.durationMinutes - b.durationMinutes;
    if (preference === 'best-value') return valueScore(a) - valueScore(b);
    if (a.price !== b.price) return a.price - b.price;
    if (a.durationMinutes !== b.durationMinutes) return a.durationMinutes - b.durationMinutes;
    return a.transfers - b.transfers;
  });
  return sorted;
}

export function chooseRecommendation(candidates: { destination: Destination; routes: RouteOption[] }[]) {
  const withBest = candidates
    .map((entry) => ({ ...entry, bestRoute: sortRoutes(entry.routes, 'cheapest')[0] }))
    .sort((a, b) => {
      if (a.bestRoute.price !== b.bestRoute.price) return a.bestRoute.price - b.bestRoute.price;
      if (a.bestRoute.durationMinutes !== b.bestRoute.durationMinutes) return a.bestRoute.durationMinutes - b.bestRoute.durationMinutes;
      return a.bestRoute.transfers - b.bestRoute.transfers;
    });
  return withBest[0];
}

export function whyThisPick(route: RouteOption) {
  return `Chosen because it offers the lowest fare (€${route.price}), with ${Math.floor(route.durationMinutes / 60)}h ${route.durationMinutes % 60}m travel time and ${route.transfers} transfer(s).`;
}
