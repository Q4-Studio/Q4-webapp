import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Mail, Users, BarChart3, Globe, Code2 } from 'lucide-react';
import { ServiceItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

const services: ServiceItem[] = [
  {
    id: 1,
    title: "Lead Generation System",
    description: "Architettura completa per l'acquisizione. Dalla ricerca del contatto all'outreach multicanale.",
    icon: <Users className="w-10 h-10 text-white" />,
    span: "md:col-span-2 md:row-span-2"
  },
  {
    id: 2,
    title: "AI Workflow Automation",
    description: "Sostituiamo i task ripetitivi con agenti intelligenti che lavorano senza sosta.",
    icon: <Bot className="w-8 h-8 text-indigo-400" />,
    span: "md:col-span-1 md:row-span-1"
  },
  {
    id: 3,
    title: "CRM Integration",
    description: "I dati fluiscono direttamente nel tuo Hubspot o Salesforce. Nessun copia-incolla.",
    icon: <DatabaseIcon />,
    span: "md:col-span-1 md:row-span-1"
  },
  {
    id: 4,
    title: "Cold Email Infrastructure",
    description: "Domini riscaldati, rotazione IP e copy personalizzato con AI per massimizzare l'open rate.",
    icon: <Mail className="w-8 h-8 text-purple-400" />,
    span: "md:col-span-2 md:row-span-1"
  },
  {
    id: 5,
    title: "Data Enrichment",
    description: "Arricchiamo i tuoi lead con dati firmografici, tecnologie utilizzate e intent signals.",
    icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    span: "md:col-span-1 md:row-span-2"
  },
  {
    id: 6,
    title: "Custom Development",
    description: "Soluzioni su misura per esigenze complesse.",
    icon: <Code2 className="w-8 h-8 text-gray-400" />,
    span: "md:col-span-1 md:row-span-1"
  }
];

function DatabaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  )
}

const Services: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
    <section className="py-32 px-6 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Le nostre Soluzioni</h2>
          <p className="text-gray-400 max-w-xl text-lg">Tecnologie avanzate per coprire l'intero ciclo di vita del cliente B2B.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
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

              <div className="relative z-10 mt-auto flex justify-end">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;