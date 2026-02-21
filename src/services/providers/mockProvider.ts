import rawRoutes from '../../data/mockRoutes.json';
import { cities } from '../../data/cities';
import { RouteOption, TransportMode, TransportProvider } from '../../types';

const explicitRoutes = rawRoutes as RouteOption[];

const toRad = (d: number) => (d * Math.PI) / 180;
const distanceKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
};

const cityByName = (name: string) => cities.find((c) => c.city.toLowerCase() === name.toLowerCase());

const estimateRoute = (from: string, to: string, mode: TransportMode): RouteOption | null => {
  const a = cityByName(from);
  const b = cityByName(to);
  if (!a || !b || from === to) return null;

  const km = distanceKm(a.lat, a.lon, b.lat, b.lon);
  const speeds: Record<TransportMode, number> = { flight: 760, train: 150, bus: 82 };
  const baseFees: Record<TransportMode, number> = { flight: 22, train: 10, bus: 7 };
  const perKm: Record<TransportMode, number> = { flight: 0.12, train: 0.09, bus: 0.06 };
  const operators: Record<TransportMode, string[]> = {
    flight: ['SkyEurope', 'EuroWings Connect', 'AirMetro'],
    train: ['EuroRail', 'InterCity Europe', 'RailJet+'],
    bus: ['FlixBus', 'BlaBus', 'EuroCoach']
  };

  const durationMinutes = Math.max(
    mode === 'flight' ? 55 : mode === 'train' ? 90 : 130,
    Math.round((km / speeds[mode]) * 60 + (mode === 'flight' ? 55 : mode === 'train' ? 35 : 25))
  );
  const transfers = mode === 'flight' ? (km > 1800 ? 1 : 0) : mode === 'train' ? (km > 900 ? 1 : km > 1500 ? 2 : 0) : km > 1200 ? 1 : 0;
  const price = Math.max(19, Math.round(baseFees[mode] + km * perKm[mode] + transfers * 12));
  const depHour = mode === 'flight' ? 8 : mode === 'train' ? 7 : 6;
  const dep = `${String(depHour).padStart(2, '0')}:30`;
  const arrTotal = depHour * 60 + 30 + durationMinutes;
  const arr = `${String(Math.floor((arrTotal % 1440) / 60)).padStart(2, '0')}:${String(arrTotal % 60).padStart(2, '0')}`;

  return {
    id: `gen-${mode}-${from}-${to}`,
    from,
    to,
    mode,
    operator: operators[mode][(from.length + to.length) % operators[mode].length],
    price,
    durationMinutes,
    transfers,
    departureTime: dep,
    arrivalTime: arr,
    bookingUrl: 'https://example.com/book',
    source: 'mock'
  };
};

export const mockProvider: TransportProvider = {
  name: 'mock',
  async searchRoutes(from, to, modes) {
    const seed = explicitRoutes.filter((route) => route.from === from && route.to === to && modes.includes(route.mode));
    const normalizedSeed = seed.map((route) => ({ ...route, source: 'mock' as const }));
    const generated = modes.map((mode) => estimateRoute(from, to, mode)).filter((route): route is RouteOption => Boolean(route));
    const byMode = new Map<TransportMode, RouteOption>();
    [...generated, ...normalizedSeed].forEach((route) => byMode.set(route.mode, route));
    return Array.from(byMode.values());
  }
};
