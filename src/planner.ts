export type DestinationStop = { destination: string; days: number };
export type Preferences = { stops: DestinationStop[]; travellers: number; budget: number; pace: string; interests: string[] };
export type Activity = { id: string; time: string; title: string; description: string; cost: number; x: number; y: number };
export type Trip = { preferences: Preferences; activities: Activity[][] };
export const destinations = ['Lisbon', 'Kyoto', 'Amalfi Coast'] as const;
const experiences: Record<string, string[]> = {
 Lisbon: ['Wander the lanes of Alfama', 'Taste your way through a local market', 'Watch sunset beside the Tagus', 'Discover Belém’s riverside monuments', 'Take a coastal escape to Cascais', 'Explore the gardens of Sintra'],
 Kyoto: ['Explore the lanes of Higashiyama', 'Discover Nishiki Market', 'Stroll beside the Kamo River', 'Visit the Arashiyama bamboo grove', 'Explore Fushimi Inari’s gates', 'Slow down in a temple garden'],
 'Amalfi Coast': ['Explore the lanes of Amalfi', 'Enjoy a seaside trattoria lunch', 'Watch sunset over the coast', 'Discover the gardens of Ravello', 'Take a day trip to Positano', 'Walk a scenic coastal trail']
};
export function tripDays(preferences: Preferences): string[] {
 return preferences.stops.flatMap(stop => Array.from({ length: stop.days }, () => stop.destination));
}
export function routeName(preferences: Preferences): string {
 return preferences.stops.map(stop => stop.destination).join(' → ');
}
// Replace this local adapter with a server-backed planning API later.
export function generateTrip(preferences: Preferences): Trip {
 let day = 0;
 return { preferences, activities: preferences.stops.flatMap(stop => {
  const titles = experiences[stop.destination];
  return Array.from({length: stop.days}, (_, localDay) => {
   const currentDay = day++;
   return Array.from({length: preferences.pace === 'Relaxed' ? 2 : 3}, (_, i) => ({
    id: `${currentDay}-${i}`, time: ['09:30', '13:00', '17:00'][i],
    title: titles[(localDay * 2 + i) % titles.length],
    description: `${i === 1 ? 'Leave time to enjoy local flavours' : 'Make room for a little discovery'}. ${preferences.interests.includes('Food & drink') ? 'Look out for neighbourhood cafés along the way.' : 'Enjoy the neighbourhood at your own pace.'}`,
    cost: [15, 28, 12][i] * preferences.travellers,
    x: 24 + ((localDay * 17 + i * 23) % 53), y: 25 + ((localDay * 13 + i * 19) % 48)
   }));
  });
 }) };
}
const positiveInteger = (value: unknown, max: number): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= max;
export function readTrip(): Trip | null {
 try {
  const t = JSON.parse(localStorage.getItem('trippilot-trip') || 'null');
  if (!t || !t.preferences) return null;
  const p = t.preferences;
  // Preserve trips saved before multi-destination planning was introduced.
  if (!p.stops && typeof p.destination === 'string') p.stops = [{destination: p.destination, days: p.days}];
  if (!Array.isArray(p.stops) || p.stops.length < 1 || p.stops.length > 3 ||
   !p.stops.every((s: DestinationStop) => s && destinations.includes(s.destination as typeof destinations[number]) && positiveInteger(s.days, 14)) ||
   new Set(p.stops.map((s: DestinationStop) => s.destination)).size !== p.stops.length ||
   !positiveInteger(p.travellers, 10) || !positiveInteger(p.budget, 1000000) ||
   !['Relaxed', 'Balanced', 'Packed'].includes(p.pace) || !Array.isArray(p.interests) || !p.interests.every((v: unknown) => typeof v === 'string')) return null;
  if (!Array.isArray(t.activities) || t.activities.length !== tripDays(p).length ||
   !t.activities.every((d: unknown) => Array.isArray(d) && d.every(a => a && typeof a.id === 'string' && typeof a.time === 'string' && typeof a.title === 'string' && typeof a.description === 'string' && Number.isFinite(a.cost) && a.cost >= 0 && Number.isFinite(a.x) && Number.isFinite(a.y)))) return null;
  return {preferences: {stops: p.stops, travellers: p.travellers, budget: p.budget, pace: p.pace, interests: p.interests}, activities: t.activities};
 } catch { return null; }
}
