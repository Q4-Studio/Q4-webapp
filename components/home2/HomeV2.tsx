import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../SEOHead';
import Marquee from '../Marquee';
import ContactForm from '../ContactForm';
import Footer from '../Footer';
import Hero2 from './Hero2';
import Manifesto2 from './Manifesto2';
import Pipeline2 from './Pipeline2';
import Agents2 from './Agents2';
import Services2 from './Services2';
import Team2 from './Team2';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Preloader: contatore rapido, poi sipario verso l'alto               */
/* ------------------------------------------------------------------ */

const Preloader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(obj, {
      v: 100,
      duration: 1.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.innerText = String(Math.round(obj.v)).padStart(3, '0');
      },
    }).to(overlayRef.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.15');
    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
      <img src="/logo.webp" alt="Q4 Studio" className="h-10 w-auto mb-8" />
      <div className="flex items-center gap-4 font-mono text-sm text-gray-500 tracking-[0.3em]">
        <span className="w-8 h-px bg-indigo-500/50" />
        <span ref={counterRef} className="text-indigo-300 tabular-nums">000</span>
        <span className="w-8 h-px bg-indigo-500/50" />
      </div>
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
    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });
      gsap.to('.cta-ghost', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
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
        <h2 className="cta-reveal text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight mb-8">
          Costruiamo il tuo
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            vantaggio.
          </span>
        </h2>
        <p className="cta-reveal text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
          Raccontaci la tua sfida: ti mostriamo come trasformarla in un sistema che cresce.
        </p>
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

  return (
    <div className="relative w-full bg-[#050505] text-white">
      <SEOHead
        title="Q4 Studio | AI Marketing Partner"
        description="Studio di consulenza per crescita B2B: AI applicata al marketing, lead generation automatizzata e agenti AI che alleggeriscono i processi aziendali."
        noIndex={true}
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
      <Team2 />
      <FinalCTA />
      <ContactForm showHeader={false} />
      <Footer showCta={false} />
    </div>
  );
};

export default HomeV2;
