import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { trackCtaClick } from '../../utils/dataLayer';
import { onInternalLink } from '../../utils/navigate';

/* ------------------------------------------------------------------ */
/* Hero della home chiara: blocco scuro con angoli arrotondati in      */
/* basso, aurora in deriva, video di sfondo e titolo a sinistra che    */
/* entra parola per parola. Le animazioni sono CSS (classi .w, .aur,   */
/* .scroll-cue in index.css): niente timeline GSAP da tenere in piedi, */
/* quindi niente rete di sicurezza per i ticker sospesi nelle webview. */
/* ------------------------------------------------------------------ */

const HERO_VIDEO_OPACITY = 0.6;

const HeroBackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // React non riflette sempre l'attributo `muted` nel DOM: lo forziamo via
    // ref perché senza (insieme a playsInline) iOS blocca l'autoplay.
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-poster.jpg')", opacity: HERO_VIDEO_OPACITY }}
        aria-hidden="true"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster="/hero-poster.jpg"
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: HERO_VIDEO_OPACITY }}
    >
      <source src="/hero-bg.mp4" type="video/mp4" />
    </video>
  );
};

const LINE_1 = ['Il', 'tuo', 'marketing', 'funziona', 'a', 'metà,'];
const LINE_2 = ['e', 'il', 'problema', 'è', 'tecnico.'];

const Hero2: React.FC = () => {
  // Ritardi come nel mockup: 80 ms tra una parola e l'altra, una pausa più
  // lunga tra le due righe, i CTA per ultimi.
  const words = [
    ...LINE_1.map((w, i) => ({ w, delay: 0.15 + i * 0.08, br: i === LINE_1.length - 1 })),
    ...LINE_2.map((w, i) => ({ w, delay: 0.62 + i * 0.08, br: false })),
  ];

  return (
    <section
      id="hero"
      className="dark-block relative flex min-h-[100svh] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:rounded-b-[56px]"
    >
      <div className="aur aur-1" aria-hidden="true" />
      <div className="aur aur-2" aria-hidden="true" />
      <div className="aur aur-3" aria-hidden="true" />
      <HeroBackgroundVideo />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }}
      />

      {/* La nav fissa di App.tsx sta sopra: il padding alto lascia spazio. */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-20 pt-36 md:px-12 md:pt-40">
        <h1 className="h-xl max-w-[1300px]">
          {words.map(({ w, delay, br }, i) => (
            <React.Fragment key={i}>
              <span className="w" style={{ animationDelay: `${delay}s` }}>{w}</span>
              {br ? <br className="hidden md:block" /> : null}{' '}
            </React.Fragment>
          ))}
        </h1>

        <div className="w-block mt-12 flex flex-wrap items-center gap-5 md:mt-[72px] md:gap-10" style={{ animationDelay: '1.15s' }}>
          <a
            href="/tracciamento-server-side"
            className="btn btn-white"
            onClick={(e) => {
              trackCtaClick({ cta_location: 'home_hero', cta_label: 'Vedi il tracciamento e i prezzi', cta_destination: '/tracciamento-server-side' });
              onInternalLink('/tracciamento-server-side')(e);
            }}
          >
            Vedi il tracciamento e i prezzi
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="/casi-studio/candiani-denim-tracking-server-side"
            className="btn btn-glass"
            onClick={onInternalLink('/casi-studio/candiani-denim-tracking-server-side')}
          >
            Leggi il caso studio
          </a>
        </div>
      </div>

      <div className="relative z-[2] flex justify-center pb-8" aria-hidden="true">
        <div className="scroll-cue" />
      </div>
    </section>
  );
};

export default Hero2;
