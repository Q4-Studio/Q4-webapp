import React from 'react';

/* ------------------------------------------------------------------ */
/* Hero scuro corto delle pagine interne chiare (`.hero.sub` dei mockup */
/* Contatti, About, Privacy): aurora, kicker viola, h1 a parole (`.w`)  */
/* e lead; `children` (CTA, metadati dell'articolo) entra dopo il lead. */
/* id="hero" tiene bianchi logo e hamburger della nav finché l'hero è   */
/* sotto.                                                              */
/* ------------------------------------------------------------------ */

interface SubHeroProps {
  kicker: React.ReactNode;
  title: string;
  lead: React.ReactNode;
  children?: React.ReactNode;
}

const SubHero: React.FC<SubHeroProps> = ({ kicker, title, lead, children }) => {
  const words = title.split(' ');
  const leadDelay = 0.15 + words.length * 0.07 + 0.2;
  return (
    <header id="hero" className="dark-block relative flex min-h-[520px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[640px] md:rounded-b-[56px]">
      <div className="aur aur-1" aria-hidden="true" />
      <div className="aur aur-2" aria-hidden="true" />
      <div className="aur aur-3" aria-hidden="true" />
      <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-20 pt-36 md:px-12 md:pb-24 md:pt-40">
        <div className="w-block text-[17px] font-medium text-purple-300" style={{ animationDelay: '0.05s' }}>{kicker}</div>
        <h1 className="h-sub mt-8 max-w-[1250px]">
          {words.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              <span className="w" style={{ animationDelay: `${(0.15 + i * 0.07).toFixed(2)}s` }}>{word}</span>{' '}
            </React.Fragment>
          ))}
        </h1>
        <p className="w-block lead mt-12 max-w-[640px] text-gray-300" style={{ animationDelay: `${leadDelay.toFixed(2)}s` }}>
          {lead}
        </p>
        {children && (
          <div className="w-block mt-12" style={{ animationDelay: `${(leadDelay + 0.15).toFixed(2)}s` }}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

export default SubHero;
