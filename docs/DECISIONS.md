# Registro delle decisioni

Numerazione progressiva delle decisioni registrate nelle spec (`docs/specs/`), in ordine di data e poi di lettera del vecchio segnaposto `D-XXX-<lettera>`. Il testo completo e il contesto stanno nella spec indicata.

| ID | Data | Decisione | Spec |
| --- | --- | --- | --- |
| D-001 | 2026-11-16 | Menu chiaro ovunque (pillola bianca, voci scure); solo logo, hamburger e "Contatti" cambiano colore in base a ciò che hanno sotto. | [homepage-light-restyle.md](specs/homepage-light-restyle.md) |
| D-002 | 2026-11-16 | Hanken Grotesk solo sotto `.home-light`; il resto del sito resta su Space Grotesk/Inter. | [homepage-light-restyle.md](specs/homepage-light-restyle.md) |
| D-003 | 2026-11-16 | Form contatti e footer con prop `tone` invece di componenti duplicati. | [homepage-light-restyle.md](specs/homepage-light-restyle.md) |
| D-004 | 2026-11-16 | `.home-light` è il sistema chiaro del sito, usato anche dalle pagine interne con mockup. | [agenti-ai-light-page.md](specs/agenti-ai-light-page.md) |
| D-005 | 2026-11-16 | `CloseCta` e `useLightDocument` condivisi tra home e pagine interne; sugli agenti la chiusura precede il form. | [agenti-ai-light-page.md](specs/agenti-ai-light-page.md) |
| D-006 | 2026-11-21 | La FAQ sugli ad blocker resta nello schema FAQPage del tracciamento anche se non è tra le FAQ visibili. Sostituita da D-029. | [tracking-light-page.md](specs/tracking-light-page.md) |
| D-007 | 2026-11-21 | Componente "Siti web" delegato a Claude Opus; rimossi mock browser GSAP e immagine hero GP Meccatronica. | [sites-light-page.md](specs/sites-light-page.md) |
| D-008 | 2026-11-21 | Componente "Meta Ads B2B" delegato a Claude Opus; rimossi i testi lunghi non presenti nel mockup. | [ads-light-page.md](specs/ads-light-page.md) |
| D-009 | 2026-11-21 | ~~Le fonti dei numeri stanno in `docs/sources/<caso>-<anno-mese>/` con screenshot e README.~~ Sostituita da D-022. | [candiani-figures-2026-11.md](specs/candiani-figures-2026-11.md) |
| D-010 | 2026-11-21 | ~~Gli uplift Meta stanno nella nota dei risultati, non nella griglia delle metriche.~~ Sostituita da D-023. | [candiani-figures-2026-11.md](specs/candiani-figures-2026-11.md) |
| D-011 | 2026-11-21 | Soglia di leggibilità nel CSS `.home-light` (classi Tailwind piccole alzate lì). | [light-readability.md](specs/light-readability.md) |
| D-012 | 2026-11-21 | `Reveal` con IntersectionObserver + `useLayoutEffect` al posto di ScrollTrigger; html/body bianchi. | [light-readability.md](specs/light-readability.md) |
| D-013 | 2026-11-21 | Template dei casi studio composto con i pezzi delle pagine chiare, senza mockup dedicato. | [case-study-light-template.md](specs/case-study-light-template.md) |
| D-014 | 2026-11-21 | Totali "recuperate" per evento = ad blocker + tracking prevention, con percentuale e fonte dichiarata. | [case-study-light-template.md](specs/case-study-light-template.md) |
| D-015 | 2026-11-21 | Parole del preloader: "Dati" e "Automazioni". | [light-preloader.md](specs/light-preloader.md) |
| D-016 | 2026-11-21 | Calcolatore perdite: 18–27% budget e 13–22% visite; il 38,3% Candiani solo come riferimento. | [tracking-loss-calculator.md](specs/tracking-loss-calculator.md) |
| D-017 | 2026-11-21 | Prefetch dei chunk delle pagine con `requestIdleCallback` (timeout 4 s) e fallback a timer. | [page-loading.md](specs/page-loading.md) |
| D-018 | 2026-11-21 | Le citazioni "Stape Partner" in `data/seoPages.ts` e `ARCHITECTURE.md` restano, da decidere con Q4 Studio. Sostituita da D-030. | [page-loading.md](specs/page-loading.md) |
| D-019 | 2026-11-21 | `trackCtaClick` parte prima dell'helper di navigazione, anche con cmd/ctrl-click. | [review-43-fixes.md](specs/review-43-fixes.md) |
| D-020 | 2026-11-21 | Nav scura dal primo pixel sulle pagine chiare senza hero; criterio: presenza di `.home-light` | [review-45-47-48-fixes.md](specs/review-45-47-48-fixes.md) |
| D-021 | 2026-11-21 | Ciclo unico di evidenziazione `.ev` (13,5 s, 6 slot) per tutte le liste | [review-45-47-48-fixes.md](specs/review-45-47-48-fixes.md) |
| D-022 | 2026-11-21 | Le fonti dei numeri dei clienti (screenshot, dataset ID, conteggi per evento) NON stanno nel repo pubblico: cartella `docs/sources` ignorata da git, conservata privatamente da Q4 Studio; sostituisce D-009 | [review-49-50-fixes.md](specs/review-49-50-fixes.md) |
| D-023 | 2026-11-21 | Gli uplift Meta stanno solo nel blocco dati dedicato del caso studio, con il proprio periodo; sostituisce D-010 | [review-49-50-fixes.md](specs/review-49-50-fixes.md) |
| D-024 | 2026-11-21 | I numeri aggregati del caso studio Candiani (per evento, per browser, bot, consenso, uplift Meta) sono stati approvati per la pubblicazione da Q4 Studio il 2026-11-21; restano fuori dal repo solo le fonti grezze (screenshot, README, dataset ID). Precisa D-022 | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-025 | 2026-11-22 | Sfondo di html/body e meta theme-color seguono la rotta (chiare bianche, scure #050505) da un elenco unico `data/lightRoutes.ts`, usato da App (`hooks/useDocumentTheme.ts`) e dal prerender; `useLightDocument` nelle pagine è rimosso. Precisa D-005 e D-012 | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-026 | 2026-11-22 | I cambi rotta SPA passano da `useTransition`: con il chunk in cache la pagina cambia senza loader; altrimenti resta la pagina corrente e il loader compare dopo 150 ms. Il primo caricamento non usa la transizione | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-027 | 2026-11-22 | Prezzi delle card servizi in home derivati dai pacchetti (`homePriceRows`); l'etichetta "Audit da 490 €" resta quella del mockup della home anche se il pacchetto ha prezzo fisso | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-028 | 2026-11-22 | Numeri del calcolatore e dei prezzi derivati sempre con il punto delle migliaia ("5.000"), con un formatter condiviso invece di `Intl` it-IT, che sotto 10.000 non lo mette | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-029 | 2026-11-22 | La FAQ sugli ad blocker è visibile nella pagina Tracciamento (seconda posizione) e resta nello schema FAQPage; il testo della FAQ GDPR del mockup è confermato da Q4 Studio. Sostituisce D-006. | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-030 | 2026-11-22 | Nessun nome di fornitore nel copy visibile, pagine risorse comprese: i riferimenti a Stape e al programma partner in `data/seoPages.ts` diventano "infrastruttura server-side dedicata". Sostituisce D-018. | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-031 | 2026-11-22 | La nota "Disdetta libera. Nessun vincolo di durata." sta sotto il pacchetto Infrastruttura e lettura dati (canone), non sotto Setup come nel mockup. | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-032 | 2026-11-22 | Il numero recuperato di Candiani si descrive come "segnali recuperati" (sono richieste del container, non solo conversioni) in home, tracciamento, caso studio e blog. | [review-51-59-fixes.md](specs/review-51-59-fixes.md) |
| D-033 | 2026-11-22 | L'indice /risorse raggruppa le card per pagina hub del cluster (h2 "Agenti AI e automazioni." poi "Tracciamento server-side."): il mockup ha una griglia unica di 10 card, ma le risorse reali sono 28; tematiche prima delle geografiche. | [resources-light-pages.md](specs/resources-light-pages.md) |
| D-034 | 2026-11-22 | Card delle risorse con titolo e `description` reali al posto delle frasi brevi del mockup; form contatti dell'articolo con oggetto = titolo della risorsa, indice senza oggetto. | [resources-light-pages.md](specs/resources-light-pages.md) |
| D-035 | 2026-11-22 | I `dataPoints` (non previsti dal mockup) stanno nel punto della fila di cifre del mockup, con lo stesso stile a colonne con filo a sinistra e il titolo "Dati e risultati." della UI precedente. | [resources-light-pages.md](specs/resources-light-pages.md) |
| D-036 | 2026-11-22 | "Argomenti correlati" preferisce, nello stesso cluster, le pagine tematiche alle geografiche (altrimenti le 18 pagine geo riempirebbero i tre posti). | [resources-light-pages.md](specs/resources-light-pages.md) |
| D-037 | 2026-11-22 | Il titolo della sezione di confronto è il titolo reale della tabella (con il punto); "Confronto tra approcci." solo se manca. Nessuna riga evidenziata: i dati non dicono quale riga è la soluzione proposta. | [resources-light-pages.md](specs/resources-light-pages.md) |
| D-038 | 2026-11-22 | Breadcrumb visibile tolto dall'articolo risorsa (non è nel mockup); resta lo schema BreadcrumbList. Il link spoke→hub diventa la CTA dell'hero "Vedi prezzi e pacchetti". | [resources-light-pages.md](specs/resources-light-pages.md) |
