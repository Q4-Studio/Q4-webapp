# Stima dei segnali persi (calcolatore)

**Data:** 2026-11-21 · **Decisioni:** D-XXX-s · **Richiesta:** Q4 Studio: un contatore come "Estimated tracking losses" di Stape, nella pagina Tracciamento.

## Comportamento

- Sezione `#stima` dopo "Cosa sta succedendo.": blocco carta con due campi (spesa pubblicitaria mensile in €, visitatori unici mensili) con valori rapidi, e due risultati nel mock bianco: "Budget che lavora su dati incompleti" (18–27% della spesa) e "Visite che non arrivano alle piattaforme" (13–22% delle visite), al mese, arrotondati a due cifre significative.
- Sotto, la frase sulla fonte: forchette di Stape (18–21% / 13–16%) e caso Candiani (38,3%); dichiarato che è una stima.
- Tutto lato client, nessuna chiamata di rete, nessun dato salvato. `aria-live` sui risultati.
- Contenuto statico no-JS: testo con un esempio numerico e la stessa frase sulla fonte.

## Decisioni

- **D-XXX-s** Percentuali 18–27% (budget) e 13–22% (visite): un po' più ampie di Stape, sotto il 30%, su indicazione di Q4 Studio; il 38,3% di Candiani resta citato come riferimento, non usato nella formula. Si cambiano in `BUDGET_SHARE` e `VISITS_SHARE`.

## File

- `components/TrackingLossCalculator.tsx` (nuovo), `components/ServerSideTracking.tsx`, `scripts/prerender.ts`.

## Verifica

- `npm run build` verde; controllo manuale: 5.000 € → 900–1.400 €; 50.000 visite → 6.500–11.000.
