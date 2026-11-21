# Sentry solo in produzione

**Data:** 2026-11-21 · **Decisioni:** D-XXX-h (registrata qui sotto: il repository non ha ancora `DECISIONS.md`)

## Obiettivo

Gli errori delle anteprime (vite preview su Tailscale, build locali con `.env.local`) non devono finire nel progetto Sentry di produzione. Due eventi già arrivati da lì: script Vercel Speed Insights assente e chunk con hash vecchio dopo una rebuild.

## Comportamento

- Sentry si inizializza solo se c'è `VITE_SENTRY_DSN` **e** l'host della pagina è `www.q4.studio`.
- `VITE_SENTRY_FORCE=1` accende Sentry anche fuori dal dominio, per provare l'integrazione.
- `isSentryEnabled` riflette la stessa condizione: `trackEvent` e le chiamate in `ContactForm`, `AppSupport`, `LazyPageErrorBoundary` restano no-op fuori produzione.

## Decisioni

- **D-XXX-h** Guardia sull'hostname lato client invece di togliere il DSN da `.env.local`: il DSN resta comodo per le prove, ma la build non può più riportare per sbaglio da un dominio diverso.

## File

- `lib/sentry.ts`, `.env.example`.

## Verifica

- `npm run build` verde.
- Su www.q4.studio gli eventi continuano ad arrivare (controllo dopo il deploy).
