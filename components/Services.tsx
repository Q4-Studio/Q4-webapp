import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Bot, Users } from 'lucide-react';
import { ServiceItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

const services: ServiceItem[] = [
  {
    id: 1,
    title: "B2B Lead Generation",
    description: "Affianchiamo marketing e sales nella costruzione di un sistema di acquisizione B2B: posizionamento, offerta, Meta Advertising, tracking, CRM e follow-up. Non guardiamo solo il costo per lead, ma la qualità commerciale e l'avanzamento in pipeline.",
    icon: <Users className="w-12 h-12 text-cyan-400" />,
    span: "md:col-span-1"
  },
  {
    id: 2,
    title: "Agenti AI",
    description: "Progettiamo agenti AI su misura per sales, back office, customer care e processi interni. Partiamo dall'audit operativo, definiamo regole e responsabilità, integriamo gli strumenti già in uso e accompagniamo il team nell'adozione.",
    icon: <Bot className="w-12 h-12 text-purple-400" />,
    span: "md:col-span-1"
  }
];

const Services: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index: number) => {
    gsap.to(itemsRef.current[index], {
      scale: 0.98,
      boxShadow: "0 0 30px rgba(99, 102, 241, 0.1)",
      borderColor: "rgba(99, 102, 241, 0.3)",
      duration: 0.3
    });
  };

  const handleMouseLeave = (index: number) => {
    gsap.to(itemsRef.current[index], {
      scale: 1,
      boxShadow: "none",
      borderColor: "rgba(255, 255, 255, 0.05)",
      duration: 0.3
    });
  };

  return (
    <section id="services" className="py-32 px-6 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">I Nostri Servizi</span>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Le nostre <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Soluzioni</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Due aree core, un unico approccio consulenziale. Studiamo il processo, definiamo le priorità e costruiamo sistemi misurabili: acquisizione B2B da un lato, automazione intelligente dall'altro.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => { itemsRef.current[index] = el }}
              className={`${service.span} relative group bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col justify-between overflow-hidden cursor-none`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{service.description}</p>
                {service.title === "Agenti AI" && (
                  <button
                    onClick={() => {
                      window.history.pushState(null, '', '/agenti-ai');
                      window.dispatchEvent(new Event('popstate'));
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    Approfondisci gli agenti AI
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
