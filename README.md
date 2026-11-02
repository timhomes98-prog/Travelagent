# TripPilot

A responsive travel-planning prototype built with React 19, TypeScript and Vite 6. Requires Node 22.12+ (validated with Node 24.19) and npm. No API keys, accounts, backend or paid services are needed.

## Run locally

```sh
cd /workspace/Travelagent
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

On your own computer, replace the directory with your checkout path and open http://localhost:5173 in your browser. In a cloud IDE, use its forwarded port 5173 if port forwarding is supported; the onboarding UI itself does not provide a website preview. Binding to 0.0.0.0 supports forwarded ports. This demo has no authentication; do not expose it as a production service.

```sh
npm run build
npm run preview -- --port 4173
npm run test:e2e
```

Browser tests use Chromium at `/usr/bin/chromium` in this cloud environment. On another machine, install Playwright Chromium with `npx playwright install chromium` and remove the `executablePath` setting in `playwright.config.ts`.

## First version

Landing page → two-step questionnaire with ordered destinations → generated multi-stop sample trip → edit/remove/add stops → update budget → revisit saved trip. Curated sample destinations: Lisbon, Kyoto, Amalfi Coast. Add up to three unique destinations, reorder them, and allocate 1–14 days to each. One itinerary and budget cover the entire route. Day-specific maps and booking searches follow the selected destination. Travel time and costs between destinations are excluded: allow transfer days and verify connections before booking. Existing single-destination browser saves are migrated without losing activity edits. Relaxed pace has two stops/day; other paces have three. Food interests adjust descriptive copy; other interest selections are saved for future recommendation logic. Prices are illustrative GBP totals for the travelling party. Budget covers the entire trip, but estimated spending currently covers activities and meals only. No dates, availability checks, reservations or payments are implemented.

The route diagram is deliberately non-geographic. Google Maps opens the actual destination. Booking links are external Google searches, not integrations or affiliate links. Original destination illustrations are bundled locally. System typography and local artwork keep the entire interface independent of external image or font services. Trip data stays in localStorage on the current browser; clearing site data removes it. Avoid sensitive information.

## Architecture and next stages

- `src/main.tsx`: landing, questionnaire and itinerary UI. Keep the first slice small; split these into feature components as they grow.
- `src/planner.ts`: typed preference, activity and trip models plus a deterministic sample planning adapter. The UI calls the adapter, keeping data generation separate from presentation.
- `src/styles.css`: responsive design tokens and styles.
- `tests/journey.spec.ts`: desktop and mobile browser journeys.

Next, introduce a backend planning endpoint implementing the same typed contract. Keep AI credentials, provider calls, rate limits and input validation on the server. Validate AI outputs against a schema before returning them. Add calendar dates and genuine place coordinates before real travel recommendations. Then use PostgreSQL for trips and preferences, with migrations and authenticated ownership checks; localStorage is only for this prototype. A framework such as Next.js can consolidate server endpoints and SEO-rendered destination pages when those become necessary; Vite avoids server and deployment complexity for this initial UI validation.

Real booking/affiliate providers should sit behind separate adapters. Disclose affiliate links, obtain provider approval, and keep live prices and availability distinct from generated suggestions. Do not treat model output as booking inventory. Add privacy controls, accessibility review, monitoring and security hardening before a public commercial launch. Discuss and approve paid providers before enabling billing.

## Validation

`npm run build` performs strict TypeScript checking and creates production assets. Browser tests cover planning, pace, editing, stop removal/addition, budget overruns, persistence, external links, mobile width and form constraints, plus destination addition/removal/reordering, day-to-destination boundaries, multi-stop saving and migration of old single-destination saves. No live AI, booking or payment functionality is claimed.
