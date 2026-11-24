# Caso Candiani: prima il fondo del funnel

**Data:** 2026-11-24 · **Decisioni:** D-062, D-063 · **Richiesta:** Q4 Studio, su feedback esterno di un lettore commerciale: rendere il caso più facile da capire per chi compra, aprire con gli acquisti recuperati invece del 38,3% astratto, rispondere in anticipo ai due dubbi tecnici (il +133% è deduplicato? perché i numeri GA scendono dopo il filtro bot?) e coprire il lettore B2B che vede solo eventi e-commerce.

## Cosa cambia

- "Il risultato" apre con le quote di funnel: 58,5% degli acquisti (79 su 135) e 45,6% degli inizi di checkout (523 su 1.148) recuperati; il 752.423 con la ripartizione tracking prevention / ad blocker resta come terza cifra. Nota finale in linguaggio da marketing manager.
- Sezione Meta: il +133% spiegato come "per ogni 100 inizi di acquisto visti dal pixel, dal server ne sono arrivati altri 133", con la nota che la metrica di Meta è già al netto della deduplicazione (stesso `event_id` su pixel e server).
- Tabella per evento: aggiunta la riga SignUp (invio modulo, 5.198 richieste, 2.329 recuperate, 44,8%) con la nota che un invio di modulo B2B si perde nella stessa misura.
- Sezione bot: nota di una riga sul perché i numeri di Analytics scendono (erano gonfiati; ordini e fatturato non cambiano).
- "Perché conta": frase sull'algoritmo che ottimizza su metà della realtà.
- Pagina Tracciamento, blocco Candiani (componente e mirror statico): una frase con le due quote di funnel. `candianiFigures` guadagna `purchaseShare` e `checkoutShare`.

## Decisioni

- **D-062** Il caso Candiani apre con le quote del fondo del funnel (acquisti, inizi di checkout), il 38,3% sul totale delle richieste resta come terza cifra. Numeri sempre da `candianiFigures` e dalla copia privata delle fonti.
- **D-063** Il +133% di Meta è presentato come già deduplicato: è la definizione della metrica di Meta ("conversioni aggiuntive registrate dall'API Conversions rispetto al solo pixel") e la deduplicazione per `event_id` è tra i lavori fatti. Da confermare da Q4 Studio che il server non invii a Meta eventi di utenti con opt-out, altrimenti la nota va precisata.

## File

- `data/caseStudies.ts`, `components/ServerSideTracking.tsx`, `scripts/prerender.ts`.

## Verifica

- `npm run build` verde; mirror statico e markdown del caso con le nuove cifre; pagina nel browser a 375 e 1280.
