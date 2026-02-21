export type TransportMode = 'flight' | 'train' | 'bus';
export type Preference = 'cheapest' | 'fastest' | 'best-value';
export type DataProvider = 'mock' | 'skyscanner';

export interface City {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  vibe: string;
}

export interface RouteOption {
  id: string;
  from: string;
  to: string;
  mode: TransportMode;
  operator: string;
  price: number;
  durationMinutes: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  bookingUrl: string;
  source: DataProvider;
}

export interface Destination {
  city: string;
  country: string;
  description: string;
  attractions: Record<string, string[]>;
}

export interface SearchParams {
  from: string;
  startDate: string;
  endDate: string;
  modes: TransportMode[];
  preference: Preference;
}

export interface TransportFilters {
  maxTransfers: number;
  maxDurationHours: number;
  departureWindow: 'any' | 'morning' | 'afternoon' | 'evening';
}

export interface AppSettings {
  currency: 'EUR' | 'USD';
  defaultDepartureCity: string;
  defaultModes: TransportMode[];
  useMockData: boolean;
  provider: DataProvider;
}

export interface SavedTrip {
  id: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  route: RouteOption;
  note?: string;
}

export interface TransportProvider {
  name: DataProvider;
  searchRoutes: (from: string, to: string, modes: TransportMode[], startDate: string, endDate: string) => Promise<RouteOption[]>;
}
