import React from 'react';

// Versione React della pagina statica generata in scripts/prerender.ts
// (generateContactHtml). Se cambi i testi qui, cambia anche lì: le due versioni
// devono restare sincronizzate perché i crawler senza JS vedono la statica.
const ContactPage: React.FC = () => (
  <div className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
    <main className="max-w-4xl mx-auto relative z-10 space-y-16">
      <header>
        <p className="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">Contatti</p>
        <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">
          Parla con Q4 Studio.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
          Scrivici o chiamaci: rispondiamo entro un giorno lavorativo. Nessun obbligo dopo il primo contatto.
        </p>
      </header>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Canali diretti</h2>
        <ul className="space-y-3 text-lg text-gray-300 max-w-3xl">
          <li>
            Email:{' '}
            <a href="mailto:info@q4.studio" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">info@q4.studio</a>
          </li>
          <li>
            Telefono e WhatsApp:{' '}
            <a href="tel:+393751146803" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">+39 375 114 6803</a>
          </li>
          <li>
            <a href="/#contatti" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Form di contatto sul sito</a>
            : racconta il problema in una frase, ti rispondiamo con il punto di partenza giusto.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Sede</h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
          Reggio Emilia (Emilia-Romagna), Italia. Riceviamo su appuntamento. Il lavoro tecnico si fa in remoto per aziende in tutta Italia.
        </p>
      </section>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Cosa scrivere per ottenere una risposta utile</h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
          Ci aiuta molto sapere: quale problema concreto vuoi risolvere (es. Meta conta meno conversioni delle vendite reali,
          i lead restano senza risposta, serve un sito), quali strumenti usi già (CRM, gestionale, WhatsApp business) e i tempi
          previsti. Con queste informazioni la prima risposta include già un&apos;indicazione di pacchetto, prezzo e tempistica.
        </p>
      </section>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Punti di partenza tipici</h2>
        <ul className="space-y-6 max-w-3xl mb-8">
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-gray-300"><strong className="text-white">Audit tracciamento:</strong> 490 €, 3-5 giorni lavorativi, documento finale tuo anche se non procedi.</li>
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-gray-300"><strong className="text-white">Setup server-side:</strong> da 1.500 €, circa una giornata per siti non-ecommerce.</li>
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-gray-300"><strong className="text-white">Automazioni e agenti AI:</strong> setup da 490 €, canone da 59 a 200 €/mese.</li>
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-gray-300"><strong className="text-white">Siti web con AI:</strong> progetti da 2.999 €, landing page pronte in circa una settimana.</li>
        </ul>
        <p className="text-lg text-gray-300 leading-relaxed">
          <a href="/tracciamento-server-side" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Prezzi tracciamento</a>
          {' · '}
          <a href="/agenti-ai" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Pacchetti automazioni</a>
          {' · '}
          <a href="/siti-web-ai" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Siti web</a>
        </p>
      </section>
    </main>
  </div>
);

export default ContactPage;
