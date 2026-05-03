import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SeoPage, seoPages, siteUrl } from '../data/seoPages';
import SEOHead from './SEOHead';

interface SeoLandingPageProps {
  page: SeoPage;
}

const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ page }) => {
  const pageUrl = `${siteUrl}/seo/${page.slug}`;
  const relatedPages = seoPages.filter((relatedPage) => relatedPage.slug !== page.slug).slice(0, 3);
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
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${siteUrl}/directory` },
      { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl }
    ]
  };

  return (
    <article className="relative pt-36 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <SEOHead title={page.metaTitle} description={page.description} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/directory" className="hover:text-indigo-300 transition-colors">Directory</a></li>
            <li>/</li>
            <li className="text-gray-300">{page.title}</li>
          </ol>
        </nav>

        <header className="mb-14">
          <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">{page.keyword}</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{page.title}</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">{page.description}</p>
        </header>

        {/* Direct Answer for GEO */}
        <section className="mb-16 rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8">
          <h2 className="text-2xl font-bold mb-4">Risposta diretta</h2>
          <p className="text-lg text-gray-200 leading-relaxed">{page.directAnswer}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold mb-3">Per chi</h2>
            <p className="text-gray-400 leading-relaxed">{page.audience}.</p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold mb-3">Problema</h2>
            <p className="text-gray-400 leading-relaxed">{page.pain}.</p>
          </section>
          <section className="rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6">
            <h2 className="text-xl font-bold mb-3">Risultato</h2>
            <p className="text-gray-300 leading-relaxed">{page.proof}.</p>
          </section>
        </div>

        {/* Data Points */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Dati e risultati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.dataPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="w-5 h-5 text-cyan-300 mt-1 flex-shrink-0" />
                <span className="text-gray-200">{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Keyword Clusters */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Argomenti correlati</h2>
          <div className="space-y-6">
            {page.clusters.map((cluster) => (
              <section key={cluster.keyword} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold mb-3 text-indigo-200">{cluster.heading}</h3>
                <p className="text-gray-400 leading-relaxed">{cluster.content}</p>
              </section>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        {page.comparisonTable && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{page.comparisonTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    {page.comparisonTable.headers.map((header) => (
                      <th key={header} className="p-4 text-indigo-300 font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparisonTable.rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/[0.02]">
                      {row.map((cell, j) => (
                        <td key={j} className="p-4 text-gray-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Come interveniamo</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">{page.solution}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.services.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 mt-1 flex-shrink-0" />
                <span className="text-gray-200">{service}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pagine correlate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPages.map((relatedPage) => (
              <a key={relatedPage.slug} href={`/seo/${relatedPage.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors">
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
