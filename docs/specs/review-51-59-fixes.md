# Correzioni dalle review interne delle PR #51–#59 (pila "light restyle")

**Data:** 2026-11-22 · **Decisioni:** D-024 (precisa D-022), D-025, D-026, D-027, D-028 · **Richiesta:** review interne delle PR #51–#59: testi sotto soglia, flash nero al caricamento a freddo, loader, copie a mano di dati condivisi, righe dati del caso studio, input del calcolatore, accessibilità, preloader, documentazione.

## Cosa cambia

### A. Testi sotto soglia e spaziature
- A1 `Process.tsx`: descrizione dei passaggi a 19px.
- A2 `index.css`: `.text-[11px]` alzato a 16px (riga legale del footer, etichetta "Richiesta" del form); `.ev em` a 16px e `white-space: nowrap` ("2 secondi"/"60 secondi" non vanno a capo a 375px); commento della soglia corretto (16px).
- A3 Calcolatore: label 19px, valori rapidi 17px, etichetta dei risultati 17px, fonte 17px; valori rapidi e fonte in `text-gray-600` (contrasto ≥ 4,5:1 sul gradiente #ecdffb).
- A4 `CloseCta` taglia `xl`: padding desktop 200px come da spec.
- A5 Breadcrumb del caso studio a 17px (componente e mirror statico).

### B. Primo paint e caricamento pagine
- B1 Mirror statico chiaro (`staticPage(content, true)`: `.home-light`, fondo bianco, testo #0a0a0a) per agenti AI, tracciamento, siti, Meta Ads; casi studio e home erano già chiari. `body` bianco in `index.css`. Verificato che Blog, articolo, Chi siamo, Contatti, Privacy, risorse, landing, partner, supporto app e 404 hanno il proprio sfondo #050505 pieno.
- B2 `generateBaseHtml` ricava "chiara/scura" dal path canonico (`isLightRoute`): le scure escono con `<html class="bg-[#050505]">`, body e theme-color #050505; le chiare bianche. In App `useDocumentTheme` (ex `useLightDocument`) imposta classe/sfondo di html e body e il meta theme-color a ogni cambio rotta; privacy, supporto app e 404 restano scure anche su un path chiaro. Elenco unico in `data/lightRoutes.ts` (D-025).
- B3 `PageLoader`: senza logo (c'è quello della nav), classe `home-light` + `data-page-loader` (la nav lo tratta come fondo chiaro, ma il MutationObserver non lo scambia per la pagina), testo `sr-only` "Caricamento pagina…".
- B4 Cambio rotta con `startTransition` (popstate, hashchange, `navigateTo`): con il chunk in cache niente loader; mentre è `isPending` il loader compare con 150 ms di ritardo (`.q4-pageloader-delayed`). Il fallback di Suspense resta per il primo caricamento, che non passa dalla transizione. Scroll in cima e pageview (PostHog `history_change`) invariati (D-026).
- B5 `scrollToTop` in `utils/navigate.ts`, rispetta `prefers-reduced-motion`; usato da `navigateTo`.
- B6 Il MutationObserver di `navOnLight` si stacca appena trova `#hero` o una `.home-light` che non sia il loader; si riaggancia al cambio rotta.

### C. Una sola fonte per i dati
- C1 `data/trackingCalculator.ts`: forchette, tetti, testo della fonte, `round2`, `estimateTrackingLoss` e la frase d'esempio, usati da componente, HTML statico e markdown (nuova sezione "Stima dei segnali persi"). La fonte dichiara le forchette applicate (18–27%, 13–22%) come allargamento prudente delle stime pubblicate (18–21%, 13–16%, D-016).
- C2 Markdown del tracciamento: FAQ da `trackingFaqs`, tabella prezzi da `trackingPackages` con la nota di ogni pacchetto sulla sua riga ("Disdetta libera" sotto il Setup, come in pagina).
- C3 Markdown degli agenti AI: pacchetti da `aiAgentsPackages` (titolo, problema, tempi, prezzo, pilot).
- C4 `gdprFaq` e `homeFaqs` in `data/servicePages.ts`, usate da `HomeSeoContent`, tracciamento e prerender. Lo schema FAQPage statico di `index.html` è stato tolto: il prerender lo genera in `dist/index.html` dalla stessa costante.
- C5 `sitesWebAiFaqs` in `data/servicePages.ts`, importate da `SitesWebAI.tsx` e dal prerender.
- C6 `homePriceRows` (derivati da `trackingPackages`, `aiAgentsPackages` e `sitesStartingPrice`) per `ServicesBento`, HTML statico e markdown della home. Etichetta "Audit da 490 €" come nel mockup della home (D-027).
- C7 `candianiFigures.windowEnd` e `candianiFigures.window` ("90 giorni fino al 20 novembre 2026") per fonti dei blocchi dati, elenco fonti, intro dei risultati e calcolatore.
- C8 Hero dell'indice casi studio (`caseStudiesIndexCopy`: kicker, titolo, lead) condiviso tra componente e mirror; tolto dal mirror il breadcrumb che la UI non ha.
- C9 Offer schema.org: `price` numerico e `priceCurrency: 'EUR'`; prezzi "da" con `priceSpecification.minPrice`; canoni mensili con `UnitPriceSpecification` (`unitCode: MON`). Helper `trackingOffer`, `aiAgentsOffer`, `sitesOffer` usati da componenti e prerender.

### D. Righe dati del caso studio
- D1 Righe per evento e per browser in `<dl class="dr">` (`<dt>` etichetta, `<dd>` valore in grassetto a destra, 19px, bordo sottile, nessuna icona né evidenziazione ciclica) dentro la card `.mock`; stesso markup nel prerender. La lista "Il lavoro" resta `.ev`.

### E. Input del calcolatore
- E1 `parseNumber` ignora ciò che segue la virgola ("5.000,50" → 5000).
- E2 Tetti 10.000.000 € e 100.000.000 visite, `maxLength`, padding destro maggiore con il suffisso "€".
- E3 Stringa grezza in stato mentre il campo ha il focus (campo vuoto = 0), formattazione al blur.
- E4 Valori rapidi: `role="group"` con `aria-label` riferito al campo, `aria-pressed` sui bottoni.
- E5 `aria-live="polite"` e `aria-atomic="true"` su ogni risultato.
- E6 `round2` sotto 100 arrotonda all'unità (30 € → "5 € – 8 €", non "10 € – 10 €").

### F. Accessibilità e navigazione
- F1 `Counter` della home: span animato `aria-hidden`, valore finale in `sr-only` ("8 ore", "60 secondi").
- F2b Menu mobile (`components/MobileMenu.tsx`): Tracciamento, Siti web e Casi studio erano ancore semplici e ricaricavano l'app; ora usano `onInternalLink` (trovato in verifica nel browser).
- F2 Link interni del footer (chiaro e scuro) e voce "Casi studio" della nav con `onInternalLink`; "Agenti AI" del footer è ora un link vero.
- F3 Marquee: copie 2 e 3 dei loghi `aria-hidden` con `alt=""`.
- F4 Form contatti: successo `role="status"`, errore `role="alert"`.
- F5 `Reveal` mette `data-reveal`; in stampa `[data-reveal]`, `.w` e `.w-block` tornano visibili.

### G. Preloader home
- G1 Gradiente su uno `<span class="grad">` inline attorno alla sola parola; contatore e parole con `.disp`; tolti `GRADIENT_TEXT` e `DISPLAY_FONT`.

### H. Documentazione
- H1 Frasi rotte in `candiani-figures-2026-11.md` e `case-study-light-template.md` riscritte; finestra "90 giorni fino al 20 novembre 2026".
- H2 `page-loading.md`: le fonti originali sono conservate fuori dal repository; loader senza logo.
- H3 `ARCHITECTURE.md`: riga su `Pipeline2.tsx` sostituita con `LeadFlow.tsx` (etichette in parole).
- H4 `light-readability.md`: sfondo bianco dal primo paint ora vero anche nel prerender; le pagine scure hanno html, body e theme-color scuri.

## Decisioni

- **D-024** I numeri aggregati del caso studio Candiani (per evento, per browser, bot, consenso, uplift Meta) sono stati approvati per la pubblicazione da Q4 Studio il 2026-11-21; restano fuori dal repo solo le fonti grezze (screenshot, README, dataset ID). Precisa D-022.
- **D-025** Sfondo di html/body e theme-color per rotta, elenco unico in `data/lightRoutes.ts`; `useLightDocument` sostituito da `useDocumentTheme` in App.
- **D-026** Cambi rotta in `useTransition`, loader ritardato di 150 ms; primo caricamento senza transizione.
- **D-027** Home: prezzi derivati dai pacchetti, etichetta "Audit da 490 €" come nel mockup.
- **D-028** Separatore delle migliaia sempre presente nei numeri derivati (calcolatore, prezzi home): "5.000", non "5000".

## Da decidere (decisioni del cliente, non toccate)

- Testo della FAQ GDPR: confermato da Q4 Studio il 2026-11-22 (unica costante `gdprFaq`).
- FAQ sugli ad blocker: dal 2026-11-22 visibile in pagina in seconda posizione e nello schema (D-029, sostituisce D-006).
- "Disdetta libera": spostata sotto Infrastruttura e lettura dati (D-031, scelta di Q4 Studio del 2026-11-22).
- Dicitura: "segnali recuperati" in home e tracciamento (D-032, scelta di Q4 Studio del 2026-11-22).
- "Stape Partner" e Stape nelle pagine risorse: rimossi (D-030, scelta di Q4 Studio del 2026-11-22).
- Il numero grande "60 s" nella card della home (dal mockup) e il titolo "Primo contatto in 60 secondi".

## Verifica

- `npm run build` verde (verify-gtm-output e verify-agentic passati).
- `dist/agenti-ai/index.html` e `dist/tracciamento-server-side/index.html`: `<html class="bg-white">`, body bianco, `<main class="home-light … bg-white">`; `dist/blog/index.html`, `dist/about/index.html`, `dist/404.html`: html, body e theme-color #050505.
- `dist/index.html` contiene un solo FAQPage, generato da `homeFaqs`.
- HTML statico e `/md/tracciamento-server-side.md`: "tra 900 e 1.400 €" e "tra 6.500 e 11.000" calcolati dalle costanti.
