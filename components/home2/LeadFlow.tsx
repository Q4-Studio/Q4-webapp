import React from 'react';
import Reveal from './Reveal';

/* ------------------------------------------------------------------ */
/* "Dal click al cliente. In automatico." Cinque righe: tempo, titolo,  */
/* cosa succede. Riga per riga, entrano allo scroll.                   */
/* ------------------------------------------------------------------ */

const steps = [
  { time: 'T+0', title: 'Il lead entra dal feed', desc: 'Modulo Meta compilato dal contatto.' },
  { time: 'T+2 s', title: 'Nel CRM prima che tu lo veda', desc: 'Scheda creata e assegnata in automatico.' },
  { time: 'T+60 s', title: 'Primo contatto in 60 secondi', desc: 'Messaggio WhatsApp inviato al lead.' },
  { time: 'T+90 s', title: 'Il lead diventa un dossier', desc: "Dati dell'azienda arricchiti senza lavoro manuale." },
  { time: '7 giorni', title: 'Ogni lead viene seguito. Sempre.', desc: 'Follow-up programmato fino alla risposta.' },
];

const LeadFlow: React.FC = () => (
  <section id="automazioni" className="px-6 pb-32 md:px-12 md:pb-[240px]">
    <div className="mx-auto max-w-[1440px]">
      <Reveal as="h2" className="h-l max-w-[1100px]">Dal click al cliente. In automatico.</Reveal>
      <div className="mt-20 md:mt-[140px]">
        {steps.map((step) => (
          <Reveal key={step.time} as="article" className="row">
            <span className="tm">{step.time}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default LeadFlow;
