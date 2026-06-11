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
    area: 'Sales Operations',
    title: 'Inserimento ordini da email e WhatsApp',
    description: "L'agente legge richieste, allegati e messaggi, estrae i dati utili e prepara l'ordine nel gestionale prima del controllo umano.",
    inputs: ['Email', 'WhatsApp', 'ERP'],
    outcome: 'Meno copia-incolla, ordini più ordinati e tempi di presa in carico più bassi.',
    gradient: 'from-fuchsia-600/80 via-purple-700/80 to-orange-500/70',
  },
  {
    icon: <FileText className="w-7 h-7" />,
    area: 'Back office',
    title: 'Generazione automatica di preventivi e documenti',
    description: 'Compila bozze di offerte, render, schede tecniche e documenti partendo da brief, listini, modelli e regole aziendali.',
    inputs: ['PDF', 'Listini', 'Template'],
    outcome: 'Documenti più rapidi da produrre, sempre coerenti con le regole interne.',
    gradient: 'from-pink-600/80 via-purple-950/80 to-zinc-200/55',
  },
  {
    icon: <LineChart className="w-7 h-7" />,
    area: 'Operations',
    title: 'Rendicontazione ore con abbinamento alle commesse',
    description: 'Raccoglie consuntivi, note e fogli ore, abbina le attività alle commesse corrette e segnala anomalie prima della chiusura.',
    inputs: ['Timesheet', 'Excel', 'Gestionale'],
    outcome: 'Rendiconti più affidabili e meno rincorse a fine mese.',
    gradient: 'from-orange-600/85 via-fuchsia-800/70 to-indigo-700/65',
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    area: 'Customer care',
    title: 'Assistenza tecnica e customer care automatizzati',
    description: 'Classifica richieste, recupera procedure interne e propone risposte o azioni al reparto giusto, mantenendo escalation controllate.',
    inputs: ['Inbox', 'Helpdesk', 'Knowledge base'],
    outcome: 'Risposte più rapide e supporto più uniforme tra operatori diversi.',
    gradient: 'from-orange-500/80 via-purple-700/75 to-fuchsia-700/80',
  },
  {
    icon: <DatabaseZap className="w-7 h-7" />,
    area: 'Sales',
    title: 'Ricerca, qualificazione e smistamento lead ai commerciali',
    description: 'Arricchisce i contatti, legge segnali commerciali, assegna priorità e inoltra il lead al commerciale più adatto.',
    inputs: ['CRM', 'Meta Ads', 'LinkedIn'],
    outcome: 'Pipeline più pulita e meno tempo perso su contatti fuori target.',
    gradient: 'from-fuchsia-600/80 via-pink-900/75 to-zinc-300/50',
  },
  {
    icon: <MessageSquareText className="w-7 h-7" />,
    area: 'Knowledge',
    title: 'Assistente chat con conoscenza aziendale',
    description: "Risponde a domande interne usando documenti, procedure e dati aziendali, citando le fonti e passando all'umano quando serve.",
    inputs: ['Documenti', 'CRM', 'Drive'],
    outcome: 'Meno interruzioni al team e conoscenza aziendale più accessibile.',
    gradient: 'from-violet-700/80 via-zinc-950/80 to-orange-500/80',
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
  'ERP / GESTIONALI',
  'EMAIL',
  'EXCEL / GOOGLE SHEET',
  'CRM',
  'DOCUMENTI',
  'WHATSAPP',
  'API AZIENDALI',
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

      <section id="use-cases" className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-20 h-[720px] w-[520px] rounded-full bg-fuchsia-900/20 blur-[150px]" />
          <div className="absolute right-0 bottom-10 h-[620px] w-[620px] rounded-full bg-orange-700/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end mb-16">
            <div>
              <p className="text-cyan-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Use case concreti</p>
              <h2 className="text-5xl md:text-8xl font-bold leading-[0.95] tracking-tighter">
                Cosa può fare un agente AI, in pratica.
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl lg:ml-auto">
              Ogni progetto parte da un lavoro reale: ordini, preventivi, rendiconti, ticket, lead, documenti. Qui non parliamo di AI generica, ma di mansioni operative che oggi consumano tempo al team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {useCases.map((item, index) => (
              <article
                key={item.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group relative min-h-[560px] rounded-[2rem] border border-white/10 bg-[#110910] p-4 md:p-5 overflow-hidden hover:border-white/25 transition-colors"
              >
                <div className={`relative h-64 md:h-72 rounded-[1.5rem] overflow-hidden bg-gradient-to-br ${item.gradient} border border-white/15 mb-8`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.45),transparent_22%),radial-gradient(circle_at_72%_72%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.75),transparent_58%)] blur-sm" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="h-28 w-28 md:h-32 md:w-32 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.55)] [&_svg]:h-full [&_svg]:w-full [&_svg]:stroke-[1.8]">
                      {item.icon}
                    </div>
                  </div>
                </div>

                <div className="px-2 md:px-3 pb-3">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">{item.area}</span>
                    <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_18px_rgba(129,140,248,0.9)]" />
                  </div>
                  <h3 className="text-3xl md:text-[2.45rem] leading-[1.02] font-bold tracking-tight mb-5">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg mb-7">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-7">
                    {item.inputs.map((input) => (
                      <span key={input} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">{input}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-white/10 bg-white/[0.08] px-5 py-2 text-sm font-medium text-white shadow-[inset_0_1px_10px_rgba(255,255,255,0.12)]">
                      Scopri
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>

                <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
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

      <section className="relative px-6 py-32 min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_28%_58%,rgba(124,58,237,0.24),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(234,88,12,0.18),transparent_30%),linear-gradient(115deg,#080608_0%,#151825_46%,#23091f_100%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

        <div className="relative z-10 max-w-[1500px] mx-auto">
          <div className="text-center mb-20">
            <p className="text-purple-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Integrazione con sistemi aziendali</p>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter">
              Gli agenti lavorano dove il team lavora già.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
            <div className="space-y-7">
              {integrationSystems.map((system) => {
                const active = system === 'EXCEL / GOOGLE SHEET';
                return (
                  <div
                    key={system}
                    className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.04em] leading-none transition-colors ${active ? 'text-white' : 'text-white/28'}`}
                  >
                    {system}
                  </div>
                );
              })}
            </div>

            <div className="relative space-y-6 md:space-y-0 md:min-h-[720px]">
              <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent hidden md:block" />
              <div className="absolute left-1/2 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-white/70 md:block" />
              <div className="absolute left-1/2 bottom-8 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-white/70 md:block" />

              <div className="relative md:absolute md:right-0 md:top-0 w-full md:w-[58%] rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <div className="h-56 rounded-[1.5rem] bg-gradient-to-br from-orange-500/80 via-fuchsia-700/70 to-cyan-400/70 border border-white/15 flex items-center justify-center">
                  <FileText className="h-24 w-24 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-3xl font-bold mt-6 mb-3">Dati in ingresso</h3>
                <p className="text-gray-300 leading-relaxed">L'agente legge documenti, email, fogli, CRM e sistemi gestionali senza chiedere al team di cambiare abitudini.</p>
              </div>

              <div className="relative md:absolute md:left-0 md:bottom-0 w-full md:w-[58%] rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <div className="h-56 rounded-[1.5rem] bg-gradient-to-br from-fuchsia-600/80 via-purple-900/75 to-orange-500/70 border border-white/15 flex items-center justify-center">
                  <DatabaseZap className="h-24 w-24 text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-3xl font-bold mt-6 mb-3">Azioni controllate</h3>
                <p className="text-gray-300 leading-relaxed">Compila campi, prepara notifiche, aggiorna record, genera bozze e porta all'operatore solo ciò che richiede giudizio.</p>
              </div>
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
