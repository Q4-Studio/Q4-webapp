import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BellRing,
  CheckCheck,
  Database,
  Mail,
  Megaphone,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Clock,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Dati della pipeline: Meta → CRM → WhatsApp → Enrichment → Follow-up */
/* ------------------------------------------------------------------ */

type Step = {
  id: string;
  label: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ReactNode;
  accent: { text: string; border: string; bg: string; shadow: string };
};

const steps: Step[] = [
  {
    id: 'meta',
    label: 'META ADS',
    title: 'Il lead entra dal feed.',
    desc: 'Campagne Meta progettate su ICP e offerta. Il form qualifica già in partenza: chi compila è davvero in target.',
    time: 'T+0 s',
    icon: <Megaphone className="w-5 h-5" />,
    accent: { text: 'text-blue-400', border: 'border-blue-400/50', bg: 'bg-blue-500', shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.35)]' },
  },
  {
    id: 'crm',
    label: 'CRM',
    title: 'Nel CRM prima che tu lo veda.',
    desc: 'Il contatto viene creato in pipeline con fonte, campagna e priorità. Assegnato al commerciale giusto, con il contesto già pronto.',
    time: 'T+2 s',
    icon: <Database className="w-5 h-5" />,
    accent: { text: 'text-indigo-400', border: 'border-indigo-400/50', bg: 'bg-indigo-500', shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.35)]' },
  },
  {
    id: 'whatsapp',
    label: 'WHATSAPP',
    title: 'Primo contatto in 60 secondi.',
    desc: 'Un messaggio personalizzato parte mentre il lead è ancora sul telefono. La velocità di risposta è la prima leva di conversione.',
    time: 'T+60 s',
    icon: <MessageCircle className="w-5 h-5" />,
    accent: { text: 'text-emerald-400', border: 'border-emerald-400/50', bg: 'bg-emerald-500', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]' },
  },
  {
    id: 'enrichment',
    label: 'ENRICHMENT',
    title: 'Il lead diventa un dossier.',
    desc: "Dati aziendali arricchiti da fonti pubbliche: dimensione, settore, segnali di priorità. Il commerciale sa con chi parla prima di chiamare.",
    time: 'T+90 s',
    icon: <Sparkles className="w-5 h-5" />,
    accent: { text: 'text-purple-400', border: 'border-purple-400/50', bg: 'bg-purple-500', shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]' },
  },
  {
    id: 'followup',
    label: 'FOLLOW-UP',
    title: 'Ogni lead viene seguito. Sempre.',
    desc: 'Sequenze automatiche su più canali finché il lead risponde. Il sistema insiste, il team vende.',
    time: 'GIORNI 1–7',
    icon: <BellRing className="w-5 h-5" />,
    accent: { text: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-500', shadow: 'shadow-[0_0_30px_rgba(34,211,238,0.35)]' },
  },
];

/* ------------------------------------------------------------------ */
/* Mini-visual per ogni fase (mock UI)                                 */
/* ------------------------------------------------------------------ */

