# Correzioni dalle review delle PR #45, #47 e #48

**Data:** 2026-11-21 · **Decisioni:** D-020, D-021 (in `docs/DECISIONS.md`) · **Richiesta:** Q4 Studio ha ricevuto tre review esterne (Agenti AI, Tracciamento, Siti web). Correzioni applicate da Claude Opus in cima alla pila, perché il codice toccato vive nei rami successivi.

## Cosa cambia

- Nav: il colore di logo, hamburger e "Contatti" si calcola su tutte le pagine (hero scuro → bianchi; oltre l'hero o pagina chiara senza hero → neri; pagine scure → bianchi), con MutationObserver per le pagine lazy.
- "Contatti" della nav e del menu mobile scrolla al form della pagina corrente quando c'è; il router gestisce `#contatti` su ogni path.
- Bento a tre colonne da 1024px in su (prima 768px): niente prezzi tagliati tra 768 e 1100px; `.meta` va a capo.
- Dati condivisi in `data/servicePages.ts` (pacchetti e FAQ di agenti AI e tracciamento) usati da componenti, schema e prerender; schema Offer con `priceFrom` invece del confronto con l'etichetta.
- Pilot WhatsApp senza "Tempi:" duplicato nello statico; alias `#pacchetti-automazioni`.
- Classe `dark-block` per i titoli bianchi nei blocchi scuri; classe `w-block` per lead/CTA/kicker degli hero (i due CTA della home tornano con il gap previsto).
- `trackCtaClick` su tutti i CTA principali delle pagine chiare.
- Sezioni `#contatti` statiche con un testo minimo (form, email, telefono).
- Evidenziazione `.ev` fino a 6 righe (ciclo 13,5 s); stagger delle cifre in ordine.
- Primitive condivise in `components/home2/primitives.tsx` (OkIcon, Bullets, NoteCard, PaperBlock).
- `docs/DECISIONS.md` con numeri reali D-001…D-019; placeholder sostituiti nelle spec.

## Decisioni

- **D-020** Le pagine chiare senza `#hero` (es. in futuro blog chiaro) hanno nav scura dal primo pixel; le pagine scure restano con nav bianca. Il criterio è la presenza di `.home-light` nel DOM.
- **D-021** Il ciclo di evidenziazione `.ev` è unico (13,5 s, 6 slot) per tutte le liste: sulle liste corte resta una pausa a fine ciclo, accettata per non avere due animazioni diverse.

## Fuori scope (decisioni del cliente in sospeso)

- Testo FAQ GDPR (#47-3), FAQ ad-blocker visibile vs solo schema (#47-4), nota "Disdetta libera" sotto Setup come nel mockup (#47-5), `scripts/verify-verbatim.mjs` con FAQ vecchie (non in build).

## Verifica

- `npm run build` verde; HTML statico confrontato prima/dopo: solo le differenze previste.
