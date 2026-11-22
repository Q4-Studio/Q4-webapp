# Caricamento delle pagine interne e riferimenti ai fornitori

**Data:** 2026-11-21 · **Decisioni:** D-017, D-018 · **Richiesta:** Q4 Studio, dopo le prove da iPhone: pagine bianche e testi in ritardo nel passaggio tra pagine; non nominare le tecnologie usate (Stape) nei testi del sito.

## Comportamento

- Mentre arriva il chunk di una pagina, al posto del bianco c'è uno schermo di attesa chiaro (fondo carta e riga che scorre; il logo è quello della nav). Lo stesso componente serve tutte le pagine lazy.
- Dopo il primo paint, quando il browser è libero, i chunk delle sei pagine principali (tracciamento, siti, agenti AI, casi studio indice e dettaglio, Meta Ads) vengono scaricati in anticipo: il cambio pagina sulla stessa visita è immediato anche su reti lente.
- Nei testi visibili del sito (caso studio Candiani, calcolatore, fonti) non compare più "Stape": si parla di "container server-side" e di "strumenti di verifica del tracciamento". Le fonti originali restano com'erano, conservate fuori dal repository.

## Decisioni

- **D-017** Prefetch dei chunk con `requestIdleCallback` (timeout 4 s) e fallback a un timer: non pesa sul primo paint e precede il click dell'utente.
- **D-018** Le pagine di risorse locali (`data/seoPages.ts`) e `ARCHITECTURE.md` citano già "Stape Partner" da prima di questo lavoro: non toccate, da decidere con Q4 Studio.

## File

- `App.tsx` (PageLoader, prefetch), `index.css` (animazione della riga), `data/caseStudies.ts`, `components/TrackingLossCalculator.tsx`, `scripts/prerender.ts`.

## Verifica

- `npm run build` verde. Nel browser: dopo il caricamento della home i sei chunk risultano scaricati; nessun "Stape" nell'HTML di caso studio e tracciamento.
