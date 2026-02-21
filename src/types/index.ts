export type TransportMode = 'flight' | 'train' | 'bus';
export type Preference = 'cheapest' | 'fastest' | 'best-value';

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

export interface AppSettings {
  currency: 'EUR' | 'USD';
  defaultDepartureCity: string;
  defaultModes: TransportMode[];
  useMockData: boolean;
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
