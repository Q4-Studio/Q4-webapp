import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Zap, Target, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Target className="w-8 h-8 text-blue-400" />,
    title: "Consulenza prima dell'execution",
    desc: "Prima di lanciare campagne o automazioni analizziamo ICP, processo commerciale, dati disponibili e colli di bottiglia. La soluzione nasce dalla diagnosi, non da un pacchetto standard."
  },
  {
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    title: "Persone e processi insieme",
    desc: "Un sistema funziona quando il team sa usarlo. Progettiamo funnel, CRM, follow-up e agenti AI tenendo insieme operatività quotidiana, responsabilità e metriche condivise."
  },
  {
    icon: <Database className="w-8 h-8 text-purple-400" />,
    title: "AI pragmatica, non demo",
    desc: "Gli agenti AI vengono disegnati su processi reali: lead routing, documenti, report, customer care, data entry e collegamenti tra software. Ogni automazione deve liberare tempo misurabile."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
    title: "Misuriamo ciò che conta",
    desc: "Guardiamo CPL, ma anche qualifica, appuntamenti, pipeline, tempi di risposta e ore recuperate. Il marketing e l'automazione devono essere leggibili dal business."
  }
];

const ValueProposition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Refs for parallax text elements
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Check if we're on mobile
      const isMobile = window.innerWidth < 768;

      // Pin the left column while the right column scrolls (desktop only)
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColRef.current,
          scrub: true,
        });
      }

      // Animate cards entry
      cardRefs.current.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play reverse play reverse"
          },
          opacity: 0.2,
          scale: 0.95,
          y: 50
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[150vh] bg-[#050505] text-white py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-12">
        
        {/* Left Column (Pinned) */}
        <div ref={leftColRef} className="md:w-1/2 h-fit flex flex-col justify-center py-12">
          <span ref={labelRef} className="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">COSA CI DISTINGUE</span>
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Perché siamo<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Diversi.
            </span>
          </h2>
          <p ref={descRef} className="text-xl text-gray-400 leading-relaxed max-w-2xl">
            Siamo uno studio di consulenza operativo: entriamo nei processi, facciamo emergere le priorità e costruiamo sistemi che il team può usare davvero.
            Lead generation e Agenti AI sono leve diverse dello stesso lavoro: rendere crescita e operations più misurabili.
          </p>
        </div>

        {/* Right Column (Scrolling) */}
        <div ref={rightColRef} className="md:w-1/2 flex flex-col gap-8 pt-12 md:pt-[20vh] pb-24">
          {features.map((item, index) => (
            <div 
              key={index}
              ref={(el) => { cardRefs.current[index] = el }}
              className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-indigo-500/30 transition-colors duration-500"
            >
              <div className="mb-6 p-4 rounded-full bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-indigo-500 transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValueProposition;
