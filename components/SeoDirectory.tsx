import React from 'react';
import { ArrowRight } from 'lucide-react';
import { resourcesPath, seoPages, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';

const SeoDirectory: React.FC = () => {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Risorse Q4 Studio',
    itemListElement: seoPages.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.title,
      url: `${siteUrl}${resourcesPath}/${page.slug}`
    }))
  };

  return (
    <section className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-white text-[#0a0a0a] min-h-screen overflow-hidden">
      <SEOHead
        title="Risorse su AI, Automazioni e Tecnologia per PMI B2B | Q4 Studio"
        description="Risorse Q4 Studio su agenti AI, automazioni WhatsApp e CRM, centralino e chatbot intelligenti per le aziende B2B."
        url={`${siteUrl}${resourcesPath}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(900px,180vw)] h-[min(900px,180vw)] bg-purple-200/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <p className="text-purple-700 text-sm tracking-[0.08em] uppercase mb-5">Risorse</p>
        <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] max-w-4xl mb-6">
          Risorse su Agenti AI, Automazioni e Tecnologia per Aziende B2B
        </h1>
        <p className="text-lg md:text-xl text-[#4b5563] leading-relaxed max-w-3xl mb-14">
          Questa directory raccoglie le pagine verticali di Q4 Studio. Ogni pagina approfondisce un intento di ricerca specifico e collega servizi, problemi, soluzioni e FAQ.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seoPages.map((page) => (
            <a
              key={page.slug}
            href={`${resourcesPath}/${page.slug}`}
              className="group rounded-3xl border border-black/5 bg-[#f7f5fb] p-6 hover:border-purple-300 hover:shadow-[0_30px_60px_-40px_rgba(126,34,206,0.35)] transition-all duration-300"
            >
              <span className="text-[11px] uppercase tracking-[0.08em] text-purple-700">{page.keyword}</span>
              <h2 className="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mt-4 mb-3 group-hover:text-purple-700 transition-colors">{page.title}</h2>
              <p className="text-[#4b5563] leading-relaxed mb-6">{page.description}</p>
              <span className="inline-flex items-center gap-2 text-purple-700 font-medium">
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
