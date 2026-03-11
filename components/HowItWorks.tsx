import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    emoji: "🔍",
    title: "Analizziamo",
    description: "Fotografia del tuo business, competitor, canali. Capiamo dove stai perdendo clienti e dove c'è margine."
  },
  {
    number: "02",
    emoji: "⚡",
    title: "Costruiamo",
    description: "Sito, campagne, funnel. Ogni pezzo progettato per portare il visitatore a prenotare un appuntamento con te."
  },
  {
    number: "03",
    emoji: "🤖",
    title: "Automatizziamo",
    description: "AI, CRM, WhatsApp, chatbot. Il sistema cattura lead, li qualifica e li porta al tuo commerciale — anche di notte."
  }
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from([labelRef.current, titleRef.current, subtitleRef.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out"
      });

      stepRefs.current.forEach((step, i) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out"
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span ref={labelRef} className="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">Come funziona</span>
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Tre passi. Un sistema.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Risultati concreti.</span>
          </h2>
          <p ref={subtitleRef} className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Un processo chiaro, senza burocrazia. Dal giorno uno, lavoriamo per farti portare a casa risultati misurabili.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { stepRefs.current[index] = el; }}
              className="relative group bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col overflow-hidden hover:border-indigo-500/30 transition-colors duration-500 cursor-none"
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl font-bold text-white/10 font-mono leading-none">{step.number}</span>
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{step.description}</p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
