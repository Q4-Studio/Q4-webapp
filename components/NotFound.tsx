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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Animazione all'ingresso pagina (nessuno ScrollTrigger): fromTo con
      // immediateRender:true equivale al comportamento precedente di
      // tl.from(...), riscritto per coerenza di stile col resto del codice.
      const tl = gsap.timeline();

      tl.fromTo(numberRef.current, { scale: 0.5, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        immediateRender: true,
      })
      .fromTo(textRef.current, { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: true,
      }, "-=0.5")
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        immediateRender: true,
      }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-white text-[#4b5563] flex items-center justify-center overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(10,10,10,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.07) 1px, transparent 1px)`,
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
            background: 'linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(129,140,248,0.9) 50%, rgba(147,51,234,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          404
        </h1>

        {/* Message */}
        <p ref={textRef} className="text-2xl md:text-3xl text-[#0a0a0a] mb-4 font-light">
          Pagina non trovata
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto">
          La pagina che stai cercando non esiste o è stata spostata. Torna alla homepage per continuare a esplorare.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Torna alla Homepage
          </button>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 border border-black/10 text-[#0a0a0a] rounded-full font-semibold hover:bg-black/5 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna Indietro
          </button>
        </div>

        {/* Recovery links: stessi puntatori della pagina 404 statica generata
            in scripts/prerender.ts (generateNotFoundHtml), così anche chi
            naviga via client routing ha un percorso per ripartire. */}
        <section aria-label="Link utili" className="mt-16 pt-10 border-t border-black/10 text-left max-w-md mx-auto">
          <h2 className="text-lg text-[#0a0a0a] mb-4">Link utili per ripartire</h2>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="/tracciamento-server-side" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">Tracciamento server-side e prezzi</a></li>
            <li><a href="/siti-web-ai" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">Siti web con AI</a></li>
            <li><a href="/agenti-ai" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">Agenti AI e automazioni</a></li>
            <li><a href="/casi-studio" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">Casi studio</a></li>
            <li><a href="/risorse" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">Risorse</a></li>
            <li><a href="/sitemap.xml" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">sitemap.xml</a> — elenco completo degli URL pubblicati</li>
            <li><a href="/llms.txt" className="text-purple-700 hover:text-purple-900 underline underline-offset-4 transition-colors">llms.txt</a> — guida al sito per agenti AI</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default NotFound;
