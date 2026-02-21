import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { listDestinations } from '../services/transportService';

export function DestinationPage() {
  const { city = '' } = useParams();
  const { settings } = useAppContext();
  const decoded = decodeURIComponent(city);
  const destination = listDestinations().find((d) => d.city.toLowerCase() === decoded.toLowerCase());

  if (!destination) return <p className="panel">Destination not found. Try searching it from Explore.</p>;

  return (
    <section className="panel elevated">
      <h2>{destination.city}, {destination.country}</h2>
      <p>{destination.description}</p>
      {Object.entries(destination.attractions).map(([category, items]) => (
        <div key={category}><h3>{category}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
      ))}
      <p>Estimated stay: {Object.values(destination.attractions).flat().length > 8 ? '3–4 days' : '1–2 days'}, based on attraction density and category spread.</p>
      <Link to={`/transport/${encodeURIComponent(settings.defaultDepartureCity)}/${encodeURIComponent(destination.city)}`}>Show routes from my departure city</Link>
    </section>
  );
}
