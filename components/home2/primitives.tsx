import React from 'react';
import { Check } from 'lucide-react';
import Reveal from './Reveal';

/* ------------------------------------------------------------------ */
/* Primitive condivise del sistema chiaro (.home-light in index.css):   */
/* spunta viola, elenco puntato, card nota sotto il bento e blocco      */
/* carta arrotondato con i puntini.                                     */
/* ------------------------------------------------------------------ */

/** Spunta nel cerchio viola delle righe `.ev`. */
export const OkIcon: React.FC = () => (
  <span className="ok" aria-hidden="true">
    <Check className="h-3 w-3" strokeWidth={3} />
  </span>
);

/** Elenco puntato `.bul`. */
export const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="bul">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

/** Card chiara che si sovrappone alla card sopra (`.ov`) con una frase. */
export const NoteCard: React.FC<{ text: string; delay?: number; minHeight?: number }> = ({ text, delay, minHeight = 240 }) => (
  <Reveal as="article" delay={delay} className="bc ov justify-center" style={{ minHeight, background: '#f7f5fb' }}>
    <p className="d m-0 font-medium" style={{ color: '#0a0a0a', marginTop: 0 }}>{text}</p>
  </Reveal>
);

export const PAPER_BG = 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)';

/**
 * Blocco carta arrotondato con i puntini. `className` va sul contenitore
 * interno (layout: grid, colonne…); `padding` sostituisce quello standard.
 */
export const PaperBlock: React.FC<{ className?: string; padding?: string; children: React.ReactNode }> = ({
  className = '',
  padding = 'px-7 py-20 md:px-20 md:py-[100px]',
  children,
}) => (
  <div className={`relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] md:rounded-[56px] ${padding}`} style={{ background: PAPER_BG }}>
    <div className="dots" aria-hidden="true" />
    <div className={`relative ${className}`.trim()}>{children}</div>
  </div>
);
