import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = [
  "Acme Corp", "GlobalTech", "Nebula", "Trio", "FoxRun", "Circle", 
  "Hexagon", "Velocità", "Luce", "Sfera", "Vertex", "Orion"
];

const Marquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      // Using fromTo ensures we animate from hidden/offset to visible/zero regardless of initial CSS state
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
        // Clone the content to ensure seamless loop (idempotent check)
        if (trackRef.current.children.length === logos.length) {
             const content = trackRef.current.innerHTML;
             trackRef.current.innerHTML = content + content;
        }

        const width = trackRef.current.scrollWidth / 2;
        
        gsap.to(trackRef.current, {
          x: -width,
          duration: 30,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % width) // Ensure smooth reset
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#050505] py-20 border-y border-white/5 overflow-hidden opacity-0">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Aziende che scalano con noi</p>
        </div>
      <div className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex whitespace-nowrap gap-20 items-center">
            {logos.map((logo, index) => (
                <div key={index} className="text-2xl md:text-4xl font-bold text-gray-700 hover:text-white transition-colors duration-300 font-['Space_Grotesk'] uppercase opacity-50 hover:opacity-100 cursor-default">
                    {logo}
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