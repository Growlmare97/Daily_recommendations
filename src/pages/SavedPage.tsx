import { useAppContext } from '../context/AppContext';

export function SavedPage() {
  const { savedTrips, removeTrip, updateNote } = useAppContext();
  return (
    <section>
      <h2>Saved trips</h2>
      {!savedTrips.length ? <p>No saved trips yet.</p> : (
        <div className="card-grid">{savedTrips.map((trip) => <article key={trip.id} className="panel"><h3>{trip.to}</h3><p>{trip.startDate} → {trip.endDate}</p><p>Cheapest: €{trip.route.price}, {Math.floor(trip.route.durationMinutes / 60)}h {trip.route.durationMinutes % 60}m</p><textarea placeholder="Notes" value={trip.note ?? ''} onChange={(e) => updateNote(trip.id, e.target.value)} /><button onClick={() => removeTrip(trip.id)}>Remove</button></article>)}</div>
      )}
    </section>
  );
}
