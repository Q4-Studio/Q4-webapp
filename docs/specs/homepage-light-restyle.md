# Restyling chiaro della homepage

**Data:** 2026-11-16 · **Decisioni:** D-001, D-002, D-003 · **Riferimento:** mockup "Q4 Studio Homepage Restyle – Homepage.html" (PDF e HTML consegnati da Q4 Studio)

## Obiettivo

La homepage passa da fondo scuro a fondo chiaro, seguendo il mockup: hero scuro con aurora e angoli arrotondati, poi sezioni su bianco e carta (`#f7f5fb`), chiusura scura arrotondata. Il menu diventa chiaro su tutto il sito. Il numero di telefono pubblicato diventa +39 338 357 6286.

## Comportamento

- Sezioni della home, nell'ordine del mockup: hero → loghi clienti → "Prima dei dati giusti…" → dato Candiani con grafico → "Dal click al cliente" (5 righe) → "Tre servizi, un unico sistema" (bento) → "Come lavoriamo" (3 tile) → FAQ (8 domande del mockup) → form contatti (`#contatti`, resta per i CTA "Contatti" di tutto il sito) → chiusura "Costruiamo il tuo vantaggio" → footer.
- Testi: quelli del mockup. Le FAQ in `index.html` (schema FAQPage) e il contenuto statico no-JS in `scripts/prerender.ts` rispecchiano i nuovi testi.
- Animazioni: parole dell'h1 che salgono, aurora in deriva, cue di scroll, marquee loghi, reveal allo scroll delle sezioni, tracciato del grafico che si disegna, contatori "8 ore" e "60 s", righe del flusso lead che si evidenziano, tile con blob e anello rotante. Con `prefers-reduced-motion` tutto è visibile da subito e fermo.
- Menu: pillola bianca con testo scuro ovunque (D-001). Sopra l'hero scuro della home e sulle altre pagine (ancora scure) logo e hamburger restano bianchi; dopo l'hero della home logo e hamburger diventano neri e il bottone "Contatti" nero. Il menu mobile è chiaro.
- Font: la home usa Hanken Grotesk (titoli 600, tracking stretto) come nel mockup; il resto del sito resta su Space Grotesk/Inter (D-002).
- Form contatti e footer hanno una variante chiara (`tone="light"`) usata solo in home; le altre pagine restano scure (D-003).
- Telefono: `+39 338 357 6286` in schema, pagine contatti/chi siamo, footer (valore offuscato), llms.txt e prerender.
- Mobile: una colonna, gutter 24px, nessuno scroll orizzontale.

## Decisioni

- **D-001** Menu chiaro ovunque: pillola bianca con voci scure anche sulle pagine ancora scure. Solo logo, hamburger e "Contatti" cambiano colore in base a ciò che hanno sotto.
- **D-002** Hanken Grotesk solo in home (scope `.home-light`): il resto del sito resta su Space Grotesk/Inter finché non passa al chiaro.
- **D-003** Form contatti e footer hanno una prop `tone` invece di un componente duplicato: la variante chiara la usa solo la home.

## File e interfacce

- `index.css`: blocco `.home-light` con token, bottoni, card, tile, FAQ, keyframes.
- `index.html`: font Hanken Grotesk, schema FAQPage aggiornato, telefono.
- `components/home2/`: `Hero2`, `Statement`, `CandianiVisual`, `LeadFlow`, `ServicesBento`, `Process`, `Reveal`, `HomeV2` (nuovi o riscritti); rimossi `Manifesto2`, `TrackingIntro`, `Pipeline2`, `Agents2`, `Services2`.
- `components/HomeSeoContent.tsx`: FAQ chiare con i nuovi testi.
- `components/Marquee.tsx`, `components/ContactForm.tsx`, `components/Footer.tsx`: prop `tone`.
- `components/MobileMenu.tsx`, `App.tsx`: menu chiaro.
- `scripts/prerender.ts`: contenuto statico della home allineato.

## Fuori scope

- Le altre pagine (tracciamento, agenti AI, blog, casi studio…) restano scure: il passaggio al chiaro di tutto il sito è un'attività separata.
- Installazione del kit `agent-workflow` nel repository (file di progetto, hook, CI): attività separata.

## Verifica

- `npx tsc --noEmit` senza errori.
- `npm run build` verde (vite build, prerender, verify-gtm-output, verify-agentic).
- Nessuna occorrenza del vecchio numero nel repository (`grep -rn "375 114\|3751146803"`).
- Controllo visivo della home a 1440px e 375px: sezioni nell'ordine del mockup, nessuno scroll orizzontale, menu leggibile sopra l'hero e dopo.
