import { resourcesPath, seoPages, siteUrl } from '../data/seoPages.ts';
import { createClient } from '@supabase/supabase-js';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, '..', 'dist');
const compiledIndexPath = join(distDir, 'index.html');

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCompiledHeadTags(): string {
  if (!existsSync(compiledIndexPath)) return '';
  const indexHtml = readFileSync(compiledIndexPath, 'utf8');
  const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';

  return headMatch[1]
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed.startsWith('<script type="module"')
        || trimmed.startsWith('<link rel="modulepreload"')
        || (trimmed.startsWith('<link rel="stylesheet"') && trimmed.includes('/assets/'));
    })
    .join('\n  ');
}

function getCompiledNoscript(): string {
  if (!existsSync(compiledIndexPath)) return '';
  const indexHtml = readFileSync(compiledIndexPath, 'utf8');
  const match = indexHtml.match(/<noscript>[\s\S]*?<\/noscript>/i);
  return match ? match[0] : '';
}

function writeHtmlFile(path: string, html: string) {
  writeFileSync(path, html, 'utf8');
}

function generateBaseHtml(options: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  type?: 'website' | 'article';
  schema?: object[];
  bodyContent: string;
}) {
  const { title, description, canonical, ogImage = `${siteUrl}/og-image.jpg`, type = 'website', schema = [], bodyContent } = options;

  const schemaScripts = schema
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  const compiledHeadTags = getCompiledHeadTags();
  const compiledNoscript = getCompiledNoscript();

  return `<!DOCTYPE html>
<html lang="it" class="bg-[#050505]">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="title" content="${escapeHtml(title)}" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:site_name" content="Q4 Studio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com" defer></script>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #050505; color: #ffffff; overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
  </style>
  ${schemaScripts}
  ${compiledHeadTags}
</head>
<body>
  ${compiledNoscript}
  <div id="root">
    ${bodyContent}
  </div>
</body>
</html>`;
}

