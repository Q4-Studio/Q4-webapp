import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO =
  "Q4 Studio è uno studio di consulenza, non la solita agenzia. Entriamo nei processi, applichiamo l'AI al marketing e costruiamo agenti che lavorano al posto del tuo team. Meno attività ripetitive, più pipeline.";

const Manifesto2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Split in parole: ogni parola si accende mentre lo scroll avanza
      const el = textRef.current!;
      el.innerHTML = '';
      const words: HTMLElement[] = [];
      MANIFESTO.split(' ').forEach((word, i, arr) => {
        const span = document.createElement('span');
        span.innerText = word;
        span.style.display = 'inline-block';
        span.style.opacity = '0.12';
        el.appendChild(span);
        words.push(span);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.4,
        },
      });

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
      gsap.to(indexRef.current, {
        yPercent: -25,
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
      <div
        ref={indexRef}
        aria-hidden="true"
        className="absolute right-6 top-16 font-bold select-none pointer-events-none leading-none"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(120px, 18vw, 280px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.05)',
        }}
      >
        01
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <span className="text-indigo-500 font-mono tracking-[0.3em] mb-10 block text-xs md:text-sm uppercase">
          01 — Lo Studio
        </span>
        <p
          ref={textRef}
          className="font-bold leading-snug tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4.5vw, 56px)' }}
        >
          {MANIFESTO}
        </p>
      </div>
    </section>
  );
};

export default Manifesto2;
