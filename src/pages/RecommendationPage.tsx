import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { candidateRoutes } from '../services/transportService';
import { budgetBands, estimateStay } from '../utils/stayEstimator';
import { chooseRecommendation, whyThisPick } from '../utils/recommendation';

export function RecommendationPage() {
  const navigate = useNavigate();
  const { lastSearch, settings, saveTrip } = useAppContext();
  const [state, setState] = useState<{ loading: boolean; error?: string; rec?: ReturnType<typeof chooseRecommendation> }>({ loading: true });

  useEffect(() => {
    if (!lastSearch) {
      navigate('/');
      return;
    }
    candidateRoutes(lastSearch, settings)
      .then((results) => {
        if (!results.length) setState({ loading: false, error: 'No routes found. Try enabling more transport modes.' });
        else setState({ loading: false, rec: chooseRecommendation(results) });
      })
      .catch(() => setState({ loading: false, error: 'Failed to fetch routes.' }));
  }, [lastSearch, settings, navigate]);

  if (state.loading) return <p className="panel">Loading recommendation...</p>;
  if (state.error || !state.rec || !lastSearch) return <p className="panel">{state.error}</p>;

  const rec = state.rec;
  const stay = estimateStay(rec.destination, rec.bestRoute);
  const budget = budgetBands(rec.bestRoute);

  return (
    <section className="panel elevated">
      <h2>Recommended: {rec.destination.city}, {rec.destination.country}</h2>
      <p><strong>Cheapest route:</strong> €{rec.bestRoute.price} · {Math.floor(rec.bestRoute.durationMinutes / 60)}h {rec.bestRoute.durationMinutes % 60}m · {rec.bestRoute.transfers} transfer(s)</p>
      <p>{rec.bestRoute.operator} ({rec.bestRoute.source}) · {rec.bestRoute.departureTime} → {rec.bestRoute.arrivalTime}</p>
      <p><strong>Why this pick?</strong> {whyThisPick(rec.bestRoute)}</p>
      <h3>Top attractions</h3>
      <ul>{Object.values(rec.destination.attractions).flat().slice(0, 10).map((a) => <li key={a}>{a}</li>)}</ul>
      <p><strong>Suggested stay:</strong> {stay.days} — {stay.explanation}</p>
      <p><strong>Daily budget:</strong> Budget €{budget.budget}, Midrange €{budget.mid}</p>
      <div className="actions">
        <Link to={`/transport/${encodeURIComponent(lastSearch.from)}/${encodeURIComponent(rec.destination.city)}`}>View transport details</Link>
        <button onClick={() => saveTrip({ id: `${lastSearch.from}-${rec.destination.city}-${lastSearch.startDate}`, from: lastSearch.from, to: rec.destination.city, startDate: lastSearch.startDate, endDate: lastSearch.endDate, route: rec.bestRoute })}>Save trip</button>
        <button onClick={() => navigate('/')}>Try another recommendation</button>
      </div>
    </section>
  );
}
