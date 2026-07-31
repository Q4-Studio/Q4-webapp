import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight, Bot, Target, Database, MessageCircle, BarChart3, Zap } from 'lucide-react';
import MagneticButton from '../MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Video di sfondo dell'hero: copre tutta l'area, a opacità ridotta    */
/* così il titolo resta leggibile anche in cima alla pagina. Niente    */
/* overlay/scrim: l'opacità è applicata direttamente al <video>.       */
/* Sostituito da un fermo immagine se l'utente preferisce meno         */
/* animazioni.                                                         */
/* ------------------------------------------------------------------ */

// Opacità abbassata (da 0.45) e desaturazione via filter direttamente sul
// video: nessun overlay/scrim, il titolo bianco e il gradiente risaltano di
// più su uno sfondo neutro e più tenue.
const HERO_VIDEO_OPACITY = 0.28;
const HERO_VIDEO_FILTER = 'grayscale(1) contrast(1.05) brightness(1.05)';

const HeroBackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // React non riflette sempre l'attributo `muted` nel DOM: lo forziamo via
    // ref perché senza (insieme a playsInline) iOS blocca l'autoplay.
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  useEffect(() => {
    // Il video non ha altezza intrinseca nel flusso (è absolute inset-0), ma
    // il suo caricamento può comunque coincidere con altri assestamenti di
    // layout (font, immagini). Ricalcoliamo le posizioni dei trigger quando
    // ha davvero un frame pronto, per sicurezza.
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => ScrollTrigger.refresh();
    video.addEventListener('loadeddata', onLoaded);
    return () => video.removeEventListener('loadeddata', onLoaded);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-poster.jpg')",
          opacity: HERO_VIDEO_OPACITY,
          filter: HERO_VIDEO_FILTER,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster="/hero-poster.jpg"
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity: HERO_VIDEO_OPACITY, filter: HERO_VIDEO_FILTER }}
    >
      <source src="/hero-bg.mp4" type="video/mp4" />
    </video>
  );
};

/* ------------------------------------------------------------------ */
/* Ticker di parole chiave in fondo all'hero                           */
/* ------------------------------------------------------------------ */

const tickerItems = [
  { label: 'LEAD GENERATION B2B', icon: <Target className="w-3.5 h-3.5" /> },
  { label: 'AGENTI AI', icon: <Bot className="w-3.5 h-3.5" /> },
  { label: 'META ADS', icon: <Zap className="w-3.5 h-3.5" /> },
  { label: 'CRM AUTOMATION', icon: <Database className="w-3.5 h-3.5" /> },
  { label: 'WHATSAPP FOLLOW-UP', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { label: 'DIGITAL ANALYTICS', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

const HeroTicker: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const singleWidth = track.scrollWidth / 3;
    const tween = gsap.fromTo(track, { x: 0 }, { x: -singleWidth, duration: 26, ease: 'none', repeat: -1 });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-white/5 py-4 overflow-hidden bg-[#050505]/60 backdrop-blur-sm">
      <div ref={trackRef} className="flex whitespace-nowrap items-center gap-10 text-[11px] tracking-[0.25em] text-gray-500">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-indigo-500/70">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const Hero2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Split manuale dei titoli in caratteri (word-safe)
      const splitChars = (el: HTMLElement | null) => {
        const targets: HTMLElement[] = [];
        if (!el) return targets;
        const original = el.innerText;
        el.innerHTML = '';
        original.split(' ').forEach((word, i, arr) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          word.split('').forEach((char) => {
            const c = document.createElement('span');
            c.innerText = char;
            c.style.display = 'inline-block';
            c.style.opacity = '0';
            wordSpan.appendChild(c);
            targets.push(c);
          });
          el.appendChild(wordSpan);
          if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
        });
        return targets;
      };

      const chars1 = splitChars(line1Ref.current);

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(containerRef.current, { opacity: 1, duration: 0.4 })
        .fromTo(
          kickerRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          chars1,
          { y: 110, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.022, duration: 0.9, ease: 'back.out(1.6)' },
          '-=0.15'
        )
        // La riga con gradiente non viene splittata in caratteri: figli con
        // opacity/transform rompono background-clip:text. Reveal come blocco.
        .fromTo(
          line2Ref.current,
          { y: 90, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0% -20% 0%)', duration: 1.1, ease: 'power4.out' },
          '-=0.55'
        )
        .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo(canvasWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, '-=1.2');

      // Parallasse allo scroll: livelli che scorrono a velocità diverse.
      // L'opacità del video è già ridotta in modo fisso (HERO_VIDEO_OPACITY,
      // sul tag <video>): qui animiamo solo la posizione, non l'opacità del
      // wrapper. Se avessimo animato anche l'opacity del wrapper, i due valori
      // si sarebbero moltiplicati e in fondo all'hero il video sarebbe quasi
      // sparito: il cliente vuole che scrollando resti visibile com'è ora.
      gsap.to(canvasWrapRef.current, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(ghostRef.current, {
        yPercent: -38,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(contentRef.current, {
        yPercent: 12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '75% top', scrub: true },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    document.querySelector('section:has(form)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const goToAgents = () => {
    window.history.pushState(null, '', '/agenti-ai');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-[#050505] opacity-0">
      {/* Video di sfondo: copre tutta l'area dell'hero. La leggibilità del
          titolo è affidata all'opacità ridotta del video stesso (HERO_VIDEO_OPACITY),
          non a un overlay/scrim sopra. */}
      <div ref={canvasWrapRef} className="absolute inset-0 z-0">
        <HeroBackgroundVideo />
      </div>

      {/* Ghost text in parallasse */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute -right-8 bottom-[-6%] z-0 select-none pointer-events-none font-bold leading-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(180px, 32vw, 480px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(129, 140, 248, 0.08)',
        }}
      >
        Q4
      </div>

      <div
        ref={contentRef}
        className="relative z-10 h-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center"
      >
        <p
          ref={kickerRef}
          className="mb-4 md:mb-5 uppercase tracking-[0.3em] text-[11px] text-indigo-300/70"
        >
          Bring AI&Tech to Marketing
        </p>

        <h1
          className="font-bold tracking-tighter leading-[0.95] text-white max-w-[8.5ch] md:max-w-none text-[clamp(44px,12.8vw,52px)] md:text-[clamp(56px,7.5vw,108px)]"
          style={{
            perspective: '800px',
            textShadow: '0 2px 24px rgba(0,0,0,0.55)',
          }}
        >
          <span ref={line1Ref} className="block">Il tuo AI</span>
          {/* pb + margin-bottom negativo: allargano l'area di paint del
              background (bg-clip-text) oltre la line-box stretta (leading-0.95)
              così il discendente della "g" non resta fuori dal gradiente, senza
              spostare gli elementi sotto (il margin negativo compensa il padding). */}
          <span
            ref={line2Ref}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 pb-[0.2em] -mb-[0.2em]"
          >
            Marketing Partner.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 text-lg md:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
        >
          Lo studio di consulenza che porta AI e le ultime tecnologie nel tuo marketing.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <MagneticButton onClick={scrollToForm} className="text-white">
            Inizia il percorso
            <ArrowUpRight className="w-5 h-5" />
          </MagneticButton>
          <button
            onClick={goToAgents}
            className="group flex items-center gap-2 text-sm tracking-widest text-gray-400 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-0 uppercase"
          >
            Scopri gli Agenti AI
            <ArrowDownRight className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <HeroTicker />
    </div>
  );
};

export default Hero2;
