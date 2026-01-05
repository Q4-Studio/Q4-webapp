import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%", // Animation starts when top of footer hits 75% of viewport
          toggleActions: "play none none reverse",
        }
      });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .from(buttonWrapperRef.current, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.7)"
      }, "-=0.8")
      .from(linksRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.6")
      .from(bottomRef.current, {
        opacity: 0,
        y: 10,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6");

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#050505] text-white pt-40 pb-10 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <h2 ref={titleRef} className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
          Pronto a scalare?
        </h2>
        
        <div ref={buttonWrapperRef} className="mb-24">
            <MagneticButton
              className="group text-lg md:text-xl px-8 py-4 md:px-10 md:py-5 font-semibold hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.6)] transition-shadow duration-500 border border-white/10 hover:border-white/30"
              onClick={() => {
                const contactForm = document.querySelector('section:has(form)');
                contactForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
                <span className="mr-3">Parla con un esperto</span>
                <ArrowUpRight className="inline-block w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
            </MagneticButton>
        </div>

        <div ref={linksRef} className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 text-sm text-gray-400">
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
                <h3 className="text-white font-bold text-lg mb-4">Q4 STUDIO</h3>
                <p className="max-w-xs mb-4 mx-auto md:mx-0">
                    Specialisti in B2B Lead Generation e Automazioni AI.
                </p>
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                    <a
                        href="https://www.instagram.com/q4.studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-400 transition-all duration-300 hover:scale-110"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/q4studio/about/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-400 transition-all duration-300 hover:scale-110"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Servizi</h4>
                <ul className="space-y-2">
                    <li
                        className="hover:text-indigo-400 cursor-pointer transition-colors"
                        onClick={() => {
                            const servicesSection = document.getElementById('services');
                            servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                    >
                        B2B Lead Generation
                    </li>
                    <li
                        className="hover:text-indigo-400 cursor-pointer transition-colors"
                        onClick={() => {
                            const servicesSection = document.getElementById('services');
                            servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                    >
                        Automazioni AI
                    </li>
                </ul>
            </div>
            <div>
                 <h4 className="text-white font-bold mb-4">Legale</h4>
                <ul className="space-y-2">
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">Cookie Policy</li>
                </ul>
            </div>
        </div>
        
        <div ref={bottomRef} className="w-full flex flex-col md:flex-row justify-between items-center gap-2 mt-20 text-xs text-gray-600 font-mono">
            <span>© {new Date().getFullYear()} Q4 Studio. Tutti i diritti riservati. • P.I. 05018960236</span>
            <span>Verona / Reggio Emilia</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;