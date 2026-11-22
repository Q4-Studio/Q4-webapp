# Aggiornamento dati caso studio Candiani (novembre 2026)

**Data:** 2026-11-21 · **Decisioni:** D-XXX-l, D-XXX-m · **Fonti:** `docs/sources/candiani-2026-11/README.md` (screenshot Stape e Meta consegnati da Q4 Studio).

## Obiettivo

Sostituire ovunque i numeri del caso studio Candiani con i dati degli ultimi 90 giorni e tenere traccia delle fonti nel repository.

## Comportamento

- Nuovi valori: 752.423 segnali recuperati in 90 giorni (22 ago–20 nov 2026), di cui 671.779 dalla tracking prevention e 80.644 dagli ad blocker, su 1.966.768 richieste (38,3%).
- Nuovi dati Meta API Conversions (23 ott–19 nov 2026) nella nota dei risultati del caso studio: +9,2% ViewContent, +46,2% AddToCart, +133,3% InitiateCheckout rispetto al solo pixel.
- Il titolo "Oltre un milione di segnali recuperati." diventa "752.423 segnali recuperati in 90 giorni." in tracciamento e nelle versioni statiche.
- Aggiornati: `data/caseStudies.ts`, `data/seoPages.ts`, `scripts/prerender.ts`, `components/home2/CandianiVisual.tsx`, `components/ServerSideTracking.tsx`, `SEO_GUIDE.md`.

## Decisioni

- **D-XXX-l** Le fonti stanno nel repository (`docs/sources/<caso>-<anno-mese>/`): screenshot originali più un README con i valori estratti, il periodo e i valori precedenti sostituiti. Ogni numero pubblicato deve essere rintracciabile lì.
- **D-XXX-m** Gli uplift Meta stanno nella nota testuale dei risultati e non nella griglia delle metriche: periodo e significato diversi dai dati Stape.

## Fuori scope

- Tre articoli del blog (contenuto su Supabase, non nel repository) citano ancora i vecchi numeri: `conversions-api-meta-segnali-persi-browser`, `perche-google-ads-non-traccia-tutte-le-conversioni`, `client-side-vs-server-side-tagging-differenza-roas`. Vanno aggiornati nel database.

## Verifica

- `npm run build` verde; grep dei vecchi valori vuoto fuori da `docs/` e dalle pagine blog.
