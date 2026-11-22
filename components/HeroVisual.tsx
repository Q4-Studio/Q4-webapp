import React from 'react';
import { Layers } from 'lucide-react';

// Le varianti tracking/agents/meta sono state tolte: le pagine sono passate al sistema chiaro.
export type HeroVisualVariant = 'partner';

interface HeroVisualProps {
  variant: HeroVisualVariant;
  /**
   * Hook per fotografia reale: quando valorizzata, sostituisce il visual
   * generato via codice con questa immagine (object-cover, stesso frame
   * arrotondato del resto del sito). Pensato per quando il cliente fornirà
   * foto/video vero del progetto: basta passare `image`, il resto dell'hero
   * (layout, ambient background, reveal) resta identico, senza riscritture.
   */
  image?: { src: string; alt: string };
  className?: string;
}

interface Theme {
  accent: string;
  accentDim: string;
  accentSoft: string;
  ring: string;
}

const THEMES: Record<HeroVisualVariant, Theme> = {
  partner: { accent: '#818cf8', accentDim: 'rgba(129,140,248,0.10)', accentSoft: 'rgba(129,140,248,0.35)', ring: 'border-indigo-400/20' },
};

/* ------------------------------------------------------------------ */
/* Keyframes e classi condivise dai visual generati. Restano scoped a  */
/* questo file (niente aggiunte a index.css) perché sono dettagli di   */
/* implementazione del solo HeroVisual. Tutte le animazioni sono CSS,  */
/* non JS, e vengono disattivate sotto prefers-reduced-motion, dove il */
/* visual mostra un frame statico invece di essere nascosto.           */
/* ------------------------------------------------------------------ */
const HeroVisualStyles: React.FC = () => (
  <style>{`
    .q4-hv-layer {
      transform: translateY(var(--base-y, 0px));
      animation: q4-hv-float 4s ease-in-out infinite;
    }
    @keyframes q4-hv-float {
      0%, 100% { transform: translateY(var(--base-y, 0px)); }
      50% { transform: translateY(calc(var(--base-y, 0px) - 6px)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .q4-hv-layer { animation: none; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Sfondo ambientale dell'hero: griglia tecnica molto tenue + mesh      */
/* radiale a due punti nel colore della pagina. Sostituisce il singolo  */
/* blob sfocato che c'era prima: stessa discrezione, un po' più di      */
/* profondità. Va posizionato dentro un contenitore `relative`.        */
/* ------------------------------------------------------------------ */
export const HeroAmbient: React.FC<{ variant: HeroVisualVariant; side?: 'left' | 'right' }> = ({ variant, side = 'right' }) => {
  const theme = THEMES[variant];
  const posClass = side === 'right' ? 'right-[-10%]' : 'left-[-10%]';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black 40%, transparent 90%)',
        }}
      />
      <div className={`absolute top-10 h-[640px] w-[640px] rounded-full blur-[150px] ${posClass}`} style={{ background: theme.accentDim }} />
      <div className="absolute bottom-[-10%] left-1/3 h-[420px] w-[420px] rounded-full blur-[130px]" style={{ background: theme.accentDim }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Frame condiviso: bordo arrotondato coerente con l'idioma del sito    */
/* (rounded-3xl / rounded-[2.5rem]) e una griglia interna leggerissima. */
/* ------------------------------------------------------------------ */
const FrameShell: React.FC<{ variant: HeroVisualVariant; children: React.ReactNode }> = ({ variant, children }) => {
  const theme = THEMES[variant];
  return (
    <div className={`relative aspect-[16/11] max-h-[420px] min-h-[220px] w-full overflow-hidden rounded-[2.5rem] border ${theme.ring} bg-white/[0.02]`}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-9">{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Variante "partner": stack a livelli, per l'idea di lavoro white      */
/* label che si inserisce sotto il brand dell'agenzia.                  */
/* ------------------------------------------------------------------ */
const PartnerVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="relative flex h-full w-full items-center justify-center">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="q4-hv-layer absolute rounded-3xl border"
        style={
          {
            width: `${74 - i * 12}%`,
            height: `${58 - i * 8}%`,
            borderColor: i === 0 ? `${accent}66` : 'rgba(255,255,255,0.1)',
            background: i === 0 ? `${accent}14` : 'rgba(255,255,255,0.02)',
            zIndex: 3 - i,
            animationDelay: `${i * 0.3}s`,
            '--base-y': `${i * 12}px`,
          } as React.CSSProperties
        }
      />
    ))}
    <span className="relative z-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-gray-400">
      <Layers className="h-4 w-4" style={{ color: accent }} />
      White label
    </span>
  </div>
);

const VARIANT_COMPONENTS: Record<HeroVisualVariant, React.FC<{ accent: string }>> = {
  partner: PartnerVisual,
};

/**
 * Visual della colonna destra delle hero servizio. Di default genera un
 * illustrazione via SVG/CSS tematizzata sul colore della pagina; se viene
 * passata `image`, mostra quella al suo posto (stesso frame). Puramente
 * decorativo: marcato aria-hidden, animazioni CSS disattivate sotto
 * prefers-reduced-motion (frame statico, non nascosto).
 */
const HeroVisual: React.FC<HeroVisualProps> = ({ variant, image, className }) => {
  const theme = THEMES[variant];

  if (image) {
    return (
      <div className={`relative aspect-[16/11] max-h-[420px] min-h-[220px] w-full overflow-hidden rounded-[2.5rem] border ${theme.ring} ${className ?? ''}`} aria-hidden="true">
        <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  const Visual = VARIANT_COMPONENTS[variant];
  return (
    <div className={className} aria-hidden="true">
      <HeroVisualStyles />
      <FrameShell variant={variant}>
        <Visual accent={theme.accent} />
      </FrameShell>
    </div>
  );
};

export default HeroVisual;
