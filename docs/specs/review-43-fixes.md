# Correzioni dalla review della PR #43

**Data:** 2026-11-21 · **Decisioni:** D-019 · **Richiesta:** Q4 Studio ha ricevuto una review esterna della PR #43 con 10 rilievi; le correzioni vanno in cima alla pila (questo ramo), perché i rilievi 2 e 3 (Reveal, grafico Candiani) erano già risolti in #51 e il codice toccato vive nei rami successivi. Correzioni applicate da Claude Opus su richiesta.

## Cosa cambia

1. Card `.bc`: hover con la proprietà CSS `translate` (non più `transform`), così non si scontra con GSAP; Reveal pulisce gli stili inline a fine ingresso.
3. Contatori "8 ore" / "60 s" partono da 0 prima del primo paint; Marquee, ContactForm e Footer accendono i reveal da "top bottom" per evitare il lampo.
4. Markdown della home: FAQ dalla stessa costante dell'HTML statico (8 FAQ del mockup).
5. FAQ GDPR: testo del mockup ovunque; corretto il Markdown del tracciamento che aveva la versione vecchia.
6. Form chiaro: messaggi di successo/errore e riquadro oggetto leggibili su fondo chiaro; etichetta "Legale" del footer a contrasto.
7. Nav: `ResizeObserver` su `#hero` e ricalcolo a `document.fonts.ready`.
8. Font: pesi di Hanken tutti usati (300 lead, 400 corpo, 500 medium, 600 titoli, 700 strong/h4), quindi invariati; corretto il prerender che non caricava Hanken nelle pagine interne. Space Grotesk e Inter restano per le pagine scure.
9. Navigazione SPA: `utils/navigate.ts` (`goTo`, `onInternalLink`) usato per i link interni di home e pagine chiare; href restano per la SEO; cmd/ctrl-click aprono in nuova scheda.
10. Footer, ContactForm, Marquee: classi per tono in una mappa `tones` per file.

## Decisioni

- **D-019** I click tracciati (`trackCtaClick`) partono prima dell'helper di navigazione, così contano anche con cmd/ctrl-click, come prima.

## Verifica

- `npm run build` verde; `dist/md/index.md` ha le nuove FAQ; Hanken nel `<head>` delle pagine prerenderate.
