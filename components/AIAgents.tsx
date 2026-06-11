import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  DatabaseZap,
  FileText,
  GitBranch,
  Headphones,
  LineChart,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import SEOHead from './SEOHead';
import MagneticButton from './MagneticButton';
import { siteUrl } from '../data/seoPages';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  {
    icon: <MailCheck className="w-7 h-7" />,
    area: 'Back office commerciale',
    title: 'Ordini e richieste cliente trasformati in attività pronte',
    description: "L'agente interpreta email, allegati e messaggi, raccoglie i dati mancanti e prepara una bozza operativa nel sistema corretto.",
    inputs: ['Messaggi cliente', 'Allegati', 'Regole interne'],
    action: 'Bozza ordine + controllo umano',
    outcome: 'Il team non riparte ogni volta da inbox e copia-incolla.',
  },
  {
    icon: <FileText className="w-7 h-7" />,
    area: 'Pre-sales',
    title: 'Preventivi e documenti preparati da template aziendali',
    description: 'Trasforma brief, listini e storico offerte in bozze coerenti, lasciando al consulente revisione, margini e decisione finale.',
    inputs: ['Brief', 'Listini', 'Template'],
    action: 'Offerta in bozza',
    outcome: 'Meno lavoro ripetitivo nella fase che precede la vendita.',
  },
  {
    icon: <LineChart className="w-7 h-7" />,
    area: 'Operations',
    title: 'Consuntivi e attività ricondotti alla commessa giusta',
    description: 'Legge note operative, fogli ore e avanzamenti, propone abbinamenti e porta in evidenza incongruenze da verificare.',
    inputs: ['Note attività', 'Fogli ore', 'Commesse'],
    action: 'Riepilogo validabile',
    outcome: 'Chiusure più ordinate e meno rincorse a fine periodo.',
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    area: 'Assistenza',
    title: 'Ticket instradati con contesto e risposta suggerita',
    description: 'Classifica urgenza, recupera procedure e casi simili, poi suggerisce risposta o reparto di competenza.',
    inputs: ['Ticket', 'Procedure', 'Storico casi'],
    action: 'Priorità + risposta proposta',
    outcome: 'Il supporto resta umano, ma parte già informato.',
  },
  {
    icon: <DatabaseZap className="w-7 h-7" />,
    area: 'Sales',
    title: 'Lead arricchiti, qualificati e assegnati con criteri chiari',
    description: 'Incrocia dati CRM, sorgente, risposte e segnali commerciali per separare priorità vere da contatti da nutrire.',
    inputs: ['CRM', 'Campagne', 'Criteri ICP'],
    action: 'Routing al sales',
    outcome: 'La pipeline diventa più leggibile prima della chiamata.',
  },
  {
    icon: <MessageSquareText className="w-7 h-7" />,
    area: 'Knowledge management',
    title: 'Conoscenza aziendale consultabile senza cercare in dieci posti',
    description: "Un assistente interno recupera procedure, documenti e risposte approvate, citando le fonti e indicando quando serve l'umano.",
    inputs: ['Drive', 'Procedure', 'CRM'],
    action: 'Risposta con fonte',
    outcome: 'Meno interruzioni e meno conoscenza dispersa.',
  },
];

const adoptionSteps = [
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Audit di processo',
    description: 'Mappiamo attività ripetitive, dati disponibili, vincoli e responsabilità umane.',
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Disegno dell'agente",
    description: 'Definiamo regole, prompt, strumenti, escalation e metriche prima di sviluppare.',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Integrazione operativa',
    description: 'Colleghiamo CRM, email, documenti, dashboard e automazioni già presenti.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Adozione e controllo',
    description: "Formiamo il team, monitoriamo output e miglioriamo l'agente con dati reali.",
  },
];

