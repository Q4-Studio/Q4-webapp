import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies, caseStudiesIndexCopy, caseStudiesPath, siteUrl } from '../data/caseStudies';
import SEOHead from './SEOHead';
import Reveal from './home2/Reveal';
import SubHero from './home2/SubHero';
import { trackCaseStudyClick } from '../utils/dataLayer';
import { onInternalLink } from '../utils/navigate';

/* ------------------------------------------------------------------ */
/* Indice dei casi studio sul sistema chiaro: hero scuro corto e card  */
/* .bc con copertina, categoria, cliente e sottotitolo.                */
/* ------------------------------------------------------------------ */

const CaseStudiesIndex: React.FC = () => {
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

      <SubHero kicker={caseStudiesIndexCopy.kicker} title={caseStudiesIndexCopy.title} lead={caseStudiesIndexCopy.lead} />

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
