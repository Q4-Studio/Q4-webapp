# Pagina Clienti sul sistema chiaro

**Data:** 2026-11-25 · **Decisioni:** D-064, D-065 · **Riferimento:** mockup "Clienti" (export HTML `Clienti.dc.html` consegnato da Q4 Studio).

## Obiettivo

Nuova pagina `/clienti` con i loghi delle aziende con cui Q4 Studio ha lavorato, costruita sul mockup. Raggiungibile solo dal footer (voce "Clienti" sotto "Esplora"), non dal menu principale né dal menu mobile.

## Comportamento

- Sezioni nell'ordine del mockup: hero scuro senza kicker ("Le aziende con cui abbiamo lavorato.", lead, CTA "Parla con noi" → `#contatti`) → "Chi si è fidato di noi." con la griglia dei 19 loghi a quattro colonne (due sotto i 1000px) e, come ultima card, l'invito scuro "Il prossimo logo potrebbe essere il tuo." → chiusura "Qual è il problema da risolvere?" con CTA "Scrivici" → form contatti generico → footer chiaro.
- Card logo: a riposo fondo carta e logo grigio (raster in scala di grigi, vettori in `currentColor`); al passaggio o al focus da tastiera la card si solleva e diventa bianca, il logo prende il colore del marchio e sale, e dal basso entra la fascia con il lavoro svolto. Su touch (`hover: none`) la fascia è sempre visibile, come nel mockup.
- Candiani Denim e GP Meccatronica sono link ai rispettivi casi studio (freccia nella fascia); le altre card non sono link ma hanno `tabindex` per mostrare la fascia da tastiera.
- Loghi raster: 15 WebP con trasparenza in `public/clienti/`, estratti dai data URI del mockup. QOR, Trenove, Ergootto e Morinat sono SVG inline (`components/clients/ClientLogos.tsx`).
- Mirror statico `/clienti/index.html`, variante Markdown `/md/clienti.md`, voce in sitemap e llms.txt, redirect `Accept: text/markdown` in `vercel.json`.

## Decisioni

- **D-064** La card di GP Meccatronica è un link al suo caso studio, anche se nel mockup solo Candiani lo è: il caso studio esiste e l'etichetta coincide ("Rebranding & Sito Web"). Da confermare con Q4 Studio.
- **D-065** I CTA dell'hero, della card scura e della chiusura portano al form `#contatti` in fondo alla pagina (il mockup linka la pagina Contatti), come nelle altre pagine chiare; la fascia delle card usa 16px (il mockup 15px) per la soglia di leggibilità del sito. `SubHero` accetta ora `kicker` opzionale.

## File e interfacce

- `data/clientsPage.ts`: testi, elenco clienti (`clients`), `clientsPath`.
- `components/ClientsPage.tsx`, `components/clients/ClientLogos.tsx`: pagina e loghi vettoriali.
- `index.css`: classi `.cl` / `.ct` sotto `.home-light`.
- `App.tsx` (rotta `clients`), `components/Footer.tsx` (voce "Clienti"), `components/home2/SubHero.tsx` (kicker opzionale), `components/home2/Reveal.tsx` (`as="li"`).
- `scripts/prerender.ts`, `vercel.json`, `data/seoPages.ts` (`pageLastModified['/clienti']`), `public/clienti/*.webp`.

## Verifica

- `npm run build` verde (verify-agentic passa).
- Controllo visivo a 1440px e 375px sull'anteprima: griglia a 4 e 2 colonne, hover con fascia e colore del logo, card scura che allinea la vicina su mobile, nessun overflow orizzontale.
