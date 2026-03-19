import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Team members - sostituisci con i vostri dati effettivi
// Per le immagini: formato JPG o PNG, dimensioni consigliate 800x1000px (ritratto verticale)
// Sfondo professionale con illuminazione come nell'immagine di riferimento
// Salva le immagini nella cartella public/team/
const teamMembers = [
  {
    id: 1,
    name: "Sebastiano Riva",
    role: "Co-Founder",
    specialty: "Responsabile Tecnico",
    image: "/team/sebastiano.webp",
    linkedin: "https://www.linkedin.com/in/sebastianoriva",
    bio: "Esperto in sviluppo software e agenti no-code. Gestisce l'infrastruttura tecnica di Q4 Studio, progettando e implementando agenti AI personalizzati per i nostri clienti. Specializzato in integrazione di software e workflow intelligenti."
  },
  {
    id: 2,
    name: "Riccardo Splisteser",
    role: "Co-Founder",
    specialty: "Responsabile Commerciale",
    image: "/team/riccardo.webp",
    linkedin: "https://www.linkedin.com/in/riccardo-splisteser",
    bio: "Specialista in strategie di vendita B2B e lead generation. Coordina il team commerciale di Q4 Studio, assicurando che ogni lead venga gestito con tempistiche perfette. Esperto in processi di qualificazione e conversione ad alto valore."
  },
  {
    id: 3,
    name: "Nicolò Pozzato",
    role: "Co-Founder",
    specialty: "Responsabile Marketing",
    image: "/team/nicolo.webp",
    linkedin: "https://www.linkedin.com/in/nicolo-pozzato",
    bio: "Esperto in Meta Advertising e strategie di acquisizione clienti. Gestisce campagne Meta (Facebook e Instagram) ad alte performance, con focus su targeting chirurgico e ottimizzazione continua. Specializzato in lead generation B2B e funnel multicanale."
  }
];

const Team: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate title entrance
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Animate cards staggered
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-[#050505] text-white overflow-hidden">
      {/* Large Background Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-indigo-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-20">
          <span className="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">
            Il nostro Team
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            La fuga di cervelli<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">non fa per noi</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Giovani, tecnici, e radicati sul territorio. Applichiamo le tecnologie più innovative per far scalare le aziende italiane, dimostrando che non serve andarsene per avere impatto.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Container */}
              <div className="relative h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950/30 to-purple-950/30 border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/0 via-indigo-600/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />

                {/* Profile Image */}
                <div className="relative h-full w-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4f46e5&color=fff&size=800`;
                    }}
                  />
                </div>

                {/* Content Overlay - hidden on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-3xl font-bold mb-2">
                    {member.name}
                  </h3>
                  <p className="text-indigo-400 font-medium text-sm mb-1">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.specialty}</p>
                </div>

                {/* Biography Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/98 to-[#050505] z-[35] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 pointer-events-none">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-2 text-indigo-300">
                      {member.name}
                    </h3>
                    <p className="text-indigo-400 font-medium text-sm mb-1">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-4">{member.specialty}</p>
                    <div className="w-12 h-px bg-gradient-to-r from-indigo-500 to-purple-500 mb-4" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-6 right-6 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-400 transition-all duration-300 group/linkedin"
                  aria-label={`LinkedIn di ${member.name}`}
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>

                {/* Hover Indicator Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
