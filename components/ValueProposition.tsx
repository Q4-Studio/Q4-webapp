import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Zap, Target, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Target className="w-8 h-8 text-indigo-400" />,
    title: "Precisione Chirurgica",
    desc: "Non spariamo nel mucchio. Identifichiamo i decisori ideali con sistemi di arricchimento dati proprietari."
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-400" />,
    title: "Velocità di Esecuzione",
    desc: "Ciò che richiedeva settimane, ora richiede minuti. I nostri workflow AI eliminano i colli di bottiglia operativi."
  },
  {
    icon: <Database className="w-8 h-8 text-cyan-400" />,
    title: "Database Proprietari",
    desc: "Accesso a milioni di contatti B2B verificati in tempo reale. Il tuo CRM non sarà mai più vuoto."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    title: "Scalabilità Infinita",
    desc: "Il sistema impara e migliora. Più lead gestisci, più l'IA diventa intelligente nel convertirli."
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
    const ctx = gsap.context(() => {
      // Pin the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        scrub: true,
      });

      // Parallax effect for text elements
      // Moving them slightly down during scroll creates a "heavy" or "slow" feel relative to the scroll direction
      gsap.to(labelRef.current, {
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      gsap.to(titleRef.current, {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      gsap.to(descRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

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
          <span ref={labelRef} className="text-indigo-500 font-mono tracking-widest mb-4 block">IL VANTAGGIO COMPETITIVO</span>
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Perché passare all'<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Automazione?
            </span>
          </h2>
          <p ref={descRef} className="text-xl text-gray-400 leading-relaxed max-w-lg">
            I metodi tradizionali di acquisizione clienti sono lenti, costosi e non scalabili. 
            Noi trasformiamo il caos in una macchina prevedibile che genera opportunità commerciali 24/7.
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