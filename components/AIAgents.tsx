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
  Sparkles,
  Workflow,
} from 'lucide-react';
import SEOHead from './SEOHead';
import MagneticButton from './MagneticButton';
import { siteUrl } from '../data/seoPages';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  {
    icon: <MailCheck className="w-7 h-7" />,
    area: 'Sales Operations',
    title: 'Qualifica e priorità dei lead',
    description: "L'agente legge form, email e note CRM, assegna un punteggio commerciale e prepara il prossimo step per il team sales.",
    inputs: ['Meta lead form', 'CRM', 'WhatsApp'],
    outcome: 'Meno lead freddi in pipeline, risposta più rapida sui contatti ad alta intenzione.',
  },
  {
    icon: <FileText className="w-7 h-7" />,
    area: 'Back office',
    title: 'Documenti, preventivi e data entry',
    description: 'Estrae dati da allegati, messaggi e fogli di lavoro, compila schede operative e genera bozze di documenti controllabili dal team.',
    inputs: ['Email', 'PDF', 'Google Sheet'],
    outcome: 'Ore manuali recuperate ogni settimana e meno errori di trascrizione.',
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    area: 'Customer care',
    title: 'Smistamento richieste e knowledge base',
    description: 'Classifica ticket, propone risposte coerenti con procedure interne e passa al reparto corretto solo quando serve intervento umano.',
    inputs: ['Inbox', 'Helpdesk', 'Documentazione'],
    outcome: 'Tempi di prima risposta più bassi e supporto più uniforme.',
  },
  {
    icon: <LineChart className="w-7 h-7" />,
    area: 'Direzione',
    title: 'Report operativi e alert',
    description: 'Raccoglie dati da CRM, campagne e gestionali, segnala anomalie e prepara sintesi leggibili per marketing, sales e operations.',
    inputs: ['CRM', 'Meta Ads', 'ERP'],
    outcome: 'Decisioni più veloci, basate su dati già ordinati.',
  },
  {
    icon: <MessageSquareText className="w-7 h-7" />,
    area: 'Marketing',
    title: 'Assistente contenuti e follow-up',
    description: 'Trasforma brief, call e domande frequenti in bozze di contenuti, sequenze email e messaggi di follow-up coerenti con il brand.',
    inputs: ['Call notes', 'CRM', 'Brand voice'],
    outcome: 'Produzione più costante senza perdere controllo sul tono.',
  },
  {
    icon: <DatabaseZap className="w-7 h-7" />,
    area: 'Processi interni',
    title: 'Connessione tra software separati',
    description: 'Fa dialogare strumenti che oggi vivono separati, orchestrando passaggi, notifiche, controlli e aggiornamenti automatici.',
    inputs: ['API', 'n8n', 'Make'],
    outcome: 'Processi meno fragili e meno dipendenti da copia-incolla.',
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
    title: 'Disegno dell agente',
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
    description: 'Formiamo il team, monitoriamo output e miglioriamo l agente con dati reali.',
  },
];

const systems = ['CRM', 'Email', 'WhatsApp', 'Google Workspace', 'Excel', 'ERP', 'Meta Ads', 'API', 'n8n', 'Make'];

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

      <section id="use-cases" className="px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <p className="text-cyan-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Use case concreti</p>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">Dove un agente AI produce valore subito.</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Partiamo da casi d'uso pratici, misurabili e vicini al lavoro quotidiano. Ogni agente nasce per ridurre un attrito preciso, non per aggiungere un altro tool da gestire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {useCases.map((item, index) => (
              <article
                key={item.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group rounded-3xl border border-white/10 bg-[#080808] p-6 hover:border-indigo-400/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-indigo-200 group-hover:text-cyan-200 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">{item.area}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.inputs.map((input) => (
                    <span key={input} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300">{input}</span>
                  ))}
                </div>
                <p className="border-l border-indigo-400/40 pl-4 text-sm leading-relaxed text-gray-300">{item.outcome}</p>
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

      <section className="px-6 py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 items-start">
          <div>
            <p className="text-purple-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Integrazioni</p>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">Gli agenti lavorano dove il team lavora già.</h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Colleghiamo gli strumenti esistenti senza stravolgere l'operatività. L'agente diventa un livello intelligente sopra dati, notifiche, documenti e workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              {systems.map((system) => (
                <span key={system} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-gray-300">{system}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-indigo-400/30 bg-indigo-500/[0.06] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 text-indigo-100">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Quando ha senso iniziare</h3>
            </div>
            <ul className="space-y-4 text-gray-300">
              {[
                'Il team perde tempo in copia-incolla, classificazioni o aggiornamenti manuali.',
                'Le informazioni sono distribuite tra CRM, email, fogli e documenti.',
                'Le risposte ai lead o ai clienti dipendono troppo dalla disponibilita delle persone.',
                'Ci sono procedure ripetibili, ma nessuno ha tempo di seguirle sempre allo stesso modo.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
