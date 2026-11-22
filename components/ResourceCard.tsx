import React from 'react';
import { Bot, ChartColumn, Clock, Database, Layers, MessageSquare, RefreshCw, Search, Server, ShieldCheck, Users } from 'lucide-react';
import Reveal from './home2/Reveal';
import { geoTopicSlug, resourcesPath, SeoPage } from '../data/seoPages';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Card di una risorsa (mockup Risorse.html e "Argomenti correlati" di  */
/* Articolo.html): fondo carta, icona viola, titolo e descrizione in    */
/* basso. Usata dall'indice /risorse e dalle pagine correlate.          */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

// Icone del mockup per slug esatto: pagine tematiche e temi della matrice
// geografica. Le pagine geografiche (`<tema>-<città>`) prendono l'icona del
// loro tema (`geoTopicSlug`), senza confronti per prefisso.
const ICONS: Record<string, IconType> = {
  'agenti-ai-per-lead-generation': Bot,
  'agente-vocale-ai-aziende': MessageSquare,
  'centralino-ai': Clock,
  'riattivazione-database-clienti-ai': RefreshCw,
  'chatbot-cliniche-studi-medici': ShieldCheck,
  'crm-automation-meta-ads': Database,
  'whatsapp-automation-lead-b2b': MessageSquare,
  'tracking-server-side-deduplicazione-eventi': Server,
  'reminder-automatici-appuntamenti-no-show': Clock,
  'second-brain-aziendale-agente-ai': Search,
  'raccolta-dati-marketing': ChartColumn,
  'automazioni-crm-pmi': RefreshCw,
  'tracking-server-side': Server,
  'conversioni-ad-blocker': ShieldCheck,
  'integrare-strumenti-marketing-server-side': Layers,
  'automazioni-lead-senza-team-tecnico': Users,
};

export const resourceIcon = (slug: string): IconType => ICONS[slug] ?? ICONS[geoTopicSlug(slug) ?? ''] ?? Search;

/** Riquadro icona del sistema chiaro (`.ico`, 60px, viola su lilla). */
export const IconBox: React.FC<{ icon: IconType }> = ({ icon: Icon }) => (
  <span className="ico" aria-hidden="true">
    <Icon className="h-7 w-7" strokeWidth={1.7} />
  </span>
);

const ResourceCard: React.FC<{ page: SeoPage; delay?: number; minHeight?: number }> = ({ page, delay = 0, minHeight = 300 }) => {
  const href = `${resourcesPath}/${page.slug}`;
  return (
    <Reveal delay={delay} className="h-full">
      <a href={href} onClick={onInternalLink(href)} className="bc h-full gap-6 no-underline" style={{ minHeight }}>
        <IconBox icon={resourceIcon(page.slug)} />
        <div className="mt-auto">
          <h3 style={{ fontSize: 'clamp(1.4rem, 1.9vw, 1.9rem)', letterSpacing: '-0.035em', lineHeight: 1.08 }}>{page.title}</h3>
          <p className="mt-3 text-[15px] leading-[1.55]">{page.description}</p>
        </div>
      </a>
    </Reveal>
  );
};

export default ResourceCard;
