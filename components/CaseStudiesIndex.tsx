import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies, caseStudiesPath, siteUrl } from '../data/caseStudies';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import { trackCaseStudyClick } from '../utils/dataLayer';
import { useLightDocument } from '../hooks/useLightDocument';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Indice dei casi studio sul sistema chiaro: hero scuro corto e card  */
/* .bc con copertina, categoria, cliente e sottotitolo.                */
/* ------------------------------------------------------------------ */

const TITLE_WORDS = ['Progetti', 'reali,', 'dati', 'reali.'];

const CaseStudiesIndex: React.FC = () => {
  useLightDocument();
  const pageUrl = `${siteUrl}${caseStudiesPath}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Casi Studio Q4 Studio',
    itemListElement: caseStudies.map((study, index) => ({ '@type': 'ListItem', position: index + 1, name: study.client, url: `${pageUrl}/${study.slug}` }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Casi Studio', item: pageUrl }
    ]
  };

  return (
    <section className="relative">
      <SEOHead title="Casi Studio | Q4 Studio" description="I progetti di Q4 Studio per aziende B2B italiane: tracking server-side, automazioni e agenti AI, raccontati con dati reali." url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header id="hero" className="relative flex min-h-[520px] flex-col overflow-hidden rounded-b-[36px] bg-[#050505] text-white md:min-h-[640px] md:rounded-b-[56px]">
        <div className="aur aur-1" aria-hidden="true" />
        <div className="aur aur-2" aria-hidden="true" />
        <div className="aur aur-3" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,.35) 0%, rgba(5,5,5,.15) 50%, rgba(5,5,5,.75) 100%)' }} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pb-20 pt-36 md:px-12 md:pt-40">
          <p className="w text-[17px] font-medium text-purple-300" style={{ animationDelay: '0.1s' }}>Casi studio</p>
          <h1 className="h-sub mt-5 max-w-[1250px] text-white" style={{ color: '#fff' }}>
            {TITLE_WORDS.map((word, i) => (
              <React.Fragment key={word}>
                <span className="w" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>{word}</span>{' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="w lead mt-10 max-w-[720px] text-gray-300" style={{ animationDelay: '0.6s' }}>
            Come lavoriamo con i clienti Q4 Studio: cosa abbiamo trovato, cosa abbiamo costruito e cosa è cambiato, con i numeri veri di ogni progetto.
          </p>
        </div>
      </header>

      <div className="px-6 pb-24 pt-16 md:px-12 md:pb-[160px] md:pt-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} as="article" delay={i * 0.1} className="bc p-0 md:p-0" style={{ padding: 0 }}>
              <a
                href={`${caseStudiesPath}/${study.slug}`}
                onClick={(e) => {
                  trackCaseStudyClick({ case_study_slug: study.slug, case_study_client: study.client, cta_location: 'case_studies_index' });
                  onInternalLink(`${caseStudiesPath}/${study.slug}`)(e);
                }}
                className="group flex h-full flex-col no-underline"
              >
                <img
                  src={study.coverImageMobile}
                  srcSet={`${study.coverImageMobile} 836w, ${study.coverImage} 1672w`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={study.coverImageAlt}
                  width={study.coverImageWidth}
                  height={study.coverImageHeight}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-8 md:p-11">
                  <span className="chip self-start">{study.category}</span>
                  <h2 className="mt-6" style={{ fontSize: 'clamp(1.875rem, 2.8vw, 2.875rem)', letterSpacing: '-0.04em', lineHeight: 1.02 }}>{study.client}</h2>
                  <p className="d">{study.subheadline}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[17px] font-semibold text-[#0a0a0a] group-hover:text-purple-700">
                    Leggi il caso studio
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesIndex;