function generateLandingPageHtml(page: typeof seoPages[0]): string {
  const pageUrl = `${siteUrl}${resourcesPath}/${page.slug}`;
  const relatedPages = seoPages.filter((p) => p.slug !== page.slug).slice(0, 3);

  const serviceSchema = {
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

  const servicesHtml = page.services
    .map((s) => `<div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><svg class="w-5 h-5 text-indigo-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><span class="text-gray-200">${escapeHtml(s)}</span></div>`)
    .join('\n              ');

  const dataPointsHtml = page.dataPoints
    .map((point) => `<div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><svg class="w-5 h-5 text-cyan-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><span class="text-gray-200">${escapeHtml(point)}</span></div>`)
    .join('\n              ');

  const clustersHtml = page.clusters
    .map((cluster) => `<section class="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 class="text-xl font-semibold mb-3 text-indigo-200">${escapeHtml(cluster.heading)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(cluster.content)}</p></section>`)
    .join('\n            ');

  const comparisonTableHtml = page.comparisonTable ? `
    <section class="mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">${escapeHtml(page.comparisonTable.title)}</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/20">
              ${page.comparisonTable.headers.map((h) => `<th class="p-4 text-indigo-300 font-semibold">${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${page.comparisonTable.rows.map((row) => `<tr class="border-b border-white/10 hover:bg-white/[0.02]">${row.map((cell) => `<td class="p-4 text-gray-300">${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
  ` : '';

  const faqsHtml = page.faqs
    .map((faq) => `<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 class="text-xl font-semibold mb-3">${escapeHtml(faq.question)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(faq.answer)}</p></div>`)
    .join('\n            ');

  const relatedHtml = relatedPages
    .map((p) => `<a href="${resourcesPath}/${p.slug}" class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors">${escapeHtml(p.title)}</a>`)
    .join('\n            ');

  const bodyContent = `
    <article class="relative pt-36 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-5xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="${resourcesPath}" class="hover:text-indigo-300 transition-colors">Risorse</a></li>
            <li>/</li>
            <li class="text-gray-300">${escapeHtml(page.title)}</li>
          </ol>
        </nav>

        <header class="mb-14">
          <p class="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">${escapeHtml(page.keyword)}</p>
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6">${escapeHtml(page.title)}</h1>
          <p class="text-xl text-gray-300 leading-relaxed max-w-3xl">${escapeHtml(page.description)}</p>
        </header>

        <section class="mb-16 rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8">
          <h2 class="text-2xl font-bold mb-4">Risposta diretta</h2>
          <p class="text-lg text-gray-200 leading-relaxed">${escapeHtml(page.directAnswer)}</p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 class="text-xl font-bold mb-3">Per chi</h2>
            <p class="text-gray-400 leading-relaxed">${escapeHtml(page.audience)}.</p>
          </section>
          <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 class="text-xl font-bold mb-3">Problema</h2>
            <p class="text-gray-400 leading-relaxed">${escapeHtml(page.pain)}.</p>
          </section>
          <section class="rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6">
            <h2 class="text-xl font-bold mb-3">Risultato</h2>
            <p class="text-gray-300 leading-relaxed">${escapeHtml(page.proof)}.</p>
          </section>
        </div>

        <section class="mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Dati e risultati</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${dataPointsHtml}
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Argomenti correlati</h2>
          <div class="space-y-6">
            ${clustersHtml}
          </div>
        </section>

        ${comparisonTableHtml}

        <section class="mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-5">Come interveniamo</h2>
          <p class="text-lg text-gray-300 leading-relaxed mb-8">${escapeHtml(page.solution)}.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${servicesHtml}
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">FAQ</h2>
          <div class="space-y-4">
            ${faqsHtml}
          </div>
        </section>

        <section>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Pagine correlate</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${relatedHtml}
          </div>
        </section>
      </div>
    </article>
  `;

  return generateBaseHtml({
    title: page.metaTitle,
    description: page.description,
    canonical: pageUrl,
    type: 'article',
    schema: [serviceSchema, faqSchema, breadcrumbSchema],
    bodyContent
  });
}

function generateDirectoryHtml(): string {
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Risorse', item: `${siteUrl}${resourcesPath}` }
    ]
  };

  const pagesHtml = seoPages
    .map((page) => `
      <a href="${resourcesPath}/${page.slug}" class="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] transition-all duration-300">
        <span class="text-xs font-mono uppercase tracking-widest text-indigo-300">${escapeHtml(page.keyword)}</span>
        <h2 class="text-2xl font-bold mt-4 mb-3 group-hover:text-indigo-200 transition-colors">${escapeHtml(page.title)}</h2>
        <p class="text-gray-400 leading-relaxed mb-6">${escapeHtml(page.description)}</p>
        <span class="inline-flex items-center gap-2 text-indigo-300 font-medium">Apri pagina <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg></span>
      </a>
    `)
    .join('\n          ');

  const bodyContent = `
    <section class="relative pt-40 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-6xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li class="text-gray-300">Risorse</li>
          </ol>
        </nav>

        <p class="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-6">Risorse</p>
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6">Risorse su Lead Generation B2B, Meta Ads e Agenti AI</h1>
        <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Questo hub raccoglie le pagine verticali di Q4 Studio. Ogni pagina approfondisce un intento di ricerca specifico con dati, confronti, cluster semantici e FAQ.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${pagesHtml}
        </div>
      </div>
    </section>
  `;

  return generateBaseHtml({
    title: 'Risorse B2B Lead Generation e AI | Q4 Studio',
    description: 'Risorse Q4 Studio su Meta Ads B2B, lead generation, automazioni CRM, WhatsApp e Agenti AI.',
    canonical: `${siteUrl}${resourcesPath}`,
    schema: [itemListSchema, breadcrumbSchema],
    bodyContent
  });
}

function generateHomeHtml(): string {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Q4 Studio',
    url: siteUrl,
    description: 'Studio di consulenza per crescita B2B, Meta Ads e Agenti AI personalizzati per aziende italiane.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IT'
    },
    sameAs: [
      'https://www.facebook.com/q4studio',
      'https://www.linkedin.com/company/q4studio'
    ]
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Q4 Studio',
    url: siteUrl,
    areaServed: ['IT', 'Verona', 'Reggio Emilia'],
    serviceType: [
      'B2B lead generation consulting',
      'Meta Ads consulting',
      'AI agents consulting',
      'CRM automation'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'In pratica, cos\'è la B2B Lead Generation su Meta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'È l\'uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate su ICP, messaggio, form, CRM e segnali di qualità.'
        }
      },
      {
        '@type': 'Question',
        name: 'Cosa sono gli Agenti AI personalizzati?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sono sistemi costruiti sul processo commerciale dell\'azienda per qualificare lead, rispondere più velocemente, assegnare contatti e automatizzare attività ripetitive.'
        }
      }
    ]
  };

  const resourceLinks = seoPages
    .slice(0, 6)
    .map((page) => `<a href="${resourcesPath}/${page.slug}" class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors"><span class="text-xs font-mono uppercase tracking-widest text-indigo-300">${escapeHtml(page.keyword)}</span><strong class="block text-xl text-white mt-3 mb-2">${escapeHtml(page.title)}</strong><span class="text-sm text-gray-400">${escapeHtml(page.description)}</span></a>`)
    .join('\n            ');

  const bodyContent = `
    <main class="w-full min-h-screen bg-[#050505] text-white">
      <nav class="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <a href="/" aria-label="Q4 Studio home"><img src="/logo.webp" alt="Q4 Studio" width="130" height="40" loading="eager" class="h-8 md:h-10 w-auto" /></a>
        <div class="hidden md:flex items-center gap-8 text-sm font-mono">
          <a href="/agenti-ai" class="hover:text-indigo-300 transition-colors">AGENTI AI</a>
          <a href="/blog" class="hover:text-indigo-300 transition-colors">BLOG</a>
          <a href="${resourcesPath}" class="hover:text-indigo-300 transition-colors">RISORSE</a>
        </div>
      </nav>

      <section class="relative min-h-screen px-6 pt-40 pb-24 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_80%_45%,rgba(168,85,247,0.16),transparent_30%)]"></div>
        <div class="relative z-10 max-w-7xl mx-auto">
          <p class="text-indigo-300 font-mono text-sm tracking-[0.35em] uppercase mb-6">Q4 Studio</p>
          <h1 class="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] max-w-5xl mb-8">Consulenza B2B, Meta Ads e Agenti AI per sistemi commerciali misurabili.</h1>
          <p class="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mb-10">Affianchiamo marketing, sales e operations per trasformare processi, lead e dati in sistemi più leggibili: campagne Meta B2B, CRM automation, follow-up e agenti AI costruiti sul lavoro reale del team.</p>
          <div class="flex flex-wrap gap-4">
            <a href="#contatto" class="rounded-full bg-indigo-600 px-7 py-4 font-semibold text-white hover:bg-indigo-500 transition-colors">Parla con Q4 Studio</a>
            <a href="${resourcesPath}" class="rounded-full border border-white/15 px-7 py-4 font-semibold text-white hover:border-indigo-300 transition-colors">Leggi le risorse</a>
          </div>
        </div>
      </section>

      <section class="px-6 py-24 border-y border-white/10 bg-[#080808]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12">
          <div>
            <p class="text-indigo-300 font-mono text-sm tracking-[0.35em] uppercase mb-4">Metodo</p>
            <h2 class="text-4xl md:text-6xl font-bold leading-tight">Prima diagnosi, poi esecuzione.</h2>
          </div>
          <div class="space-y-5 text-lg text-gray-300 leading-relaxed">
            <p>La B2B Lead Generation su Meta funziona quando ICP, messaggio, form, CRM e follow-up vengono progettati insieme. Per questo non guardiamo solo CPL e volume, ma MQL, SQL, appuntamenti, velocità di presa in carico e valore pipeline.</p>
            <p>Gli Agenti AI vengono disegnati sul processo operativo: regole, dati, strumenti, escalation e controllo umano. L'obiettivo è ridurre attività ripetitive e rendere più costante la qualità del lavoro commerciale.</p>
          </div>
        </div>
      </section>

      <section class="px-6 py-24">
        <div class="max-w-7xl mx-auto">
          <p class="text-indigo-300 font-mono text-sm tracking-[0.35em] uppercase mb-4">Servizi</p>
          <h2 class="text-4xl md:text-6xl font-bold mb-10">Due aree core, un sistema unico.</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article class="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 class="text-3xl font-bold mb-4">B2B Lead Generation</h3>
              <p class="text-gray-300 leading-relaxed">Meta Ads B2B, offerte, tracking, CRM e follow-up progettati per portare contatti qualificati e opportunità leggibili dal team sales.</p>
            </article>
            <article class="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 class="text-3xl font-bold mb-4">Agenti AI</h3>
              <p class="text-gray-300 leading-relaxed">Agenti AI per qualifica lead, centralino e customer care, preventivi, riattivazione database clienti, documenti e processi interni ripetibili.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="px-6 py-24 bg-[#080808]">
        <div class="max-w-7xl mx-auto">
          <p class="text-indigo-300 font-mono text-sm tracking-[0.35em] uppercase mb-4">Risorse</p>
          <h2 class="text-4xl md:text-6xl font-bold mb-10">Pagine leggibili anche da AI answer engines.</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${resourceLinks}
          </div>
        </div>
      </section>

      <section id="contatto" class="px-6 py-24">
        <div class="max-w-4xl mx-auto rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8 md:p-12 text-center">
          <h2 class="text-4xl md:text-6xl font-bold mb-5">Costruiamo il primo sistema utile.</h2>
          <p class="text-lg text-gray-300 leading-relaxed mb-8">Partiamo da un audit operativo su funnel, dati e processi. Poi scegliamo l'intervento a maggiore impatto: campagne, automazioni CRM, agenti AI o riattivazione database.</p>
          <a href="mailto:info@q4.studio" class="inline-flex rounded-full bg-white px-7 py-4 font-semibold text-black hover:bg-gray-200 transition-colors">Scrivi a Q4 Studio</a>
        </div>
      </section>
    </main>
  `;

  return generateBaseHtml({
    title: 'Q4 Studio | Consulenza B2B, Meta Ads e Agenti AI',
    description: 'Studio di consulenza per crescita B2B, Meta Ads e Agenti AI. Affianchiamo marketing, sales e operations per trasformare processi, lead e dati in sistemi misurabili.',
    canonical: `${siteUrl}/`,
    schema: [organizationSchema, serviceSchema, faqSchema],
    bodyContent
  });
}

