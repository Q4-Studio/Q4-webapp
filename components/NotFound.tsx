import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(numberRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      })
      .from(textRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* 404 Number */}
        <h1
          ref={numberRef}
          className="text-[200px] md:text-[280px] font-bold leading-none tracking-tighter mb-8"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(99,102,241,0.8) 50%, rgba(168,85,247,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          404
        </h1>

        {/* Message */}
        <p ref={textRef} className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
          Pagina non trovata
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata. Torna alla homepage per continuare a esplorare.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Torna alla Homepage
          </button>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full font-semibold hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Torna Indietro
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
