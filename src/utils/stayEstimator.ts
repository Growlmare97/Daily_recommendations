import { Destination, RouteOption } from '../types';

export function estimateStay(destination: Destination, route: RouteOption) {
  const attractionCount = Object.values(destination.attractions).flat().length;
  let days = attractionCount <= 5 ? '1–2 days' : attractionCount <= 12 ? '3–4 days' : '5–7 days';
  let bonusDays = 0;
  if (route.durationMinutes > 360) bonusDays += 1;
  if (route.transfers > 1) bonusDays += 1;
  if (bonusDays > 0) days = `${days} +${bonusDays} extra day${bonusDays > 1 ? 's' : ''}`;

  return {
    days,
    explanation: `${destination.city} has ${attractionCount} notable spots across ${Object.keys(destination.attractions).length} categories. Travel effort adds ${bonusDays} adjustment day(s).`
  };
}

export function budgetBands(route: RouteOption) {
  const budget = Math.max(45, Math.round(route.price * 0.7));
  const mid = Math.max(90, Math.round(route.price * 1.2));
  return { budget, mid };
}
