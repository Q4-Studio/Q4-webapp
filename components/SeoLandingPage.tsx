import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { clusterHub, resourcesPath, SeoPage, seoPages, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';

interface SeoLandingPageProps {
  page: SeoPage;
}

const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ page }) => {
  const pageUrl = `${siteUrl}${resourcesPath}/${page.slug}`;
  const hub = clusterHub[page.cluster];
  // "Pagine correlate" preferisce lo stesso cluster tematico (stesso hub di
  // riferimento) invece di pescare a caso tra le 10 pagine: prima le altre
  // pagine dello stesso cluster, poi riempie con le rimanenti solo se non
  // bastano a fare 3.
  const otherPages = seoPages.filter((relatedPage) => relatedPage.slug !== page.slug);
  const sameCluster = otherPages.filter((relatedPage) => relatedPage.cluster === page.cluster);
  const otherCluster = otherPages.filter((relatedPage) => relatedPage.cluster !== page.cluster);
  const relatedPages = [...sameCluster, ...otherCluster].slice(0, 3);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.description,
    provider: {
      '@type': 'Organization',
      name: 'Q4 Studio',
      url: siteUrl
    },
    areaServed: 'IT',
    url: pageUrl,
    mainEntityOfPage: pageUrl
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Risorse', item: `${siteUrl}${resourcesPath}` },
      { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl }
    ]
  };

  return (
    <article className="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-white text-[#0a0a0a] min-h-screen overflow-hidden">
      <SEOHead title={page.metaTitle} description={page.description} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(900px,180vw)] h-[min(900px,180vw)] bg-purple-200/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-purple-700 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href={resourcesPath} className="hover:text-purple-700 transition-colors">Risorse</a></li>
            <li>/</li>
            <li className="text-[#0a0a0a]">{page.title}</li>
          </ol>
        </nav>

        <header className="mb-14">
          <p className="text-purple-700 text-sm tracking-[0.08em] uppercase mb-5">{page.keyword}</p>
          <h1 className="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">{page.title}</h1>
          <p className="text-lg md:text-xl text-[#4b5563] leading-relaxed max-w-3xl">{page.description}</p>
        </header>

        {/* Direct Answer for GEO */}
        <section className="mb-16 rounded-3xl border border-purple-200 bg-gradient-to-br from-[#f7f5fb] to-[#ecdffb] p-8">
          <h2 className="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">Risposta diretta</h2>
          <p className="text-lg md:text-xl text-[#0a0a0a] leading-relaxed">{page.directAnswer}</p>
        </section>

        {/* Link mandatorio spoke→hub: questa pagina informativa collega
            sempre alla pagina di offerta bespoke del suo cluster. */}
        <a href={hub.path} className="mb-16 flex items-center justify-between gap-4 rounded-3xl border border-black/5 bg-[#f7f5fb] p-6 transition-colors hover:border-purple-300">
          <span className="text-[#4b5563]">Vuoi vedere prezzi e pacchetti? <strong className="text-[#0a0a0a]">{hub.label}</strong></span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-purple-700" />
        </a>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <section className="rounded-3xl border border-black/5 bg-[#f7f5fb] p-6">
            <h2 className="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">Per chi</h2>
            <p className="text-[#4b5563] leading-relaxed">{page.audience}.</p>
          </section>
          <section className="rounded-3xl border border-black/5 bg-[#f7f5fb] p-6">
            <h2 className="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">Problema</h2>
            <p className="text-[#4b5563] leading-relaxed">{page.pain}.</p>
          </section>
          <section className="rounded-3xl border border-purple-200 bg-gradient-to-br from-[#f7f5fb] to-[#ecdffb] p-6">
            <h2 className="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">Risultato</h2>
            <p className="text-[#4b5563] leading-relaxed">{page.proof}.</p>
          </section>
        </div>

        {/* Data Points */}
        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Dati e risultati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.dataPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-[#f7f5fb] p-5">
                <CheckCircle2 className="w-5 h-5 text-purple-700 mt-1 flex-shrink-0" />
                <span className="text-[#0a0a0a]">{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Keyword Clusters */}
        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Argomenti correlati</h2>
          <div className="space-y-6">
            {page.clusters.map((cluster) => (
              <section key={cluster.keyword} className="rounded-2xl border border-black/5 bg-[#f7f5fb] p-6">
                <h3 className="text-2xl font-semibold leading-[1.25] tracking-[-0.01em] mb-4 text-purple-800">{cluster.heading}</h3>
                <p className="text-[#4b5563] leading-relaxed">{cluster.content}</p>
              </section>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        {page.comparisonTable && (
          <section className="mb-16">
            <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">{page.comparisonTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/20">
                    {page.comparisonTable.headers.map((header) => (
                      <th key={header} className="p-4 text-purple-700 font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.rows.map((row, i) => (
                    <tr key={i} className="border-b border-black/10 hover:bg-black/[0.02]">
                      {row.map((cell, j) => (
                        <td key={j} className="p-4 text-[#4b5563]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Come interveniamo</h2>
          <p className="text-lg md:text-xl text-[#4b5563] leading-relaxed mb-8">{page.solution}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.services.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-2xl border border-black/5 bg-[#f7f5fb] p-5">
                <CheckCircle2 className="w-5 h-5 text-purple-700 mt-1 flex-shrink-0" />
                <span className="text-[#0a0a0a]">{service}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">FAQ</h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-black/5 bg-[#f7f5fb] p-6">
                <h3 className="text-2xl font-semibold leading-[1.25] tracking-[-0.01em] mb-3">{faq.question}</h3>
                <p className="text-[#4b5563] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Pagine correlate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPages.map((relatedPage) => (
              <a key={relatedPage.slug} href={`${resourcesPath}/${relatedPage.slug}`} className="rounded-2xl border border-black/5 bg-[#f7f5fb] p-5 text-[#4b5563] hover:text-[#0a0a0a] hover:border-purple-300 transition-colors">
                {relatedPage.title}
              </a>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default SeoLandingPage;
