import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { listDestinations } from '../services/transportService';

export function ExplorePage() {
  const { settings } = useAppContext();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [budget, setBudget] = useState(120);
  const [weekend, setWeekend] = useState(false);
  const all = listDestinations();
  const countries = ['All', ...new Set(all.map((d) => d.country))];

  const results = useMemo(
    () => all.filter((d) => (country === 'All' || d.country === country) && d.city.toLowerCase().includes(search.toLowerCase()) && (!weekend || ['Paris', 'Amsterdam', 'Prague', 'Berlin'].includes(d.city)) && budget >= 45),
    [all, country, search, weekend, budget]
  );

  return (
    <section>
      <h2>Explore destinations</h2>
      <div className="panel grid-4">
        <input placeholder="Search city" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>{countries.map((c) => <option key={c}>{c}</option>)}</select>
        <label>Under €{budget}<input type="range" min={40} max={200} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label>
        <label><input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} /> Weekend-friendly</label>
      </div>
      <div className="card-grid">{results.map((d) => <article key={d.city} className="panel"><h3>{d.city}, {d.country}</h3><p>{d.description}</p><p>Est. cheapest from {settings.defaultDepartureCity}: under €{budget}</p><Link to={`/destination/${d.city}`}>View destination</Link></article>)}</div>
      {!results.length && <p>No destinations match your filters.</p>}
    </section>
  );
}
