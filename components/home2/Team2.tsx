import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin } from 'lucide-react';
import ScrollRevealText from './ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    id: 1,
    name: 'Sebastiano Riva',
    role: 'Co-Founder',
    specialty: 'Responsabile Tecnico',
    image: '/team/sebastiano.webp',
    linkedin: 'https://www.linkedin.com/in/sebastianoriva',
    bio: "Esperto in sviluppo software e agenti no-code. Gestisce l'infrastruttura tecnica di Q4 Studio, progettando e implementando agenti AI personalizzati per i clienti.",
  },
  {
    id: 2,
    name: 'Riccardo Splisteser',
    role: 'Co-Founder',
    specialty: 'Responsabile Commerciale',
    image: '/team/riccardo.webp',
    linkedin: 'https://www.linkedin.com/in/riccardo-splisteser',
    bio: 'Specialista in strategie di vendita B2B e lead generation. Coordina il team commerciale, assicurando che ogni lead venga gestito con tempistiche perfette.',
  },
  {
    id: 3,
    name: 'Nicolò Pozzato',
    role: 'Co-Founder',
    specialty: 'Responsabile Marketing',
    image: '/team/nicolop.jpg',
    linkedin: 'https://www.linkedin.com/in/nicolo-pozzato',
    bio: 'Esperto in Meta Advertising e acquisizione clienti. Gestisce campagne ad alte performance con focus su targeting chirurgico e ottimizzazione continua.',
  },
];

const Team2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.team-reveal', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('.team-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%' },
          y: 90,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.12,
          ease: 'power3.out',
        });

        // Parallasse interna della foto
        const img = card.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 px-6 bg-[#050505] text-white border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-indigo-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:mb-20">
          <h2 className="team-reveal text-4xl md:text-6xl font-bold leading-tight mb-6">
            La fuga di cervelli
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">non fa per noi</span>
          </h2>
          <ScrollRevealText
            text="Giovani, tecnici e radicati sul territorio. Applichiamo le tecnologie più innovative per far scalare le aziende italiane, dimostrando che non serve andarsene per avere impatto."
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card group relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/5 group-hover:border-indigo-500/30 transition-colors duration-500">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="h-[112%] w-full object-cover object-top grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4f46e5&color=fff&size=800`;
                    }}
                  />
                </div>

                {/* Scanline decorativa */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 z-20" />

                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-indigo-400 uppercase mb-2">{member.role}</p>
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{member.specialty}</p>
                  <p className="text-gray-300 text-sm leading-relaxed max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {member.bio}
                  </p>
                </div>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-400 transition-all duration-300"
                  aria-label={`LinkedIn di ${member.name}`}
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>

                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team2;
