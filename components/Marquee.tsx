import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Array di loghi clienti reali
const logos = [
  { name: "MES Connettori", path: "/logos/mes-connettori.webp" },
  { name: "RR Auto", path: "/logos/rr-auto.webp" },
  { name: "Senza Stress Ristrutturare", path: "/logos/senza-stress-ristrutturare.webp" },
  { name: "Trenove", path: "/logos/trenove.webp" },
  { name: "GP Meccatronica", path: "/logos/gp-meccatronica.webp" },
  { name: "STC", path: "/logos/stc.png" },
  { name: "Candiani", path: "/logos/candiani.png" },
];

interface MarqueeProps {
  /** `light`: loghi neri su fondo bianco (home chiara). Default `dark`. */
  tone?: 'dark' | 'light';
}

// Classi per tono: ogni colore della variante chiara/scura sta qui.
const tones = {
  light: {
    container: 'bg-white pt-24 pb-10',
    caption: 'sr-only',
    logo: 'brightness-0 opacity-35 hover:opacity-100',
    fade: 'from-white',
  },
  dark: {
    container: 'bg-[#050505] py-20 border-y border-white/5',
    caption: 'text-gray-500',
    logo: 'grayscale opacity-40 hover:opacity-80 hover:grayscale-0',
    fade: 'from-[#050505]',
  },
};

const Marquee: React.FC<MarqueeProps> = ({ tone = 'dark' }) => {
  const t = tones[tone];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Niente scroll/marquee: il contenuto (loghi) resta semplicemente
      // visibile e fermo, senza animazioni.
      if (containerRef.current) gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      // immediateRender:false + once: prima non c'era una classe statica che
      // teneva il blocco a opacity 0 finché GSAP non lo riaccendeva: se lo
      // ScrollTrigger non scattava (misure premature), i loghi restavano
      // invisibili per sempre. Ora lo stato "spento" viene applicato solo
      // quando il tween parte davvero, e una volta acceso resta acceso.
      gsap.fromTo(containerRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: containerRef.current,
            // "top bottom": lo stato spento viene applicato quando il blocco
            // è ancora fuori schermo, niente lampo visibile → nascosto.
            start: "top bottom",
            once: true
          }
        }
      );

      // 2. Loop infinito
      // Tre set identici (gap reso come padding finale di ogni set): un set è
      // esattamente 1/3 della traccia, quindi xPercent -100/3 chiude il giro
      // senza misurare larghezze (prima scrollWidth / 3 al mount, sbagliato
      // finché le immagini lazy non erano caricate).
      if (trackRef.current) {
        const loop = gsap.to(trackRef.current, {
          xPercent: -100 / 3,
          duration: 30,
          ease: "none",
          repeat: -1,
          paused: true
        });

        // Il loop gira solo quando il blocco è nel viewport.
        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause())
        });
        // Stato iniziale esplicito: non dipendiamo dal fatto che onToggle
        // scatti già alla creazione se il blocco è visibile.
        if (st.isActive) loop.play();
      }
    }, containerRef);

    // Il cleanup del context uccide solo i tween/ScrollTrigger creati qui sopra,
    // non quelli di altre sezioni dell'app (bug precedente: killava TUTTI gli
    // ScrollTrigger globali con ScrollTrigger.getAll().forEach(kill)).
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${t.container}`}>
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className={`text-sm uppercase tracking-[0.08em] ${t.caption}`}>Aziende che ci hanno già scelto</p>
        </div>
      <div className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex w-max whitespace-nowrap" style={{ willChange: 'transform' }}>
            {/* w-max: la traccia è larga quanto il contenuto, così xPercent
                -100/3 vale esattamente un set (non un terzo del viewport).
                Tre set identici per il loop continuo: solo il primo è letto
                dagli screen reader, i set 2 e 3 sono decorativi. */}
            {[0, 1, 2].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-16 md:gap-24 pr-16 md:pr-24" aria-hidden={copy > 0 ? true : undefined}>
                    {logos.map((logo) => (
                        <div key={logo.name} className={`flex-shrink-0 h-12 md:h-14 flex items-center transition-all duration-300 cursor-default ${t.logo}`}>
                            <img
                                src={logo.path}
                                alt={copy > 0 ? '' : logo.name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
        
        {/* Gradients to fade edges */}
        <div className={`absolute top-0 left-0 w-32 h-full bg-gradient-to-r to-transparent z-10 ${t.fade}`}></div>
        <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l to-transparent z-10 ${t.fade}`}></div>
      </div>
    </div>
  );
};

export default Marquee;
