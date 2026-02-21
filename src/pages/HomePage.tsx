import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { listDestinations } from '../services/transportService';
import { Preference, TransportMode } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const { settings, setLastSearch } = useAppContext();
  const [from, setFrom] = useState(settings.defaultDepartureCity);
  const [startDate, setStartDate] = useState('2026-03-10');
  const [endDate, setEndDate] = useState('2026-03-14');
  const [preference, setPreference] = useState<Preference>('cheapest');
  const [modes, setModes] = useState<TransportMode[]>(settings.defaultModes);

  const cities = ['London', ...listDestinations().map((d) => d.city)];

  const toggleMode = (mode: TransportMode) => {
    setModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const search = { from, startDate, endDate, preference, modes: modes.length ? modes : ['flight'] as TransportMode[] };
    setLastSearch(search);
    navigate('/recommendation');
  };

  return (
    <section>
      <h1>Find the cheapest European escape.</h1>
      <form className="panel" onSubmit={submit}>
        <label>Departure city<select value={from} onChange={(e) => setFrom(e.target.value)}>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
        <label>Start date<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
        <label>End date<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
        <label>Preference<select value={preference} onChange={(e) => setPreference(e.target.value as Preference)}><option value="cheapest">Cheapest</option><option value="fastest">Fastest</option><option value="best-value">Best value</option></select></label>
        <div><strong>Transport modes</strong><div className="chips">{(['flight', 'train', 'bus'] as TransportMode[]).map((mode) => <button type="button" key={mode} className={modes.includes(mode) ? 'chip active' : 'chip'} onClick={() => toggleMode(mode)}>{mode}</button>)}</div></div>
        <div className="actions">
          <button type="submit">Recommend me a place</button>
          <button type="button" onClick={() => navigate('/explore')}>Explore destinations</button>
        </div>
      </form>
    </section>
  );
}
