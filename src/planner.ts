export type Preferences = { destination: string; days: number; travellers: number; budget: number; pace: string; interests: string[] };
export type Activity = { id: string; time: string; title: string; description: string; cost: number; x: number; y: number };
export type Trip = { preferences: Preferences; activities: Activity[][] };
export const destinations = ['Lisbon', 'Kyoto', 'Amalfi Coast'] as const;
const experiences: Record<string, string[]> = {
 Lisbon: ['Wander the lanes of Alfama', 'Taste your way through a local market', 'Watch sunset beside the Tagus', 'Discover Belém’s riverside monuments', 'Take a coastal escape to Cascais', 'Explore the gardens of Sintra'],
 Kyoto: ['Explore the lanes of Higashiyama', 'Discover Nishiki Market', 'Stroll beside the Kamo River', 'Visit the Arashiyama bamboo grove', 'Explore Fushimi Inari’s gates', 'Slow down in a temple garden'],
 'Amalfi Coast': ['Explore the lanes of Amalfi', 'Enjoy a seaside trattoria lunch', 'Watch sunset over the coast', 'Discover the gardens of Ravello', 'Take a day trip to Positano', 'Walk a scenic coastal trail']
};
// Replace this local adapter with a server-backed planning API later.
export function generateTrip(preferences: Preferences): Trip {
 const titles = experiences[preferences.destination] || experiences.Lisbon;
 return { preferences, activities: Array.from({length: preferences.days}, (_, day) => Array.from({length: preferences.pace === 'Relaxed' ? 2 : 3}, (_, i) => ({id: `${day}-${i}`, time: ['09:30', '13:00', '17:00'][i], title: titles[(day * 2 + i) % titles.length], description: `${i === 1 ? 'Leave time to enjoy local flavours' : 'Make room for a little discovery'}. ${preferences.interests.includes('Food & drink') ? 'Look out for neighbourhood cafés along the way.' : 'Enjoy the neighbourhood at your own pace.'}`, cost: [15, 28, 12][i] * preferences.travellers, x: 24 + ((day * 17 + i * 23) % 53), y: 25 + ((day * 13 + i * 19) % 48)}))) };
}
export function readTrip(): Trip | null { try { const t = JSON.parse(localStorage.getItem('trippilot-trip') || 'null'); return t && destinations.includes(t.preferences.destination) && Array.isArray(t.activities) && t.activities.every((d: unknown) => Array.isArray(d) && d.every(a => a && typeof a.title === 'string' && Number.isFinite(a.cost))) ? t : null; } catch { return null; } }
