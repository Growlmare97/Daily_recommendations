import { createContext, useContext, useMemo, useState } from 'react';
import { AppSettings, SavedTrip, SearchParams } from '../types';
import { loadLocal, saveLocal } from '../utils/storage';

interface AppState {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  lastSearch?: SearchParams;
  setLastSearch: (search: SearchParams | undefined) => void;
  savedTrips: SavedTrip[];
  saveTrip: (trip: SavedTrip) => void;
  removeTrip: (id: string) => void;
  updateNote: (id: string, note: string) => void;
}

const defaultSettings: AppSettings = {
  currency: 'EUR',
  defaultDepartureCity: 'London',
  defaultModes: ['flight', 'train'],
  useMockData: true,
  provider: 'mock'
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>(() => loadLocal('eurohop-settings', defaultSettings));
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => loadLocal('eurohop-saved', []));
  const [lastSearch, setLastSearch] = useState<SearchParams>();

  const setSettings = (next: AppSettings) => {
    setSettingsState(next);
    saveLocal('eurohop-settings', next);
  };

  const saveTrip = (trip: SavedTrip) => {
    const next = [trip, ...savedTrips.filter((t) => t.id !== trip.id)];
    setSavedTrips(next);
    saveLocal('eurohop-saved', next);
  };

  const removeTrip = (id: string) => {
    const next = savedTrips.filter((trip) => trip.id !== id);
    setSavedTrips(next);
    saveLocal('eurohop-saved', next);
  };

  const updateNote = (id: string, note: string) => {
    const next = savedTrips.map((trip) => (trip.id === id ? { ...trip, note } : trip));
    setSavedTrips(next);
    saveLocal('eurohop-saved', next);
  };

  const value = useMemo(
    () => ({ settings, setSettings, lastSearch, setLastSearch, savedTrips, saveTrip, removeTrip, updateNote }),
    [settings, lastSearch, savedTrips]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('App context missing');
  return ctx;
}
