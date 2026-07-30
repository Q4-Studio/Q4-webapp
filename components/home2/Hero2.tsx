import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight, Bot, Target, Database, MessageCircle, BarChart3, Zap } from 'lucide-react';
import MagneticButton from '../MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Video di sfondo dell'hero: autoplay silenzioso, sostituito da un    */
/* fermo immagine se l'utente preferisce meno animazioni.              */
/* ------------------------------------------------------------------ */

const HeroBackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // React non riflette sempre l'attributo `muted` nel DOM: lo forziamo via
    // ref perché senza (insieme a playsInline) iOS blocca l'autoplay.
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-poster.jpg')" }}
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
      <div ref={trackRef} className="flex whitespace-nowrap items-center gap-10 text-[11px] font-mono tracking-[0.25em] text-gray-500">
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Il video di sfondo non deve mai arrivare fino al bordo superiore: sotto il
  // titolo resta una fascia nera piena (nessun overlay/gradiente). L'offset è
  // calcolato dall'altezza reale del titolo (varia per breakpoint/contenuto)
  // invece di una percentuale fissa, così il titolo resta sempre sul nero.
  useEffect(() => {
    const updateVideoOffset = () => {
      if (!titleRef.current || !containerRef.current || !canvasWrapRef.current) return;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const titleBottom = titleRef.current.getBoundingClientRect().bottom;
      const gap = 40; // margine di sicurezza tra fine titolo e inizio video
      const offset = Math.max(0, titleBottom - containerTop + gap);
      canvasWrapRef.current.style.top = `${offset}px`;
    };

    updateVideoOffset();
    window.addEventListener('resize', updateVideoOffset);
    // ResizeObserver sul titolo: cattura qualunque cambio di layout (breakpoint,
    // orientamento, reflow da font caricato) anche quando non viene emesso un
    // evento `resize` sulla window (es. resize del viewport via devtools/CDP).
    let ro: ResizeObserver | undefined;
    if (titleRef.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(updateVideoOffset);
      ro.observe(titleRef.current);
    }
    // Il font (Space Grotesk) può caricare dopo il primo render e cambiare
    // l'altezza del titolo: ricalcola quando i webfont sono pronti.
    document.fonts?.ready?.then(updateVideoOffset).catch(() => {});
    const t1 = setTimeout(updateVideoOffset, 300);
    // Il titolo entra con un'animazione GSAP (translateY sui caratteri): durante
    // l'animazione il bounding box è temporaneamente più basso del riposo finale.
    // Ricalcola a animazione conclusa per non lasciare un distacco eccessivo.
    const t2 = setTimeout(updateVideoOffset, 2600);

    return () => {
      window.removeEventListener('resize', updateVideoOffset);
      ro?.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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
          chars1,
          { y: 110, opacity: 0, rotateX: -90 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.022, duration: 0.9, ease: 'back.out(1.6)' },
          '-=0.2'
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
      // Ampiezza contenuta per non scoprire troppo fondo nero sotto il video.
      gsap.to(canvasWrapRef.current, {
        yPercent: 10,
        opacity: 0.35,
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
      {/* Video di sfondo: parte sotto il titolo, mai dal bordo superiore.
          Sopra resta il fondo nero pieno del contenitore (nessun overlay/gradiente).
          Il valore di `top` è impostato via JS in base all'altezza reale del titolo. */}
      <div ref={canvasWrapRef} className="absolute inset-x-0 bottom-0 z-0" style={{ top: '38%' }}>
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
        className="relative z-10 h-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center"
      >
        <h1
          ref={titleRef}
          className="font-bold tracking-tighter leading-[0.95] text-white"
          style={{
            fontSize: 'clamp(44px, 9vw, 132px)',
            perspective: '800px',
            textShadow: '0 2px 24px rgba(0,0,0,0.55)',
          }}
        >
          <span ref={line1Ref} className="block">Il tuo AI</span>
          <span
            ref={line2Ref}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
          >
            Marketing Partner.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
        >
          Lo studio di consulenza che applica l&apos;AI al marketing: campagne che convertono, automazioni che
          inseguono ogni lead e agenti AI che alleggeriscono i processi del tuo team.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <MagneticButton onClick={scrollToForm} className="text-white">
            Inizia il percorso
            <ArrowUpRight className="w-5 h-5" />
          </MagneticButton>
          <button
            onClick={goToAgents}
            className="group flex items-center gap-2 text-sm font-mono tracking-widest text-gray-400 hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-0 uppercase"
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
