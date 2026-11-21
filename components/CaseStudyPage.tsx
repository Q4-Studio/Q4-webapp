import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { CaseStudy, CaseStudyDataBlock, CaseStudyDemoVideo, CaseStudyStat, caseStudiesPath, siteUrl } from '../data/caseStudies';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import CloseCta from './home2/CloseCta';
import { trackCtaClick } from '../utils/dataLayer';
import { useLightDocument } from '../hooks/useLightDocument';

interface CaseStudyPageProps {
  study: CaseStudy;
}

/* ------------------------------------------------------------------ */
/* Pagina del caso studio sul sistema chiaro: hero scuro con aurora,   */
/* immagine di copertina, intro, sfida, lavoro (lista .ev), video,     */
/* risultato (tre numeri grandi), blocchi dati aggiuntivi, perché      */
/* conta, chiusura scura con CTA, servizi e fonti. Un solo template    */
/* per tutti i casi studio: il contenuto arriva da data/caseStudies.ts */
/* ------------------------------------------------------------------ */

const PAPER_BG = 'linear-gradient(160deg, #f7f5fb 0%, #ecdffb 100%)';

/* Video dimostrativo (loop muto, decorativo). Stessa convenzione di
   HeroBackgroundVideo: `muted` forzato via ref, poster statico con
   prefers-reduced-motion. */
const CaseStudyDemo: React.FC<{ demo: CaseStudyDemoVideo }> = ({ demo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  if (reducedMotion) {
    return <img src={demo.poster} alt={demo.alt} width={demo.width} height={demo.height} loading="lazy" decoding="async" className="aspect-video h-auto w-full object-cover" />;
  }

  return (
    <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster={demo.poster} width={demo.width} height={demo.height} aria-label={demo.alt} className="aspect-video h-auto w-full object-cover">
      <source src={demo.webmSrc} type="video/webm" />
      <source src={demo.mp4Src} type="video/mp4" />
    </video>
  );
};

const OkIcon: React.FC = () => (
  <span className="ok" aria-hidden="true">
    <Check className="h-3 w-3" strokeWidth={3} />
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode; small?: boolean }> = ({ children, small }) => (
  <Reveal as="h2" className="h-l max-w-[1100px]" style={small ? { fontSize: 'clamp(2.25rem, 4.6vw, 4.5rem)' } : undefined}>
    {children}
  </Reveal>
);

const Lead: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay, className = '' }) => (
  <Reveal as="p" delay={delay} className={`lead max-w-[720px] ${className}`}>{children}</Reveal>
);

/** Tre numeri grandi con bordo a sinistra (come le cifre della pagina siti). */
const StatGrid: React.FC<{ stats: CaseStudyStat[] }> = ({ stats }) => (
  <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
    {stats.map((stat, i) => (
      <Reveal key={stat.label} delay={i * 0.1} className="py-2 pl-8" style={{ borderLeft: '1px solid rgba(10,10,10,.12)' }}>
        <p className="disp grad tabular-nums" style={{ fontSize: 'clamp(2.75rem, 5.2vw, 5.5rem)', letterSpacing: '-0.06em' }}>{stat.value}</p>
        <p className="mt-4 max-w-[320px] text-[19px] leading-normal">{stat.label}</p>
      </Reveal>
    ))}
  </div>
);

/** Righe etichetta → valore nel mock bianco (come la lista eventi della home). */
const RowList: React.FC<{ rows: Array<{ label: string; value: string }> }> = ({ rows }) => (
  <Reveal delay={0.12} className="mock">
    {rows.map((row) => (
      <div key={row.label} className="ev">
        <OkIcon />
        {row.label}
        {row.value && <em>{row.value}</em>}
      </div>
    ))}
  </Reveal>
);

