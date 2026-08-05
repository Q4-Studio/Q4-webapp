import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CaseStudy, CaseStudyDemoVideo, caseStudiesPath, siteUrl } from '../data/caseStudies';
import SEOHead from './SEOHead';

interface CaseStudyPageProps {
  study: CaseStudy;
}

/* ------------------------------------------------------------------ */
/* Video dimostrativo del sito realizzato (loop muto, decorativo).     */
/* Stessa convenzione di HeroBackgroundVideo (home2/Hero2.tsx): il       */
/* browser sceglie il primo <source> che supporta (WebM prima di MP4),  */
/* `muted` è forzato anche via ref perché Safari/iOS a volte ignorano   */
/* l'attributo, e con prefers-reduced-motion niente autoplay, solo il   */
/* poster statico. */
/* ------------------------------------------------------------------ */
const CaseStudyDemo: React.FC<{ demo: CaseStudyDemoVideo }> = ({ demo }) => {
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
      <img
        src={demo.poster}
        alt={demo.alt}
        width={demo.width}
        height={demo.height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto aspect-video object-cover"
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
      preload="metadata"
      poster={demo.poster}
      width={demo.width}
      height={demo.height}
      aria-label={demo.alt}
      className="w-full h-auto aspect-video object-cover"
    >
      <source src={demo.webmSrc} type="video/webm" />
      <source src={demo.mp4Src} type="video/mp4" />
    </video>
  );
};

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ study }) => {
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
    author: {
      '@type': 'Organization',
      name: 'Q4 Studio',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Q4 Studio',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    about: {
      '@type': 'Organization',
      name: study.client,
      ...(study.clientUrl ? { url: study.clientUrl } : {})
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
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

  return (
    <article className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen overflow-hidden">
      <SEOHead
        title={study.metaTitle}
        description={study.description}
        image={ogImage}
        imageWidth={study.ogImageWidth}
        imageHeight={study.ogImageHeight}
        url={pageUrl}
        type="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(900px,180vw)] h-[min(900px,180vw)] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href={caseStudiesPath} className="hover:text-indigo-300 transition-colors">Casi Studio</a></li>
            <li>/</li>
            <li className="text-gray-300">{study.client}</li>
          </ol>
        </nav>

        <header className="mb-12">
          <p className="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">{study.kicker}</p>
          <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">{study.title}</h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">{study.subheadline}</p>
        </header>

        <div className="relative rounded-3xl overflow-hidden mb-14 md:mb-16 border border-white/10">
          <img
            src={study.coverImage}
            srcSet={`${study.coverImageMobile} 836w, ${study.coverImage} 1672w`}
            sizes="(min-width: 896px) 896px, 100vw"
            alt={study.coverImageAlt}
            width={study.coverImageWidth}
            height={study.coverImageHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="space-y-6 mb-16 max-w-3xl">
          {study.intro.map((block, i) => (
            <p key={block.link?.href ?? i} className="text-gray-300 leading-relaxed">
              {block.paragraph}
              {block.link && (
                <>
                  {' '}
                  <a
                    href={block.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4 decoration-indigo-400/40 transition-colors"
                  >
                    {block.link.label}
                  </a>
                </>
              )}
            </p>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{study.challenge.heading}</h2>
          <div className="space-y-4 max-w-3xl">
            {study.challenge.paragraphs.map((p, i) => (
              <p key={i} className="text-lg md:text-xl text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{study.work.heading}</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">{study.work.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {study.work.items.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 mt-1 flex-shrink-0" />
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {study.demoVideo && (
          <section className="mb-16">
            <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{study.demoVideo.heading}</h2>
            <div className="relative rounded-3xl overflow-hidden mb-6 border border-white/10">
              <CaseStudyDemo demo={study.demoVideo} />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-3xl">{study.demoVideo.caption}</p>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{study.results.heading}</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">{study.results.intro}</p>

          {study.results.stats && study.results.stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5 mb-8">
              {study.results.stats.map((stat) => (
                <div key={stat.label} className="bg-[#070707] p-8 md:p-10 text-center flex flex-col items-center gap-3">
                  <p
                    className="tabular-nums text-[clamp(28px,4.5vw,48px)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-gray-400 leading-relaxed max-w-3xl">{study.results.note}</p>
        </section>

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{study.whyItMatters.heading}</h2>
          <div className="space-y-4 max-w-3xl">
            {study.whyItMatters.paragraphs.map((p, i) => (
              <p key={i} className="text-lg md:text-xl text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {study.cta && (
          <section className="mb-16 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.05] p-8 md:p-12">
            <h2 className="mb-4 text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em]">{study.cta.heading}</h2>
            <p className="mb-7 max-w-3xl text-lg leading-relaxed text-gray-300">{study.cta.body}</p>
            <a href={study.cta.href} className="inline-flex rounded-full bg-white px-6 py-3.5 font-semibold text-[#050505]">{study.cta.label}</a>
          </section>
        )}

        <div className="flex flex-wrap gap-3 pt-8 border-t border-white/10">
          {study.services.map((service) => (
            <span key={service} className="text-[11px] uppercase tracking-[0.08em] text-gray-400 rounded-full border border-white/10 px-3 py-1.5">
              {service}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default CaseStudyPage;
