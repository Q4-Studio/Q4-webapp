# Preloader sul sistema chiaro

**Data:** 2026-11-21 · **Decisioni:** D-XXX-r · **Richiesta:** Q4 Studio: aggiornare il loader della home con i testi e i colori nuovi.

## Comportamento

- Sfondo carta `#f7f5fb`, logo nero, parole "Dati" e "Automazioni" in Hanken Grotesk 600 con il gradiente indaco-viola, contatore scuro in basso a destra, riga di avanzamento con il gradiente. Timeline, rete di sicurezza e reduced-motion invariati.

## Decisioni

- **D-XXX-r** Le parole del preloader sono "Dati" e "Automazioni" (proposta accettata da Q4 Studio): sono i due tempi del lavoro raccontati dalla home chiara. Si cambiano in `PRELOADER_WORDS`.

## File

- `components/home2/HomeV2.tsx` (solo il componente Preloader).

## Verifica

- `npm run build` verde; controllo visivo del primo caricamento della home.
