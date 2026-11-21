import React from 'react';
import Reveal from './Reveal';

/* ------------------------------------------------------------------ */
/* "Come lavoriamo": tre tile scure con blob in deriva e un anello     */
/* tratteggiato che ruota, sfalsate in verticale su desktop.           */
/* ------------------------------------------------------------------ */

const steps = [
  {
    n: '01',
    tile: 't1',
    title: 'Audit',
    desc: 'Mappiamo eventi, consensi e passaggi tra sito, CRM e campagne. Ti consegniamo cosa si perde e dove.',
    offset: '',
    delay: 0,
    shape: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true">
        <circle cx="60" cy="60" r="56" opacity=".35" />
        <g className="rot">
          <circle cx="60" cy="60" r="38" strokeDasharray="3 7" />
          <circle cx="60" cy="4" r="5" fill="#fff" stroke="none" />
        </g>
        <circle cx="60" cy="60" r="10" fill="#fff" stroke="none" />
      </svg>
    ),
  },
  {
    n: '02',
    tile: 't2',
    title: 'Implementazione',
    desc: 'Configuriamo tracciamento e automazioni. Un setup server-side tipico richiede 8 ore.',
    offset: 'md:mt-20',
    delay: 0.12,
    shape: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true">
        <rect x="6" y="6" width="108" height="108" rx="28" opacity=".35" />
        <g className="rot">
          <rect x="26" y="26" width="68" height="68" rx="18" strokeDasharray="3 7" />
        </g>
        <rect x="48" y="48" width="24" height="24" rx="8" fill="#fff" stroke="none" />
      </svg>
    ),
  },
  {
    n: '03',
    tile: 't3',
    title: 'Manutenzione',
    desc: 'Monitoriamo i flussi e correggiamo quando una piattaforma cambia le regole.',
    offset: 'md:mt-40',
    delay: 0.2,
    shape: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true">
        <path d="M60 4 L112 34 V86 L60 116 L8 86 V34 Z" opacity=".35" />
        <g className="rot">
          <path d="M60 24 L94 44 V76 L60 96 L26 76 V44 Z" strokeDasharray="3 7" />
        </g>
        <circle cx="60" cy="60" r="10" fill="#fff" stroke="none" />
      </svg>
    ),
  },
];

const Process: React.FC = () => (
  <section id="processo" className="px-6 pb-24 md:px-12 md:pb-[160px]">
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" className="h-l">Come lavoriamo</Reveal>
      <div className="mt-20 grid grid-cols-1 gap-12 md:mt-[80px] md:grid-cols-3 md:gap-8">
        {steps.map((step) => (
          <Reveal key={step.n} delay={step.delay} className={step.offset}>
            <div className={`tile ${step.tile}`}>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <span className="n">{step.n}</span>
              {step.shape}
            </div>
            <h3 className="mt-8" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>{step.title}</h3>
            <p className="mt-3.5 max-w-[380px] text-[17px] leading-[1.65]">{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
