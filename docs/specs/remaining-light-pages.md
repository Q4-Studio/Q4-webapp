# Pagine restanti sul sistema chiaro (blog, articolo, partner tecnico, supporto app, 404)

**Data:** 2026-11-22 · **Decisioni:** D-045, D-046, D-047, D-048, D-049, D-050, D-051 · **Richiesta:** Q4 Studio, "non devono rimanere pagine nere". Per queste pagine il cliente non ha dato un mockup: sono composte solo con i pezzi già approvati nei mockup delle pagine risorse e aziendali (hero corto `SubHero`, card `.bc`, titoli `h-l` + testo, `PaperBlock`, righe `.row`, chiusura `CloseCta`, form e footer chiari). Nessun pattern nuovo.

## Pagine senza mockup: scelte fatte (da confermare con il cliente)

Ogni punto è una scelta fatta senza un mockup. Va confermata o corretta da Q4 Studio.

1. **Blog, indice (/blog).** Hero corto con kicker "Blog", titolo "Guide pratiche su dati, tracciamento e automazioni." e lead nuovi (il vecchio "Il nostro Blog" non regge a dimensione `h-sub`). Titolo e descrizione SEO invariati. Sotto: "Ultimi articoli." e griglia di card a 3 colonne (2 su tablet, 1 su mobile) con la stessa card dell'indice casi studio: copertina 16:9, chip categoria, titolo, data · tempo di lettura, estratto su 3 righe, "Leggi l'articolo". Chiusura "Qualcosa non torna nei tuoi dati?" → form contatti. (D-046)
2. **Filtri e ricerca.** Non esistevano nella pagina scura: non sono stati aggiunti. Con 5 articoli, tutti nella categoria "Tracciamento", un filtro per categoria non servirebbe.
3. **Stato vuoto.** Senza Supabase configurato o senza articoli: card carta "Nessun articolo pubblicato al momento." con link a Risorse e Casi studio. Caricamento ed errore come una riga di testo (`role="status"` / `role="alert"`), senza spinner.
4. **Articolo (/blog/:slug).** Hero corto con la categoria come chip al posto del kicker, titolo a `h-sub` (come gli articoli risorsa, anche se lungo), estratto come lead, poi foto, nome autore, data e tempo di lettura. Copertina sotto l'hero (max 1200px, angoli 28/40px). Il link "Torna al blog" è tolto (come il breadcrumb visibile delle risorse, D-038): il blog è nella nav. (D-047)
5. **Indice dell'articolo ("In questa pagina").** Mantenuto e ristilizzato: card carta a sinistra (260px, sticky da 1024px), sopra il testo su mobile. Link a 16px.
6. **Prosa.** Nuove regole `.home-light .prose-light` in `index.css`: corpo 19px, interlinea 1,75, colonna 760px, h2/h3 in inchiostro, link sottolineati viola come nelle pagine aziendali, elenchi con pallino viola, citazioni in carta con filo viola, codice inline lilla, blocchi di codice scuri, immagini arrotondate, tabelle con intestazione carta e scroll orizzontale interno.
7. **Card autore.** Dopo il testo: card bianca con foto, "Scritto da", nome e ruolo (solo per autori noti in `blogAuthors`). Il vecchio CTA "Contattaci" della card è stato tolto: la chiusura e il form fanno lo stesso lavoro. (D-047)
8. **Articoli correlati.** "Altri articoli." con fino a 3 card: prima la stessa categoria, poi i più recenti. Poi chiusura e form; l'oggetto del form è il titolo dell'articolo (come le risorse, D-034).
9. **Partner tecnico (/partner-tecnico).** Testi invariati. Hero corto con i due CTA del vecchio hero ("Prenota trenta minuti" bianco, "Scrivimi" vetro); tolta l'illustrazione animata (`HeroVisual`). Il problema in blocco carta (titolo a sinistra, testo a destra), "Come funziona." a righe numerate come i passaggi di Agenti AI, la garanzia in blocco carta con la frase grande, "Cosa faccio." in 4 card con prezzo e tempi presi dai pacchetti del tracciamento, "Sul prezzo." e "Chi sono." su due colonne. Chiusura nuova "Trenta minuti, senza il cliente." con CTA al calendario, poi form contatti con oggetto "Partner tecnico". La pagina resta noindex. (D-048)
10. **Supporto app (/#app-support).** Hero corto "Supporto Q4 CRM.", tre card (accesso, bug, richieste generali) e il form di supporto in un blocco carta con le classi del form contatti chiaro. Nessun form contatti né chiusura. Testi invariati, tranne il bottone "Invia la richiesta". (D-049)
11. **404.** Hero corto "Pagina non trovata." con "Torna alla home" e "Torna indietro"; "Da dove ripartire." con 6 card (Tracciamento, Siti web, Agenti AI, Casi studio, Risorse, Blog) e i link sitemap.xml e llms.txt per gli agenti. Nessun form. (D-049)
12. **Errore di caricamento** (`LazyPageErrorBoundary`): stessa pagina minima su fondo bianco con bottoni del sistema chiaro.

## Cosa cambia

### A. Dati e parser condivisi
- A1 `data/extraPages.ts` (nuovo): `blogIndexCopy`, `blogArticleCopy`, `blogAuthors`, `formatPostDate`, `relatedPosts`, `technicalPartnerCopy`, `notFoundCopy`. Unica fonte per componenti, mirror statico e markdown; prezzi del partner da `trackingPackages` (anche il "1.500 €" nel testo "Sul prezzo"). (D-050)
- A2 `lib/blogMarkdown.ts` (nuovo): parser markdown unico per React e prerender (titoli con id per l'indice, paragrafi, elenchi, citazioni `>`, immagini, blocchi di codice, tabelle; link e immagini solo `/`, `#`, `https:`, `mailto:`). Sostituisce i due parser divergenti di `BlogArticle.tsx` e `prerender.ts`; ora la citazione "Punti chiave" dell'articolo sulla Conversions API è una citazione e non un paragrafo che inizia con ">". (D-050)

### B. Componenti
- B1 `components/Blog.tsx`, `components/BlogCard.tsx` (nuovo), `components/BlogArticle.tsx`: riscritti sul sistema chiaro, senza GSAP. `onArticleClick`/`onBack` tolti: le card sono link interni (`onInternalLink`). `BlogArticle` riceve anche `posts` per i correlati.
- B2 `components/BlogSchema.tsx`: invariato salvo `AUTHOR_INFO` letto da `blogAuthors`. Schema BlogPosting nel client come prima; BreadcrumbList solo nel mirror statico, come prima.
- B3 `components/TechnicalPartner.tsx`: riscritto. `components/HeroVisual.tsx` e `hooks/useHeroReveal.ts` eliminati (nessun altro chiamante, verificato con grep).
- B4 `components/AppSupport.tsx`, `components/NotFound.tsx`, `components/LazyPageErrorBoundary.tsx`: sul sistema chiaro, senza GSAP. La 404 imposta il canonical `/404` come la pagina statica.
- B5 `components/home2/SubHero.tsx`: `kicker` accetta un nodo (chip della categoria) e `children` dopo il lead (CTA, metadati). `CloseCta`: `cta.external` per i link fuori dal sito (nuova scheda). `ContactForm`: esporta `lightFormClasses` per il form di supporto.
- B6 `index.css`: regole `.prose-light` e `.toc`; commenti aggiornati (niente più pagine scure).

### C. App e rotte
- C1 `App.tsx`: blog, articolo, partner, supporto app e 404 dentro `.home-light` con `Footer tone="light"`; `ContactForm` chiaro su blog (nessun oggetto), articolo (oggetto = titolo), partner (oggetto "Partner tecnico"); supporto e 404 senza form. Errore del blog da `blogIndexCopy.error`.
- C2 `data/lightRoutes.ts`: `/blog`, `/partner-tecnico` e il prefisso `/blog/` tra le rotte chiare; `UNLISTED_ROUTES_LIGHT = true` rende chiare anche le rotte non elencate (404, hash `#privacy`/`#app-support`), quindi `isLightRoute` vale sempre true. `lightDocument` in App è sparito: `useDocumentTheme(isLightRoute(path))`. La struttura e `DARK_BACKGROUND` restano per poter tornare indietro su una rotta. (D-045) Superato da D-054: `data/lightRoutes.ts`, `useDocumentTheme` e il ramo scuro del prerender sono stati rimossi (review-62-64-fixes.md).

### D. Prerender e markdown (`scripts/prerender.ts`, `vercel.json`)
- D1 `staticPage` ha solo la variante chiara (la scura non ha più chiamanti).
- D2 `generateBlogIndexHtml(posts)`: mirror chiaro con hero, card degli articoli (o stato vuoto) e chiusura; aggiunto lo schema BreadcrumbList. Prima la pagina statica aveva solo uno spinner.
- D3 `generateBlogArticleHtml(post, posts)`: mirror chiaro con hero, copertina, indice, prosa `.prose-light` (stesso parser), autore, correlati, chiusura; schema BlogPosting (autori da `blogAuthors`) e BreadcrumbList invariati.
- D4 `generateTechnicalPartnerHtml`, `generateNotFoundHtml`: mirror chiari dai dati condivisi.
- D5 Markdown: `/md/blog.md` con titolo, lead e articoli (categoria, data, lettura); `/md/blog/<slug>.md` con categoria e ruolo dell'autore, correlati e chiusura; nuovo `/md/partner-tecnico.md` con la sua route `Accept: text/markdown` in `vercel.json`. La 404 non ha markdown: non è una pagina di contenuto (ha già i link a sitemap.xml e llms.txt).

## Decisioni
- D-045 Nessuna rotta scura: `isLightRoute` sempre true tramite `UNLISTED_ROUTES_LIGHT`, struttura mantenuta. Sostituita da D-054 (struttura rimossa).
- D-046 Hero e chiusura del blog con testi nuovi; meta SEO invariati; niente filtri.
- D-047 Articolo: niente "Torna al blog" né CTA nella card autore; categoria come chip nell'hero. Form generico senza oggetto da D-055.
- D-048 Partner tecnico: tolta l'illustrazione `HeroVisual`, prezzi dai pacchetti, nuova chiusura con CTA al calendario e form con oggetto.
- D-049 Supporto app e 404 senza form contatti; 404 con 6 card e link per agenti.
- D-050 Dati e parser markdown del blog condivisi tra React e prerender.
- D-051 Le varianti scure di `ContactForm`, `Footer` e `Marquee` restano nel codice ma senza chiamanti; rimozione in un passaggio separato.

## Fuori scope
- Contenuto degli articoli (Supabase): invariato. **Da segnalare al cliente:** l'articolo "Conversions API Meta…" nomina "Stape" nel testo; va corretto nel CMS (regola D-030), non nel codice.
- Nav, footer, `ContactForm` (salvo l'export delle classi), CaseStudyPage: invariati.
- Varianti `tone="dark"` di `ContactForm`, `Footer`, `Marquee`: ora senza chiamanti, restano (D-051).
- Sul caricamento diretto di `/blog/<slug>` la SPA mostra la home finché arrivano gli articoli da Supabase: comportamento precedente, non toccato.

## Verifica
- `npm run build` verde, `verify-agentic` tutti i controlli passati (varianti markdown per 12 route concrete, partner compreso).
- `dist/blog/index.html`, `dist/blog/<slug>/index.html` (5 articoli, Supabase configurato nel build), `dist/partner-tecnico/index.html`, `dist/404.html`: `<html class="bg-white">`, `theme-color #ffffff`, `<main class="home-light …">`, nessun `#050505`.
- `grep -rl 'bg-\[#050505\]' components/`: solo hero/chiusure scure volute (`SubHero`, hero delle pagine servizio, risorse, casi studio, `Hero2`, il riquadro mock di `SitesWebAI`) e le varianti scure senza chiamanti di `ContactForm`, `Footer`, `Marquee` (D-051).
- Browser (vite preview) a 375 e 1440 px: /blog, due articoli, /partner-tecnico, un path inesistente (404) e /#app-support con body bianco, theme-color bianco, nessun elemento oltre il viewport; prosa a 760px e 19px, indice con 9 voci, 3 correlati e `#contatti` nell'articolo.
