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

  if (state.loading) return <p>Loading recommendation...</p>;
  if (state.error || !state.rec || !lastSearch) return <p>{state.error}</p>;

  const stay = estimateStay(state.rec.destination, state.rec.bestRoute);
  const budget = budgetBands(state.rec.bestRoute);

  return (
    <section className="panel">
      <h2>Recommended: {state.rec.destination.city}, {state.rec.destination.country}</h2>
      <p><strong>Route:</strong> €{state.rec.bestRoute.price} · {Math.floor(state.rec.bestRoute.durationMinutes / 60)}h {state.rec.bestRoute.durationMinutes % 60}m · {state.rec.bestRoute.transfers} transfer(s) · {state.rec.bestRoute.operator}</p>
      <p>{state.rec.bestRoute.departureTime} → {state.rec.bestRoute.arrivalTime}</p>
      <p><strong>Why this pick?</strong> {whyThisPick(state.rec.bestRoute)}</p>
      <h3>Top attractions</h3>
      <ul>{Object.values(state.rec.destination.attractions).flat().slice(0, 10).map((a) => <li key={a}>{a}</li>)}</ul>
      <p><strong>Suggested stay:</strong> {stay.days} — {stay.explanation}</p>
      <p><strong>Daily budget:</strong> Budget €{budget.budget}, Midrange €{budget.mid}</p>
      <div className="actions">
        <Link to={`/transport/${lastSearch.from}/${state.rec.destination.city}`}>View transport details</Link>
        <button onClick={() => saveTrip({ id: `${lastSearch.from}-${state.rec.destination.city}-${lastSearch.startDate}`, from: lastSearch.from, to: state.rec.destination.city, startDate: lastSearch.startDate, endDate: lastSearch.endDate, route: state.rec.bestRoute })}>Save trip</button>
        <button onClick={() => navigate('/')}>Try another recommendation</button>
      </div>
    </section>
  );
}
