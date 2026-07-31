import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Users,
  Bot,
} from 'lucide-react';
import MagneticButton from '../MagneticButton';
import ScrollRevealText from './ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Scenari del terminale: un agente al lavoro, riga per riga           */
/* ------------------------------------------------------------------ */

type TermLine = { kind: 'in' | 'ok' | 'out'; text: string };
type Scenario = { name: string; lines: TermLine[] };

const scenarios: Scenario[] = [
  {
    name: 'q4-agent · preventivi',
    lines: [
      { kind: 'in', text: 'Nuova email da info@ — richiesta preventivo con disegno allegato' },
      { kind: 'ok', text: "Specifiche estratte dall'allegato" },
      { kind: 'ok', text: 'Listini e offerte simili recuperati dallo storico' },
      { kind: 'ok', text: 'Bozza offerta compilata sul template aziendale' },
      { kind: 'out', text: 'In attesa di revisione umana — tempo totale: 2 min' },
    ],
  },
  {
    name: 'q4-agent · ordini',
    lines: [
      { kind: 'in', text: 'WhatsApp cliente: "Mi servono 40 cartoni del codice FR-200 entro venerdì"' },
      { kind: 'ok', text: 'Ordine riconosciuto nel messaggio' },
      { kind: 'ok', text: 'Codice e disponibilità verificati nel gestionale' },
      { kind: 'ok', text: "Bozza d'ordine pronta con i prezzi da listino" },
      { kind: 'out', text: 'Riepilogo inviato al commerciale — tempo totale: 40 s' },
    ],
  },
  {
    name: 'q4-agent · lead',
    lines: [
      { kind: 'in', text: 'Form sito: "Vorrei informazioni per la mia azienda (32 dipendenti)"' },
      { kind: 'ok', text: 'Dati aziendali arricchiti da fonti pubbliche' },
      { kind: 'ok', text: 'Contatto qualificato secondo i criteri definiti' },
      { kind: 'ok', text: 'Assegnato al commerciale giusto nel CRM' },
      { kind: 'out', text: 'Email di primo contatto inviata — tempo totale: 5 min' },
    ],
  },
];

const AgentTerminal: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [doneLines, setDoneLines] = useState<TermLine[]>([]);
  const [typing, setTyping] = useState<{ line: TermLine; chars: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeouts.push(setTimeout(resolve, ms));
      });

    const run = async () => {
      const scenario = scenarios[scenarioIdx];
      setDoneLines([]);
      setTyping(null);
      await wait(500);
      for (const line of scenario.lines) {
        if (cancelled) return;
        for (let c = 1; c <= line.text.length; c++) {
          if (cancelled) return;
          setTyping({ line, chars: c });
          await wait(14);
        }
        setDoneLines((prev) => [...prev, line]);
        setTyping(null);
        await wait(420);
      }
      await wait(2600);
      if (!cancelled) setScenarioIdx((i) => (i + 1) % scenarios.length);
    };

    run();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [scenarioIdx]);

  const renderLine = (line: TermLine, text: string, key: React.Key, cursor = false) => (
    <div key={key} className="flex items-start gap-2.5 leading-relaxed">
      <span className="mt-1 flex-shrink-0">
        {line.kind === 'in' && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
        {line.kind === 'ok' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
        {line.kind === 'out' && <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />}
      </span>
      <span className={line.kind === 'in' ? 'text-gray-400' : line.kind === 'ok' ? 'text-gray-200' : 'text-indigo-300'}>
        {text}
        {cursor && <span className="inline-block w-2 h-4 bg-indigo-400 ml-0.5 align-middle animate-pulse" />}
      </span>
    </div>
  );

  return (
    <div className="rounded-3xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white/10" />
          <span className="w-3 h-3 rounded-full bg-white/10" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] text-gray-500">{scenarios[scenarioIdx].name}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="p-6 font-mono text-[13px] min-h-[240px] space-y-3">
        {doneLines.map((line, i) => renderLine(line, line.text, `${scenarioIdx}-${i}`))}
        {typing && renderLine(typing.line, typing.line.text.slice(0, typing.chars), 'typing', true)}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const integrations = [
  { name: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { name: 'Email / PEC', icon: <Mail className="w-3.5 h-3.5" /> },
  { name: 'Gestionale / ERP', icon: <Database className="w-3.5 h-3.5" /> },
  { name: 'CRM', icon: <Users className="w-3.5 h-3.5" /> },
  { name: 'Excel / Sheets', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
  { name: 'Calendario', icon: <Calendar className="w-3.5 h-3.5" /> },
];

const Agents2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalWrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        // gsap.fromTo + immediateRender:false: lo stato "spento" viene applicato
        // solo quando il tween parte davvero. Se lo ScrollTrigger, per qualunque
        // motivo, non dovesse scattare (misure prese prima che il layout si
        // assestasse), il contenuto resta visibile invece di sparire per sempre.
        // `once: true` sostituisce il vecchio `toggleActions: '... reverse'`:
        // una volta acceso il contenuto non si spegne più tornando indietro.
        gsap.fromTo(
          '.agents-reveal',
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          }
        );

        // Il terminale sale più lentamente del resto: profondità
        gsap.fromTo(
          terminalWrapRef.current,
          { y: 80 },
          {
            y: -80,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      }

      // Tilt 3D del terminale al passaggio del mouse
      const wrap = tiltRef.current;
      if (wrap && !reduced) {
        const onMove = (e: MouseEvent) => {
          const rect = wrap.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(wrap, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 900, duration: 0.6, ease: 'power2.out' });
        };
        const onLeave = () => gsap.to(wrap, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        wrap.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', onLeave);
        return () => {
          wrap.removeEventListener('mousemove', onMove);
          wrap.removeEventListener('mouseleave', onLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goToAgents = () => {
    window.history.pushState(null, '', '/agenti-ai');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 px-6 bg-[#050505] text-white border-t border-white/5 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-900/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Testo */}
        <div>
          <h2 className="agents-reveal text-4xl md:text-6xl font-bold leading-tight mb-6">
            Colleghi digitali,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              progettati sul tuo processo.
            </span>
          </h2>
          <ScrollRevealText
            text="Agenti costruiti sui processi reali dell'azienda: leggono email e messaggi, interrogano il gestionale, preparano preventivi e ordini, e coinvolgono una persona quando serve una decisione."
            className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-xl"
          />

          <div className="agents-reveal flex flex-wrap gap-2.5 mb-10">
            {integrations.map((item) => (
              <span
                key={item.name}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
              >
                {item.icon}
                {item.name}
              </span>
            ))}
          </div>

          <div className="agents-reveal">
            <MagneticButton onClick={goToAgents} className="text-white">
              <Bot className="w-5 h-5" />
              Esplora gli Agenti AI
              <ArrowUpRight className="w-5 h-5" />
            </MagneticButton>
          </div>
        </div>

        {/* Terminale */}
        <div ref={terminalWrapRef}>
          <div ref={tiltRef} style={{ transformStyle: 'preserve-3d' }}>
            <AgentTerminal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agents2;
