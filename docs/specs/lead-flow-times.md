# Tempi del flusso lead in parole semplici

**Data:** 2026-11-22 · **Richiesta:** Q4 Studio: "T+0" e simili nella home non sono chiari per il cliente; usare solo "2 secondi".

## Cosa cambia

- Sezione "Dal click al cliente. In automatico." (`components/home2/LeadFlow.tsx`): le etichette tempo passano da `T+0`, `T+2 s`, `T+60 s`, `T+90 s` a `Subito`, `2 secondi`, `60 secondi`, `90 secondi`. `7 giorni` resta.
- Card "Automazioni e agenti AI" nel bento (`components/home2/ServicesBento.tsx`): `T+2 s` e `T+60 s` diventano `2 secondi` e `60 secondi`.
- Mirror statico della home in `scripts/prerender.ts` allineato.

## Verifica

- `npm run build` verde; nessuna stringa `T+` nei componenti, nel prerender e in `dist/`.
