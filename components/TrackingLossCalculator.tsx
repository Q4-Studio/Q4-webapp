import React, { useId, useState } from 'react';
import Reveal from './home2/Reveal';
import { formatNumber } from '../data/servicePages';
import {
  CALCULATOR_LABELS,
  CALCULATOR_LEAD,
  CALCULATOR_SOURCE,
  CALCULATOR_TITLE,
  EXAMPLE_SPEND,
  EXAMPLE_VISITS,
  MAX_SPEND,
  MAX_VISITS,
  estimateTrackingLoss,
  formatBudgetRange,
  formatVisitsRange,
} from '../data/trackingCalculator';

/* ------------------------------------------------------------------ */
/* Stima dei segnali persi: due campi (spesa pubblicitaria mensile,     */
/* visitatori mensili) e due forchette (budget che lavora su dati       */
/* incompleti, visite non tracciate). Costanti, calcolo e testo della   */
/* fonte stanno in data/trackingCalculator.ts (gli stessi del           */
/* prerender). Nessuna chiamata di rete: tutto lato client.             */
/* ------------------------------------------------------------------ */

const SPEND_PRESETS = [1000, 3000, 5000, 10000, 30000];
const VISITS_PRESETS = [10000, 50000, 100000, 500000, 2000000];

/** Cifre intere prima della virgola ("5.000,50" → 5000), con tetto massimo. */
const parseNumber = (raw: string, max: number) => {
  const digits = raw.split(',')[0]!.replace(/[^\d]/g, '');
  return digits ? Math.min(Number(digits), max) : 0;
};

interface FieldProps {
  id: string;
  label: string;
  presetsLabel: string;
  value: number;
  max: number;
  presets: number[];
  suffix?: string;
  onChange: (value: number) => void;
}

const Field: React.FC<FieldProps> = ({ id, label, presetsLabel, value, max, presets, suffix, onChange }) => {
  // Mentre il campo ha il focus mostriamo la stringa digitata (anche vuota):
  // riformattare a ogni tasto sposterebbe il cursore. Si formatta al blur.
  const [draft, setDraft] = useState<string | null>(null);
  const maxLength = formatNumber(max).length + 3;

  return (
    <div>
      <label htmlFor={id} className="block text-[19px] font-medium text-[#0a0a0a]">{label}</label>
      <div className="relative mt-3">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={maxLength}
          value={draft ?? formatNumber(value)}
          onFocus={() => setDraft(value ? formatNumber(value) : '')}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(parseNumber(event.target.value, max));
          }}
          onBlur={() => setDraft(null)}
          className={`w-full rounded-2xl border border-black/10 bg-white py-4 pl-5 text-[22px] font-semibold tabular-nums text-[#0a0a0a] outline-none focus:border-purple-500 ${suffix ? 'pr-12' : 'pr-5'}`}
        />
        {suffix && <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[19px] text-gray-500" aria-hidden="true">{suffix}</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label={presetsLabel}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-pressed={preset === value}
            onClick={() => onChange(preset)}
            className={`cursor-pointer border-0 bg-transparent p-0 text-[17px] tabular-nums ${preset === value ? 'font-semibold text-[#0a0a0a]' : 'text-gray-600 hover:text-[#0a0a0a]'}`}
          >
            {formatNumber(preset)}
          </button>
        ))}
      </div>
    </div>
  );
};

const Result: React.FC<{ label: string; value: string; delay?: number }> = ({ label, value, delay }) => (
  <Reveal delay={delay} className="border-t border-black/10 py-8 first:border-t-0 first:pt-0 last:pb-0">
    <div aria-live="polite" aria-atomic="true">
      <p className="text-[17px] font-medium uppercase tracking-[0.06em] text-gray-500">{label}</p>
      <p className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="disp tabular-nums" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', letterSpacing: '-0.04em' }}>{value}</span>
        <span className="text-[19px] text-gray-500">al mese</span>
      </p>
    </div>
  </Reveal>
);

const TrackingLossCalculator: React.FC = () => {
  const [spend, setSpend] = useState(EXAMPLE_SPEND);
  const [visits, setVisits] = useState(EXAMPLE_VISITS);
  const spendId = useId();
  const visitsId = useId();

  const estimate = estimateTrackingLoss(spend, visits);

  return (
    <section id="stima" className="scroll-mt-24 px-6 pb-24 md:pb-[160px]" aria-labelledby="stima-titolo">
      <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 py-16 md:rounded-[56px] md:px-20 md:py-[100px]" style={{ background: 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)' }}>
        <div className="dots" aria-hidden="true" />
        <div className="relative">
          <Reveal as="h2" id="stima-titolo" className="h-l max-w-[1000px]" style={{ fontSize: 'clamp(2.25rem, 4.6vw, 4.5rem)' }}>{CALCULATOR_TITLE}</Reveal>
          <Reveal as="p" className="lead mt-7 max-w-[640px] text-gray-700">{CALCULATOR_LEAD}</Reveal>

          <div className="mt-14 grid grid-cols-1 items-start gap-10 md:mt-20 md:grid-cols-2 md:gap-16">
            <Reveal delay={0.1} className="grid gap-10">
              <Field id={spendId} label={CALCULATOR_LABELS.spend} presetsLabel="Valori rapidi per la spesa pubblicitaria" value={spend} max={MAX_SPEND} presets={SPEND_PRESETS} suffix="€" onChange={setSpend} />
              <Field id={visitsId} label={CALCULATOR_LABELS.visits} presetsLabel="Valori rapidi per i visitatori unici" value={visits} max={MAX_VISITS} presets={VISITS_PRESETS} onChange={setVisits} />
            </Reveal>

            <div className="mock p-8 md:p-10">
              <Result label={CALCULATOR_LABELS.budgetResult} value={formatBudgetRange(estimate.budget)} delay={0.14} />
              <Result label={CALCULATOR_LABELS.visitsResult} value={formatVisitsRange(estimate.visits)} delay={0.18} />
            </div>
          </div>

          <Reveal as="p" delay={0.2} className="mt-10 max-w-[760px] text-[17px] leading-normal text-gray-600">{CALCULATOR_SOURCE}</Reveal>
        </div>
      </div>
    </section>
  );
};

export default TrackingLossCalculator;