const integrationSystems = [
  { name: 'CRM', detail: 'lead, opportunità, note sales', className: 'lg:col-start-1 lg:row-start-1' },
  { name: 'Email', detail: 'richieste, allegati, follow-up', className: 'lg:col-start-3 lg:row-start-1' },
  { name: 'Gestionale', detail: 'ordini, commesse, anagrafiche', className: 'lg:col-start-1 lg:row-start-3' },
  { name: 'Documenti', detail: 'procedure, offerte, contratti', className: 'lg:col-start-3 lg:row-start-3' },
  { name: 'Fogli dati', detail: 'listini, consuntivi, import', className: 'lg:col-start-2 lg:row-start-1' },
  { name: 'Canali chat', detail: 'WhatsApp, form, helpdesk', className: 'lg:col-start-2 lg:row-start-3' },
];

const AIAgents: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
    setTimeout(() => {
      const contactForm = document.querySelector('section:has(form)');
      contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div ref={pageRef} className="relative overflow-hidden bg-[#050505] text-white">
      <SEOHead
        title="Agenti AI per aziende | Consulenza e automazioni Q4 Studio"
        description="Q4 Studio progetta Agenti AI su misura per sales, back office, customer care e processi interni: audit, sviluppo, integrazione e adozione operativa."
        url={`${siteUrl}/agenti-ai`}
      />

      <section className="relative min-h-screen px-6 pt-36 pb-24 flex items-center border-b border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/3 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-900/15 blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '70px 70px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-6">Agenti AI</p>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter mb-8">
              Consulenti digitali per i processi che rallentano il team.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl">
              Progettiamo agenti AI su misura partendo dal modo in cui la tua azienda lavora: persone, dati, software, controlli e obiettivi commerciali. Non vendiamo chatbot generici, costruiamo sistemi operativi che affiancano il team.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <MagneticButton
                onClick={scrollToContact}
                className="group text-base md:text-lg px-7 py-4 font-semibold border border-white/10 hover:border-white/30"
              >
                <span className="mr-3">Parla con un consulente</span>
                <ArrowRight className="inline-block w-5 h-5 transition-transform group-hover:translate-x-2" />
              </MagneticButton>
              <a
                href="#use-cases"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 px-7 py-4 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors cursor-none"
              >
                Vedi casi d'uso
                <ArrowDownRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm font-mono uppercase tracking-[0.25em] text-gray-500">Agent canvas</p>
                  <h2 className="text-2xl font-bold mt-2">Da processo a sistema</h2>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-200">
                  <Bot className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-4">
                {['Input aziendali', 'Regole operative', 'Azioni automatizzate', 'Controllo umano'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#080808] p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-sm font-mono text-indigo-200">0{index + 1}</span>
                    <span className="font-medium text-gray-200">{item}</span>
                    <GitBranch className="ml-auto h-5 w-5 text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative px-6 py-32 overflow-hidden border-y border-white/10 bg-[#070707]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '96px 96px' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-5xl mb-20">
            <p className="text-cyan-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Use case concreti</p>
            <h2 className="text-5xl md:text-8xl font-bold leading-[0.95] tracking-tighter mb-8">
              Sei playbook operativi, non sei card da catalogo.
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl">
              Ogni agente viene disegnato come una procedura: quali dati legge, quale regola applica, quale azione prepara e dove resta il controllo umano.
            </p>
          </div>

          <div className="space-y-6">
            {useCases.map((item, index) => (
              <article
                key={item.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group grid grid-cols-1 lg:grid-cols-[140px_1fr_420px] gap-6 lg:gap-10 items-stretch rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 md:p-6 hover:border-cyan-300/35 transition-colors"
              >
                <div className="flex lg:flex-col items-center lg:items-start justify-between gap-5 rounded-[1.25rem] border border-white/10 bg-[#050505] p-5">
                  <span className="text-4xl md:text-5xl font-bold text-white/20 font-mono">0{index + 1}</span>
                  <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-300/20 text-cyan-100">
                    {React.cloneElement(item.icon, { className: 'w-9 h-9 md:w-11 md:h-11' })}
                  </div>
                  <span className="hidden lg:block h-px w-full bg-gradient-to-r from-cyan-300/70 to-transparent" />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300/80 mb-5">{item.area}</span>
                  <h3 className="text-3xl md:text-5xl leading-[1.02] font-bold tracking-tight mb-6">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg md:text-xl max-w-3xl">{item.description}</p>
                  <p className="mt-6 border-l border-cyan-300/40 pl-4 text-base text-gray-400">{item.outcome}</p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#050505] p-5 flex flex-col justify-center">
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-5">Flusso agente</p>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <span className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Input</span>
                      <div className="flex flex-wrap gap-2">
                    {item.inputs.map((input) => (
                          <span key={input} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-gray-300">{input}</span>
                    ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 px-4">
                      <span className="h-px flex-1 bg-white/10" />
                      <ArrowRight className="h-4 w-4" />
                      <span className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                      <span className="block text-xs text-cyan-200/70 uppercase tracking-widest mb-2">Output</span>
                      <p className="text-white font-medium">{item.action}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
          <div>
            <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">AI Adoption</p>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">La tecnologia funziona solo se entra nel processo.</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Per questo Q4 Studio lavora come uno studio di consulenza: analizziamo il contesto, costruiamo il primo agente utile, formiamo chi lo userà e definiamo come misurarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {adoptionSteps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-[#080808] p-6">
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-200 border border-indigo-400/20">{step.icon}</span>
                  <span className="text-sm font-mono text-gray-500">0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,#050505_0%,#071016_44%,#130813_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-purple-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Integrazioni</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tighter mb-8">
                Un hub centrale sopra gli strumenti che hai già.
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                L'agente non sostituisce CRM, gestionale o documenti: si mette in mezzo, legge il contesto, applica regole e prepara azioni verificabili.
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-sm font-mono uppercase tracking-[0.25em] text-gray-500 mb-4">Ruolo Q4 Studio</p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Disegniamo connessioni, permessi, fallback e punti di controllo umano prima di automatizzare. Così l'AI entra nel processo senza renderlo più fragile.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4">
              {integrationSystems.map((system) => {
                return (
                  <div
                    key={system.name}
                    className={`${system.className} min-h-[150px] rounded-3xl border border-white/10 bg-white/[0.035] p-5 flex flex-col justify-between`}
                  >
                    <span className="text-sm font-mono uppercase tracking-[0.18em] text-cyan-300/70">{system.name}</span>
                    <p className="text-gray-300 leading-relaxed">{system.detail}</p>
                  </div>
                );
              })}

                <div className="md:col-span-2 lg:col-start-2 lg:row-start-2 min-h-[190px] rounded-3xl border border-cyan-300/30 bg-cyan-300/[0.08] p-6 flex flex-col items-center justify-center text-center shadow-[0_0_60px_-30px_rgba(103,232,249,0.8)]">
                  <Bot className="h-12 w-12 text-cyan-100 mb-4" />
                  <h3 className="text-3xl font-bold mb-2">Agente AI Q4</h3>
                  <p className="text-gray-300 leading-relaxed max-w-sm">Legge, decide secondo regole, prepara l'azione e chiede conferma quando serve.</p>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 hidden h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 lg:block pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-28 border-t border-white/10 bg-[#070707]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <div>
            <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">Quando partire</p>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">Se il processo è ripetibile, l'agente può aiutare.</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Il primo progetto deve essere abbastanza concreto da misurare tempo recuperato, errori evitati o velocità di risposta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              'Il team perde tempo in copia-incolla, classificazioni o aggiornamenti manuali.',
              'Le informazioni sono distribuite tra CRM, email, fogli e documenti.',
              'Le risposte ai lead o ai clienti dipendono troppo dalla disponibilità delle persone.',
              'Ci sono procedure ripetibili, ma nessuno riesce a seguirle sempre allo stesso modo.',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-cyan-300" />
                <p className="text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-6">Next step</p>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">Troviamo il primo processo da trasformare.</h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            In una call analizziamo dove oggi perdi tempo, quali dati hai già e quale agente può generare il primo impatto misurabile.
          </p>
          <MagneticButton
            onClick={scrollToContact}
            className="group text-base md:text-lg px-8 py-4 font-semibold border border-white/10 hover:border-white/30"
          >
            <span className="mr-3">Prenota una consulenza</span>
            <ArrowRight className="inline-block w-5 h-5 transition-transform group-hover:translate-x-2" />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
};

export default AIAgents;
