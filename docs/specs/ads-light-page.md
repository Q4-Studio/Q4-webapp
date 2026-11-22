# Pagina Meta Ads B2B sul sistema chiaro

**Data:** 2026-11-21 · **Decisioni:** D-008 · **Riferimento:** mockup "Meta Ads B2B" (export HTML consegnato da Q4 Studio) · **Dipende da:** [sites-light-page](./sites-light-page.md) (PR #48).

## Obiettivo

La pagina `/meta-advertising-b2b` passa al sistema chiaro seguendo il mockup, sezione per sezione.

## Comportamento

- Sezioni, nell'ordine del mockup: hero scuro ("Meta Ads B2B, con il tracciamento fatto bene a monte.", lead, CTA "Vedi il metodo" → `#metodo`) → "Non campagne a volume. Un sistema leggibile." → tre cifre (2, 3, 3) → "Il metodo." (tre card) → blocco carta "Il costo per contatto non dice chi compra." con lo schema del funnel → "Dal click al segnale." (cinque passaggi con frecce, in colonna sotto 1024px) → bento "Agenti AI sul processo sales." (tre colonne sfalsate con note, una scura) → FAQ (3, prima aperta) → chiusura "Il tracciamento viene prima delle campagne." con CTA "Vedi il tracciamento e i prezzi" → `/tracciamento-server-side` → form contatti → footer chiaro.
- La chiusura del mockup porta al tracciamento; sotto, come nelle altre pagine chiare, il form contatti (`subject="Advertising"`, `#contatti`), aggiunto con la review della PR #49 perché senza il CTA del footer la pagina non aveva più un percorso di contatto.
- FAQ: le tre del mockup (la terza, su Google Ads, è nuova; le prime due hanno testi accorciati), anche nello schema e nel contenuto statico no-JS di `scripts/prerender.ts`.
- Nav: logo e hamburger bianchi sull'hero (`id="hero"`), neri dopo.

## Decisioni

- **D-008** Implementazione del componente delegata a Claude Opus su richiesta di Q4 Studio; CSS, routing, prerender, spec, verifica e PR a cura della sessione principale. Rimossi i testi lunghi delle vecchie sezioni Advisory e Misurazione e la frase sul numero limitato di progetti: non sono nel mockup.

## File e interfacce

- `components/MetaAdvertisingB2B.tsx`: riscritta sul mockup; le FAQ (`metaAdvertisingFaqs`) stanno in `data/servicePages.ts`.
- `App.tsx`: route `meta-advertising` dentro `.home-light`, `<ContactForm subject="Advertising" showHeader={false} tone="light" />`, footer `tone="light"`.
- `scripts/prerender.ts`: FAQ (importate da `data/servicePages.ts`) e contenuto statico di `/meta-advertising-b2b` allineati, con la sezione `#contatti` (`STATIC_CONTACT_HTML`).

## Verifica

- `npm run build` verde.
- Controllo visivo a 1440px e 375px sull'anteprima.
