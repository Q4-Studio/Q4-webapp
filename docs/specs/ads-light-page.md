# Pagina Meta Ads B2B sul sistema chiaro

**Data:** 2026-11-21 · **Decisioni:** D-008 · **Riferimento:** mockup "Meta Ads B2B" (export HTML consegnato da Q4 Studio) · **Dipende da:** [sites-light-page](./sites-light-page.md) (PR #48).

## Obiettivo

La pagina `/meta-advertising-b2b` passa al sistema chiaro seguendo il mockup, sezione per sezione.

## Comportamento

- Sezioni, nell'ordine del mockup: hero scuro ("Meta Ads B2B, con il tracciamento fatto bene a monte.", lead, CTA "Vedi il metodo" → `#metodo`) → "Non campagne a volume. Un sistema leggibile." → tre cifre (2, 3, 3) → "Il metodo." (tre card) → blocco carta "Il costo per contatto non dice chi compra." con lo schema del funnel → "Dal click al segnale." (cinque passaggi con frecce, in colonna sotto 1024px) → bento "Agenti AI sul processo sales." (tre colonne sfalsate con note, una scura) → FAQ (3, prima aperta) → chiusura "Il tracciamento viene prima delle campagne." con CTA "Vedi il tracciamento e i prezzi" → `/tracciamento-server-side` → footer chiaro.
- Come nel mockup e nella pagina precedente, la pagina non ha il form contatti: il CTA finale porta al tracciamento.
- FAQ: le tre del mockup (la terza, su Google Ads, è nuova; le prime due hanno testi accorciati), anche nello schema e nel contenuto statico no-JS di `scripts/prerender.ts`.
- Nav: logo e hamburger bianchi sull'hero (`id="hero"`), neri dopo.

## Decisioni

- **D-008** Implementazione del componente delegata a Claude Opus su richiesta di Q4 Studio; CSS, routing, prerender, spec, verifica e PR a cura della sessione principale. Rimossi i testi lunghi delle vecchie sezioni Advisory e Misurazione e la frase sul numero limitato di progetti: non sono nel mockup.

## File e interfacce

- `components/MetaAdvertisingB2B.tsx`: riscritta sul mockup; esporta `metaAdvertisingFaqs`.
- `App.tsx`: route `advertising` dentro `.home-light`, footer `tone="light"`.
- `scripts/prerender.ts`: FAQ e contenuto statico di `/meta-advertising-b2b` allineati.

## Verifica

- `npm run build` verde.
- Controllo visivo a 1440px e 375px sull'anteprima.
