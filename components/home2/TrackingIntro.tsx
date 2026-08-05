import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const included = [
  'Container server-side e infrastruttura dedicata',
  'Consent Mode v2 configurato correttamente',
  'Conversions API per Meta, Enhanced Conversions per Google',
  "Segnali dal CRM alle campagne, non solo l'invio del form",
  "Documentazione di eventi e naming, che resta all'azienda",
];

const TrackingIntro: React.FC = () => (
  <section className="relative overflow-hidden border-t border-white/5 bg-[#050505] px-6 py-32 md:py-44">
    <div className="pointer-events-none absolute -right-48 top-16 h-[520px] w-[520px] rounded-full bg-cyan-900/10 blur-[150px]" />
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
      <div>
        <p className="mb-5 text-sm uppercase tracking-[0.08em] text-cyan-300">Il punto di partenza</p>
        <h2 className="mb-8 text-[clamp(32px,5vw,64px)] font-bold leading-[1.08] tracking-[-0.035em]">
          Prima dei dati giusti, nessuna ottimizzazione funziona.
        </h2>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-gray-300 md:text-xl">
          <p>Il browser blocca gli script. L&apos;ad blocker blocca i pixel. Il consenso limita quello che puoi raccogliere. Risultato: le piattaforme vedono una frazione delle conversioni reali, e ottimizzano su quella frazione.</p>
          <p>Il tracciamento server-side sposta la raccolta dati dal browser a un server che controlliamo noi. I segnali arrivano completi, conformi, e utilizzabili dall&apos;algoritmo.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.035] p-7 md:p-9">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.08em] text-cyan-200">Cosa comprende</p>
        <ul className="space-y-4">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a href="/tracciamento-server-side" className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#050505] transition-colors hover:bg-cyan-100">
          Vedi i pacchetti e i prezzi <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default TrackingIntro;
