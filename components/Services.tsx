import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Users } from 'lucide-react';
import { ServiceItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

const services: ServiceItem[] = [
  {
    id: 1,
    title: "B2B Lead Generation",
    description: "La nostra forza è Meta Advertising (Facebook e Instagram), dove abbiamo generato i risultati più significativi per i nostri clienti. Costruiamo campagne multicanale integrando anche cold email e LinkedIn. Ogni lead viene tracciato in tempo reale: ricevi notifiche istantanee su WhatsApp e i nostri setter sono pronti a chiamare immediatamente per non perdere opportunità mentre il contatto è caldo.",
    icon: <Users className="w-12 h-12 text-cyan-400" />,
    span: "md:col-span-1"
  },
  {
    id: 2,
    title: "Automazioni AI",
    description: "Realizziamo automazioni AI completamente personalizzate senza i costi proibitivi del mercato tradizionale. Il nostro modello snello no-code ci permette di costruire e deployare workflow intelligenti in pochi giorni, non mesi. Automatizziamo invio ordini, processi aziendali interni, attività ripetitive, data entry e collegamento tra software diversi. Il tuo team si libera dalle operazioni manuali e si concentra sul valore.",
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
            Due servizi core e indipendenti. Da un lato, generiamo lead qualificati su Meta con targeting chirurgico. Dall'altro, costruiamo automazioni AI su misura per eliminare task ripetitivi e scalare operazioni. Entrambi progettati per massimizzare il ROI.
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;