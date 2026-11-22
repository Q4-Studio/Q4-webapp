import React from 'react';
import { Plus } from 'lucide-react';
import Reveal from './home2/Reveal';
import { homeFaqs } from '../data/servicePages';

/** FAQ della home: testi in data/servicePages.ts (`homeFaqs`), gli stessi di schema e prerender. */
const HomeSeoContent: React.FC = () => (
  <section id="faq" className="px-6 pb-24 md:px-12 md:pb-[140px]">
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" className="h-l">Domande frequenti</Reveal>
      <Reveal delay={0.12} className="mt-20 md:mt-[80px]">
        {homeFaqs.map((faq, i) => (
          <details key={faq.question} className="f" open={i === 0}>
            <summary>
              <h3>{faq.question}</h3>
              <span className="pl" aria-hidden="true"><Plus className="h-[18px] w-[18px]" /></span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </Reveal>
    </div>
  </section>
);

export default HomeSeoContent;
