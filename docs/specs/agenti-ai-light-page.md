# Pagina Agenti AI sul sistema chiaro

**Data:** 2026-11-16 · **Decisioni:** D-XXX-f, D-XXX-g (registrate qui sotto: il repository non ha ancora `DECISIONS.md`) · **Riferimento:** mockup "Agenti AI e automazioni" (export HTML consegnato da Q4 Studio) · **Dipende da:** [homepage-light-restyle](./homepage-light-restyle.md) (PR #43)

## Obiettivo

La pagina `/agenti-ai` passa al sistema chiaro seguendo il mockup, sezione per sezione. Niente conversione "a tema": layout, testi e animazioni sono quelli del mockup.

## Comportamento

- Sezioni, nell'ordine del mockup: hero scuro (aurora, angoli arrotondati, titolo parola per parola, lead, CTA "Vedi i pacchetti" → `#pacchetti`) → "Un problema alla volta." (due colonne) → "Tre passaggi." (tre righe `.row`) → "Scegli il lavoro ripetitivo da togliere al team." (bento a tre colonne sfalsate: assistente + "2 settimane", CRM + "2–3 settimane", WhatsApp + "Pilot pubblico" scuro) → FAQ (4 domande, prima aperta) → "Approfondisci" (tre righe con link) → chiusura scura "Quale attività stai ancora facendo a mano?" con CTA "Scrivici" → form contatti chiaro (`#contatti`) → footer chiaro.
- Testi: quelli del mockup. Il contenuto statico no-JS in `scripts/prerender.ts` rispecchia i nuovi testi; schema Service, BreadcrumbList e FAQPage invariati nei contenuti.
- Animazioni: parole dell'h1 che salgono, aurora in deriva, reveal allo scroll (`<Reveal>`), righe `.ev` che si evidenziano a turno, hover delle card e delle righe. Con `prefers-reduced-motion` tutto è visibile da subito e fermo.
- Nav: sopra l'hero scuro logo e hamburger bianchi (`id="hero"`), neri dopo. Il CTA "Scrivici" e "Contatti" della nav portano al form in fondo alla pagina.
- Mobile: una colonna, bento in colonna, righe in colonna, nessuno scroll orizzontale.

## Decisioni

- **D-XXX-f** Il wrapper `.home-light` (e il relativo CSS) è il sistema chiaro del sito: lo usano anche le pagine interne che hanno un mockup, non solo la home. Il nome della classe resta per non toccare la PR #43.
- **D-XXX-g** La chiusura scura (`CloseCta`) e lo schiarimento di html/body (`useLightDocument`) sono condivisi tra home e pagine interne, invece di duplicare il markup. Sulla pagina agenti la chiusura precede il form, perché il suo CTA "Scrivici" porta al form.

## File e interfacce

- `components/AIAgents.tsx`: riscritta sul mockup; esporta `aiAgentsFaqs`.
- `components/home2/CloseCta.tsx` (nuovo): chiusura condivisa con `size`, `lead`, `cta`.
- `hooks/useLightDocument.ts` (nuovo): estratto da `HomeV2`.
- `components/home2/HomeV2.tsx`: usa `CloseCta` e `useLightDocument`.
- `index.css`: classi `.h-sub`, `.chat`, `.bub`, `.chips`, `.chip`, `.bul`, `.meta` nel blocco `.home-light`.
- `App.tsx`: la route `agenti-ai` è dentro `.home-light`, con form e footer `tone="light"`; il marquee loghi non c'è nel mockup e viene tolto.
- `scripts/prerender.ts`: contenuto statico di `/agenti-ai` allineato (ancora `#pacchetti`).

## Fuori scope

- Le altre pagine interne: ognuna arriva con il proprio mockup.
- `HeroVisual`/`useHeroReveal` restano per le pagine ancora scure.

## Verifica

- `npm run build` verde (vite build, prerender, verify-gtm-output, verify-agentic).
- `dist/agenti-ai/index.html` contiene i nuovi titoli ("Un problema alla volta.", "Tre passaggi.").
- Controllo visivo a 1440px e 375px sull'anteprima: sezioni nell'ordine del mockup, nav leggibile sopra e dopo l'hero, nessuno scroll orizzontale.
