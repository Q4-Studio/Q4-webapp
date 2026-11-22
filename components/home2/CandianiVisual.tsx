import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Dato Candiani: numero grande a sinistra, finestra con il grafico a  */
/* destra. La linea "Recuperati" si disegna mentre si scorre.          */
/* ------------------------------------------------------------------ */

const CASE_STUDY_PATH = '/casi-studio/candiani-denim-tracking-server-side';

const CandianiVisual: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      path,
      { strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: path, start: 'top 90%', end: 'top 35%', scrub: 0.4 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="casi" className="px-6 pb-32 md:pb-[240px]">
      <div
        className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 pt-16 md:rounded-[56px] md:px-20 md:pt-[120px]"
        style={{ background: 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)' }}
      >
        <div className="dots" aria-hidden="true" />
        <div className="relative grid grid-cols-1 items-start gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <Reveal>
            <p className="disp" style={{ fontSize: 'clamp(3.25rem, 8vw, 8.5rem)', letterSpacing: '-0.06em', lineHeight: 0.95 }}>
              1.032.695
            </p>
            <p className="lead mt-6 max-w-[420px]" style={{ color: '#0a0a0a' }}>
              segnali di conversione recuperati in 90 giorni per{' '}
              <a href={CASE_STUDY_PATH} className="underline decoration-purple-400/50 underline-offset-4 hover:decoration-purple-600">
                Candiani Denim
              </a>.
            </p>
            <p className="mt-5 max-w-[420px] text-base leading-relaxed">963.652 sarebbero stati bloccati dalla tracking prevention.</p>
          </Reveal>

          <Reveal delay={0.12} className="mock -mb-10 px-6 pt-6 md:px-8 md:pt-8">
            <div className="mb-7 flex gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-gray-200" />
              <span className="h-3 w-3 rounded-full bg-gray-200" />
              <span className="h-3 w-3 rounded-full bg-gray-200" />
            </div>
            <svg viewBox="0 0 640 320" width="100%" role="img" aria-label="Grafico: segnali recuperati contro segnali bloccati" className="block">
              <defs>
                <linearGradient id="q4-candiani-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#818cf8" />
                  <stop offset=".6" stopColor="#a855f7" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
              </defs>
              <g stroke="rgba(10,10,10,.07)">
                <path d="M0 60H640" />
                <path d="M0 130H640" />
                <path d="M0 200H640" />
                <path d="M0 270H640" />
              </g>
              <path
                ref={pathRef}
                pathLength={1000}
                strokeDasharray={1000}
                d="M0 280 C90 262 130 214 210 200 S360 130 440 96 S570 44 640 20"
                fill="none"
                stroke="url(#q4-candiani-grad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M0 290 C110 284 220 270 330 256 S540 236 640 226"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="3"
                strokeDasharray="3 9"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex gap-8 py-5 text-sm font-medium" style={{ color: '#0a0a0a' }}>
              <span className="flex items-center gap-2">
                <i className="h-1 w-5 rounded" style={{ background: 'linear-gradient(90deg, #818cf8, #9333ea)' }} aria-hidden="true" />
                Recuperati
              </span>
              <span className="flex items-center gap-2 text-gray-500">
                <i className="w-5 border-t-[3px] border-dotted border-gray-400" aria-hidden="true" />
                Bloccati
              </span>
            </div>
          </Reveal>
        </div>
        <div className="h-20" aria-hidden="true" />
      </div>
    </section>
  );
};

export default CandianiVisual;
