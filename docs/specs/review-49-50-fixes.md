# Correzioni dalle review delle PR #49 e #50 e rimozione delle fonti dal repo pubblico

**Data:** 2026-11-21 · **Decisioni:** D-022 (sostituisce D-009), D-023 (sostituisce D-010) · **Richiesta:** due review esterne (Meta Ads, dati Candiani). La review #50 ha segnalato che gli screenshot e i conteggi del cliente erano stati pubblicati in un repository pubblico.

## Incidente e rimedio

- Il repository Q4-webapp è pubblico. Gli 8 screenshot e il README con dataset ID, tassi di consenso, bot e conteggi per evento erano in `docs/sources/candiani-2026-11` su 9 rami pubblicati (mai su `main`).
- Rimedio: file rimossi dalla storia di tutti i rami con riscrittura e push forzato; `docs/sources/` ora in `.gitignore`; copia privata conservata da Q4 Studio fuori dal repo. Verificato: nessun commit raggiungibile contiene più la cartella e GitHub risponde 404 sul percorso. GitHub può conservare per un periodo oggetti non più referenziati: per una cancellazione completa va chiesta al supporto GitHub.

## Cosa cambia

- Meta Ads: etichette del funnel fuori dalle barre (leggibili a 375px); form contatti chiaro prima del footer (mirror statico incluso); FAQ in `data/servicePages.ts`.
- Scroll "smooth" rispetta `prefers-reduced-motion` (`scrollToId` in `utils/navigate.ts`) su tutte le pagine chiare e in App.
- `HeroVisual`: rimosse le varianti senza chiamanti (tracking, agents, meta); resta `partner`.
- Caso studio: campo `dateModified` (Candiani 2026-11-21) usato in schema Article e sitemap; `pageLastModified` aggiornati per home, tracciamento, Meta Ads e la risorsa locale che cita Candiani.
- Testi Candiani: finestra "90 giorni fino al 20 novembre 2026" (la data di inizio non è confermata dalla fonte); etichette "recuperate …"; nota dei risultati senza gli uplift Meta, che restano nel blocco dati con il loro periodo.
- Numeri Candiani in una sola costante `candianiFigures`, usata da caso studio, home, tracciamento, risorse locali, prerender e calcolatore.

## Decisioni

- **D-022** Le fonti dei numeri dei clienti non stanno nel repo pubblico: `docs/sources` ignorata da git e conservata privatamente da Q4 Studio. Sostituisce D-009.
- **D-023** Gli uplift Meta stanno solo nel blocco dati dedicato del caso studio, con il proprio periodo; non nella nota dei risultati. Sostituisce D-010.

## Fuori scope (decisioni del cliente)

- Dicitura "segnali di conversione" per le richieste recuperate (#50-4). Articoli del blog su Supabase con i vecchi numeri (#50-8).

## Verifica

- `npm run build` verde; `#contatti` in `/meta-advertising-b2b`; `dateModified` 2026-11-21 nello schema del caso studio e `lastmod` in sitemap; `git log --all -- docs/sources` vuoto.
