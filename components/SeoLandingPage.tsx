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

  return (
    <article className="relative pt-36 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <SEOHead title={page.metaTitle} description={page.description} url={pageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <a href="/directory" className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Torna alla directory
        </a>

        <header className="mb-14">
          <p className="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">{page.keyword}</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{page.title}</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">{page.description}</p>
        </header>

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