function generateBlogIndexHtml(): string {
  const bodyContent = `
    <section class="relative pt-40 pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <span class="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">Insights & Strategie</span>
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">Il nostro <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Blog</span></h1>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Guide pratiche, case study e strategie avanzate per scalare il tuo business con Meta Advertising e Agenti AI.
          </p>
        </div>
        <div class="flex items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </section>
  `;

  return generateBaseHtml({
    title: 'Blog Q4 Studio | Guide Meta Advertising e AI Automation',
    description: 'Scopri strategie avanzate di Lead Generation B2B con Meta Ads, case study e guide pratiche su agenti AI. Il blog di Q4 Studio per far crescere il tuo business.',
    canonical: `${siteUrl}/blog`,
    bodyContent
  });
}

function generateAIAgentsHtml(): string {
  const pageUrl = `${siteUrl}/agenti-ai`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Agenti AI per aziende',
    description: 'Consulenza, progettazione e integrazione di agenti AI su misura per sales, back office, customer care e processi interni.',
    provider: {
      '@type': 'Organization',
      name: 'Q4 Studio',
      url: siteUrl
    },
    areaServed: 'IT',
    url: pageUrl,
    serviceType: 'AI agents consulting and automation'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Agenti AI', item: pageUrl }
    ]
  };

  const useCases = [
    ['Back office commerciale', 'Ordini e richieste cliente trasformati in attività pronte', "L'agente interpreta email, allegati e messaggi, raccoglie i dati mancanti e prepara una bozza operativa nel sistema corretto.", 'Bozza ordine + controllo umano'],
    ['Pre-sales', 'Preventivi e documenti preparati da template aziendali', 'Trasforma brief, listini e storico offerte in bozze coerenti, lasciando al consulente revisione, margini e decisione finale.', 'Offerta in bozza'],
    ['Operations', 'Consuntivi e attività ricondotti alla commessa giusta', 'Legge note operative, fogli ore e avanzamenti, propone abbinamenti e porta in evidenza incongruenze da verificare.', 'Riepilogo validabile'],
    ['Assistenza', 'Ticket instradati con contesto e risposta suggerita', 'Classifica urgenza, recupera procedure e casi simili, poi suggerisce risposta o reparto di competenza.', 'Priorità + risposta proposta'],
    ['Sales', 'Lead arricchiti, qualificati e assegnati con criteri chiari', 'Incrocia dati CRM, sorgente, risposte e segnali commerciali per separare priorità vere da contatti da nutrire.', 'Routing al sales'],
    ['Knowledge management', 'Conoscenza aziendale consultabile senza cercare in dieci posti', "Un assistente interno recupera procedure, documenti e risposte approvate, citando le fonti e indicando quando serve l'umano.", 'Risposta con fonte']
  ];

  const useCasesHtml = useCases
    .map(([area, title, description, action], index) => `<article class="grid grid-cols-1 lg:grid-cols-[120px_1fr_340px] gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6"><div class="rounded-2xl border border-white/10 bg-[#050505] p-5"><span class="block text-4xl font-bold text-white/20 font-mono">0${index + 1}</span><span class="mt-8 block h-px bg-cyan-300/50"></span></div><div><p class="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300/80 mb-4">${escapeHtml(area)}</p><h2 class="text-3xl md:text-5xl font-bold leading-tight mb-5">${escapeHtml(title)}</h2><p class="text-gray-300 leading-relaxed text-lg">${escapeHtml(description)}</p></div><div class="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5 flex flex-col justify-center"><span class="text-xs font-mono uppercase tracking-[0.25em] text-cyan-200/70 mb-3">Output controllato</span><p class="text-white text-xl font-semibold">${escapeHtml(action)}</p></div></article>`)
    .join('\n          ');

  const adoptionHtml = [
    'Audit di processo e dati disponibili',
    'Disegno di regole, strumenti, escalation e metriche',
    'Integrazione con CRM, email, documenti, dashboard e workflow',
    'Formazione del team, controllo umano e miglioramento continuo'
  ]
    .map((item) => `<li class="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span class="text-indigo-300">✓</span><span>${escapeHtml(item)}</span></li>`)
    .join('\n              ');

  const bodyContent = `
    <article class="relative pt-40 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-[1500px] mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li class="text-gray-300">Agenti AI</li>
          </ol>
        </nav>

        <header class="mb-16">
          <p class="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-5">Agenti AI</p>
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6">Agenti AI per aziende: consulenza, automazione e adozione operativa</h1>
          <p class="text-xl text-gray-300 leading-relaxed max-w-3xl">
            Q4 Studio progetta agenti AI su misura partendo dal modo in cui la tua azienda lavora: persone, dati, software, controlli e obiettivi commerciali.
          </p>
        </header>

        <section class="mb-16 rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8">
          <h2 class="text-3xl font-bold mb-4">Non chatbot generici, ma consulenti digitali integrati nel processo</h2>
          <p class="text-lg text-gray-200 leading-relaxed">
            Un agente AI utile legge informazioni, applica regole operative, compie azioni controllate e restituisce al team output verificabili. Il nostro lavoro combina audit, progettazione, sviluppo, integrazione e formazione.
          </p>
        </section>

        <section class="mb-24 rounded-[2rem] border border-white/10 bg-[#070707] p-6 md:p-10">
          <h2 class="text-5xl md:text-7xl font-bold tracking-tight mb-8">Sei playbook operativi, non sei card da catalogo.</h2>
          <p class="text-xl text-gray-300 leading-relaxed max-w-4xl mb-10">Ogni agente viene disegnato come una procedura: quali dati legge, quale regola applica, quale azione prepara e dove resta il controllo umano.</p>
          <div class="space-y-6">
            ${useCasesHtml}
          </div>
        </section>

        <section class="mb-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div>
            <p class="text-indigo-300 font-mono text-sm tracking-[0.35em] uppercase mb-4">AI Adoption</p>
            <h2 class="text-3xl md:text-4xl font-bold mb-5">La tecnologia funziona solo se entra nel lavoro quotidiano</h2>
            <p class="text-gray-300 leading-relaxed text-lg">Per questo lavoriamo come studio di consulenza: analizziamo il contesto, costruiamo il primo agente utile, formiamo chi lo userà e definiamo come misurarlo.</p>
          </div>
          <ul class="space-y-4 text-gray-300">
            ${adoptionHtml}
          </ul>
        </section>

        <section class="rounded-[2rem] border border-white/10 bg-[#070b0d] p-8 md:p-12 mb-16">
          <div class="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
            <div>
              <p class="text-purple-300 font-mono text-sm tracking-[0.35em] uppercase mb-5">Integrazioni</p>
              <h2 class="text-5xl md:text-7xl font-bold mb-8">Un hub centrale sopra gli strumenti che hai già.</h2>
              <p class="text-lg text-gray-300 leading-relaxed mb-6">L'agente non sostituisce CRM, gestionale o documenti: si mette in mezzo, legge il contesto, applica regole e prepara azioni verificabili.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${['CRM: lead e note sales', 'Email: richieste e allegati', 'Gestionale: ordini e commesse', 'Documenti: procedure e contratti', 'Fogli dati: listini e import', 'Canali chat: form e helpdesk']
                .map((item) => `<div class="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-gray-300">${escapeHtml(item)}</div>`)
                .join('\n              ')}
              <div class="md:col-span-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.08] p-6 text-center"><strong class="text-2xl text-white">Agente AI Q4</strong><p class="text-gray-300 mt-2">Legge, decide secondo regole, prepara l'azione e chiede conferma quando serve.</p></div>
            </div>
          </div>
          <a href="/" class="inline-flex items-center rounded-full bg-indigo-600 px-7 py-4 font-semibold text-white hover:bg-indigo-500 transition-colors">Parla con un consulente</a>
        </section>
      </div>
    </article>
  `;

  return generateBaseHtml({
    title: 'Agenti AI per aziende | Consulenza e automazioni Q4 Studio',
    description: 'Q4 Studio progetta Agenti AI su misura per sales, back office, customer care e processi interni: audit, sviluppo, integrazione e adozione operativa.',
    canonical: pageUrl,
    schema: [serviceSchema, breadcrumbSchema],
    bodyContent
  });
}

