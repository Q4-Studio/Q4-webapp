import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Array di loghi clienti reali
const logos = [
  { name: "MES Connettori", path: "/logos/mes-connettori.png" },
  { name: "RR Auto", path: "/logos/rr-auto.png" },
  { name: "Senza Stress Ristrutturare", path: "/logos/senza-stress-ristrutturare.png" },
  { name: "Trenove", path: "/logos/trenove.png" },
];

const Marquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Entrance Animation
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
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Infinite Scroll Animation
    if (trackRef.current) {
      const track = trackRef.current;

      // Calculate the width of one set of logos (we rendered 3 sets)
      const singleSetWidth = track.scrollWidth / 3;

      // Animate seamlessly
      gsap.fromTo(track,
        { x: 0 },
        {
          x: -singleSetWidth,
          duration: 30,
          ease: "none",
          repeat: -1
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(trackRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#050505] py-20 border-y border-white/5 overflow-hidden opacity-0">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Aziende che scalano con noi</p>
        </div>
      <div className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex whitespace-nowrap gap-16 md:gap-24 items-center">
            {/* Render logos twice for seamless loop */}
            {[...logos, ...logos, ...logos].map((logo, index) => (
                <div key={index} className="flex-shrink-0 h-12 md:h-16 flex items-center grayscale opacity-40 hover:opacity-80 hover:grayscale-0 transition-all duration-300 cursor-default">
                    <img
                        src={logo.path}
                        alt={logo.name}
                        className="h-full w-auto object-contain"
                    />
                </div>
            ))}
        </div>
        
        {/* Gradients to fade edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default Marquee;