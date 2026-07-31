import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../SEOHead';
import Marquee from '../Marquee';
import ContactForm from '../ContactForm';
import Footer from '../Footer';
import HomeSeoContent from '../HomeSeoContent';
import Hero2 from './Hero2';
import Manifesto2 from './Manifesto2';
import Pipeline2 from './Pipeline2';
import Agents2 from './Agents2';
import Services2 from './Services2';
import ScrollRevealText from './ScrollRevealText';
import { siteUrl } from '../../data/seoPages';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Preloader editoriale: due parole in serif corsivo che si alternano    */
/* al centro, contatore in basso a destra, riga di avanzamento e poi    */
/* sipario verso l'alto.                                               */
/* ------------------------------------------------------------------ */

/** I due tempi del lavoro di Q4. Basta cambiare queste stringhe. */
const PRELOADER_WORDS = ['Web', 'Agenti'];

const SERIF_ITALIC = "'Times New Roman', Georgia, 'Playfair Display', serif";

const Preloader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Con reduced-motion il sipario non ha senso: si va dritti al contenuto.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return;
    }

    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    const counter = { v: 0 };
    // Tempo totale volutamente breve: il preloader sta davanti al contenuto,
    // quindi ogni decimo in piu` pesa su rimbalzo e LCP.
    const total = 1.3; // durata del conteggio, le parole si distribuiscono qui dentro
    const slot = total / PRELOADER_WORDS.length;

    const tl = gsap.timeline({ onComplete: onDone });

    // Contatore 000 → 100 e riga di avanzamento, in parallelo
    tl.to(counter, {
      v: 100,
      duration: total,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.innerText = String(Math.round(counter.v)).padStart(3, '0');
      },
    }, 0);
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'power1.inOut' }, 0);

    // Ogni parola entra dal basso, resta, ed esce verso l'alto
    words.forEach((word, i) => {
      const at = i * slot;
      tl.fromTo(
        word,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.38, ease: 'power3.out' },
        at
      );
      // L'ultima parola resta finché non parte il sipario
      if (i < words.length - 1) {
        tl.to(word, { yPercent: -110, opacity: 0, duration: 0.3, ease: 'power3.in' }, at + slot - 0.3);
      }
    });

    tl.to(overlayRef.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, total + 0.05);

    // Rete di sicurezza: il preloader copre tutta la pagina, quindi non deve mai
    // poter restare bloccato (rAF sospeso, GSAP che non parte, tab in background).
    const failSafe = window.setTimeout(onDone, 3000);

    return () => {
      window.clearTimeout(failSafe);
      tl.kill();
    };
  }, [onDone]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden">
      {/* Logo in alto a sinistra */}
      <img
        src="/logo.webp"
        alt="Q4 Studio"
        width={130}
        height={40}
        loading="eager"
        fetchPriority="high"
        className="absolute top-6 left-6 h-7 w-auto"
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
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-gray-300"
              style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', opacity: 0 }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Contatore in basso a destra */}
      <span
        ref={counterRef}
        className="absolute bottom-8 right-6 text-white tabular-nums leading-none"
        style={{ fontFamily: SERIF_ITALIC, fontSize: 'clamp(56px, 13vw, 132px)' }}
      >
        000
      </span>

      {/* Riga di avanzamento in fondo */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CTA unica: apre la sezione contatti, il form segue subito sotto     */
/* ------------------------------------------------------------------ */

const FinalCTA: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        // fromTo + immediateRender:false + once: sostituisce gsap.from(...) con
        // toggleActions '... reverse'. Se il trigger non scatta mai (misure
        // prese prima che il layout finisse di assestarsi) il contenuto resta
        // visibile invece di restare bloccato a opacity 0; una volta acceso,
        // non si rispegne più tornando indietro con lo scroll.
        gsap.fromTo(
          '.cta-reveal',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
          }
        );
        gsap.to('.cta-ghost', {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-36 md:pt-48 pb-16 px-6 bg-[#050505] text-white border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="cta-ghost absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap select-none pointer-events-none font-bold"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(120px, 20vw, 320px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(129, 140, 248, 0.06)',
        }}
      >
        FUTURE-READY — FUTURE-READY —
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="cta-reveal text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-8">
          Costruiamo il tuo
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            vantaggio.
          </span>
        </h2>
        <ScrollRevealText
          as="p"
          text="Raccontaci la tua sfida: ti mostriamo come trasformarla in un sistema che cresce."
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed"
        />
      </div>
    </section>
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
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div className="relative w-full bg-[#050505] text-white">
      <SEOHead
        title="Q4 Studio | AI Marketing Partner per PMI B2B"
        description="Studio di consulenza per crescita B2B: AI applicata al marketing, lead generation automatizzata e agenti AI che alleggeriscono i processi aziendali."
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
      <Manifesto2 />
      <Pipeline2 />
      <Agents2 />
      <Services2 />
      <Marquee />
      <HomeSeoContent />
      <FinalCTA />
      <ContactForm showHeader={false} />
      <Footer showCta={false} />
    </div>
  );
};

export default HomeV2;
