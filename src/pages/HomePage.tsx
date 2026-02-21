import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { listCities } from '../services/transportService';
import { Preference, TransportMode } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const { settings, setLastSearch } = useAppContext();
  const [from, setFrom] = useState(settings.defaultDepartureCity);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
  const [preference, setPreference] = useState<Preference>('cheapest');
  const [modes, setModes] = useState<TransportMode[]>(settings.defaultModes);

  const cities = useMemo(() => listCities().map((c) => c.city), []);

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
      <div className="hero glass">
        <p className="eyebrow">Smart European trip finder</p>
        <h1>Find the cheapest European escape.</h1>
        <p>Search 80+ cities, compare flights, trains, and buses, and get one clear recommendation in seconds.</p>
      </div>
      <form className="panel elevated" onSubmit={submit}>
        <div className="grid-2">
          <label>Departure city
            <input list="cities" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Type any city" />
            <datalist id="cities">{cities.map((city) => <option key={city} value={city} />)}</datalist>
          </label>
          <label>Preference
            <select value={preference} onChange={(e) => setPreference(e.target.value as Preference)}>
              <option value="cheapest">Cheapest</option><option value="fastest">Fastest</option><option value="best-value">Best value</option>
            </select>
          </label>
          <label>Start date<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
          <label>End date<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
        </div>
        <div><strong>Transport modes</strong><div className="chips">{(['flight', 'train', 'bus'] as TransportMode[]).map((mode) => <button type="button" key={mode} className={modes.includes(mode) ? 'chip active' : 'chip'} onClick={() => toggleMode(mode)}>{mode}</button>)}</div></div>
        <div className="actions">
          <button className="primary" type="submit">Recommend me a place</button>
          <button type="button" onClick={() => navigate('/explore')}>Explore destinations</button>
        </div>
      </form>
    </section>
  );
}
