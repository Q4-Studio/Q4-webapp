import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../SEOHead';
import Marquee from '../Marquee';
import ContactForm from '../ContactForm';
import Footer from '../Footer';
import HomeSeoContent from '../HomeSeoContent';
import Hero2 from './Hero2';
import Statement from './Statement';
import CandianiVisual from './CandianiVisual';
import LeadFlow from './LeadFlow';
import ServicesBento from './ServicesBento';
import Process from './Process';
import CloseCta from './CloseCta';
import { trackCtaClick } from '../../utils/dataLayer';
import { useLightDocument } from '../../hooks/useLightDocument';
import { siteUrl } from '../../data/seoPages';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Preloader sul sistema chiaro: due parole in Hanken Grotesk con il    */
/* gradiente indaco-viola che si alternano al centro su fondo carta,    */
/* contatore scuro in basso a destra, riga di avanzamento e poi sipario */
/* verso l'alto.                                                        */
/* ------------------------------------------------------------------ */

/** I due tempi del lavoro di Q4. Basta cambiare queste stringhe. */
const PRELOADER_WORDS = ['Dati', 'Automazioni'];

const DISPLAY_FONT = "'Hanken Grotesk', 'Inter', Arial, sans-serif";
const GRADIENT_TEXT: React.CSSProperties = {
  background: 'linear-gradient(120deg, #818cf8 0%, #a855f7 55%, #9333ea 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

const Preloader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // `onDone` arriva dal genitore come arrow function inline: se HomeV2 si
  // re-renderizza mentre il preloader è a schermo (es. il fetch blog di
  // App.tsx che risolve durante i ~1,3s di conteggio), la prop cambia identità
  // a ogni render. Una ref tiene sempre l'ultima versione senza far dipendere
  // da essa l'effetto che monta la timeline: così la timeline GSAP parte una
  // sola volta, indipendentemente da quante volte il genitore re-renderizza.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    // Con reduced-motion il sipario non ha senso: si va dritti al contenuto.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDoneRef.current();
      return;
    }

    // Rete di sicurezza armata PRIMA di costruire la timeline: il preloader
    // copre tutta la pagina con z-[9999], quindi non deve mai poter restare
    // bloccato (rAF sospeso nelle webview in-app, tab in background, o un
    // errore in una qualsiasi delle chiamate GSAP qui sotto). Se il timer
    // fosse registrato in fondo, un throw durante la costruzione lascerebbe il
    // sipario a schermo senza alcun modo di toglierlo.
    let tl: gsap.core.Timeline | null = null;

    const failSafe = window.setTimeout(() => onDoneRef.current(), 3000);

    // Se dopo mezzo secondo la timeline non è avanzata di un tick, il ticker di
    // GSAP è fermo (rAF sospeso) e il conteggio non partirà mai: inutile tenere
    // il sipario per i 3 secondi pieni con il contatore bloccato sul 000 del
    // markup, si va subito al contenuto.
    const stallCheck = window.setTimeout(() => {
      if (!tl || tl.totalTime() === 0) onDoneRef.current();
    }, 500);

    try {
      const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
      const counter = { v: 0 };
      // Tempo totale volutamente breve: il preloader sta davanti al contenuto,
      // quindi ogni decimo in piu` pesa su rimbalzo e LCP.
      const total = 1.3; // durata del conteggio, le parole si distribuiscono qui dentro
      const slot = total / PRELOADER_WORDS.length;

      const timeline = gsap.timeline({ onComplete: () => onDoneRef.current() });
      tl = timeline;

      // Contatore 000 → 100 e riga di avanzamento, in parallelo
      timeline.to(counter, {
        v: 100,
        duration: total,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (counterRef.current) counterRef.current.innerText = String(Math.round(counter.v)).padStart(3, '0');
        },
      }, 0);
      timeline.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'power1.inOut' }, 0);

      // Ogni parola entra dal basso, resta, ed esce verso l'alto
      words.forEach((word, i) => {
        const at = i * slot;
        timeline.fromTo(
          word,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.38, ease: 'power3.out' },
          at
        );
        // L'ultima parola resta finché non parte il sipario
        if (i < words.length - 1) {
          timeline.to(word, { yPercent: -110, opacity: 0, duration: 0.3, ease: 'power3.in' }, at + slot - 0.3);
        }
      });

      timeline.to(overlayRef.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, total + 0.05);
    } catch {
      // Senza animazione il sipario non ha più motivo di restare: si va dritti
      // al contenuto invece di aspettare i 3 secondi della rete di sicurezza.
      onDoneRef.current();
    }

    return () => {
      window.clearTimeout(failSafe);
      window.clearTimeout(stallCheck);
      tl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- di proposito: la
    // timeline deve montarsi una sola volta, `onDone` è letta dalla ref sopra.
  }, []);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] bg-[#f7f5fb] overflow-hidden">
      {/* Logo in alto a sinistra */}
      <img
        src="/logo.webp"
        alt="Q4 Studio"
        width={130}
        height={40}
        loading="eager"
        fetchPriority="high"
        className="absolute top-6 left-6 h-7 w-auto brightness-0"
      />

      {/* Parole al centro: un solo slot, le parole si sovrappongono */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {/* Larghezza piena e parole tutte in absolute: così la parola più lunga
            non viene tagliata dall'overflow-hidden usato per lo scorrimento. */}
        <div className="relative w-full h-[1.3em] overflow-hidden" style={{ fontSize: 'clamp(38px, 8vw, 88px)' }}>
          {PRELOADER_WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => { wordsRef.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ ...GRADIENT_TEXT, fontFamily: DISPLAY_FONT, fontWeight: 600, letterSpacing: '-0.05em', opacity: 0 }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Contatore in basso a destra */}
      <span
        ref={counterRef}
        className="absolute bottom-8 right-6 text-[#0a0a0a] tabular-nums leading-none"
        style={{ fontFamily: DISPLAY_FONT, fontWeight: 600, letterSpacing: '-0.05em', fontSize: 'clamp(56px, 13vw, 132px)' }}
      >
        000
      </span>

      {/* Riga di avanzamento in fondo */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-indigo-400 via-purple-500 to-purple-700"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Home v2                                                             */
/* ------------------------------------------------------------------ */

const HomeV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Barra di avanzamento dello scroll
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => trigger.kill();
  }, []);

  // Dopo il preloader ricalcola le posizioni dei trigger
  useEffect(() => {
    if (!loading) ScrollTrigger.refresh();
  }, [loading]);

  useLightDocument();

  // Rete di sicurezza aggiuntiva: il layout può assestarsi anche dopo la fine
  // del preloader (font che finiscono di caricare e cambiano le altezze del
  // testo, immagini che arrivano). Ricalcoliamo le posizioni dei trigger in
  // questi momenti, altrimenti uno ScrollTrigger misurato troppo presto può
  // restare "storto" per tutta la sessione.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    // `load` non arriva mai in alcune webview in-app (Facebook su Android):
    // basta una richiesta che resta pendente e l'evento non scatta più. Senza
    // una rete di sicurezza a tempo, trigger misurati troppo presto restano
    // storti per tutta la sessione.
    window.addEventListener('load', refresh);
    const fallback = window.setTimeout(refresh, 3000);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="home-light relative w-full">
      <SEOHead
        title="Tracciamento Server-Side e Automazioni AI per PMI | Q4 Studio"
        description="Recuperiamo i segnali di conversione che browser e ad blocker bloccano. Tracciamento server-side, Consent Mode, automazioni AI. Reggio Emilia."
        url={`${siteUrl}/`}
      />

      {loading && <Preloader onDone={() => setLoading(false)} />}

      {/* Barra di avanzamento scroll */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100] pointer-events-none">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Grana cinematografica */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[90] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
        }}
      />

      <Hero2 />
      <Marquee tone="light" />
      <Statement />
      <CandianiVisual />
      <LeadFlow />
      <ServicesBento />
      <Process />
      <HomeSeoContent />
      <ContactForm showHeader={false} tone="light" />
      <CloseCta
        title={<>Costruiamo<br />il tuo <span className="grad">vantaggio.</span></>}
        cta={{
          label: 'Vai al tracciamento',
          href: '/tracciamento-server-side',
          onClick: () => trackCtaClick({ cta_location: 'home_mid_cta', cta_label: 'Vai al tracciamento', cta_destination: '/tracciamento-server-side' }),
        }}
      />
      <Footer showCta={false} tone="light" />
    </div>
  );
};

export default HomeV2;
