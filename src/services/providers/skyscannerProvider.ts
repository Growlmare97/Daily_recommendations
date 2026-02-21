import { RouteOption, TransportMode, TransportProvider } from '../../types';

const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPID_API_HOST = import.meta.env.VITE_SKYSCANNER_HOST ?? 'skyscanner89.p.rapidapi.com';

export const skyscannerProvider: TransportProvider = {
  name: 'skyscanner',
  async searchRoutes(from, to, modes, startDate) {
    if (!RAPID_API_KEY) {
      throw new Error('Skyscanner provider selected but VITE_RAPIDAPI_KEY is missing.');
    }

    const options: RouteOption[] = [];
    if (modes.includes('flight')) {
      const url = `https://${RAPID_API_HOST}/flights/one-way/list?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&departureDate=${startDate}`;
      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST
        }
      });

      if (!response.ok) throw new Error('Skyscanner API request failed.');
      const payload = await response.json();
      const items = payload?.data?.itineraries ?? [];
      for (const [idx, item] of items.slice(0, 8).entries()) {
        const leg = item?.legs?.[0] ?? {};
        options.push({
          id: `sky-${idx}-${from}-${to}`,
          from,
          to,
          mode: 'flight',
          operator: leg?.carriers?.marketing?.[0]?.name ?? 'Skyscanner Partner',
          price: Math.round(item?.price?.raw ?? item?.price?.amount ?? 0),
          durationMinutes: Math.round(leg?.durationInMinutes ?? 0),
          transfers: Math.max(0, (leg?.stopCount ?? 0)),
          departureTime: leg?.departure ? new Date(leg.departure).toISOString().slice(11, 16) : '--:--',
          arrivalTime: leg?.arrival ? new Date(leg.arrival).toISOString().slice(11, 16) : '--:--',
          bookingUrl: item?.deeplink ?? 'https://www.skyscanner.net',
          source: 'skyscanner'
        });
      }
    }

    return options;
  }
};
