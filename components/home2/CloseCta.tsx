import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

/* ------------------------------------------------------------------ */
/* Chiusura del sistema chiaro: blocco scuro arrotondato con aurora,   */
/* griglia 60px, titolo enorme, lead opzionale e un CTA bianco.        */
/* Usata in home ("Costruiamo il tuo vantaggio") e nelle pagine        */
/* interne con mockup (agenti AI).                                     */
/* ------------------------------------------------------------------ */

interface CloseCtaProps {
  title: React.ReactNode;
  /** `xl` è la misura della home, `l` quella delle pagine interne. */
  size?: 'xl' | 'l';
  lead?: string;
  cta: { label: string; href: string; onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void };
  id?: string;
}

const TITLE_STYLE: Record<NonNullable<CloseCtaProps['size']>, React.CSSProperties> = {
  xl: { fontSize: 'clamp(3rem, 11.5vw, 12rem)', letterSpacing: '-0.06em', lineHeight: 0.92 },
  l: { fontSize: 'clamp(3.25rem, 9.5vw, 10rem)', letterSpacing: '-0.055em', lineHeight: 0.95 },
};

const CloseCta: React.FC<CloseCtaProps> = ({ title, size = 'xl', lead, cta, id }) => (
  <section id={id} className="px-6 pb-6">
    <div className="close">
      <div className="aur aur-1 opacity-80" aria-hidden="true" />
      <div className="aur aur-2 opacity-80" aria-hidden="true" />
      <div className="grid60" aria-hidden="true" />
      <div className={`relative mx-auto max-w-[1440px] px-6 py-40 text-center md:px-12 ${size === 'xl' ? 'md:py-[100px]' : 'md:py-[180px]'}`}>
        <Reveal as="h2" style={TITLE_STYLE[size]}>
          {title}
        </Reveal>
        {lead && (
          <Reveal as="p" delay={0.12} className="lead mx-auto mt-12 max-w-[560px] text-gray-300">
            {lead}
          </Reveal>
        )}
        <Reveal delay={0.2} className="mt-14 md:mt-20">
          <a href={cta.href} onClick={cta.onClick} className="btn btn-white">
            {cta.label}
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

export default CloseCta;