// Supabase client for build-time fetch
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function fetchBlogPosts() {
  if (!supabase) {
    console.warn('⚠️  Supabase not configured. Skipping blog prerender.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error fetching blog posts:', error.message);
      return [];
    }

    return (data || []).map((dbPost: any) => ({
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      coverImage: dbPost.cover_image,
      category: dbPost.category,
      date: dbPost.date,
      readTime: dbPost.read_time,
      author: {
        name: dbPost.author_name,
        image: dbPost.author_image,
      },
    }));
  } catch (err) {
    console.error('❌ Exception fetching blog posts:', err);
    return [];
  }
}

// Simple markdown renderer matching BlogArticle.tsx logic
function renderMarkdown(content: string): string {
  const lines = content.trim().split('\n');
  const elements: string[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(`<ol class="list-decimal list-inside space-y-2 mb-6 text-gray-300">${currentList.map((item) => `<li class="leading-relaxed">${item}</li>`).join('')}</ol>`);
      currentList = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(`<h1 class="text-4xl md:text-5xl font-bold mb-6 mt-8">${escapeHtml(line.replace('# ', ''))}</h1>`);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(`<h2 class="text-3xl md:text-4xl font-bold mb-4 mt-8 text-indigo-300">${escapeHtml(line.replace('## ', ''))}</h2>`);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(`<h3 class="text-2xl font-bold mb-3 mt-6 text-purple-300">${escapeHtml(line.replace('### ', ''))}</h3>`);
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      currentList.push(text);
    } else if (line.trim() === '') {
      flushList();
    } else if (line.trim() !== '') {
      flushList();
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      elements.push(`<p class="text-lg text-gray-300 leading-relaxed mb-4">${html}</p>`);
    }
  });

  flushList();
  return elements.join('\n');
}

