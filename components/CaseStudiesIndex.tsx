import React from 'react';
import { ArrowRight } from 'lucide-react';
import { caseStudies, caseStudiesPath, siteUrl } from '../data/caseStudies';
import SEOHead from './SEOHead';

const CaseStudiesIndex: React.FC = () => {
  const pageUrl = `${siteUrl}${caseStudiesPath}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Casi Studio Q4 Studio',
    itemListElement: caseStudies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: study.client,
      url: `${pageUrl}/${study.slug}`
    }))
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
    <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen overflow-hidden">
      <SEOHead
        title="Casi Studio | Q4 Studio"
        description="I progetti di Q4 Studio per aziende B2B italiane: tracking server-side, automazioni e agenti AI, raccontati con dati reali."
        url={pageUrl}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(900px,180vw)] h-[min(900px,180vw)] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <p className="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">Casi Studio</p>
        <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] max-w-4xl mb-6">
          Progetti reali, dati reali.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Come lavoriamo con i clienti Q4 Studio: cosa abbiamo trovato, cosa abbiamo costruito e cosa è cambiato, con i numeri veri di ogni progetto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {caseStudies.map((study) => (
            <a
              key={study.slug}
              href={`${caseStudiesPath}/${study.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] transition-all duration-300"
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
                className="w-full aspect-video object-cover border-b border-white/10"
              />
              <div className="p-6">
                <span className="text-[11px] uppercase tracking-[0.08em] text-indigo-300">{study.category}</span>
                <h2 className="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mt-4 mb-3 group-hover:text-indigo-200 transition-colors">{study.client}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{study.subheadline}</p>
                <span className="inline-flex items-center gap-2 text-indigo-300 font-medium">
                  Leggi il caso studio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesIndex;
