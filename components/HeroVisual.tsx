import React from 'react';
import { Globe, Server, Megaphone, Layers } from 'lucide-react';

export type HeroVisualVariant = 'tracking' | 'agents' | 'meta' | 'partner';

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
  tracking: { accent: '#22d3ee', accentDim: 'rgba(34,211,238,0.10)', accentSoft: 'rgba(34,211,238,0.35)', ring: 'border-cyan-400/20' },
  agents: { accent: '#c084fc', accentDim: 'rgba(192,132,252,0.10)', accentSoft: 'rgba(192,132,252,0.35)', ring: 'border-purple-400/20' },
  meta: { accent: '#60a5fa', accentDim: 'rgba(96,165,250,0.10)', accentSoft: 'rgba(96,165,250,0.35)', ring: 'border-blue-400/20' },
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
    .q4-hv-dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      opacity: 0;
      animation: q4-hv-flow 2.6s linear infinite;
    }
    @keyframes q4-hv-flow {
      0% { offset-distance: 0%; opacity: 0; }
      8% { opacity: 1; }
      92% { opacity: 1; }
      100% { offset-distance: 100%; opacity: 0; }
    }
    .q4-hv-msg { animation: q4-hv-pulse 2.6s ease-in-out infinite; }
    .q4-hv-row { animation: q4-hv-pulse 2.6s ease-in-out infinite; }
    @keyframes q4-hv-pulse {
      0%, 100% { opacity: 0.55; }
      50% { opacity: 1; }
    }
    .q4-hv-bar {
      animation: q4-hv-grow 2.8s ease-in-out infinite alternate;
      transform-origin: bottom;
    }
    @keyframes q4-hv-grow {
      0% { transform: scaleY(0.92); }
      100% { transform: scaleY(1); }
    }
    .q4-hv-layer {
      transform: translateY(var(--base-y, 0px));
      animation: q4-hv-float 4s ease-in-out infinite;
    }
    @keyframes q4-hv-float {
      0%, 100% { transform: translateY(var(--base-y, 0px)); }
      50% { transform: translateY(calc(var(--base-y, 0px) - 6px)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .q4-hv-dot { animation: none; opacity: 0.85; offset-distance: 50%; }
      .q4-hv-msg, .q4-hv-row { animation: none; opacity: 1; }
      .q4-hv-bar { animation: none; transform: scaleY(1); }
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
/* Variante "tracking": pacchetti dati che scorrono da browser a        */
/* container server-side, e da lì alla piattaforma ads.                 */
/* ------------------------------------------------------------------ */
const PATH_A = 'M 30 60 C 100 60, 100 140, 155 140';
const PATH_B = 'M 155 140 C 210 140, 210 210, 270 210';

const TrackingVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="relative h-full w-full">
    <svg viewBox="0 0 300 260" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d={PATH_A} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <path d={PATH_B} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
    </svg>
    <div className="absolute left-[4%] top-[10%] flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a]">
        <Globe className="h-5 w-5 text-gray-300" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Browser</span>
    </div>
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ borderColor: accent, background: `${accent}22` }}>
        <Server className="h-6 w-6" style={{ color: accent }} />
      </div>
      <span className="max-w-[9ch] text-center text-[10px] uppercase tracking-[0.1em] text-gray-400">Container server-side</span>
    </div>
    <div className="absolute bottom-[8%] right-[4%] flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a]">
        <Megaphone className="h-5 w-5 text-gray-300" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Ad platform</span>
    </div>
    {[0, 1, 2].map((i) => (
      <span key={`a${i}`} className="q4-hv-dot" style={{ offsetPath: `path('${PATH_A}')`, background: accent, animationDelay: `${i * 0.85}s` }} />
    ))}
    {[0, 1, 2].map((i) => (
      <span key={`b${i}`} className="q4-hv-dot" style={{ offsetPath: `path('${PATH_B}')`, background: accent, animationDelay: `${0.45 + i * 0.85}s` }} />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Variante "agents": messaggi disordinati in arrivo che si risolvono   */
/* in righe strutturate nel CRM.                                        */
/* ------------------------------------------------------------------ */
const AgentsVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="grid h-full w-full grid-cols-2 gap-5">
    <div className="flex flex-col justify-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Messaggi in arrivo</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="q4-hv-msg rounded-2xl border border-white/10 bg-[#0a0a0a] p-3"
          style={{ animationDelay: `${i * 0.5}s`, width: `${82 - i * 12}%` }}
        >
          <div className="h-1.5 w-full rounded-full bg-white/10" />
          <div className="mt-2 h-1.5 w-2/3 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
    <div className="flex flex-col justify-center gap-3 border-l border-dashed border-white/10 pl-5">
      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Righe nel CRM</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="q4-hv-row flex items-center gap-2 rounded-xl border p-2"
          style={{ borderColor: `${accent}55`, background: `${accent}14`, animationDelay: `${0.4 + i * 0.5}s` }}
        >
          <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
          <div className="h-1.5 flex-1 rounded-full bg-white/20" />
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Variante "meta": funnel di audience, con barre che "respirano" per   */
/* dare un'idea di dati vivi/monitorati.                                */
/* ------------------------------------------------------------------ */
const META_STEPS: [string, number][] = [['Reach', 92], ['Interesse', 68], ['Lead', 46], ['Cliente', 26]];

const MetaVisual: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="flex h-full w-full flex-col justify-center gap-5">
    <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">Funnel di audience</span>
    <div className="flex h-[70%] items-end gap-3">
      {META_STEPS.map(([label, h], i) => (
        <div key={label} className="flex flex-1 flex-col items-center justify-end gap-2">
          <div
            className="q4-hv-bar w-full rounded-t-lg"
            style={{ height: `${h}%`, background: `linear-gradient(to top, ${accent}66, ${accent}0d)`, animationDelay: `${i * 0.25}s` }}
          />
          <span className="text-[10px] text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

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
  tracking: TrackingVisual,
  agents: AgentsVisual,
  meta: MetaVisual,
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
