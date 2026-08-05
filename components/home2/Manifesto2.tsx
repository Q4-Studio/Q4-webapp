import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollRevealText from './ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO =
  "Q4 Studio è uno studio tecnico. Sistemiamo la raccolta dei dati, colleghiamo gli strumenti che usi già, e automatizziamo il lavoro ripetitivo che oggi fa una persona a mano.";

const Manifesto2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Orbs in parallasse a velocità diverse
      gsap.to(orbARef.current, {
        yPercent: -60,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.to(orbBRef.current, {
        yPercent: 45,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 md:py-56 px-6 bg-[#050505] text-white border-t border-white/5 overflow-hidden">
      {/* Elementi decorativi in parallasse */}
      <div ref={orbARef} className="absolute -left-32 top-1/4 w-[420px] h-[420px] bg-indigo-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div ref={orbBRef} className="absolute -right-40 bottom-0 w-[380px] h-[380px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollRevealText
          text={MANIFESTO}
          className="font-bold leading-[1.15] tracking-[-0.02em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4.5vw, 48px)' }}
          start="top 70%"
          end="bottom 60%"
        />
      </div>
    </section>
  );
};

export default Manifesto2;