function generateBlogArticleHtml(post: any): string {
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const publishedDate = new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const renderedContent = renderMarkdown(post.content);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      image: post.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Q4 Studio',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    articleSection: post.category,
    keywords: ['meta advertising', 'lead generation', 'b2b marketing', 'agenti ai', post.category.toLowerCase()],
    inLanguage: 'it-IT',
    timeRequired: post.readTime,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  };

  const bodyContent = `
    <article class="relative pt-32 pb-20 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-8">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/blog" class="hover:text-indigo-300 transition-colors">Blog</a></li>
            <li>/</li>
            <li class="text-gray-300">${escapeHtml(post.title)}</li>
          </ol>
        </nav>

        <div>
          <div class="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-6">
            <span class="text-indigo-300 text-sm font-medium">${escapeHtml(post.category)}</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">${escapeHtml(post.title)}</h1>

          <div class="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-white/10">
            <div class="flex items-center gap-3">
              <img src="${post.author.image}" alt="${escapeHtml(post.author.name)}" loading="lazy" decoding="async" class="w-12 h-12 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=96'" />
              <div>
                <p class="text-white font-medium">${escapeHtml(post.author.name)}</p>
                <div class="flex items-center gap-4 text-sm">
                  <span>${publishedDate}</span>
                  <span>${post.readTime} di lettura</span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative h-[400px] rounded-3xl overflow-hidden mb-12">
            <img src="${post.coverImage}" alt="${escapeHtml(post.title)}" loading="eager" fetchpriority="high" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          </div>
        </div>

        <div class="prose prose-invert prose-lg max-w-none">
          ${renderedContent}
        </div>

        <div class="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border border-white/10">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <img src="${post.author.image}" alt="${escapeHtml(post.author.name)}" loading="lazy" decoding="async" class="w-20 h-20 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=160'" />
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-2xl font-bold mb-2">${escapeHtml(post.author.name)}</h3>
              <p class="text-gray-400">Vuoi approfondire queste strategie per il tuo business? Contattaci per una consulenza personalizzata.</p>
            </div>
            <a href="/" class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300 whitespace-nowrap">Contattaci</a>
          </div>
        </div>
      </div>
    </article>
  `;

  return generateBaseHtml({
    title: `${post.title} | Q4 Studio Blog`,
    description: post.excerpt,
    canonical: pageUrl,
    ogImage: post.coverImage,
    type: 'article',
    schema: [blogSchema, breadcrumbSchema],
    bodyContent,
  });
}

