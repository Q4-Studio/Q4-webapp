import React from 'react';
import { ArrowRight } from 'lucide-react';
import { seoPages, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';

const SeoDirectory: React.FC = () => {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Directory SEO Q4 Studio',
    itemListElement: seoPages.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.title,
      url: `${siteUrl}/seo/${page.slug}`
    }))
  };

  return (
    <section className="relative pt-40 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <SEOHead
        title="Directory servizi B2B Lead Generation e AI | Q4 Studio"
        description="Directory SEO Q4 Studio: tutte le pagine su Meta Ads B2B, lead generation, automazioni CRM, WhatsApp e Agenti AI."
        url={`${siteUrl}/directory`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-6">Directory</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6">
          Risorse SEO su Lead Generation B2B, Meta Ads e Agenti AI
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Questa directory raccoglie le pagine verticali di Q4 Studio. Ogni pagina approfondisce un intento di ricerca specifico e collega servizi, problemi, soluzioni e FAQ.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seoPages.map((page) => (
            <a
              key={page.slug}
              href={`/seo/${page.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] transition-all duration-300"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-300">{page.keyword}</span>
              <h2 className="text-2xl font-bold mt-4 mb-3 group-hover:text-indigo-200 transition-colors">{page.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-6">{page.description}</p>
              <span className="inline-flex items-center gap-2 text-indigo-300 font-medium">
                Apri pagina
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoDirectory;