const DataBlock: React.FC<{ block: CaseStudyDataBlock }> = ({ block }) => (
  <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
    <div className="mx-auto max-w-[1440px]">
      <SectionTitle small>{block.heading}</SectionTitle>
      {block.intro && <Lead className="mt-8 md:mt-10">{block.intro}</Lead>}
      {block.stats && <div className="mt-16 md:mt-20"><StatGrid stats={block.stats} /></div>}
      {block.rows && <div className="mt-16 max-w-[960px] md:mt-20"><RowList rows={block.rows} /></div>}
      {block.note && <Lead delay={0.12} className="mt-10">{block.note}</Lead>}
      {block.source && <Reveal as="p" delay={0.16} className="mt-6 max-w-[720px] text-[16px] leading-normal text-gray-500">Fonte: {block.source}</Reveal>}
    </div>
  </section>
);

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ study }) => {
  useLightDocument();
  const pageUrl = `${siteUrl}${caseStudiesPath}/${study.slug}`;
  const ogImage = `${siteUrl}${study.ogImage}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.client}: ${study.subheadline}`,
    description: study.description,
    image: ogImage,
    datePublished: study.datePublished,
    dateModified: study.datePublished,
    author: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Q4 Studio', logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` } },
    about: { '@type': 'Organization', name: study.client, ...(study.clientUrl ? { url: study.clientUrl } : {}) },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: 'it-IT'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Casi Studio', item: `${siteUrl}${caseStudiesPath}` },
      { '@type': 'ListItem', position: 3, name: study.client, item: pageUrl }
    ]
  };

  const titleWords = study.title.split(' ');

  return (
    <article className="relative">
      <SEOHead title={study.metaTitle} description={study.description} image={ogImage} imageWidth={study.ogImageWidth} imageHeight={study.ogImageHeight} url={pageUrl} type="article" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero scuro: id="hero" tiene bianchi logo e hamburger della nav. */}
      <header id="hero" className="relative flex min-h-[560px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[680px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-20 pt-36 md:px-12 md:pt-40">
          <nav aria-label="Breadcrumb" className="w text-[16px] text-white/70" style={{ animationDelay: '0.1s' }}>
            <ol className="flex flex-wrap items-center gap-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li aria-hidden="true">/</li>
              <li><a href={caseStudiesPath} className="hover:text-white">Casi studio</a></li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{study.client}</li>
            </ol>
          </nav>
          <p className="w mt-10 text-[17px] font-medium text-purple-300" style={{ animationDelay: '0.2s' }}>{study.kicker}</p>
          <h1 className="h-sub mt-5 max-w-[1250px] text-white" style={{ color: '#fff' }}>
            {titleWords.map((word, i) => (
              <React.Fragment key={`${word}-${i}`}>
                <span className="w" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w lead mt-10 max-w-[720px] text-gray-300" style={{ animationDelay: `${0.4 + titleWords.length * 0.08}s` }}>{study.subheadline}</p>
        </div>
      </header>

      {/* Copertina */}
      <section className="px-6 pt-6 md:pt-8">
        <Reveal className="mx-auto max-w-[1392px] overflow-hidden rounded-[36px] md:rounded-[56px]">
          <img
            src={study.coverImage}
            srcSet={`${study.coverImageMobile} 836w, ${study.coverImage} 1672w`}
            sizes="(min-width: 1440px) 1392px, 100vw"
            alt={study.coverImageAlt}
            width={study.coverImageWidth}
            height={study.coverImageHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-auto w-full object-cover"
          />
        </Reveal>
      </section>

      {/* Intro: chi è il cliente */}
      <section className="px-6 pb-24 pt-24 md:px-12 md:pb-[160px] md:pt-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="ml-auto max-w-[760px]">
            {study.intro.map((block, i) => (
              <Lead key={block.link?.href ?? i} delay={i * 0.12} className={i > 0 ? 'mt-7' : ''}>
                {block.paragraph}
                {block.link && (
                  <>
                    {' '}
                    <a href={block.link.href} target="_blank" rel="noopener noreferrer" className="text-[#0a0a0a] underline decoration-purple-400/60 underline-offset-4 hover:text-purple-700">{block.link.label}</a>
                  </>
                )}
              </Lead>
            ))}
          </div>
        </div>
      </section>

      {/* La sfida */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>{study.challenge.heading}</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-24">
            {study.challenge.paragraphs.map((p, i) => (
              <Lead key={i} delay={i * 0.12} className="max-w-[560px]">{p}</Lead>
            ))}
          </div>
        </div>
      </section>

      {/* Il lavoro: blocco carta con la lista */}
      <section className="px-6 pb-24 md:pb-[160px]">
        <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[36px] px-7 py-16 md:rounded-[56px] md:px-20 md:py-[100px]" style={{ background: PAPER_BG }}>
          <div className="dots" aria-hidden="true" />
          <div className="relative grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-24">
            <div>
              <SectionTitle small>{study.work.heading}</SectionTitle>
              <Lead className="mt-7 max-w-[560px] text-gray-700">{study.work.intro}</Lead>
            </div>
            <RowList rows={study.work.items.map((item) => ({ label: item, value: '' }))} />
          </div>
        </div>
      </section>

      {/* Video dimostrativo */}
      {study.demoVideo && (
        <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle small>{study.demoVideo.heading}</SectionTitle>
            <Reveal delay={0.12} className="mt-12 overflow-hidden rounded-[36px] md:mt-16 md:rounded-[56px]" style={{ boxShadow: '0 40px 80px -40px rgba(76,29,149,.45)' }}>
              <CaseStudyDemo demo={study.demoVideo} />
            </Reveal>
            <Lead delay={0.16} className="mt-8">{study.demoVideo.caption}</Lead>
          </div>
        </section>
      )}

      {/* Il risultato */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>{study.results.heading}</SectionTitle>
          <Lead className="mt-8 md:mt-10">{study.results.intro}</Lead>
          {study.results.stats && study.results.stats.length > 0 && (
            <div className="mt-16 md:mt-20"><StatGrid stats={study.results.stats} /></div>
          )}
          <Lead delay={0.12} className="mt-12">{study.results.note}</Lead>
        </div>
      </section>

      {/* Blocchi dati aggiuntivi */}
      {study.data?.map((block) => <DataBlock key={block.heading} block={block} />)}

      {/* Perché conta */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle>{study.whyItMatters.heading}</SectionTitle>
          <div className="ml-auto mt-12 max-w-[760px] md:mt-16">
            {study.whyItMatters.paragraphs.map((p, i) => (
              <Lead key={i} delay={i * 0.12} className={i > 0 ? 'mt-7' : ''}>{p}</Lead>
            ))}
          </div>
        </div>
      </section>

      {/* Servizi e fonti */}
      <section className="px-6 pb-24 md:px-12 md:pb-[160px]">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="flex flex-wrap gap-2.5">
            {study.services.map((service) => <span key={service} className="chip">{service}</span>)}
          </Reveal>
          {study.sources && study.sources.length > 0 && (
            <Reveal delay={0.12} className="mt-12 max-w-[760px]">
              <h2 className="text-[22px]" style={{ letterSpacing: '-0.02em' }}>Fonti dei numeri</h2>
              <ul className="bul mt-4">
                {study.sources.map((source) => <li key={source}>{source}</li>)}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {study.cta && (
        <CloseCta
          size="l"
          title={study.cta.heading}
          lead={study.cta.body}
          cta={{
            label: study.cta.label,
            href: study.cta.href,
            onClick: () => trackCtaClick({ cta_location: 'case_study_detail', cta_label: study.cta!.label, cta_destination: study.cta!.href, case_study_slug: study.slug }),
          }}
        />
      )}
    </article>
  );
};

export default CaseStudyPage;
