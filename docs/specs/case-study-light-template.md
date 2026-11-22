# Casi studio sul sistema chiaro e caso Candiani arricchito

**Data:** 2026-11-21 · **Decisioni:** D-XXX-p, D-XXX-q · **Richiesta:** Q4 Studio: allineare colori, font, dimensioni e stili del template dei casi studio al sistema chiaro (senza mockup: il contenuto è semplice) e arricchire il caso Candiani con i dati di `docs/sources/candiani-2026-11`.

## Comportamento

- Template unico per tutti i casi studio (`CaseStudyPage`): hero scuro con breadcrumb, kicker, titolo parola per parola e sottotitolo → copertina arrotondata → intro → "La sfida" (due colonne) → "Il lavoro" (blocco carta con lista `.ev`) → video dimostrativo se presente → "Il risultato" (tre numeri grandi con gradiente) → blocchi dati aggiuntivi → "Perché conta" → servizi (chip) e "Fonti dei numeri" → chiusura scura con CTA → footer chiaro.
- Indice `/casi-studio`: hero scuro corto e card `.bc` con copertina, categoria, cliente, sottotitolo.
- Modello dati: `CaseStudy.data?: CaseStudyDataBlock[]` (heading, intro, stats e/o rows, note, source) e `CaseStudy.sources?: string[]`. I casi senza dati aggiuntivi non cambiano.
- Candiani: quattro blocchi dati (Meta API Conversions per evento; recupero per evento GA4; perdite per browser; bot filtrati e consenso) con fonte e periodo sotto ogni blocco, più l'elenco delle fonti a fine pagina.
- Contenuto statico no-JS e varianti Markdown allineati (blocchi dati e fonti inclusi).

## Decisioni

- **D-XXX-p** Il template dei casi studio è composto con i pezzi già approvati delle altre pagine chiare, senza mockup dedicato, su indicazione di Q4 Studio.
- **D-XXX-q** Nei blocchi dati i totali "recuperate" per evento sono la somma di ad blocker e tracking prevention del README delle fonti, con la percentuale sul totale delle richieste dell'evento; ogni blocco dichiara strumento, periodo e tabella di origine.

## File

- `components/CaseStudyPage.tsx`, `components/CaseStudiesIndex.tsx`: riscritti sul sistema chiaro.
- `data/caseStudies.ts`: nuovi tipi e dati Candiani.
- `App.tsx`: route dentro `.home-light` con footer chiaro.
- `scripts/prerender.ts`: mirror statici e Markdown dei casi studio.

## Verifica

- `npm run build` verde; `dist/casi-studio/candiani-denim-tracking-server-side/index.html` e la variante `.md` contengono i nuovi blocchi.
- Controllo visivo di Candiani e GP Meccatronica (con video) a 1440px e 375px.
