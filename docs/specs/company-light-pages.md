# Pagine aziendali sul sistema chiaro (/contact, /about, /privacy)

**Data:** 2026-11-22 · **Decisioni:** D-039, D-040, D-041, D-042, D-043, D-044 · **Richiesta:** portare Contatti, Chi siamo e Privacy & Cookie Policy sui mockup del cliente `Contatti.html`, `About.html` e `Privacy.html`, con form e footer chiari, mirror statico chiaro e markdown coerenti, usando i recapiti e il testo legale reali.

## Cosa cambia

### A. Dati e testi condivisi (`data/companyPages.ts`, nuovo)
- A1 `company`: ragione sociale, sede, P.IVA (con e senza prefisso IT), email, telefono, profili, fondatore e foto. Stessi valori dello schema Organization.
- A2 `contactPageCopy`, `aboutPageCopy`: hero, titoli e testi delle sezioni del mockup, chiusure. Prezzi e tempi derivati da `trackingPackages`, `aiAgentsPackages`, `sitesStartingPrice` (nessun prezzo scritto a mano).
- A3 `privacyPageCopy`, `privacySections`, `cookieSections`: testo legale vigente (quello del vecchio `Privacy.tsx`) parola per parola, strutturato in blocchi (paragrafo, elenco, nota, cookie) per React, HTML statico e markdown (D-043).

### B. Componente condiviso
- B1 `components/home2/SubHero.tsx`: hero scuro corto `.hero.sub` (aurora, kicker, h1 a parole `.w`, lead), `id="hero"`.

### C. Contatti (`components/ContactPage.tsx`)
- C1 Hero "Parla con Q4 Studio.", lead del mockup.
- C2 "Come ci trovi." in blocco carta con anteprima del form; il bottone porta al form `#contatti` (D-040).
- C3 "Canali diretti.": Email (`mailto:`), Telefono e WhatsApp (`tel:`), Sede (non link).
- C4 "Cosa scrivere per una risposta utile." con le tre righe `.ev`.
- C5 "Punti di partenza.": Audit tracciamento, Setup server-side, Automazioni e agenti AI con prezzi dai pacchetti e link a /tracciamento-server-side e /agenti-ai (D-041).
- C6 Chiusura "Qual è il problema da risolvere?" con CTA "Scrivici" al form. Schema ContactPage + SEOHead.

### D. Chi siamo (`components/AboutPage.tsx`)
- D1 Hero "Uno studio tecnico con sede a Reggio Emilia.".
- D2 "Il fondatore." con testo e card foto/nome/ruolo (D-042).
- D3 "Tre principi, ogni progetto." (Prezzi pubblici con prezzi derivati, Fatto con l'AI non dall'AI, Mai inventare dati).
- D4 Fila di cifre 490 € / 1.500 € / 2.999 € (dai pacchetti).
- D5 "Dati aziendali." con righe `.ev` (ragione sociale, sede, P.IVA, email, telefono) e profili verificati.
- D6 Chiusura "Parliamo del tuo problema." con CTA a /contact. Schema AboutPage (mainEntity → Organization) invariato + SEOHead.

### E. Privacy (`components/Privacy.tsx`)
- E1 Hero "Privacy & Cookie Policy." con lead e data di ultimo aggiornamento (5 gennaio 2025).
- E2 "Privacy Policy.": sei righe numerate titolo | testo con gli elenchi originali.
- E3 "Cookie Policy.": Cosa sono i cookie, Cookie tecnici, Cookie analytics, Cookie di marketing, Gestione dei cookie (link ai browser), Link utili, Domande (D-043). Nessuna animazione GSAP, nessun form.

### F. App e rotte
- F1 `App.tsx`: le tre rotte dentro `<div className="home-light relative w-full">` con `Footer showCta={false} tone="light"`; Contatti e Chi siamo con `ContactForm showHeader={false} tone="light"` (sezione `#contatti`), Privacy senza form.
- F2 `data/lightRoutes.ts`: `/about`, `/contact`, `/privacy` in `LIGHT_ROUTES`; `lightDocument` in App non esclude più la privacy e la considera chiara anche come hash (D-044). Non esiste un hash route `#contact`: nulla da preservare.

### G. Prerender (`scripts/prerender.ts`)
- G1 `generateAboutHtml`, `generateContactHtml`, `generatePrivacyStaticHtml` riscritti con `staticPage(body, true)`, stesse sezioni e titoli della UI, dati da `data/companyPages.ts`; Contatti e Chi siamo con la sezione statica `#contatti`.
- G2 `buildTrustMd`: markdown di /about, /contact, /privacy con le sezioni della nuova UI; la privacy contiene il testo legale integrale.

## Fuori scope
- Nav, footer, `ContactForm`, CaseStudyPage: invariati.
- Contenuto del testo legale: invariato. Il mockup ne mostra un riassunto; non è stato adottato (D-043). Se Q4 Studio vuole la versione riassunta va approvata come nuovo testo legale.
- Nessuna sezione del mockup manca nel testo vigente; "Link utili" è nel testo vigente ma non nel mockup ed è stata mantenuta.

## Verifica
- `npm run build` verde, `verify-agentic` tutti i controlli passati (trust pages con h1 e ≥ 500 caratteri, markdown ≥ 200 caratteri).
- `dist/about`, `dist/contact`, `dist/privacy`: `<html class="bg-white">`, `theme-color #ffffff`, `<main class="home-light …">`, h2 nell'ordine della UI.
- `dist/md/about.md`, `contact.md`, `privacy.md` con le sezioni della nuova UI e prezzi dai pacchetti.
- Browser (vite preview): /contact, /about, /privacy e /#privacy con html bianco e theme-color bianco; `#contatti` presente su Contatti e Chi siamo, assente su Privacy; nessuno scroll orizzontale a 375 e 1440 px.
- `grep -ri stape` vuoto su data/, components/, scripts/, App.tsx e sulle pagine generate.
