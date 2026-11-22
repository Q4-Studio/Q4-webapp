# Pagine risorse sul sistema chiaro (indice /risorse e articolo /risorse/:slug)

**Data:** 2026-11-22 · **Decisioni:** D-033, D-034, D-035, D-036, D-037, D-038 · **Richiesta:** portare l'indice delle risorse e la pagina della singola risorsa sui mockup del cliente `Risorse.html` e `Articolo.html`, con mirror statico chiaro e markdown coerenti.

## Cosa cambia

### A. Dati e testi condivisi (`data/seoPages.ts`)
- A1 `resourcesIndexCopy` (kicker, titolo e lead dell'hero, meta title/description, chiusura "Non trovi il tuo caso?") e `resourceArticleCopy` (titoli di sezione del mockup, CTA dell'hero "Vedi prezzi e pacchetti", chiusura "Vuoi capire se ha senso per il tuo processo?"). Usati da componenti, mirror statico e markdown: nessun testo copiato a mano nel prerender.
- A2 `resourceGroups` / `resourcePagesInOrder`: risorse raggruppate per pagina hub del cluster (`clusterHub`): "Agenti AI e automazioni" (cluster C e D) prima, "Tracciamento server-side" (A) dopo; dentro ogni gruppo prima le pagine tematiche, poi quelle geografiche, nell'ordine di `seoPages` (D-033).
- A3 `getRelatedSeoPages`: stesso cluster prima, tematiche prima delle geografiche, poi gli altri cluster (D-036). `isGeoSeoPage`, `resourceKicker` ("Risorse · <hub>"), `asSentence` (maiuscola iniziale e punto finale senza doppio punto), `asHeading`.

### B. Indice `/risorse` e alias `/directory` (`components/SeoDirectory.tsx`)
- B1 Hero scuro corto `id="hero"` con aurora, kicker "Risorse", h1 a parole (`.w`) e lead del mockup.
- B2 Tutte le 28 risorse di `seoPages` in card del mockup (`components/ResourceCard.tsx`: fondo carta `.bc`, icona `.ico`, h3 e descrizione in basso, hover che solleva), griglia 1/2/3 colonne, un h2 per gruppo (D-033).
- B3 Descrizione della card = `page.description` (il mockup ha frasi brevi che non esistono nei dati, D-034). Titolo = `page.title` completo.
- B4 Chiusura `CloseCta` "Non trovi il tuo caso?" con CTA "Contattaci" che scorre al form `#contatti`.
- B5 Schema JSON-LD ItemList (nell'ordine visibile) e BreadcrumbList.

### C. Articolo `/risorse/:slug` e alias `/seo/:slug` (`components/SeoLandingPage.tsx`)
Mappa dei campi di `SeoPage`:

| Sezione del mockup | Campo |
| --- | --- |
| Hero sub: kicker / h1 / lead / CTA | `resourceKicker(page)` / `title` / `description` / link all'hub `clusterHub[cluster].path` |
| Risposta diretta. | `directAnswer` (blocco carta, card bianca `.mock` con icona) |
| Per chi, problema, risultato. | `audience`, `pain`, `proof` (tre card con icona) |
| (fila di cifre del mockup) | `dataPoints` → sezione "Dati e risultati." (D-035) |
| Approfondimenti. | `clusters` (righe h3 \| testo) |
| Confronto tra approcci. | `comparisonTable` (titolo proprio della tabella, D-037) |
| Come interveniamo. | `solution` (lead) + `services` (righe `.ev` numerate) |
| Domande frequenti | `faqs` (`details.f`, la prima aperta) |
| Argomenti correlati. | `getRelatedSeoPages(page)` (3 card) |
| Chiusura #contatti | `resourceArticleCopy.close`, CTA al form |

- C1 Campi non mostrati: `keyword` (era il kicker della vecchia UI, ora il kicker è "Risorse · <hub>" come nel mockup), `lastModified` (solo sitemap), `metaTitle` (solo `<title>`). La "località" delle pagine geografiche non è un campo separato: sta già nel testo di `proof`, `directAnswer`, `clusters` e FAQ, che sono mostrati.
- C2 Breadcrumb visibile rimosso (il mockup non lo ha); resta lo schema BreadcrumbList (D-038).
- C3 Il link spoke→hub resta: è la CTA bianca dell'hero "Vedi prezzi e pacchetti".
- C4 Tabella: `th` di colonna 16px grigio, prima cella di ogni riga `th scope="row"` in grassetto, celle a 19px (D-011), dentro `.mock` con scorrimento orizzontale proprio su mobile (nessuno scroll della pagina). Nessuna riga evidenziata (D-037).
- C5 Schema JSON-LD invariati: Service, FAQPage, BreadcrumbList.

### D. App e rotte
- D1 `App.tsx`: indice e articolo dentro `<div className="home-light relative w-full">` con `ContactForm` chiaro (`showHeader={false}`) e `Footer` chiaro (`showCta={false}`). Indice senza oggetto (richiesta generica, come agenti AI); articolo con `subject={page.title}` (D-034).
- D2 `data/lightRoutes.ts`: `/risorse` e `/directory` in `LIGHT_ROUTES`; nuovo `LIGHT_ROUTE_PREFIXES` con `/casi-studio/`, `/risorse/`, `/seo/`, usato da `isLightRoute`.

### E. Prerender (`scripts/prerender.ts`)
- E1 `generateResourcesHtml` e `generateLandingPageHtml` riscritti: `staticPage(body, true)` (variante chiara), stesse sezioni e titoli della UI, dati da `resourceGroups`, `getRelatedSeoPages`, `resourceArticleCopy`. `<html class="bg-white">` e theme-color bianco arrivano da `isLightRoute`.
- E2 Markdown `/risorse`: un `##` per gruppo con link e descrizione, poi la chiusura. Markdown di ogni risorsa: kicker + link all'hub, Risposta diretta, Per chi/problema/risultato, Dati e risultati, Approfondimenti, tabella di confronto in markdown, Come interveniamo (soluzione + passi numerati), Domande frequenti, Argomenti correlati, chiusura.

### F. Testi
- F1 Nessun "Stape" in `data/`, `components/`, `scripts/`, `App.tsx` (grep vuoto).

## Fuori scope
- Nav, footer, `ContactForm`, CaseStudyPage: invariati.
- Testi delle risorse in `data/seoPages.ts`: invariati (nessuna riscrittura per accorciarli come nel mockup).
- Redirect `/directory` e `/seo/*` in `vercel.json`: invariati (il prerender genera solo `/risorse*`).

## Verifica
- `npm run build` verde, `verify-agentic` tutti i controlli passati (ordine geo Reggio/Parma/Modena, markdown presenti e ≥ 200 caratteri).
- `dist/risorse/index.html` e `dist/risorse/agenti-ai-per-lead-generation/index.html`: `<html class="bg-white">`, `theme-color #ffffff`, `<main class="home-light …">`, h2 nell'ordine della UI; 3 e 4 blocchi JSON-LD (Organization + ItemList/Breadcrumb; Organization + Service/FAQPage/Breadcrumb).
- `dist/md/risorse.md` (28 link in 2 gruppi) e `dist/md/risorse/agenti-ai-per-lead-generation.md` con le sezioni della nuova UI e la tabella.
- Browser (vite preview): a 375px e 1440px nessuno scroll orizzontale su indice e articolo; 28 card; form contatti con "Richiesta: <titolo risorsa>"; html bianco e theme-color bianco.