function generateSitemap(blogPosts: any[] = []): string {
  const urls = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${siteUrl}/agenti-ai`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${siteUrl}${resourcesPath}`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    ...seoPages.map((page) => ({
      loc: `${siteUrl}${resourcesPath}/${page.slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    })),
    ...blogPosts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly'
    }))
  ];

  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Main execution
(async () => {
  console.log('🔧 Starting prerender...');

  // Ensure dist directory exists
  ensureDir(distDir);

  // Fetch blog posts from Supabase
  const blogPosts = await fetchBlogPosts();
  console.log(`📚 Fetched ${blogPosts.length} blog posts`);

  // Generate home page
  const homeHtml = generateHomeHtml();
  writeHtmlFile(join(distDir, 'index.html'), homeHtml);
  console.log('✅ Generated /index.html');

  // Generate resources hub
  const directoryPath = join(distDir, resourcesPath.replace(/^\//, ''));
  ensureDir(directoryPath);
  const directoryHtml = generateDirectoryHtml();
  writeHtmlFile(join(directoryPath, 'index.html'), directoryHtml);
  console.log(`✅ Generated ${resourcesPath}/index.html`);

  // Generate blog index page
  const blogPath = join(distDir, 'blog');
  ensureDir(blogPath);
  const blogHtml = generateBlogIndexHtml();
  writeHtmlFile(join(blogPath, 'index.html'), blogHtml);
  console.log('✅ Generated /blog/index.html');

  // Generate AI Agents page
  const aiAgentsPath = join(distDir, 'agenti-ai');
  ensureDir(aiAgentsPath);
  const aiAgentsHtml = generateAIAgentsHtml();
  writeHtmlFile(join(aiAgentsPath, 'index.html'), aiAgentsHtml);
  console.log('✅ Generated /agenti-ai/index.html');

  // Generate individual blog articles
  for (const post of blogPosts) {
    const postDir = join(distDir, 'blog', post.slug);
    ensureDir(postDir);
    const postHtml = generateBlogArticleHtml(post);
    writeHtmlFile(join(postDir, 'index.html'), postHtml);
    console.log(`✅ Generated /blog/${post.slug}/index.html`);
  }

  // Generate resource landing pages
  for (const page of seoPages) {
    const pageDir = join(distDir, resourcesPath.replace(/^\//, ''), page.slug);
    ensureDir(pageDir);
    const pageHtml = generateLandingPageHtml(page);
    writeHtmlFile(join(pageDir, 'index.html'), pageHtml);
    console.log(`✅ Generated ${resourcesPath}/${page.slug}/index.html`);
  }

  // Generate sitemap.xml with blog posts
  const sitemapPath = join(distDir, 'sitemap.xml');
  writeHtmlFile(sitemapPath, generateSitemap(blogPosts));
  console.log('✅ Generated /sitemap.xml');

  // Copy robots.txt to dist if it exists in public
  const publicRobots = join(__dirname, '..', 'public', 'robots.txt');
  const distRobots = join(distDir, 'robots.txt');
  if (existsSync(publicRobots)) {
    copyFileSync(publicRobots, distRobots);
    console.log('✅ Copied robots.txt to dist');
  }

  console.log('🎉 Prerender complete!');
})();
