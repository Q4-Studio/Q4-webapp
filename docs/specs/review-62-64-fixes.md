# Correzioni dalle review interne delle PR #62–#64 (pila "light", risorse, pagine aziendali, blog)

**Data:** 2026-11-22 · **Decisioni:** D-052, D-053, D-054 (sostituisce D-025 e D-045), D-055 (precisa D-047), D-056, D-057 (sostituisce D-036), D-058 (precisa D-021) · **Richiesta:** review interne delle PR #62 (risorse), #63 (contatti, chi siamo, privacy), #64 (blog, partner, 404): correlate tutte uguali, schema doppi, hero copiati a mano, prezzi che ignorano il "da", recapiti scritti più volte, codice morto del tema scuro, hash malformati, Indietro/Avanti nell'indice dell'articolo, tabelle markdown, analytics del form.

## Cosa cambia

### A. Risorse (PR #62)
- A1 `getRelatedSeoPages` (`data/seoPages.ts`): pagine geografiche → stesso tema nelle altre città, poi stessa città con altri temi dello stesso hub; poi le tematiche dello stesso hub ruotate a partire da quella che segue la pagina corrente; poi il resto. Tema e città da una mappa unica (`geoParts`) che serve anche `isGeoSeoPage` e il nuovo `geoTopicSlug`. Verificato con uno script `tsx`: 28 pagine, 28 terne diverse, nessuna pagina riceve se stessa (D-057).
- A2 "Come interveniamo" (`SeoLandingPage.tsx`): `<ol>` di righe `.ev.static`, senza il ciclo `q4-hl`; nuova regola `.home-light .ev.static { animation: none; }`. Il mirror statico era già un `<ol>` semplice (D-058).
- A3 Schema JSON-LD doppi: il doppione è sistemico (anche servizi e casi studio emettono lo schema sia dal componente sia nell'head del prerender). Per le pagine di questa pila (indice e articoli risorse, contatti, chi siamo) i componenti non emettono più schema: resta solo quello dell'head prerenderato. Il blog era già deduplicato (`BlogSchema` controlla l'head) (D-052).
- A4 `resourceIcon` (`ResourceCard.tsx`): mappa per slug esatto; le pagine geografiche usano l'icona del loro tema (`geoTopicSlug`), niente prefissi dipendenti dall'ordine. Tolta la prop `headingLevel` mai usata.
- A5 `SubHero` usato da `SeoDirectory`, `SeoLandingPage` (CTA verso l'hub come `children`) e `CaseStudiesIndex`; nuova prop `minHeightClass` (l'articolo risorsa resta 560/680px perché ha la CTA). Nel prerender l'helper `subHeroHtml` riproduce le classi di `SubHero` per il mirror dell'indice casi studio; i mirror di risorse restano semantici come quelli delle altre pagine con `SubHero`.
- A6 `faqSection` (markdown): riga vuota prima di ogni `###`.

### B. Contatti, chi siamo, privacy (PR #63)
- B1 `priceWithFrom(pack)` in `data/servicePages.ts` ("da 1.500 €" / "490 €"), usato da contatti (punti di partenza), chi siamo ("Prezzi pubblici") e prerender (HTML del tracciamento e tabella prezzi del markdown). La fila di cifre di /about tiene il valore senza "da" e mette "prezzo di partenza" nella didascalia anche per l'audit, se mai diventasse "da".
- B2 Schema Organization del prerender da `company` (email, telefono, P.IVA, sede, regione, social, nuovo campo `facebook`). La copia statica in `index.html` è tolta: il prerender inietta lo stesso blocco in `dist/index.html` accanto al FAQPage della home. Footer e form contatti leggono email, telefono, P.IVA, sede e profili da `company`; `utils/obfuscate.ts` rimosso. Da `company` anche il contatto statico dei mirror, la riga contatti del markdown della home e llms.txt (D-053).
- B3 `automationsPricing` (setup minimo e forchetta dei canoni) esportato da `data/servicePages.ts`, usato da `homePriceRows` e dalla card "Automazioni e agenti AI" dei contatti.
- B4 vedi C8.
- B5 Card carta non cliccabili: variante `.bc.static` in `index.css` (niente sollevamento all'hover) al posto della stringa `rounded-[32px] bg-[#f7f5fb] px-7 py-8 md:p-11` in `ContactPage` (card Sede), `AboutPage` (principi), `SeoLandingPage` (per chi/problema/risultato), `MetaAdvertisingB2B` (metodo), `SitesWebAI` (fasi); anche lo stato vuoto del blog. Tra 768 e 1000px il padding è quello di `.bc` (32/28px) invece di 44px.
- B6 `legalPlainText` rimosso (export morto).
- B7 `privacyPageCopy.heroLead` ("… Ultimo aggiornamento: 5 gennaio 2025."), usato da `Privacy.tsx` e dal mirror.
- B8 `company.vatNumber` è un getter derivato da `vatId`.

### C. Blog, partner, 404 (PR #64)
- C1 `BlogArticle`: `decodeURIComponent` dell'hash in try/catch; un hash malformato non manda più la pagina nell'error boundary.
- C2 `App.tsx`: se cambia solo l'hash sullo stesso path e l'id esiste (e non è un hash-rotta: `privacy`, `app-support`, `404`, `home`, `contatti`), si scorre alla sezione con `scrollToId` invece che in cima. `#contatti` resta sul suo ramo con i tentativi ripetuti. Stesso try/catch per l'hash.
- C3 `formatPostDate` con `timeZone: 'UTC'`.
- C4 `ContactForm` non ha un campo di contesto separato da `subject`: l'articolo del blog usa il form generico (senza oggetto), come l'indice; gli eventi restano `contact_form` / `general_inquiry` (D-055).
- C5 `lib/blogMarkdown.ts`: la divisoria deve contenere `|` e solo celle di trattini (con `:`); un `---` nudo resta paragrafo. Le righe proseguono finché iniziano con `|` (o, se l'intestazione non ha il `|` iniziale, finché hanno lo stesso numero di celle). Test `scripts/verify-blog-markdown.ts` (`npm run verify:blog-markdown`, eseguito anche da `npm run build`).
- C6 `trackingPackage(title)` in `data/servicePages.ts`: pacchetti per titolo in `extraPages`, `companyPages` e `homePriceRows`. Il margine del partner è calcolato: rivendita d'esempio 2.500 € meno il prezzo del setup ("hai marginato 1.000 €") (D-056).
- C7 Prerender: `blogDir` al posto della variabile locale `blogPath` che oscurava l'import.
- C8 Tutto il sito è chiaro: eliminati `data/lightRoutes.ts` e `hooks/useDocumentTheme.ts`, il parametro `light` e il ramo scuro di `generateBaseHtml` (html, body e theme-color sempre bianchi) e la chiamata in `App.tsx`. Sfondo e theme-color bianchi restano fissi in `index.html`, `index.css` e prerender (D-054).
- C9 `buildIndexAndBlogMds`: `relatedPosts` calcolato una volta per articolo.
- C10 `ARCHITECTURE.md`: sezione Blog aggiornata (props reali, stati senza spinner/retry, `BlogArticle` con `posts`) e paragrafo "Dati e testi condivisi" (`lib/blogMarkdown.ts`, `data/extraPages.ts`, `data/companyPages.ts`, `data/servicePages.ts`).

## Decisioni

- **D-052** Schema JSON-LD delle pagine della pila (indice e articoli risorse, contatti, chi siamo) solo nell'head del prerender; i componenti non lo emettono più. Le altre pagine (servizi, casi studio) hanno ancora il doppione: da allineare in un passaggio separato.
- **D-053** Recapiti, P.IVA, sede e social da `company` per schema Organization, footer, form e mirror; niente più offuscamento Base64 di email e telefono (erano già in chiaro nello schema e nelle pagine aziendali, D-043); Organization tolto da `index.html` e iniettato dal prerender.
- **D-054** Tutto il sito è sul sistema chiaro: nessuna logica di tema per rotta. Sostituisce D-025 e D-045.
- **D-055** Articolo del blog: form contatti generico senza oggetto, perché `subject` classifica la richiesta come "service inquiry" negli analytics. Precisa D-047.
- **D-056** Partner tecnico: margine dell'esempio calcolato dai numeri ("1.000 €" al posto di "mille euro"), così resta vero se cambia il prezzo del setup.
- **D-057** "Argomenti correlati": stesso tema in altre città, stessa città, tematiche dello stesso hub ruotate, poi il resto. Sostituisce D-036.
- **D-058** Liste di passaggi in righe ferme (`.ev.static`) e card carta non cliccabili in `.bc.static`. Precisa D-021.

## Da decidere

- Le pagine risorse passano ancora il titolo della risorsa come `subject` al form (D-034): negli analytics sono "service inquiry" come lo erano gli articoli del blog. Non toccate (fuori dalla richiesta C4).
- Schema doppi su servizi e casi studio (D-052).
- Testo del margine del partner (D-056) da confermare con Q4 Studio insieme a D-048.

## Verifica

- `npx tsx` sulle correlate: 28 pagine, 28 terne distinte, nessuna autoreferenza.
- `scripts/verify-blog-markdown.ts`: `---` nudo, paragrafo con `|` dopo la tabella, tabella senza pipe iniziale, divisoria senza trattini.
- `npm run build` verde (verify-blog-markdown, verify-gtm-output e verify-agentic passati). In `dist/`: un solo Organization in `index.html`, nessun `#050505` nelle pagine, FAQ markdown separate da righe vuote, "Prezzo: da 1.500 €" nel mirror del tracciamento.
