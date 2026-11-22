# Leggibilità e primo caricamento delle pagine chiare

**Data:** 2026-11-21 · **Decisioni:** D-011, D-012 · **Richiesta:** Q4 Studio, dopo il controllo visivo delle pagine chiare: testi troppo piccoli (descrizioni sotto le cifre, elenchi nelle card, chip, eyebrow), troppo spazio tra le sezioni, sfarfallio delle animazioni al primo caricamento.

## Comportamento

- Nessun testo sotto i 16px nelle pagine chiare; il corpo delle card, le righe, gli elenchi e le descrizioni stanno a 19-20px (alzati di due punti su richiesta dopo il primo controllo). Vale per tutte le pagine sotto `.home-light` (home, agenti AI, tracciamento, siti web, Meta Ads).
- Spazi verticali ridotti di circa un terzo: sezioni 160px invece di 240px su desktop, titolo→contenuto 80px invece di 120px, chiusure 180/200px invece di 260/280px. Lo sfalsamento delle colonne del bento resta.
- Primo caricamento senza sfarfallio: i blocchi con reveal partono nascosti prima del primo paint e si mostrano quando entrano in viewport; sulle pagine chiare html e body sono bianchi fin dal primo paint (anche nell'HTML prerenderato: `body` bianco in `index.css`, classe e theme-color per rotta in `scripts/prerender.ts`).

## Decisioni

- **D-011** La soglia di leggibilità è nel CSS (`.home-light`): le classi Tailwind piccole (`text-xs`, `text-sm`, `text-[13px]`, `text-[15px]`, `text-base`) vengono alzate lì, così vale anche per i componenti condivisi (form) e per le pagine future senza ritoccare ogni file.
- **D-012** `Reveal` usa IntersectionObserver e `useLayoutEffect` al posto di ScrollTrigger con `immediateRender:false`: il vecchio schema mostrava il contenuto, lo nascondeva e lo faceva rientrare (lo sfarfallio). Un timer di sicurezza mostra il blocco se l'observer non scatta. Lo sfondo di html/body segue la rotta: bianco sulle pagine chiare, #050505 sulle pagine scure (blog, chi siamo, contatti, privacy, risorse, partner, 404), insieme al meta theme-color, sia nel prerender sia in App al cambio rotta (`hooks/useDocumentTheme.ts`, elenco unico in `data/lightRoutes.ts`). Le pagine scure non cambiano nel contenuto, ma barra del browser e overscroll sono scuri come la pagina (vedi review-51-59-fixes.md).

## File

- `index.css`: soglie di dimensione nel blocco `.home-light`.
- `components/home2/Reveal.tsx`, `CandianiVisual.tsx`, `ScrollRevealText.tsx`, `components/ServerSideTracking.tsx` (barre): stato iniziale prima del primo paint.
- `index.html`, `index.css`, `scripts/prerender.ts`, `App.tsx`, `data/lightRoutes.ts`, `hooks/useDocumentTheme.ts`: sfondo e theme-color per rotta.
- Componenti delle pagine chiare: spaziature ridotte.

## Verifica

- `npm run build` verde.
- Controllo visivo: caricare ogni pagina chiara da zero (anche con cache vuota) e verificare che nessun blocco lampeggi; testi leggibili a distanza normale.