const VisualShell: React.FC<{ label: string; accent: Step['accent']; children: React.ReactNode }> = ({ label, accent, children }) => (
  <div className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
      <span className={`font-mono text-[10px] tracking-[0.25em] ${accent.text}`}>{label}</span>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white/10" />
        <span className="w-2 h-2 rounded-full bg-white/10" />
        <span className={`w-2 h-2 rounded-full ${accent.bg} animate-pulse`} />
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const StepVisual: React.FC<{ step: Step }> = ({ step }) => {
  switch (step.id) {
    case 'meta':
      return (
        <VisualShell label="META · LEAD FORM" accent={step.accent}>
          <div className="pipe-stagger flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-blue-300 text-sm">
              MR
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Mario Rossi</p>
              <p className="text-xs text-gray-400">Direttore Commerciale — Meccanica Estense Srl</p>
            </div>
          </div>
          <div className="pipe-stagger mt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400">
              Campagna: B2B — Preventivo
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[11px] font-mono text-blue-300">
              Nuovo lead
            </span>
          </div>
        </VisualShell>
      );
    case 'crm':
      return (
        <VisualShell label="CRM · PIPELINE" accent={step.accent}>
          <div className="pipe-stagger flex gap-2 mb-4 flex-wrap">
            {['Nuovo', 'Qualificato', 'Opportunità', 'Cliente'].map((stage, i) => (
              <span
                key={stage}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                  i === 0 ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300' : 'bg-white/5 border-white/10 text-gray-500'
                }`}
              >
                {stage}
              </span>
            ))}
          </div>
          <div className="pipe-stagger space-y-2 text-xs font-mono text-gray-400">
            <p><span className="text-gray-600">fonte:</span> Meta Ads — Lead Form</p>
            <p><span className="text-gray-600">assegnato a:</span> <span className="text-white">Riccardo (Sales)</span></p>
            <p><span className="text-gray-600">priorità:</span> <span className="text-indigo-300">alta</span></p>
          </div>
        </VisualShell>
      );
    case 'whatsapp':
      return (
        <VisualShell label="WHATSAPP BUSINESS" accent={step.accent}>
          <div className="pipe-stagger max-w-[90%] ml-auto bg-emerald-500/15 border border-emerald-400/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-200">
            Ciao Mario, grazie per la richiesta. Ti va una call di 10 minuti domani alle 11 per parlarne?
            <span className="flex justify-end mt-1 text-emerald-400">
              <CheckCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="pipe-stagger mt-3 max-w-[70%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
            <span className="flex gap-1.5 items-center h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </VisualShell>
      );
    case 'enrichment':
      return (
        <VisualShell label="DATA ENRICHMENT" accent={step.accent}>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {[
              ['Dipendenti', '45'],
              ['Settore', 'Meccanica di precisione'],
              ['Fatturato', '€ 8,2M'],
              ['Sito e LinkedIn', 'Verificati'],
            ].map(([k, v]) => (
              <div key={k} className="pipe-stagger rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">{k}</p>
                <p className="text-white font-medium">{v}</p>
              </div>
            ))}
          </div>
          <div className="pipe-stagger mt-3 flex items-center gap-2 text-[11px] font-mono text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            Dossier completo inviato al commerciale
          </div>
        </VisualShell>
      );
    default:
      return (
        <VisualShell label="FOLLOW-UP ENGINE" accent={step.accent}>
          <div className="space-y-3">
            {[
              { icon: <Phone className="w-3.5 h-3.5" />, when: '+10 min', what: 'Chiamata del commerciale' },
              { icon: <Mail className="w-3.5 h-3.5" />, when: '+1 giorno', what: 'Email con caso studio' },
              { icon: <MessageCircle className="w-3.5 h-3.5" />, when: '+3 giorni', what: 'Promemoria WhatsApp' },
              { icon: <BellRing className="w-3.5 h-3.5" />, when: 'sempre', what: 'Ogni lead resta presidiato' },
            ].map((row) => (
              <div key={row.what} className="pipe-stagger flex items-center gap-3 text-xs">
                <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center flex-shrink-0">
                  {row.icon}
                </span>
                <span className="font-mono text-gray-500 w-16 flex-shrink-0">{row.when}</span>
                <span className="text-gray-300">{row.what}</span>
              </div>
            ))}
          </div>
        </VisualShell>
      );
  }
};

/* ------------------------------------------------------------------ */
/* Header condiviso                                                    */
/* ------------------------------------------------------------------ */

const PipelineHeader: React.FC = () => (
  <div className="mb-12 md:mb-10">
    <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
      Dal click al cliente.
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">In automatico.</span>
    </h2>
    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
      Il nostro sistema di lead generation collega Meta, CRM e WhatsApp: ogni lead viene arricchito, contattato e
      seguito, dal primo click alla firma.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Versione desktop: sezione pinnata, impulso che percorre il circuito */
/* ------------------------------------------------------------------ */

const PipelineDesktop: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        onUpdate: (self) => {
          const p = self.progress;
          const railH = railRef.current?.clientHeight ?? 0;
          gsap.set(fillRef.current, { scaleY: p });
          gsap.set(pulseRef.current, { y: p * railH });

          // Nodo attivo: soglie ai 5 punti del rail
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Transizione della card a ogni cambio di fase
  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(cardRef.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    const staggered = cardRef.current.querySelectorAll('.pipe-stagger');
    if (staggered.length) {
      tl.fromTo(staggered, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.25');
    }
    return () => {
      tl.kill();
    };
  }, [active]);

  const step = steps[active];

  return (
    <div ref={sectionRef} className="relative" style={{ height: '480vh' }}>
      <div ref={pinRef} className="h-screen flex flex-col justify-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <PipelineHeader />

          <div className="grid grid-cols-12 gap-10 items-center">
            {/* Card della fase attiva */}
            <div className="col-span-7">
              <div ref={cardRef} key={active} className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-mono text-sm text-gray-600 tracking-widest">
                    0{active + 1}<span className="text-gray-700">/05</span>
                  </span>
                  <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${step.accent.border} ${step.accent.text} bg-white/5 font-mono text-[11px] tracking-[0.2em]`}>
                    <Clock className="w-3.5 h-3.5" />
                    {step.time}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">{step.desc}</p>
                <div className="max-w-md">
                  <StepVisual step={step} />
                </div>
              </div>
            </div>

            {/* Circuito verticale */}
            <div className="col-span-5 flex justify-center">
              <div ref={railRef} className="relative h-[52vh] min-h-[380px] flex flex-col justify-between items-center py-0">
                {/* Linea di base */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10" />
                {/* Linea di avanzamento */}
                <div
                  ref={fillRef}
                  className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-blue-400 via-indigo-400 to-cyan-400 origin-top"
                  style={{ transform: 'scaleY(0)' }}
                />
                {/* Impulso */}
                <div ref={pulseRef} className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_6px_rgba(129,140,248,0.8)]" />
                </div>

                {steps.map((s, i) => {
                  const reached = i <= active;
                  const current = i === active;
                  return (
                    <div key={s.id} className="relative z-10 flex items-center gap-4" style={{ width: '100%', justifyContent: 'center' }}>
                      <div className="relative">
                        {current && (
                          <span className={`absolute inset-0 rounded-full ${s.accent.bg} opacity-30 animate-ping`} />
                        )}
                        <div
                          className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 bg-[#050505] ${
                            reached ? `${s.accent.border} ${s.accent.text} ${current ? s.accent.shadow : ''} scale-100` : 'border-white/10 text-gray-600 scale-90'
                          }`}
                        >
                          {s.icon}
                        </div>
                      </div>
                      <span
                        className={`absolute left-[calc(50%+3rem)] font-mono text-[11px] tracking-[0.25em] transition-colors duration-500 whitespace-nowrap ${
                          reached ? s.accent.text : 'text-gray-700'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Versione mobile / reduced-motion: timeline verticale                */
/* ------------------------------------------------------------------ */

const PipelineMobile: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pipe-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="px-6 py-24">
      <div className="max-w-xl mx-auto">
        <PipelineHeader />
        <div className="relative pl-9">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-indigo-400/60 to-cyan-400/60" />
          <div className="space-y-10">
            {steps.map((s, i) => (
              <div key={s.id} className="pipe-card relative">
                <div className={`absolute -left-9 top-0 w-7 h-7 rounded-full border bg-[#050505] flex items-center justify-center ${s.accent.border} ${s.accent.text}`}>
                  <span className="scale-[0.65] flex">{s.icon}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-gray-600">0{i + 1}/05</span>
                  <span className={`font-mono text-[10px] tracking-[0.2em] ${s.accent.text}`}>{s.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <StepVisual step={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const useDesktopMotion = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(query.matches && !reduced.matches);
    update();
    query.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);
  return enabled;
};

const Pipeline2: React.FC = () => {
  const desktop = useDesktopMotion();
  return (
    <section className="relative bg-[#050505] text-white border-t border-white/5">
      {desktop ? <PipelineDesktop /> : <PipelineMobile />}
    </section>
  );
};

export default Pipeline2;
