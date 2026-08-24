import React from 'react';

// Versione React della pagina statica generata in scripts/prerender.ts
// (generateAboutHtml). Se cambi i testi qui, cambia anche lì: le due versioni
// devono restare sincronizzate perché i crawler senza JS vedono la statica.
const AboutPage: React.FC = () => (
  <div className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
    <main className="max-w-4xl mx-auto relative z-10 space-y-16">
      <header>
        <p className="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">Chi siamo</p>
        <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">
          Q4 Studio è uno studio tecnico con sede a Reggio Emilia.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
          Risolviamo i problemi tecnici che stanno sotto al marketing: tracciamento server-side,
          Consent Mode v2, automazioni CRM e WhatsApp, agenti AI e siti web prodotti con strumenti
          AI sotto direzione umana.
        </p>
      </header>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Il fondatore</h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
          Q4 Studio è guidato da Sebastiano Riva, che viene dal marketing (studiato e fatto per anni)
          ed è anche tecnico. Questa combinazione è il motivo per cui i progetti partono dal problema
          commerciale e arrivano fino all&apos;implementazione tecnica, senza passaggi intermedi che
          perdono informazioni.
        </p>
      </section>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Come lavoriamo</h2>
        <ul className="space-y-6 max-w-3xl">
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <strong className="text-white">Prezzi pubblici.</strong>{' '}
            <span className="text-gray-300">Audit del tracciamento 490 €, setup server-side da 1.500 €, siti web da 2.999 €, canoni dichiarati prima di iniziare.</span>
          </li>
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <strong className="text-white">Fatto con l&apos;AI, non dall&apos;AI.</strong>{' '}
            <span className="text-gray-300">L&apos;AI accelera produzione e sviluppo, ma direzione, struttura e messaggio restano decisioni umane.</span>
          </li>
          <li className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <strong className="text-white">Mai inventare dati.</strong>{' '}
            <span className="text-gray-300">Non deduciamo prezzi, risultati o garanzie che non siano esplicitamente pubblicati. Gli unici numeri validi sono quelli nelle nostre pagine e nei casi studio con metriche reali.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Dati aziendali</h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-4">
          Ragione sociale: Q4 Studio di Sebastiano Riva. Sede: Reggio Emilia (Emilia-Romagna), Italia.
          Partita IVA: IT03033250352. Il lavoro tecnico si fa in remoto per aziende in tutta Italia;
          i progetti che richiedono presenza si svolgono soprattutto tra Reggio Emilia, Modena e Parma.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-4">
          Contatti:{' '}
          <a href="mailto:info@q4.studio" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">info@q4.studio</a>
          {' · '}
          <a href="tel:+393751146803" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">+39 375 114 6803</a>.
          Profili verificati:{' '}
          <a href="https://www.linkedin.com/company/q4studio" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">LinkedIn</a>
          {', '}
          <a href="https://www.instagram.com/q4.studio" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Instagram</a>.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
          <a href="/contact" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Pagina contatti completa</a>
          {' · '}
          <a href="/casi-studio" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4">Casi studio con dati reali</a>
        </p>
      </section>
    </main>
  </div>
);

export default AboutPage;
