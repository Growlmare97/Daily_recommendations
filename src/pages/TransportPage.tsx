import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getRoutes } from '../services/transportService';
import { Preference, RouteOption, TransportMode } from '../types';
import { sortRoutes } from '../utils/recommendation';

export function TransportPage() {
  const params = useParams();
  const from = decodeURIComponent(params.from ?? '');
  const to = decodeURIComponent(params.to ?? '');
  const { settings, lastSearch } = useAppContext();
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<TransportMode>('flight');
  const [preference, setPreference] = useState<Preference>('cheapest');
  const [maxTransfers, setMaxTransfers] = useState(2);
  const [maxDuration, setMaxDuration] = useState(18);
  const [window, setWindow] = useState<'any' | 'morning' | 'afternoon' | 'evening'>('any');

  useEffect(() => {
    setLoading(true);
    getRoutes(from, to, ['flight', 'train', 'bus'], settings, lastSearch?.startDate, lastSearch?.endDate).then((data) => {
      setRoutes(data);
      setLoading(false);
    });
  }, [from, to, settings, lastSearch]);

  const filtered = useMemo(
    () => sortRoutes(routes.filter((r) => {
      const hour = Number(r.departureTime.split(':')[0]);
      const inWindow = window === 'any' || (window === 'morning' && hour < 12) || (window === 'afternoon' && hour >= 12 && hour < 18) || (window === 'evening' && hour >= 18);
      return r.mode === mode && r.transfers <= maxTransfers && r.durationMinutes <= maxDuration * 60 && inWindow;
    }), preference),
    [routes, mode, maxTransfers, maxDuration, preference, window]
  );

  if (loading) return <p className="panel">Loading transport options...</p>;
  return (
    <section>
      <h2>Transport from {from} to {to}</h2>
      <div className="tabs">{(['flight', 'train', 'bus'] as TransportMode[]).map((m) => <button key={m} className={m === mode ? 'active' : ''} onClick={() => setMode(m)}>{m}s</button>)}</div>
      <div className="panel grid-4 elevated">
        <label>Sort<select value={preference} onChange={(e) => setPreference(e.target.value as Preference)}><option value="cheapest">Price</option><option value="fastest">Duration</option><option value="best-value">Best value</option></select></label>
        <label>Max transfers<input type="number" min={0} max={4} value={maxTransfers} onChange={(e) => setMaxTransfers(Number(e.target.value))} /></label>
        <label>Max duration (h)<input type="number" min={1} max={40} value={maxDuration} onChange={(e) => setMaxDuration(Number(e.target.value))} /></label>
        <label>Departure window<select value={window} onChange={(e) => setWindow(e.target.value as 'any' | 'morning' | 'afternoon' | 'evening')}><option value="any">Any</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label>
      </div>
      {!filtered.length ? <p className="panel">No options for selected filters.</p> : (
        <div className="card-grid">{filtered.map((r) => <article key={r.id} className="panel elevated"><p><strong>€{r.price}</strong> · {Math.floor(r.durationMinutes / 60)}h {r.durationMinutes % 60}m · {r.transfers} transfer(s)</p><p>{r.operator} · <span className="pill">{r.source}</span></p><p>{r.departureTime} → {r.arrivalTime}</p><a href={r.bookingUrl} target="_blank">Book</a></article>)}</div>
      )}
    </section>
  );
}
