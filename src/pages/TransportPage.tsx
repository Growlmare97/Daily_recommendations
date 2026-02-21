import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getRoutes } from '../services/transportService';
import { Preference, RouteOption, TransportMode } from '../types';
import { sortRoutes } from '../utils/recommendation';

export function TransportPage() {
  const { from = '', to = '' } = useParams();
  const { settings } = useAppContext();
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<TransportMode>('flight');
  const [preference, setPreference] = useState<Preference>('cheapest');
  const [maxTransfers, setMaxTransfers] = useState(3);
  const [maxDuration, setMaxDuration] = useState(20);

  useEffect(() => {
    setLoading(true);
    getRoutes(from, to, ['flight', 'train', 'bus'], settings).then((data) => {
      setRoutes(data);
      setLoading(false);
    });
  }, [from, to, settings]);

  const filtered = useMemo(
    () => sortRoutes(routes.filter((r) => r.mode === mode && r.transfers <= maxTransfers && r.durationMinutes <= maxDuration * 60), preference),
    [routes, mode, maxTransfers, maxDuration, preference]
  );

  if (loading) return <p>Loading transport options...</p>;
  return (
    <section>
      <h2>Transport from {from} to {to}</h2>
      <div className="tabs">{(['flight', 'train', 'bus'] as TransportMode[]).map((m) => <button key={m} className={m === mode ? 'active' : ''} onClick={() => setMode(m)}>{m}s</button>)}</div>
      <div className="panel grid-3">
        <label>Sort<select value={preference} onChange={(e) => setPreference(e.target.value as Preference)}><option value="cheapest">Price</option><option value="fastest">Duration</option><option value="best-value">Best value</option></select></label>
        <label>Max transfers<input type="number" value={maxTransfers} onChange={(e) => setMaxTransfers(Number(e.target.value))} /></label>
        <label>Max duration (h)<input type="number" value={maxDuration} onChange={(e) => setMaxDuration(Number(e.target.value))} /></label>
      </div>
      {!filtered.length ? <p>No options for selected filters.</p> : (
        <div className="card-grid">{filtered.map((r) => <article key={r.id} className="panel"><p><strong>€{r.price}</strong> · {Math.floor(r.durationMinutes / 60)}h {r.durationMinutes % 60}m · {r.transfers} transfers</p><p>{r.operator}</p><p>{r.departureTime} → {r.arrivalTime}</p><a href={r.bookingUrl} target="_blank">Book</a></article>)}</div>
      )}
    </section>
  );
}
