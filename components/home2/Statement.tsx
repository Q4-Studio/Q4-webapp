import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollRevealText from './ScrollRevealText';
import Reveal from './Reveal';
import { trackCtaClick } from '../../utils/dataLayer';
import { onInternalLink } from '../../utils/navigate';

/* ------------------------------------------------------------------ */
/* "Prima dei dati giusti, nessuna ottimizzazione funziona."            */
/* Titolo grande che si accende parola per parola, lead e CTA scuro.   */
/* ------------------------------------------------------------------ */

const Statement: React.FC = () => (
  <section id="tracciamento" className="px-6 pb-24 pt-24 md:px-12 md:pb-[140px] md:pt-[160px]">
    <div className="mx-auto max-w-[1440px]">
      <ScrollRevealText
        as="h2"
        text="Prima dei dati giusti, nessuna ottimizzazione funziona."
        className="h-l max-w-[1280px]"
        start="top 85%"
        end="bottom 55%"
      />
      <div className="mt-16 grid grid-cols-1 items-end gap-10 md:mt-[120px] md:grid-cols-2 md:gap-24">
        <Reveal as="p" className="lead max-w-[560px]">
          Browser e ad blocker sottraggono conversioni alle piattaforme. Il tracciamento server-side sposta la raccolta su un server controllato da Q4, così Meta e Google ricevono il dato completo.
        </Reveal>
        <Reveal delay={0.12}>
          <a
            href="/tracciamento-server-side"
            className="btn btn-dark"
            onClick={(e) => {
              trackCtaClick({ cta_location: 'home_tracking_intro', cta_label: 'Vedi i pacchetti e i prezzi', cta_destination: '/tracciamento-server-side' });
              onInternalLink('/tracciamento-server-side')(e);
            }}
          >
            Vedi i pacchetti e i prezzi
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Statement;
