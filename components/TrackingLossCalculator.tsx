import React, { useId, useState } from 'react';
import Reveal from './home2/Reveal';
import { candianiFigures } from '../data/caseStudies';

/* ------------------------------------------------------------------ */
/* Stima dei segnali persi: due campi (spesa pubblicitaria mensile,     */
/* visitatori mensili) e due forchette (budget che lavora su dati       */
/* incompleti, visite non tracciate). Le percentuali sono dichiarate   */
/* sotto il risultato, con la fonte. Nessuna chiamata di rete: tutto   */
/* lato client.                                                         */
/* ------------------------------------------------------------------ */

/** Quota del budget che ottimizza su conversioni non viste (min–max). */
export const BUDGET_SHARE: [number, number] = [0.18, 0.27];
/** Quota delle visite che il browser o un ad blocker nasconde (min–max). */
export const VISITS_SHARE: [number, number] = [0.13, 0.22];

export const CALCULATOR_SOURCE =
  `Forchette basate sulle stime pubblicate da strumenti di verifica del tracciamento (18–21% del budget, 13–16% delle visite, novembre 2026) e sul caso Candiani Denim, dove il server-side ha recuperato il ${candianiFigures.share} delle richieste in 90 giorni. È una stima: l’audit misura il dato reale del tuo sito.`;

const SPEND_PRESETS = [1000, 3000, 5000, 10000, 30000];
const VISITS_PRESETS = [10000, 50000, 100000, 500000, 2000000];

const fmt = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 });
const formatEuro = (n: number) => `${fmt.format(n)} €`;

/** Arrotonda a un numero "pulito" (2 cifre significative) per non fingere precisione. */
const round2 = (n: number) => {
  if (n < 100) return Math.round(n / 10) * 10;
  const magnitude = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / magnitude) * magnitude;
};

const parseNumber = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
};

interface FieldProps {
  id: string;
  label: string;
  value: number;
  presets: number[];
  suffix?: string;
  onChange: (value: number) => void;
}

const Field: React.FC<FieldProps> = ({ id, label, value, presets, suffix, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-[17px] font-medium text-[#0a0a0a]">{label}</label>
    <div className="relative mt-3">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={fmt.format(value)}
        onChange={(event) => onChange(parseNumber(event.target.value))}
        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-[22px] font-semibold tabular-nums text-[#0a0a0a] outline-none focus:border-purple-500"
      />
      {suffix && <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[19px] text-gray-500">{suffix}</span>}
    </div>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label="Valori rapidi">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onChange(preset)}
          className={`cursor-pointer border-0 bg-transparent p-0 text-[16px] tabular-nums ${preset === value ? 'font-semibold text-[#0a0a0a]' : 'text-gray-500 hover:text-[#0a0a0a]'}`}
        >
          {fmt.format(preset)}
        </button>
      ))}
    </div>
  </div>
);

const Result: React.FC<{ label: string; value: string; delay?: number }> = ({ label, value, delay }) => (
  <Reveal delay={delay} className="border-t border-black/10 py-8 first:border-t-0 first:pt-0 last:pb-0">
    <p className="text-[16px] font-medium uppercase tracking-[0.06em] text-gray-500">{label}</p>
    <p className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <span className="disp tabular-nums" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', letterSpacing: '-0.04em' }}>{value}</span>
      <span className="text-[19px] text-gray-500">al mese</span>
    </p>
  </Reveal>
);

const TrackingLossCalculator: React.FC = () => {
  const [spend, setSpend] = useState(5000);
  const [visits, setVisits] = useState(50000);
  const spendId = useId();
  const visitsId = useId();

  const budgetRange = BUDGET_SHARE.map((share) => round2(spend * share));
  const visitsRange = VISITS_SHARE.map((share) => round2(visits * share));

  return (
    <section id="stima" className="scroll-mt-24 px-6 pb-24 md:pb-[160px]" aria-labelledby="stima-titolo">
      <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 py-16 md:rounded-[56px] md:px-20 md:py-[100px]" style={{ background: 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)' }}>
        <div className="dots" aria-hidden="true" />
        <div className="relative">
          <Reveal as="h2" id="stima-titolo" className="h-l max-w-[1000px]" style={{ fontSize: 'clamp(2.25rem, 4.6vw, 4.5rem)' }}>Quanto ti costa il tracciamento che non arriva?</Reveal>
          <Reveal as="p" className="lead mt-7 max-w-[640px] text-gray-700">Inserisci spesa pubblicitaria e visite mensili: stimiamo quanto budget sta ottimizzando su conversioni che le piattaforme non vedono e quante visite restano fuori dai dati.</Reveal>

          <div className="mt-14 grid grid-cols-1 items-start gap-10 md:mt-20 md:grid-cols-2 md:gap-16">
            <Reveal delay={0.1} className="grid gap-10">
              <Field id={spendId} label="Spesa pubblicitaria mensile" value={spend} presets={SPEND_PRESETS} suffix="€" onChange={setSpend} />
              <Field id={visitsId} label="Visitatori unici mensili" value={visits} presets={VISITS_PRESETS} onChange={setVisits} />
            </Reveal>

            <div className="mock p-8 md:p-10" aria-live="polite">
              <Result label="Budget che lavora su dati incompleti" value={`${formatEuro(budgetRange[0])} – ${formatEuro(budgetRange[1])}`} delay={0.14} />
              <Result label="Visite che non arrivano alle piattaforme" value={`${fmt.format(visitsRange[0])} – ${fmt.format(visitsRange[1])}`} delay={0.18} />
            </div>
          </div>

          <Reveal as="p" delay={0.2} className="mt-10 max-w-[760px] text-[16px] leading-normal text-gray-500">{CALCULATOR_SOURCE}</Reveal>
        </div>
      </div>
    </section>
  );
};

export default TrackingLossCalculator;
