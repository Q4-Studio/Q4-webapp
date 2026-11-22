# Pagina Tracciamento sul sistema chiaro

**Data:** 2026-11-21 · **Decisioni:** D-XXX-i (registrata qui sotto) · **Riferimento:** mockup "Tracciamento server-side" (export HTML consegnato da Q4 Studio) · **Dipende da:** [agenti-ai-light-page](./agenti-ai-light-page.md) (PR #45) per `CloseCta`, `useLightDocument` e le classi `.h-sub`, `.bul`, `.meta`.

## Obiettivo

La pagina `/tracciamento-server-side` passa al sistema chiaro seguendo il mockup, sezione per sezione.

## Comportamento

- Sezioni, nell'ordine del mockup: hero scuro (titolo parola per parola, lead, CTA "Vedi i pacchetti" → `#pacchetti`) → "Cosa sta succedendo." con il confronto 40/90 (barre che si riempiono allo scroll) → blocco carta arrotondato "Come lo risolviamo." con la lista eventi `.ev` → "Come recuperare le conversioni bloccate dagli ad blocker." con quattro righe `.row` → "I pacchetti." (bento sfalsato: audit + nota documento, setup + nota disdetta, infrastruttura + card scura con i link alla documentazione ufficiale) → blocco scuro "Oltre un milione di segnali recuperati." con CTA al caso studio Candiani → FAQ (5 del mockup, prima aperta) → "Approfondisci" (due righe) → chiusura "Non sai se il tuo tracciamento è a posto?" con CTA "Richiedi l'audit" → form contatti chiaro (oggetto "Audit tracciamento") → footer chiaro.
- Testi: quelli del mockup. FAQ GDPR e "agenzia" aggiornate ai testi del mockup, anche nello schema e nel contenuto statico.
- Contenuto statico no-JS in `scripts/prerender.ts` allineato; la variante Markdown non cambia.
- Nav: logo e hamburger bianchi sull'hero (`id="hero"`), neri dopo.
- Con `prefers-reduced-motion` tutto visibile da subito e fermo.

## Decisioni

- **D-XXX-i** La domanda "Come recuperare i dati di conversione bloccati dagli ad blocker?" non è tra le FAQ del mockup ma resta nello schema FAQPage: `scripts/verify-agentic.mjs` la richiede e la risposta è la sezione visibile con lo stesso titolo. Se Q4 Studio preferisce lo schema identico alle FAQ visibili, va aggiornato anche il verificatore.

## File e interfacce

- `components/ServerSideTracking.tsx`: riscritta sul mockup; componente `Bar` (GSAP, scaleX allo scroll).
- `index.css`: classi `.bar` nel blocco `.home-light`.
- `App.tsx`: route `tracking` dentro `.home-light`, form e footer `tone="light"`.
- `scripts/prerender.ts`: contenuto statico e FAQ schema di `/tracciamento-server-side` allineati.

## Verifica

- `npm run build` verde (incluso `verify-agentic`: titolo ad blocker nell'HTML e nel Markdown, domanda nel JSON-LD, link a documentazione Google e Meta).
- Controllo visivo a 1440px e 375px sull'anteprima.
