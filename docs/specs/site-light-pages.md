# Pagine interne sul sistema chiaro

**Data:** 2026-11-16 · **Decisioni:** D-XXX-d, D-XXX-e (registrate qui sotto) · **Dipende da:** `docs/specs/homepage-light-restyle.md` (PR #43)

## Obiettivo

Dopo l'approvazione della home chiara, tutto il sito passa allo stesso sistema: fondo bianco, carta `#f7f5fb`, inchiostro `#0a0a0a`, Hanken Grotesk, CTA nere a pillola, accento viola. Nessun cambiamento di testi, rotte, schema o tracciamento.

## Comportamento

- `index.css`: body bianco e Hanken Grotesk per tutto il sito; i token di `.home-light` valgono per tutte le pagine (la classe sta sul `<main>` di `App.tsx`). I default dei titoli usano `:where()` così le utility Tailwind delle pagine vincono.
- Pagine servizio (tracciamento, siti web, agenti AI, Meta advertising, partner tecnico): hero scuro con aurora e angoli arrotondati come in home (`id="hero"`), resto chiaro (D-XXX-d).
- Pagine contenuto e di servizio (blog, articoli, casi studio, risorse, chi siamo, contatti, privacy, supporto app, 404): interamente chiare, senza hero scuro.
- Nav: logo, hamburger e "Contatti" bianchi solo sopra un elemento `#hero`; neri su ogni pagina senza hero scuro. L'hero delle pagine lazy viene osservato con un `MutationObserver`.
- `ContactForm`, `Footer`, `Marquee`: `tone` di default `light`; la variante `dark` resta disponibile per blocchi scuri (D-XXX-e).
- Cookie banner e error boundary chiari. Pagine prerenderate (`scripts/prerender.ts`): stesse classi chiare, stesso font di `index.html`.

## Decisioni

- **D-XXX-d** Le pagine servizio tengono un hero scuro come la home: dà continuità al passaggio dalla home e mantiene i visual di `HeroVisual` (pensati su fondo scuro) senza rifarli.
- **D-XXX-e** Il tema chiaro è il default dei componenti condivisi; `tone="dark"` resta per i blocchi scuri invece di cancellare la variante.

## Fuori scope

- Rifare i visual di `HeroVisual` per il chiaro.
- Il preloader della home (resta scuro: sfocia nell'hero scuro).

## Verifica

- `npm run build` verde.
- `grep` nei componenti per classi solo-scuro (`#050505`, `white/`, `text-gray-400`…) con giustificazione di quelle rimaste (hero scuri).
- Controllo visivo di ogni rotta sull'anteprima del branch.
