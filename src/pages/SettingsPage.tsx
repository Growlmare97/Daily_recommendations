import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DataProvider, TransportMode } from '../types';

export function SettingsPage() {
  const { settings, setSettings } = useAppContext();
  const [draft, setDraft] = useState(settings);

  const toggleMode = (mode: TransportMode) => {
    setDraft((prev) => ({ ...prev, defaultModes: prev.defaultModes.includes(mode) ? prev.defaultModes.filter((m) => m !== mode) : [...prev.defaultModes, mode] }));
  };

  return (
    <section className="panel elevated">
      <h2>Settings & API providers</h2>
      <label>Currency<select value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value as 'EUR' | 'USD' })}><option value="EUR">EUR</option><option value="USD">USD</option></select></label>
      <label>Default departure city<input value={draft.defaultDepartureCity} onChange={(e) => setDraft({ ...draft, defaultDepartureCity: e.target.value })} /></label>
      <label>Data provider<select value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value as DataProvider })}><option value="mock">Mock provider</option><option value="skyscanner">Skyscanner (via RapidAPI)</option></select></label>
      <div><strong>Default transport modes</strong><div className="chips">{(['flight', 'train', 'bus'] as TransportMode[]).map((m) => <button key={m} className={draft.defaultModes.includes(m) ? 'chip active' : 'chip'} onClick={() => toggleMode(m)}>{m}</button>)}</div></div>
      <label><input type="checkbox" checked={draft.useMockData} onChange={(e) => setDraft({ ...draft, useMockData: e.target.checked })} /> Force mock data</label>
      <button className="primary" onClick={() => setSettings(draft)}>Save settings</button>
      <p>Skyscanner setup: set <code>VITE_RAPIDAPI_KEY</code> (and optional <code>VITE_SKYSCANNER_HOST</code>) in your environment. If API fails, EuroHop auto-falls back to mock routes.</p>
      <p>Disclaimer: transport prices and times may be estimated when in mock mode.</p>
    </section>
  );
}
