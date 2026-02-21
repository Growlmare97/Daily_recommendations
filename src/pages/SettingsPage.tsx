import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TransportMode } from '../types';

export function SettingsPage() {
  const { settings, setSettings } = useAppContext();
  const [draft, setDraft] = useState(settings);

  const toggleMode = (mode: TransportMode) => {
    setDraft((prev) => ({ ...prev, defaultModes: prev.defaultModes.includes(mode) ? prev.defaultModes.filter((m) => m !== mode) : [...prev.defaultModes, mode] }));
  };

  return (
    <section className="panel">
      <h2>Settings & about</h2>
      <label>Currency<select value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value as 'EUR' | 'USD' })}><option value="EUR">EUR</option><option value="USD">USD</option></select></label>
      <label>Default departure city<input value={draft.defaultDepartureCity} onChange={(e) => setDraft({ ...draft, defaultDepartureCity: e.target.value })} /></label>
      <div><strong>Default transport modes</strong><div className="chips">{(['flight', 'train', 'bus'] as TransportMode[]).map((m) => <button key={m} className={draft.defaultModes.includes(m) ? 'chip active' : 'chip'} onClick={() => toggleMode(m)}>{m}</button>)}</div></div>
      <label><input type="checkbox" checked={draft.useMockData} onChange={(e) => setDraft({ ...draft, useMockData: e.target.checked })} /> Use mock data</label>
      <button onClick={() => setSettings(draft)}>Save settings</button>
      <p>Disclaimer: transport prices and times may be estimated or sourced from mock data unless API providers are configured.</p>
    </section>
  );
}
