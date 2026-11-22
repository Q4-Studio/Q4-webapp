# Pagina Siti web sul sistema chiaro

**Data:** 2026-11-21 · **Decisioni:** D-007 · **Riferimento:** mockup "Siti web con AI" (export HTML consegnato da Q4 Studio) · **Dipende da:** [tracking-light-page](./tracking-light-page.md) (PR #47).

## Obiettivo

La pagina `/siti-web-ai` passa al sistema chiaro seguendo il mockup, sezione per sezione.

## Comportamento

- Sezioni, nell'ordine del mockup: hero scuro ("Fatto con l’AI, non dall’AI.", lead, CTA "Progetti da 2.999 €" → `#contatti`) → "L’AI abbassa il costo della produzione. Non il livello delle scelte." → quattro cifre (2.999 €, 7 giorni, 3 fasi, 1 referente) → bento "Più linguaggi, nello stesso progetto." (tre colonne sfalsate con riquadro icona, card note sotto, una scura) → blocco carta "Una pagina può essere pronta in una settimana." con mock del browser e chip → blocco scuro caso studio GP Meccatronica con chip, CTA al caso studio e lista `.ev` → "Tre fasi, non un modulo da compilare." (tre card) → blocco carta "Cosa serve da te." → FAQ (4, prima aperta) → chiusura "Il prossimo sito non deve sembrare il precedente." con CTA "Parlaci del progetto" → form contatti chiaro (oggetto "Sito web AI") → footer chiaro.
- Testi: quelli del mockup. Le due FAQ con testo accorciato (costo, foto/video) sono aggiornate anche nello schema e nel contenuto statico.
- Contenuto statico no-JS in `scripts/prerender.ts` allineato.
- Nav: logo e hamburger bianchi sull'hero (`id="hero"`), neri dopo.

## Decisioni

- **D-007** Implementazione del componente delegata a Claude Opus su richiesta di Q4 Studio; CSS, routing, prerender, spec, verifica e PR a cura della sessione principale. Il vecchio mock del browser animato con GSAP e l'immagine hero di GP Meccatronica non sono nel mockup e vengono rimossi dalla pagina (restano nel caso studio).

## File e interfacce

- `components/SitesWebAI.tsx`: riscritta sul mockup.
- `index.css`: `.ico` (riquadro icona) e `.bar` allineata al mockup (14px, #efe7fb).
- `App.tsx`: route `sites` dentro `.home-light`, form e footer `tone="light"`.
- `scripts/prerender.ts`: contenuto statico e FAQ di `/siti-web-ai` allineati.

## Verifica

- `npm run build` verde.
- Controllo visivo a 1440px e 375px sull'anteprima.
