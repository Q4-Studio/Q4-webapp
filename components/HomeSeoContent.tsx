import React from 'react';
import { BarChart3, ChevronDown, GitBranch, Target } from 'lucide-react';

const faqs = [
  {
    question: 'In pratica, cos\'è la B2B Lead Generation su Meta?',
    answer: 'È l\'uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate su ICP, messaggio, form, CRM e segnali di qualità.'
  },
  {
    question: 'Meta Ads funziona anche per aziende B2B con cicli di vendita lunghi?',
    answer: 'Sì, se l\'obiettivo non è solo il costo per lead. Nei cicli complessi servono domande qualificanti, follow-up rapido e ottimizzazione su eventi come MQL, SQL e pipeline.'
  },
  {
    question: 'Cosa sono gli Agenti AI personalizzati?',
    answer: 'Sono sistemi costruiti sul processo commerciale dell\'azienda per qualificare lead, rispondere più velocemente, assegnare contatti e automatizzare attività ripetitive.'
  },
  {
    question: 'Perché collegare Meta Ads, CRM e automazioni?',
    answer: 'Perché il CRM restituisce segnali più utili dell\'invio form. Quando questi dati rientrano nel modello di ottimizzazione, le campagne possono cercare contatti più vicini al valore commerciale reale.'
  }
];

const HomeSeoContent: React.FC = () => {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-gray-200">
      <div className="absolute left-1/2 top-24 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-900/10 blur-[140px]" />
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12">
            <div>
              <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-4">Metodo</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Consulenza B2B Lead Generation su Meta</h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-gray-300">
              <p>
                La B2B Lead Generation su Meta è un sistema di acquisizione contatti pensato per trasformare Facebook e Instagram in canali di crescita misurabile anche per aziende con cicli di vendita complessi. Il nostro ruolo non è comportarci da agenzia che esegue campagne a volume, ma da consulenti che affiancano marketing e sales nella costruzione di un funnel più leggibile, tracciabile e sostenibile.
              </p>
              <p>
                Partiamo dall&apos;analisi del processo commerciale: ICP, proposta di valore, segmentazione, creatività, domande qualificanti, routing al CRM e SLA di contatto. Poi traduciamo questa diagnosi in una struttura Meta Ads che ottimizza per qualità del lead e probabilità di avanzamento commerciale, non solo per costo per contatto.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="rounded-3xl border border-white/10 bg-[#080808] p-6">
              <Target className="w-7 h-7 text-indigo-300 mb-5" />
              <h3 className="text-xl font-semibold text-white mb-3">Diagnosi prima delle campagne</h3>
              <p className="text-gray-400 leading-relaxed">Audit di funnel, audience, offerta e gestione lead prima di aumentare budget o test creativi.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#080808] p-6">
              <GitBranch className="w-7 h-7 text-purple-300 mb-5" />
              <h3 className="text-xl font-semibold text-white mb-3">Sistema, non singola ads</h3>
              <p className="text-gray-400 leading-relaxed">Campagne, CRM e follow-up vengono progettati insieme per ridurre dispersione e tempi morti.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#080808] p-6">
              <BarChart3 className="w-7 h-7 text-cyan-300 mb-5" />
              <h3 className="text-xl font-semibold text-white mb-3">Governance dei KPI</h3>
              <p className="text-gray-400 leading-relaxed">Misuriamo MQL, SQL, appuntamenti e pipeline, non solo CPL e performance apparente.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-950/30 to-white/[0.03] p-6 md:p-8">
            <p className="text-indigo-300 font-mono text-xs tracking-[0.3em] uppercase mb-4">Meta Ads Advisory</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Meta Ads orientate alla qualità</h2>
            <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
              <p>
                Lavoriamo come consulenti operativi sulle campagne Meta B2B: audit account, architettura delle campagne, piano test creativo, tracking server-side e lettura dei dati commerciali. L&apos;obiettivo è aiutare il team a capire cosa sta generando opportunità reali e cosa sta solo gonfiando il volume dei lead.
              </p>
              <p>
                L&apos;algoritmo Andromeda dà valore ai segnali di conversione ad alta intenzione. Per questo allineiamo campagne e CRM su eventi come completamento di domande qualificanti, risposta del prospect e progressione nello stage commerciale.
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-purple-950/30 to-white/[0.03] p-6 md:p-8">
            <p className="text-purple-300 font-mono text-xs tracking-[0.3em] uppercase mb-4">AI Process Consulting</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Agenti AI sul processo sales</h2>
            <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
              <p>
                Gli Agenti AI non sono chatbot generici. Li disegniamo insieme al team, partendo da regole operative, tono di voce, CRM e punti di frizione nel processo commerciale. Il risultato è un supporto che qualifica, prioritizza e prepara il lavoro umano invece di sostituirlo.
              </p>
              <p>
                Nei progetti più maturi, l&apos;integrazione Meta Ads + Agenti AI riduce i tempi di prima risposta, aumenta la precisione nel routing e rende il funnel meno dipendente da interventi manuali ripetitivi.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#080808] p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-cyan-300 font-mono text-sm tracking-[0.35em] uppercase mb-4">Misurazione</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Risultati misurabili, leggibili dal team</h2>
              <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
                <p>
                  Ogni attività viene valutata su metriche operative e metriche di business. Oltre ai KPI pubblicitari, tracciamo tempo di presa in carico, tasso di appuntamento, opportunità generate e valore pipeline attribuibile. Questo approccio evita il classico problema delle campagne che sembrano funzionare ma non producono vendite.
                </p>
                <p>
                  In un campione interno di progetti B2B gestiti negli ultimi 12 mesi, abbiamo osservato una crescita media del 31% nel tasso di qualificazione MQL→SQL entro il secondo trimestre di collaborazione. Nei contesti con integrazione completa CRM + automazioni, il miglioramento può arrivare al 48% grazie alla riduzione dei tempi morti tra marketing e sales.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6">
              <p className="text-sm font-mono uppercase tracking-[0.25em] text-indigo-200 mb-5">Focus consulenziale</p>
              <ul className="space-y-4 text-gray-300">
                <li>Audit e priorità operative prima dell&apos;execution.</li>
                <li>Affiancamento a marketing e sales nella lettura dei dati.</li>
                <li>Documentazione di naming, eventi e criteri di qualificazione.</li>
                <li>Decisioni basate su pipeline, non vanity metrics.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="pt-10 border-t border-white/10">
          <div className="mb-8">
            <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Domande frequenti su Meta Ads B2B e Agenti AI</h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              Abbiamo raccolto in un unico punto le risposte operative sulle campagne Meta B2B, sugli Agenti AI e sul collegamento con CRM e automazioni.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors open:border-indigo-400/40 open:bg-indigo-500/[0.06]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">{faq.question}</h3>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-indigo-300 transition-transform group-open:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <p className="mt-5 max-w-3xl text-base md:text-lg text-gray-300 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default HomeSeoContent;
