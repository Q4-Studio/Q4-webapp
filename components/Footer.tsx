import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Instagram, Linkedin, Phone, Mail } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { OBFUSCATED, decode } from '../utils/obfuscate';
import { caseStudiesPath } from '../data/caseStudies';
import { trackCtaClick } from '../utils/dataLayer';
import { onInternalLink } from '../utils/navigate';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  /** Mostra il blocco CTA "Pronto a crescere?" in testa al footer (default true). */
  showCta?: boolean;
  /** `light`: footer su fondo bianco (home chiara). Default `dark`. */
  tone?: 'dark' | 'light';
}

// Classi per tono: ogni colore della variante chiara/scura sta qui.
const tones = {
  light: {
    footer: 'bg-white text-[#0a0a0a]',
    padTopNoCta: 'pt-12',
    link: 'hover:text-[#0a0a0a] transition-colors',
    links: 'border-black/10 text-gray-500',
    logo: 'brightness-0',
    contact: 'text-gray-500 hover:text-[#0a0a0a]',
    social: 'border-black/15 hover:border-[#0a0a0a] hover:text-[#0a0a0a]',
    heading: 'text-[#0a0a0a]',
    // gray-500 e non gray-400: su bianco il 400 resta sotto il contrasto minimo.
    muted: 'text-gray-500',
    bottom: 'text-gray-500',
  },
  dark: {
    footer: 'bg-[#050505] text-white',
    padTopNoCta: 'pt-20',
    link: 'hover:text-indigo-400 transition-colors',
    links: 'border-white/10 text-gray-400',
    logo: '',
    contact: 'text-gray-400 hover:text-indigo-400',
    social: 'border-white/20 hover:border-indigo-400 hover:text-indigo-400',
    heading: 'text-white',
    muted: 'text-gray-500',
    bottom: 'text-gray-600',
  },
};

const Footer: React.FC<FooterProps> = ({ showCta = true, tone = 'dark' }) => {
  const light = tone === 'light';
  const t = tones[tone];
  const link = t.link;
  const footerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setPhone(decode(OBFUSCATED.phone));
    setEmail(decode(OBFUSCATED.email));
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // fromTo + immediateRender:false + once (invece di tl.from(...) con
      // toggleActions "play none none reverse"): se lo ScrollTrigger non
      // scatta (misure prese prima che il layout si assestasse) il footer
      // resta visibile invece di restare bloccato a opacity 0; una volta
      // acceso non si rispegne più tornando indietro con lo scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          // "top bottom": lo stato spento viene applicato quando il footer è
          // ancora fuori schermo, niente lampo visibile → nascosto.
          start: "top bottom",
          once: true,
        }
      });

      if (titleRef.current) {
        tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          immediateRender: false,
        });
      }
      if (buttonWrapperRef.current) {
        tl.fromTo(buttonWrapperRef.current, { scale: 0.8, y: 50, opacity: 0 }, {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.7)",
          immediateRender: false,
        }, "-=0.8");
      }
      tl.fromTo(linksRef.current?.children || [], { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        immediateRender: false,
      }, "-=0.6")
      .fromTo(bottomRef.current, { opacity: 0, y: 10 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        immediateRender: false,
      }, "-=0.6");

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={`relative ${t.footer} ${showCta ? 'pt-40 md:pt-52' : t.padTopNoCta} pb-10 px-6 overflow-hidden`}>
      {/* Background Glow */}
      {!light && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />}

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        {showCta && (
          <>
            <h2 ref={titleRef} className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-12">
              Pronto a crescere?
            </h2>

            <div ref={buttonWrapperRef} className="mb-24">
                <MagneticButton
                  className="group text-lg md:text-xl px-8 py-4 md:px-10 md:py-5 font-semibold hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.6)] transition-shadow duration-500 border border-white/10 hover:border-white/30"
                  onClick={() => {
                    trackCtaClick({ cta_location: 'footer', cta_label: 'Parla con un esperto', cta_destination: '/#contatti' });
                    window.history.pushState(null, '', '/#contatti');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                >
                    <span className="mr-3">Parla con un esperto</span>
                    <ArrowUpRight className="inline-block w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
                </MagneticButton>
            </div>
          </>
        )}

        <div ref={linksRef} className={`w-full grid grid-cols-1 md:grid-cols-4 gap-8 border-t pt-10 text-sm ${t.links}`}>
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
                <img
                  src="/logo.webp"
                  alt="Q4 Studio"
                  width={130}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className={`h-8 md:h-10 w-auto mb-4 mx-auto md:mx-0 ${t.logo}`}
                />
                <p className="max-w-xs mb-4 mx-auto md:mx-0">
                    Studio tecnico per tracciamento server-side, siti web, automazioni e agenti AI.
                </p>
                <div className="flex flex-col gap-2 mt-4 mb-4">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className={`flex items-center gap-2 justify-center md:justify-start ${t.contact} transition-colors`}>
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{phone}</span>
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className={`flex items-center gap-2 justify-center md:justify-start ${t.contact} transition-colors`}>
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span>{email}</span>
                    </a>
                  )}
                </div>
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                    <a
                        href="https://www.instagram.com/q4.studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 ${t.social}`}
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/q4studio/about/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 ${t.social}`}
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <div>
                <h4 className={`font-bold text-lg mb-4 ${t.heading}`}>Servizi</h4>
                <ul className="space-y-2">
                    <li><a href="/tracciamento-server-side" onClick={onInternalLink('/tracciamento-server-side')} className={link}>Tracciamento server-side</a></li>
                    <li><a href="/siti-web-ai" onClick={onInternalLink('/siti-web-ai')} className={link}>Siti web con AI</a></li>
                    <li><a href="/agenti-ai" onClick={onInternalLink('/agenti-ai')} className={link}>Agenti AI</a></li>
                    <li>
                        <a href={caseStudiesPath} onClick={onInternalLink(caseStudiesPath)} className={link}>
                            Casi Studio
                        </a>
                    </li>
                    <li><a href="/meta-advertising-b2b" onClick={onInternalLink('/meta-advertising-b2b')} className={link}>Meta Advertising B2B</a></li>
                </ul>
            </div>
            <div>
                <h4 className={`font-bold text-lg mb-4 ${t.heading}`}>Esplora</h4>
                <ul className="space-y-2">
                    <li>
                        <a href="/blog" onClick={onInternalLink('/blog')} className={link}>Blog</a>
                    </li>
                    <li>
                        <a href="/risorse" onClick={onInternalLink('/risorse')} className={link}>
                            Risorse
                        </a>
                    </li>
                    <li>
                        <a href="/about" onClick={onInternalLink('/about')} className={link}>
                            Chi siamo
                        </a>
                    </li>
                    <li>
                        <a href="/contact" onClick={onInternalLink('/contact')} className={link}>
                            Contatti
                        </a>
                    </li>
                    <li className={`pt-2 ${t.muted}`}>Legale</li>
                    {/* Link reale alla pagina /privacy (prerenderata): i crawler
                        senza JS la raggiungono dal footer, come le altre voci. */}
                    <li>
                        <a href="/privacy" onClick={onInternalLink('/privacy')} className={link}>
                            Privacy & Cookie Policy
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <div ref={bottomRef} className={`w-full flex flex-col md:flex-row justify-between items-center gap-2 mt-20 text-[11px] ${t.bottom}`}>
            <span>© {new Date().getFullYear()} Q4 Studio. Tutti i diritti riservati. • P.I. 03033250352</span>
            <span>Reggio Emilia</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
