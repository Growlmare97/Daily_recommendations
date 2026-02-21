import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getRoutes, listCities, listDestinations } from '../services/transportService';

export function ExplorePage() {
  const { settings } = useAppContext();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [budget, setBudget] = useState(180);
  const [weekend, setWeekend] = useState(false);
  const [cheapestMap, setCheapestMap] = useState<Record<string, number>>({});

  const all = listDestinations();
  const countries = ['All', ...new Set(listCities().map((d) => d.country))];

  useEffect(() => {
    Promise.all(
      all.slice(0, 120).map(async (d) => {
        const routes = await getRoutes(settings.defaultDepartureCity, d.city, settings.defaultModes, settings);
        return [d.city, Math.min(...routes.map((r) => r.price))] as const;
      })
    ).then((rows) => setCheapestMap(Object.fromEntries(rows.filter(([, v]) => Number.isFinite(v)))));
  }, [settings, all]);

  const results = useMemo(
    () => all
      .filter((d) => (country === 'All' || d.country === country) && d.city.toLowerCase().includes(search.toLowerCase()))
      .filter((d) => (cheapestMap[d.city] ?? 9999) <= budget)
      .filter((d) => (!weekend || (cheapestMap[d.city] ?? 9999) <= 120)),
    [all, country, search, budget, weekend, cheapestMap]
  );

  return (
    <section>
      <h2>Explore destinations across Europe</h2>
      <div className="panel grid-4 elevated">
        <input placeholder="Search city (try Reykjavik, Dubrovnik, Sofia...)" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>{countries.map((c) => <option key={c}>{c}</option>)}</select>
        <label>Under €{budget}<input type="range" min={40} max={350} value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label>
        <label><input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} /> Weekend-friendly</label>
      </div>
      <div className="card-grid">{results.map((d) => <article key={d.city} className="panel elevated"><h3>{d.city}, {d.country}</h3><p>{d.description}</p><p>Est. cheapest from {settings.defaultDepartureCity}: <strong>€{cheapestMap[d.city] ?? '...'}</strong></p><Link to={`/destination/${encodeURIComponent(d.city)}`}>View destination</Link></article>)}</div>
      {!results.length && <p className="panel">No destinations match your filters.</p>}
    </section>
  );
}
