# Passata GSAP sui componenti animati

**Data:** 2026-11-23 · **Decisioni:** D-059, D-060 · **Richiesta:** Q4 Studio: rivedere le animazioni GSAP del sito con le skill ufficiali GreenSock (gsap-react, gsap-performance, gsap-scrolltrigger) e portare in PR solo correzioni concrete, senza nuove librerie.

## Cosa si corregge

- `components/MagneticButton.tsx`: a ogni `mousemove` creava due tween nuovi (bottone e testo) e non li chiudeva allo smontaggio. Ora usa `gsap.quickTo` (un tween riutilizzato per proprietà), rispetta `prefers-reduced-motion` (nessun ascoltatore), e in cleanup uccide i tween e toglie gli stili inline. La prop `strength` non era usata: ora è il fattore di spostamento (default invariato, 0.4 sul bottone, 0.1 sul testo).
- `components/CustomCursor.tsx`: stesso problema su `mousemove` (due tween per evento) → `quickTo`. Gli hover sugli elementi interattivi erano agganciati con `querySelectorAll` al mount: dopo un cambio pagina della SPA i link nuovi non ingrandivano il cursore. Ora un solo ascoltatore delegato su `document` (`mouseover` + `closest`): la scala deriva solo dall'elemento sotto il puntatore, così elementi annidati e link smontati da una navigazione non lasciano il cursore ingrandito. Anche la scala usa `quickTo`. Cleanup completo. `will-change: transform` sui due elementi del cursore.
- `components/Marquee.tsx`: la larghezza di un giro era misurata con `scrollWidth / 3` al mount, prima che le immagini lazy fossero caricate (i loghi hanno larghezza automatica): il loop ripartiva nel punto sbagliato. Ora ogni set di loghi è un blocco identico con il gap come padding finale e la traccia scorre di `xPercent: -100/3`, indipendente dal caricamento. Il loop si mette in pausa quando il blocco è fuori viewport (ScrollTrigger `onToggle`), non gira più per tutta la sessione.

## Cosa non si tocca

- `Reveal`, `ScrollRevealText`, `CandianiVisual`, `ServicesBento.Counter`, `ServerSideTracking.Bar`, `Footer`, `ContactForm`, `HomeV2` (preloader e barra di avanzamento): già conformi (context + revert o kill esplicito, trasformazioni e opacità, refresh dei trigger a font e load).
- Nessun `@gsap/react`: la skill ufficiale ammette `gsap.context()` + `ctx.revert()` in `useEffect`, che è quello che il sito fa già (D-059).

## Decisioni

- **D-059** Non si aggiunge `@gsap/react` (`useGSAP`): il pattern `gsap.context` + `revert` già usato è equivalente per questo sito e si evita una dipendenza.
- **D-060** Niente `will-change` diffuso sui blocchi `[data-reveal]`: solo sugli elementi che si muovono di continuo (cursore, traccia del marquee).

## File

- `components/MagneticButton.tsx`, `components/CustomCursor.tsx`, `components/Marquee.tsx`, `index.css` (solo se serve per `will-change`).

## Verifica

- `npm run build` verde.
- Browser 375/1280/1440: marquee senza salto al riavvio del giro, cursore che ingrandisce sui link anche dopo un cambio pagina, bottone del footer che segue il mouse e torna a posto.
