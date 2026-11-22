import { candianiFigures } from './caseStudies';
import { formatEuro, formatNumber } from './servicePages';

/* ------------------------------------------------------------------ */
/* Stima dei segnali persi (calcolatore della pagina tracciamento).    */
/* Unica fonte per components/TrackingLossCalculator.tsx e per          */
/* scripts/prerender.ts (HTML statico e markdown): costanti, testo      */
/* della fonte e calcolo. Decisione sulle forchette: D-016.             */
/* ------------------------------------------------------------------ */

/** Quota del budget che ottimizza su conversioni non viste (min–max). */
export const BUDGET_SHARE: [number, number] = [0.18, 0.27];
/** Quota delle visite che il browser o un ad blocker nasconde (min–max). */
export const VISITS_SHARE: [number, number] = [0.13, 0.22];

/** Stime pubblicate da cui partono le forchette (prima dell'allargamento prudente). */
const PUBLISHED_BUDGET: [number, number] = [0.18, 0.21];
const PUBLISHED_VISITS: [number, number] = [0.13, 0.16];

/** Tetti dei campi: oltre questi valori la stima non ha senso. */
export const MAX_SPEND = 10_000_000;
export const MAX_VISITS = 100_000_000;

/** Esempio mostrato nell'HTML statico e nel markdown (stessi valori iniziali del componente). */
export const EXAMPLE_SPEND = 5000;
export const EXAMPLE_VISITS = 50000;

const pct = ([min, max]: [number, number]) => `${Math.round(min * 100)}–${Math.round(max * 100)}%`;

export const CALCULATOR_SOURCE =
  `Forchette applicate: ${pct(BUDGET_SHARE)} del budget e ${pct(VISITS_SHARE)} delle visite, allargate in modo prudente rispetto alle stime pubblicate da strumenti di verifica del tracciamento (${pct(PUBLISHED_BUDGET)} del budget, ${pct(PUBLISHED_VISITS)} delle visite, novembre 2026). Riferimento: nel caso Candiani Denim il server-side ha recuperato il ${candianiFigures.share} delle richieste nei ${candianiFigures.window}. È una stima: l’audit misura il dato reale del tuo sito.`;

/** Arrotonda a un numero "pulito" (2 cifre significative) per non fingere precisione; sotto 100 all'unità. */
export const round2 = (n: number): number => {
  if (n < 100) return Math.round(n);
  const magnitude = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / magnitude) * magnitude;
};

export interface TrackingLossEstimate {
  /** Budget mensile che lavora su dati incompleti, in euro (min–max). */
  budget: [number, number];
  /** Visite mensili che non arrivano alle piattaforme (min–max). */
  visits: [number, number];
}

export const estimateTrackingLoss = (spend: number, visits: number): TrackingLossEstimate => ({
  budget: [round2(spend * BUDGET_SHARE[0]), round2(spend * BUDGET_SHARE[1])],
  visits: [round2(visits * VISITS_SHARE[0]), round2(visits * VISITS_SHARE[1])],
});

export const formatBudgetRange = ([min, max]: [number, number]) => `${formatEuro(min)} – ${formatEuro(max)}`;
export const formatVisitsRange = ([min, max]: [number, number]) => `${formatNumber(min)} – ${formatNumber(max)}`;

const example = estimateTrackingLoss(EXAMPLE_SPEND, EXAMPLE_VISITS);

/** Frase d'esempio per HTML statico e markdown, calcolata dalle stesse costanti. */
export const CALCULATOR_EXAMPLE =
  `Esempio: con ${formatEuro(EXAMPLE_SPEND)} al mese e ${formatNumber(EXAMPLE_VISITS)} visitatori, tra ${formatNumber(example.budget[0])} e ${formatEuro(example.budget[1])} di budget lavorano su dati incompleti e tra ${formatNumber(example.visits[0])} e ${formatNumber(example.visits[1])} visite non arrivano alle piattaforme.`;

export const CALCULATOR_TITLE = 'Quanto ti costa il tracciamento che non arriva?';
export const CALCULATOR_LEAD = 'Inserisci spesa pubblicitaria e visite mensili: stimiamo quanto budget sta ottimizzando su conversioni che le piattaforme non vedono e quante visite restano fuori dai dati.';
export const CALCULATOR_LABELS = {
  spend: 'Spesa pubblicitaria mensile',
  visits: 'Visitatori unici mensili',
  budgetResult: 'Budget che lavora su dati incompleti',
  visitsResult: 'Visite che non arrivano alle piattaforme',
};
