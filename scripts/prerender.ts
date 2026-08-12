import { seoPages, siteUrl, resourcesPath } from '../data/seoPages.ts';
import { caseStudies, caseStudiesPath, CaseStudy } from '../data/caseStudies.ts';
import { createClient } from '@supabase/supabase-js';
import { createWriteStream, mkdirSync, existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, '..', 'dist');

// Keep the standalone prerendered documents aligned with index.html. These
// pages are served as their own HTML files, so they cannot inherit GTM from the
// root Vite document.
const GTM_HEAD = `  <!-- Google Tag Manager -->
  <script>
    window.addEventListener('load', function () {
      const loadGtm = function () {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TS9PFGLR');
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadGtm, { timeout: 2500 });
      } else {
        setTimeout(loadGtm, 0);
      }
    });
  </script>
  <!-- End Google Tag Manager -->`;

const GTM_NOSCRIPT = `<!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TS9PFGLR"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

// Extract the importmap and the hashed module script from the Vite-built index.html,
// so prerendered pages load the real production bundle (not the raw /index.tsx source).
function getAppScripts(): string {
  const builtIndexPath = join(distDir, 'index.html');
  if (existsSync(builtIndexPath)) {
    const builtHtml = readFileSync(builtIndexPath, 'utf-8');
    const importmapMatch = builtHtml.match(/<script type="importmap">[\s\S]*?<\/script>/);
    const moduleMatch = builtHtml.match(/<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/);
    if (moduleMatch) {
      return `${importmapMatch ? importmapMatch[0] : ''}\n  ${moduleMatch[0]}`;
    }
  }
  console.warn('⚠️  dist/index.html not found or has no module script, falling back to /index.tsx');
  return '<script type="module" src="/index.tsx"></script>';
}

const appScripts = getAppScripts();

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

function generateBaseHtml(options: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  type?: 'website' | 'article';
  schema?: object[];
  bodyContent: string;
  noIndex?: boolean;
}) {
  const {
    title,
    description,
    canonical,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    ogImageAlt,
    type = 'website',
    schema = [],
    bodyContent,
    noIndex = false
  } = options;

  const defaultOgImage = `${siteUrl}/og-image.jpg`;
  const resolvedOgImage = ogImage || defaultOgImage;
  // Le dimensioni 1200x630 sono note solo per l'immagine di default (asset locale
  // in public/). Per immagini diverse (es. copertine articolo da Supabase) le
  // dimensioni reali non sono note a build time: meglio nessun dato che uno
  // falso, quindi i tag width/height/alt di default si applicano solo quando
  // l'immagine è davvero quella di default, a meno che il chiamante non passi
  // valori espliciti.
  const isDefaultOgImage = resolvedOgImage === defaultOgImage;
  const resolvedOgImageWidth = ogImageWidth ?? (isDefaultOgImage ? 1200 : undefined);
  const resolvedOgImageHeight = ogImageHeight ?? (isDefaultOgImage ? 630 : undefined);
  const resolvedOgImageAlt = ogImageAlt ?? (isDefaultOgImage ? 'Q4 Studio' : title);

  const schemaScripts = schema
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  const imageDimensionsMeta = resolvedOgImageWidth && resolvedOgImageHeight
    ? `\n  <meta property="og:image:width" content="${resolvedOgImageWidth}" />\n  <meta property="og:image:height" content="${resolvedOgImageHeight}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="it" class="bg-[#050505]">
<head>
${GTM_HEAD}

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="title" content="${escapeHtml(title)}" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="${noIndex ? 'noindex, nofollow' : 'index, follow'}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${resolvedOgImage}" />
  <meta property="og:image:alt" content="${escapeHtml(resolvedOgImageAlt)}" />${imageDimensionsMeta}
  <meta property="og:locale" content="it_IT" />
  <meta property="og:site_name" content="Q4 Studio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${resolvedOgImage}" />
  <meta name="twitter:image:alt" content="${escapeHtml(resolvedOgImageAlt)}" />
  <meta name="theme-color" content="#050505" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
  <link rel="manifest" href="/favicon/site.webmanifest">
  <link rel="shortcut icon" href="/favicon/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://esm.sh">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com" defer></script>
  <style>
    html, body { max-width: 100%; overflow-x: hidden; overscroll-behavior-x: none; }
    body { font-family: 'Inter', sans-serif; background-color: #050505; color: #ffffff; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
  </style>
  ${schemaScripts}
</head>
<body>
  ${GTM_NOSCRIPT}

  <div id="root">
    ${bodyContent}
  </div>
  ${appScripts}
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
    .map((cluster) => `<section class="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 class="text-2xl font-semibold leading-[1.25] tracking-[-0.01em] mb-3 text-indigo-200">${escapeHtml(cluster.heading)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(cluster.content)}</p></section>`)
    .join('\n            ');

  const comparisonTableHtml = page.comparisonTable ? `
    <section class="mb-16">
      <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(page.comparisonTable.title)}</h2>
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
    .map((faq) => `<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 class="text-2xl font-semibold leading-[1.25] tracking-[-0.01em] mb-3">${escapeHtml(faq.question)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(faq.answer)}</p></div>`)
    .join('\n            ');

  const relatedHtml = relatedPages
    .map((p) => `<a href="${resourcesPath}/${p.slug}" class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors">${escapeHtml(p.title)}</a>`)
    .join('\n            ');

  const bodyContent = `
    <article class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
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
          <p class="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">${escapeHtml(page.keyword)}</p>
          <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">${escapeHtml(page.title)}</h1>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">${escapeHtml(page.description)}</p>
        </header>

        <section class="mb-16 rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8">
          <h2 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">Risposta diretta</h2>
          <p class="text-lg md:text-xl text-gray-200 leading-relaxed">${escapeHtml(page.directAnswer)}</p>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 class="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-3">Per chi</h2>
            <p class="text-gray-400 leading-relaxed">${escapeHtml(page.audience)}.</p>
          </section>
          <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 class="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-3">Problema</h2>
            <p class="text-gray-400 leading-relaxed">${escapeHtml(page.pain)}.</p>
          </section>
          <section class="rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6">
            <h2 class="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-3">Risultato</h2>
            <p class="text-gray-300 leading-relaxed">${escapeHtml(page.proof)}.</p>
          </section>
        </div>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Dati e risultati</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${dataPointsHtml}
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Argomenti correlati</h2>
          <div class="space-y-6">
            ${clustersHtml}
          </div>
        </section>

        ${comparisonTableHtml}

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-5">Come interveniamo</h2>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">${escapeHtml(page.solution)}.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${servicesHtml}
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">FAQ</h2>
          <div class="space-y-4">
            ${faqsHtml}
          </div>
        </section>

        <section>
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Pagine correlate</h2>
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

function generateResourcesHtml(): string {
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
        <span class="text-[11px] uppercase tracking-[0.08em] text-indigo-300">${escapeHtml(page.keyword)}</span>
        <h2 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mt-4 mb-3 group-hover:text-indigo-200 transition-colors">${escapeHtml(page.title)}</h2>
        <p class="text-gray-400 leading-relaxed mb-6">${escapeHtml(page.description)}</p>
        <span class="inline-flex items-center gap-2 text-indigo-300 font-medium">Apri pagina <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg></span>
      </a>
    `)
    .join('\n          ');

  const bodyContent = `
    <section class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-6xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li class="text-gray-300">Risorse</li>
          </ol>
        </nav>

        <p class="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">Risorse</p>
        <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] max-w-4xl mb-6">Risorse su Agenti AI, Automazioni e Tecnologia per Aziende B2B</h1>
        <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Questa directory raccoglie le pagine verticali di Q4 Studio. Ogni pagina approfondisce un intento di ricerca specifico e collega servizi, problemi, soluzioni e FAQ.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${pagesHtml}
        </div>
      </div>
    </section>
  `;

  return generateBaseHtml({
    title: 'Risorse su AI, Automazioni e Tecnologia per PMI B2B | Q4 Studio',
    description: 'Risorse Q4 Studio su agenti AI, automazioni WhatsApp e CRM, centralino e chatbot intelligenti per le aziende B2B.',
    canonical: `${siteUrl}${resourcesPath}`,
    schema: [itemListSchema, breadcrumbSchema],
    bodyContent
  });
}

function generateCaseStudiesIndexHtml(): string {
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

  const cardsHtml = caseStudies
    .map((study) => `
      <a href="${caseStudiesPath}/${study.slug}" class="group rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] transition-all duration-300">
        <img src="${study.coverImageMobile}" srcset="${study.coverImageMobile} 836w, ${study.coverImage} 1672w" sizes="(min-width: 768px) 50vw, 100vw" alt="${escapeHtml(study.coverImageAlt)}" width="${study.coverImageWidth}" height="${study.coverImageHeight}" loading="lazy" decoding="async" class="w-full aspect-video object-cover border-b border-white/10" />
        <div class="p-6">
          <span class="text-[11px] uppercase tracking-[0.08em] text-indigo-300">${escapeHtml(study.category)}</span>
          <h2 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mt-4 mb-3 group-hover:text-indigo-200 transition-colors">${escapeHtml(study.client)}</h2>
          <p class="text-gray-400 leading-relaxed mb-6">${escapeHtml(study.subheadline)}</p>
          <span class="inline-flex items-center gap-2 text-indigo-300 font-medium">Leggi il caso studio <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg></span>
        </div>
      </a>
    `)
    .join('\n          ');

  const bodyContent = `
    <section class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-6xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li class="text-gray-300">Casi Studio</li>
          </ol>
        </nav>

        <p class="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">Casi Studio</p>
        <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] max-w-4xl mb-6">Progetti reali, dati reali.</h1>
        <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Come lavoriamo con i clienti Q4 Studio: cosa abbiamo trovato, cosa abbiamo costruito e cosa è cambiato, con i numeri veri di ogni progetto.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;

  return generateBaseHtml({
    title: 'Casi Studio | Q4 Studio',
    description: 'I progetti di Q4 Studio per aziende B2B italiane: tracking server-side, automazioni e agenti AI, raccontati con dati reali.',
    canonical: pageUrl,
    schema: [itemListSchema, breadcrumbSchema],
    bodyContent
  });
}

function generateCaseStudyDetailHtml(study: CaseStudy): string {
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

  const introHtml = study.intro
    .map((block) => `<p class="text-gray-300 leading-relaxed">${escapeHtml(block.paragraph)}${block.link ? ` <a href="${block.link.href}" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline underline-offset-4 decoration-indigo-400/40 transition-colors">${escapeHtml(block.link.label)}</a>` : ''}</p>`)
    .join('\n          ');

  const challengeHtml = study.challenge.paragraphs
    .map((p) => `<p class="text-lg md:text-xl text-gray-300 leading-relaxed">${escapeHtml(p)}</p>`)
    .join('\n            ');

  const workItemsHtml = study.work.items
    .map((item) => `<div class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><svg class="w-5 h-5 text-indigo-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><span class="text-gray-200">${escapeHtml(item)}</span></div>`)
    .join('\n            ');

  const statsHtml = (study.results.stats ?? [])
    .map((stat) => `<div class="bg-[#070707] p-8 md:p-10 text-center flex flex-col items-center gap-3"><p class="tabular-nums text-[clamp(28px,4.5vw,48px)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300" style="font-family: 'Space Grotesk', sans-serif;">${escapeHtml(stat.value)}</p><p class="text-sm text-gray-400 leading-relaxed">${escapeHtml(stat.label)}</p></div>`)
    .join('\n            ');

  const demoVideoHtml = study.demoVideo
    ? `
        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(study.demoVideo.heading)}</h2>
          <div class="relative rounded-3xl overflow-hidden mb-6 border border-white/10">
            <video autoplay muted loop playsinline preload="metadata" poster="${study.demoVideo.poster}" width="${study.demoVideo.width}" height="${study.demoVideo.height}" aria-label="${escapeHtml(study.demoVideo.alt)}" class="w-full h-auto aspect-video object-cover">
              <source src="${study.demoVideo.webmSrc}" type="video/webm" />
              <source src="${study.demoVideo.mp4Src}" type="video/mp4" />
            </video>
          </div>
          <p class="text-gray-400 leading-relaxed max-w-3xl">${escapeHtml(study.demoVideo.caption)}</p>
        </section>`
    : '';

  const whyItMattersHtml = study.whyItMatters.paragraphs
    .map((p) => `<p class="text-lg md:text-xl text-gray-300 leading-relaxed">${escapeHtml(p)}</p>`)
    .join('\n            ');

  const servicesHtml = study.services
    .map((service) => `<span class="text-[11px] uppercase tracking-[0.08em] text-gray-400 rounded-full border border-white/10 px-3 py-1.5">${escapeHtml(service)}</span>`)
    .join('\n          ');

  const ctaHtml = study.cta
    ? `<section class="mb-16 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-8"><h2 class="text-3xl font-bold mb-4">${escapeHtml(study.cta.heading)}</h2><p class="text-gray-300 mb-6">${escapeHtml(study.cta.body)}</p><a href="${study.cta.href}" class="inline-flex rounded-full bg-white px-6 py-3 text-black font-semibold">${escapeHtml(study.cta.label)}</a></section>`
    : '';

  const bodyContent = `
    <article class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="${caseStudiesPath}" class="hover:text-indigo-300 transition-colors">Casi Studio</a></li>
            <li>/</li>
            <li class="text-gray-300">${escapeHtml(study.client)}</li>
          </ol>
        </nav>

        <header class="mb-12">
          <p class="text-indigo-400 text-sm tracking-[0.08em] uppercase mb-5">${escapeHtml(study.kicker)}</p>
          <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">${escapeHtml(study.title)}</h1>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">${escapeHtml(study.subheadline)}</p>
        </header>

        <div class="relative rounded-3xl overflow-hidden mb-14 md:mb-16 border border-white/10">
          <img src="${study.coverImage}" srcset="${study.coverImageMobile} 836w, ${study.coverImage} 1672w" sizes="(min-width: 896px) 896px, 100vw" alt="${escapeHtml(study.coverImageAlt)}" width="${study.coverImageWidth}" height="${study.coverImageHeight}" loading="eager" fetchpriority="high" decoding="async" class="w-full h-auto object-cover" />
        </div>

        <div class="space-y-6 mb-16 max-w-3xl">
          ${introHtml}
        </div>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(study.challenge.heading)}</h2>
          <div class="space-y-4 max-w-3xl">
            ${challengeHtml}
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(study.work.heading)}</h2>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">${escapeHtml(study.work.intro)}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${workItemsHtml}
          </div>
        </section>
${demoVideoHtml}
        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(study.results.heading)}</h2>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">${escapeHtml(study.results.intro)}</p>
          ${statsHtml ? `<div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5 mb-8">
            ${statsHtml}
          </div>` : ''}
          <p class="text-gray-400 leading-relaxed max-w-3xl">${escapeHtml(study.results.note)}</p>
        </section>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">${escapeHtml(study.whyItMatters.heading)}</h2>
          <div class="space-y-4 max-w-3xl">
            ${whyItMattersHtml}
          </div>
        </section>

        ${ctaHtml}

        <div class="flex flex-wrap gap-3 pt-8 border-t border-white/10">
          ${servicesHtml}
        </div>
      </div>
    </article>
  `;

  return generateBaseHtml({
    title: study.metaTitle,
    description: study.description,
    canonical: pageUrl,
    ogImage,
    ogImageWidth: study.ogImageWidth,
    ogImageHeight: study.ogImageHeight,
    ogImageAlt: study.coverImageAlt,
    type: 'article',
    schema: [articleSchema, breadcrumbSchema],
    bodyContent
  });
}

function generateBlogIndexHtml(): string {
  const bodyContent = `
    <section class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <span class="text-indigo-500 tracking-[0.08em] mb-5 block text-sm uppercase">Insights & Strategie</span>
          <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold mb-6 leading-[1.1] tracking-[-0.03em]">Il nostro <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Blog</span></h1>
          <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
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

// Supabase client for build-time fetch
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const isPlaceholderSupabaseConfiguration =
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'placeholder-key';

const supabase = supabaseUrl && supabaseAnonKey && !isPlaceholderSupabaseConfiguration
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

function safeArticleLink(href: string): { href: string; external: boolean } | null {
  const value = href.trim();
  if ((value.startsWith('/') && !value.startsWith('//')) || /^#[a-z0-9][a-z0-9_-]*$/i.test(value)) {
    return { href: value, external: false };
  }
  if (value.startsWith('https://') || value.startsWith('mailto:')) {
    return { href: value, external: value.startsWith('https://') };
  }
  return null;
}

function renderArticleInline(value: string): string {
  return value
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((token) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return `<strong class="font-semibold text-white">${escapeHtml(token.slice(2, -2))}</strong>`;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return `<code>${escapeHtml(token.slice(1, -1))}</code>`;
      }
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const destination = safeArticleLink(link[2]);
        if (!destination) return escapeHtml(link[1]);
        const externalAttributes = destination.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(destination.href)}"${externalAttributes} class="font-medium text-indigo-300 underline underline-offset-4">${escapeHtml(link[1])}</a>`;
      }
      return escapeHtml(token);
    })
    .join('');
}

// Safe markdown renderer matching BlogArticle.tsx link rules.
function renderMarkdown(content: string): string {
  const lines = content.trim().split('\n');
  const elements: string[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(`<ol class="list-decimal list-inside space-y-2 mb-6 text-gray-300">${currentList.map((item) => `<li class="leading-relaxed">${renderArticleInline(item)}</li>`).join('')}</ol>`);
      currentList = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(`<h1 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6 mt-8">${renderArticleInline(line.replace('# ', ''))}</h1>`);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(`<h2 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mb-4 mt-8 text-indigo-300">${renderArticleInline(line.replace('## ', ''))}</h2>`);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(`<h3 class="text-lg md:text-xl font-bold leading-[1.5] mb-3 mt-6 text-purple-300">${renderArticleInline(line.replace('### ', ''))}</h3>`);
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '');
      currentList.push(text);
    } else if (line.trim() === '') {
      flushList();
    } else if (line.trim() !== '') {
      flushList();
      elements.push(`<p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">${renderArticleInline(line)}</p>`);
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
    <article class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
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

          <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold mb-6 leading-[1.1] tracking-[-0.03em]">${escapeHtml(post.title)}</h1>

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
              <h3 class="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-2">${escapeHtml(post.author.name)}</h3>
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
    // La copertina è un URL remoto (Supabase): le dimensioni reali non sono note
    // a build time, quindi non passiamo ogImageWidth/Height (generateBaseHtml
    // le omette quando l'immagine non è quella di default). L'alt riprende il
    // titolo dell'articolo invece del generico "Q4 Studio".
    ogImage: post.coverImage,
    ogImageAlt: post.title,
    type: 'article',
    schema: [blogSchema, breadcrumbSchema],
    bodyContent,
  });
}

const staticPage = (content: string) => `<main class="min-h-screen bg-[#050505] text-white px-6 pt-36 pb-24"><div class="max-w-6xl mx-auto space-y-16">${content}</div></main>`;

function generateRestyledAIAgentsHtml(): string {
  const packages = [
    { title: 'Assistente virtuale sul sito', problem: 'Le stesse domande arrivano per telefono e mail, e fuori orario non risponde nessuno.', requirements: ['Sito accessibile', 'Elenco delle domande frequenti', 'Tono di voce', 'Un referente per la validazione delle risposte'], timing: '2 settimane', price: 'Setup 490 € · canone 59 €/mese' },
    { title: 'Automazioni CRM e follow-up', problem: 'I lead non vengono ricontattati e il follow-up dipende da chi si ricorda.', actions: ['Riceve il lead da form, campagne o LinkedIn', 'Lo assegna al commerciale giusto nel CRM, con il contesto già pronto', 'Prepara il primo messaggio e i promemoria di follow-up'], requirements: ['CRM esistente o incluso', 'Numero WhatsApp business', 'Elenco dei momenti di contatto da automatizzare'], timing: '2-3 settimane', price: 'Setup da 490 € · canone da 150 €/mese' },
    { title: 'Richieste WhatsApp che arrivano già compilate', problem: 'I clienti ti scrivono su WhatsApp in tre messaggi disordinati, e qualcuno deve leggere, capire e ridigitare tutto a mano. Nel frattempo passano ore, e il lead ha già chiesto un preventivo a qualcun altro.', description: "Legge i messaggi in arrivo, estrae le informazioni che ti servono per rispondere (nel caso di un preventivo: cosa, dove, quando, quanto), le scrive nel CRM e manda una prima risposta in meno di un minuto. Se manca un'informazione, la chiede. Quando il dato non è certo, segnala invece di inventare.", requirements: ['Un numero WhatsApp collegabile alla piattaforma. Se oggi rispondi dal tuo cellulare con WhatsApp Business, serve un numero dedicato: te lo spieghiamo prima di partire, non dopo.', 'L’elenco delle informazioni che ti servono per rispondere a una richiesta', 'Una persona che valida i primi giorni di funzionamento'], timing: "4-6 settimane dall'avvio", price: 'Setup 990 € · canone 200 €/mese', pilot: 'Per i primi due clienti: setup 490 € invece di 990 €, in cambio del diritto di raccontare il progetto come caso studio e di una call di feedback dopo il primo mese.' },
  ];
  const cards = packages.map((pack) => `<article class="rounded-3xl border border-white/10 p-8"><h3 class="text-3xl font-bold mb-5">${escapeHtml(pack.title)}</h3><p><strong>Il problema:</strong> ${escapeHtml(pack.problem)}</p>${pack.description ? `<p class="mt-4"><strong>Cosa fa:</strong> ${escapeHtml(pack.description)}</p>` : ''}${pack.actions ? `<p class="mt-4"><strong>Cosa fa</strong></p><ul>${pack.actions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}<p class="mt-4"><strong>Cosa serve da te</strong></p><ul>${pack.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><p class="mt-4"><strong>Tempi:</strong> ${escapeHtml(pack.timing)}</p><p class="mt-4 text-xl font-bold">${escapeHtml(pack.price)}</p>${pack.pilot ? `<p><strong>Pilot pubblico.</strong> ${escapeHtml(pack.pilot)}</p>` : ''}</article>`).join('');
  return generateBaseHtml({ title: 'Agenti AI e Automazioni per PMI | Q4 Studio', description: 'Automazioni WhatsApp, CRM e assistenti virtuali con tempi, setup e canoni pubblici. Soluzioni concrete per le attività ripetitive delle PMI.', canonical: `${siteUrl}/agenti-ai`, bodyContent: staticPage(`<header><p>Automazioni · setup e canone chiari</p><h1 class="text-6xl font-bold">Automazioni concrete, su problemi che racconti in una frase.</h1><p>Assistenti sul sito, follow-up nel CRM e richieste WhatsApp già strutturate. Sai prima cosa serve, quanto tempo richiede e quanto costa.</p><a href="#pacchetti-automazioni">Vedi i pacchetti</a></header><section id="pacchetti-automazioni"><p>Tre punti di partenza</p><h2>Scegli il lavoro ripetitivo da togliere al team.</h2><div class="grid gap-6">${cards}</div></section><section><h2>Quale attività stai ancora facendo a mano?</h2><p>Raccontala in una frase. Ti diciamo se uno di questi pacchetti è il punto di partenza giusto.</p><a href="#contatti">Scrivici</a></section><section id="contatti" aria-label="Contatti"></section>`) });
}

function generateServerSideTrackingHtml(): string {
  const body = `<header><p>Tracciamento server-side · Meta e Google</p><h1 class="text-6xl font-bold">Il tuo account pubblicitario vede meno conversioni di quelle che fai.</h1><p>Non è un problema di campagne. È un problema di raccolta dati.</p></header>
  <section><h2>Cosa sta succedendo</h2><p>Safari e Firefox limitano i cookie di terze parti. Gli ad blocker bloccano i pixel. Il consenso negato interrompe la raccolta. Il risultato è che Meta e Google vedono una parte delle tue conversioni, e ottimizzano su quella parte.</p><p>Se il tuo account dice 40 conversioni e il tuo gestionale dice 90, non è un errore di lettura: è il tracciamento che non arriva.</p></section>
  <section><h2>Come lo risolviamo</h2><p>Spostiamo la raccolta dati dal browser a un container server-side su infrastruttura dedicata. I segnali passano da lì, vengono normalizzati e inviati alle piattaforme via API server-to-server.</p><p>Aggiungiamo i segnali che contano davvero: non l'invio del form, ma la qualificazione, la risposta del prospect, l'avanzamento nel CRM. Sono i segnali che l'algoritmo usa per cercare persone simili a chi compra, non a chi compila.</p></section>
  <section id="services"><p>Prezzi pubblici</p><h2>I pacchetti</h2><article><p>3-5 giorni lavorativi</p><h3>Audit tracciamento</h3><p>490 €</p><ul><li>Verifica di cosa viene tracciato e cosa si perde oggi</li><li>Confronto tra dati piattaforma e dati reali</li><li>Analisi del Consent Mode e della configurazione attuale</li><li>Documento con le priorità di intervento</li></ul><p>Il documento resta tuo. Se decidi di non procedere, hai comunque una mappa di cosa sistemare.</p></article><article><p>circa una giornata di lavoro per siti non-ecommerce, 1-3 giornate per ecommerce</p><h3>Setup server-side</h3><p>da 1.500 €</p><ul><li>Container server-side su infrastruttura dedicata</li><li>Consent Mode v2 configurato e verificato</li><li>Conversions API Meta ed Enhanced Conversions Google</li><li>Eventi personalizzati sui passaggi che contano</li><li>Documentazione di eventi e naming, che resta all'azienda</li></ul></article><article><p>Disdetta libera. Nessun vincolo di durata.</p><h3>Infrastruttura e lettura dati</h3><p>da 100 €/mese</p><ul><li>Container monitorato, con alert se qualcosa si interrompe</li><li>Aggiornamenti quando le piattaforme cambiano le regole</li><li>Report mensile con la lettura dei dati, non solo i numeri</li></ul></article></section>
  <section><p>Un caso reale</p><h2>Oltre un milione di segnali recuperati.</h2><p>Su Candiani Denim abbiamo recuperato oltre un milione di segnali di conversione in 90 giorni, di cui 963.652 bloccati dai sistemi di tracking prevention dei browser e 69.043 dagli ad blocker.</p><a href="/casi-studio/candiani-denim-tracking-server-side">Leggi il caso studio completo</a></section>
  <section id="faq"><h2>Domande frequenti</h2><h3>Cos'è il tracciamento server-side, in parole semplici?</h3><p>Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.</p><h3>Quanto costa e quanto tempo serve?</h3><p>L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese.</p><h3>Il tracciamento server-side è conforme al GDPR?</h3><p>È lo strumento che rende la conformità più gestibile, non meno: il consenso viene rispettato a monte tramite Consent Mode v2 e i dati passano da un’infrastruttura che controlliamo. Non siamo consulenti legali e non forniamo pareri: implementiamo quello che il tuo DPO o consulente privacy definisce.</p><h3>Serve cambiare qualcosa sul mio sito?</h3><p>Nell'implementazione standard no: il container gira su un sottodominio del tuo sito e il codice esistente resta. In alcuni casi serve un intervento sul tema o sui template, e te lo diciamo dopo l'audit.</p><h3>Lavori anche con la mia agenzia?</h3><p>Sì. Molte agenzie non hanno un tecnico interno per questa parte: possiamo lavorare direttamente con loro.</p></section>
  <section><h2>Non sai se il tuo tracciamento è a posto?</h2><p>L'audit da 490 € ti dà una risposta documentata in cinque giorni.</p><a href="#contatti">Richiedi l'audit</a></section><section id="contatti" aria-label="Audit tracciamento"></section>`;
  return generateBaseHtml({ title: 'Tracciamento Server-Side per Meta e Google | Q4 Studio', description: 'Recuperiamo i segnali di conversione che browser e ad blocker bloccano. Setup server-side, Consent Mode v2, Conversions API. Audit da 490 €.', canonical: `${siteUrl}/tracciamento-server-side`, bodyContent: staticPage(body) });
}

function generateTechnicalPartnerHtml(): string {
  const body = `<header><p>White label · per agenzie</p><h1 class="text-6xl font-bold">Sono il tecnico che la tua agenzia non ha in casa.</h1><p>Tracciamento server-side, Consent Mode, automazioni, integrazioni CRM. Lavoro white label: il cliente resta tuo, io non lo contatto mai.</p></header>
  <section><h2>Il problema che conosci</h2><p>Il cliente ti scrive che Meta dice 40 conversioni e il suo gestionale ne dice 90. Tu sai che è il tracciamento. Ma sistemare un container server-side, la Consent Mode e le Conversions API non è il lavoro per cui hai assunto il tuo team.</p><p>Così la conversazione si ripete ogni mese, e ogni mese il cliente si fida un po' meno dei numeri che gli porti.</p></section>
  <section><h2>Come funziona</h2><p><strong>1. Mi giri il problema.</strong> Una call di trenta minuti con te, senza il cliente.</p><p><strong>2. Ti dico tempi e prezzo.</strong> Fisso, non a ore.</p><p><strong>3. Lavoro.</strong> Con i tuoi accessi o con quelli del cliente, come preferisci.</p><p><strong>4. Ti consegno.</strong> Documentazione inclusa, così il tuo team capisce cosa c'è.</p><p>Se serve, sto in call col cliente presentato come tuo tecnico. Se preferisci che non compaia, non compaio.</p></section>
  <section><h2>La garanzia che conta</h2><p><strong>Non contatto i tuoi clienti. Non li aggiungo su LinkedIn. Non li ricontatto quando il progetto finisce.</strong> Se vuoi, lo mettiamo per scritto.</p><p>So che il rischio che ti preoccupa non è il costo: è che il fornitore tecnico diventi il tuo concorrente. Non è il mio modello: io vivo di lavoro tecnico, non di gestione clienti.</p></section>
  <section><h2>Cosa faccio</h2><ul><li><strong>Tracciamento server-side</strong>: container, Consent Mode v2, Conversions API, Enhanced Conversions. Da 1.500 €, circa una giornata per siti non-ecommerce.</li><li><strong>Audit tracciamento</strong>: 490 €, 3-5 giorni. Utile da rivendere al cliente come primo passo.</li><li><strong>Automazioni e integrazioni</strong>: richieste inbound strutturate, follow-up, collegamenti CRM. Setup + canone.</li><li><strong>Siti e landing</strong>: quando serve il pezzo che manca.</li></ul></section>
  <section><h2>Sul prezzo</h2><p>Non sono un freelance a basso costo, e probabilmente non ti serve. Il mio prezzo è pensato perché tu lo ricarichi: se rivendi un setup a 2.500 € e il tuo costo è 1.500 €, hai marginato mille euro su un lavoro che non sapevi fare.</p></section>
  <section><h2>Chi sono</h2><p>Sebastiano, Reggio Emilia. Vengo dal marketing (l'ho studiato e l'ho fatto per anni) e sono tecnico. È una combinazione poco comune, ed è il motivo per cui capisco cosa ti serve senza che debba spiegarmelo due volte.</p><p>Lavoro già con un'agenzia in questo modo: ore prepagate più progetti a prezzo fisso.</p><a href="https://calendar.notion.so/meet/sebastianor/tg3rl4yct">Prenota trenta minuti</a> · <a href="mailto:sebastiano@q4.studio">Scrivimi</a></section>`;
  return generateBaseHtml({ title: 'Partner tecnico white label per agenzie | Q4 Studio', description: 'Tracciamento server-side, Consent Mode, automazioni e integrazioni CRM in white label per agenzie.', canonical: `${siteUrl}/partner-tecnico`, noIndex: true, bodyContent: staticPage(body) });
}

const metaAdvertisingFaqs = [
  { question: "In pratica, cos'è la B2B Lead Generation su Meta?", answer: "È l'uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate sul profilo del cliente giusto, messaggio, form, CRM e segnali di qualità." },
  { question: 'Perché collegare Meta Ads, CRM e automazioni?', answer: "Perché il CRM restituisce segnali più utili dell'invio form. Quando questi dati rientrano nel modello di ottimizzazione, le campagne possono cercare contatti più vicini al valore commerciale reale." },
];

function generateMetaAdvertisingHtml(): string {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: metaAdvertisingFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const faqHtml = metaAdvertisingFaqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('');
  const body = `<header><p>Meta Advertising · B2B</p><h1 class="text-6xl font-bold">Meta Ads B2B, con il tracciamento fatto bene a monte.</h1><p>Le campagne Meta per il B2B funzionano quando l'obiettivo non è il costo per contatto ma la probabilità che quel contatto diventi cliente. Perché questo succeda, l'algoritmo deve ricevere segnali corretti: ed è la parte che quasi nessuno sistema prima di aumentare il budget.</p><p>Seguiamo un numero limitato di progetti Meta B2B, di norma per aziende con cui lavoriamo già sul lato tecnico.</p></header>
  <section><p>Metodo</p><h2>Consulenza B2B Lead Generation su Meta</h2><p>La B2B Lead Generation su Meta è un sistema di acquisizione contatti pensato per trasformare Facebook e Instagram in canali di crescita misurabile anche per aziende con cicli di vendita complessi. Il nostro ruolo non è comportarci da agenzia che esegue campagne a volume, ma da consulenti che affiancano marketing e sales nella costruzione di un funnel più leggibile, tracciabile e sostenibile.</p><p>Partiamo dall'analisi del processo commerciale: chi è il cliente giusto, proposta di valore, segmentazione, creatività, domande qualificanti, instradamento al CRM e tempi di risposta ai contatti. Poi traduciamo questa diagnosi in una struttura Meta Ads che ottimizza per qualità del contatto e probabilità di diventare cliente, non solo per costo per contatto.</p><article><h3>Diagnosi prima delle campagne</h3><p>Audit di funnel, audience, offerta e gestione lead prima di aumentare budget o test creativi.</p></article><article><h3>Sistema, non singola ads</h3><p>Campagne, CRM e follow-up vengono progettati insieme per ridurre dispersione e tempi morti.</p></article><article><h3>Governance dei KPI</h3><p>Misuriamo contatti che diventano davvero clienti, appuntamenti e opportunità generate, non solo il costo per contatto e numeri di facciata.</p></article></section>
  <section><p>Meta Ads Advisory</p><h2>Meta Ads orientate alla qualità</h2><p>Lavoriamo come consulenti operativi sulle campagne Meta B2B: audit account, architettura delle campagne, piano test creativo, tracking server-side e lettura dei dati commerciali. L'obiettivo è aiutare il team a capire cosa sta generando opportunità reali e cosa sta solo gonfiando il volume dei lead.</p><p>L'algoritmo Andromeda dà valore ai segnali di conversione ad alta intenzione. Per questo allineiamo campagne e CRM su eventi come completamento di domande qualificanti, risposta del prospect e progressione nello stage commerciale.</p></section>
  <section><p>AI Process Consulting</p><h2>Agenti AI sul processo sales</h2><p>Gli Agenti AI non sono chatbot generici. Li disegniamo insieme al team, partendo da regole operative, tono di voce, CRM e punti di frizione nel processo commerciale. Il risultato è un supporto che qualifica, prioritizza e prepara il lavoro umano invece di sostituirlo.</p><p>Nei progetti più maturi, l'integrazione Meta Ads + Agenti AI riduce i tempi di prima risposta, aumenta la precisione nel routing e rende il funnel meno dipendente da interventi manuali ripetitivi.</p></section>
  <section><p>Misurazione</p><h2>Risultati misurabili, leggibili dal team</h2><p>Ogni attività viene valutata su metriche operative e metriche di business. Questo approccio evita il classico problema delle campagne che sembrano funzionare ma non producono vendite.</p><p>Nei progetti B2B monitoriamo nel tempo quanti contatti diventano davvero clienti e confrontiamo i dati prima e dopo integrazione CRM, instradamento e automazioni. Quando i segnali sono più puliti, il team capisce meglio quali campagne generano conversazioni commerciali reali e quali portano solo volume.</p></section>
  <section><p>FAQ</p><h2>Domande frequenti su Meta Ads B2B</h2>${faqHtml}</section>
  <section><h2>Il tracciamento viene prima delle campagne. Parti dall'audit.</h2><a href="/tracciamento-server-side">Vedi il tracciamento e i prezzi</a></section>`;
  return generateBaseHtml({ title: 'Meta Ads B2B e Lead Generation su Facebook e Instagram | Q4 Studio', description: 'Consulenza Meta Advertising per aziende B2B: campagne orientate alla qualità del contatto, tracciamento server-side e segnali dal CRM.', canonical: `${siteUrl}/meta-advertising-b2b`, schema: [faqSchema], bodyContent: staticPage(body) });
}

const sitesWebAiFaqs = [
  { question: 'Il sito viene generato automaticamente dall’AI?', answer: 'No. L’AI accelera parti della produzione, ma direzione, struttura, messaggio, scelte visive e controllo finale restano umani. È fatto con l’AI, non dall’AI.' },
  { question: 'Quanto costa un sito web con Q4 Studio?', answer: 'I progetti partono da 2.999 €. Il preventivo dipende dal tipo di sito, dai contenuti e dalla produzione necessaria: definiamo il progetto prima di iniziare, senza trasformarlo in un elenco rigido di moduli.' },
  { question: 'Quanto tempo serve per una landing page?', answer: 'Una landing page può essere pronta in una settimana. Per siti più articolati, tempi e fasi vengono definiti sul progetto.' },
  { question: 'Potete occuparvi anche di foto e video reali?', answer: 'Sì. Quando il progetto lo richiede, la produzione di foto e video reali può rientrare nella realizzazione del sito, insieme ad asset creati con l’AI, video animati e sezioni con animazioni allo scroll.' },
];

function generateSitesWebAiHtml(): string {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Siti web con AI per aziende B2B',
    description: 'Progettazione e sviluppo di siti e landing page B2B con direzione umana e strumenti AI.',
    provider: { '@type': 'Organization', name: 'Q4 Studio', url: siteUrl },
    areaServed: 'IT',
    url: `${siteUrl}/siti-web-ai`,
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '2999', description: 'Prezzo di partenza' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sitesWebAiFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const faqHtml = sitesWebAiFaqs.map((faq) => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join('');
  const body = `<header><p>Siti web · direzione umana · strumenti AI</p><h1>Fatto con l’AI, non dall’AI.</h1><p>Progettiamo siti e landing page con una direzione precisa. L’AI ci permette di produrre immagini, movimento e varianti più velocemente; non decide cosa dire, cosa mostrare o perché.</p><a href="#contatti">Parlaci del tuo sito</a><p>Progetti da <strong>2.999 €</strong></p></header>
  <section><p>Una distinzione importante</p><h2>L’AI abbassa il costo della produzione. Non il livello delle scelte.</h2><p>Un sito non diventa efficace perché una macchina ha generato una pagina. Serve capire cosa deve far ricordare, quale percorso deve costruire e dove deve portare chi lo visita.</p><p>Usiamo l’AI nel processo creativo e tecnico, sotto direzione umana. Il risultato non è “un sito AI”: è un sito riconoscibile, costruito con più possibilità a disposizione.</p></section>
  <section><p>Più linguaggi, nello stesso progetto</p><h2>Il sito può fare più che mettere testo sopra una foto.</h2><article><h3>Asset che non arrivano da una banca immagini</h3><p>Creiamo visual, texture e composizioni su misura con strumenti AI, poi li dirigiamo e rifiniamo dentro un’identità coerente.</p></article><article><h3>Il movimento fa parte del racconto</h3><p>Video animati e sezioni che reagiscono allo scroll possono guidare la lettura, spiegare un servizio e rendere il sito riconoscibile.</p></article><article><h3>Quando serve, la produzione è reale</h3><p>Foto e video originali possono entrare nello stesso progetto. AI e produzione sul campo non sono alternative: sono strumenti diversi della stessa direzione.</p></article></section>
  <section><p>Landing page</p><h2>Una pagina può essere pronta in una settimana.</h2><p>Quando serve portare online un’offerta o una campagna senza aspettare un sito completo, concentriamo direzione, contenuto e sviluppo in una singola esperienza.</p><p><strong>Siti web da 2.999 €.</strong> Forma, tempi e produzione vengono definiti sul progetto.</p></section>
  <section><p>Caso studio</p><h2>GP Meccatronica, dal rebranding al sito in movimento.</h2><p>Una direzione visiva scura e tecnica, motion design e asset generati con l’AI per accompagnare il traffico delle campagne ADV.</p><a href="/casi-studio/gp-meccatronica-sito-web">Leggi il caso studio</a></section>
  <section><p>FAQ</p><h2>Domande prima di partire.</h2>${faqHtml}</section>
  <section><h2>Il prossimo sito non deve sembrare il precedente.</h2><p>Raccontaci cosa deve fare, per chi e perché adesso. Partiamo da lì.</p><a href="#contatti">Parlaci del progetto</a></section><section id="contatti" aria-label="Contatti"><h2>Parliamo del tuo prossimo sito.</h2><p>Raccontaci cosa deve fare, per chi e perché adesso.</p></section>`;
  return generateBaseHtml({
    title: 'Siti web con AI per aziende B2B | Q4 Studio',
    description: 'Siti e landing page B2B fatti con l’AI, non dall’AI: asset su misura, motion e produzione foto-video. Progetti da 2.999 €.',
    canonical: `${siteUrl}/siti-web-ai`,
    schema: [serviceSchema, faqSchema],
    bodyContent: staticPage(body),
  });
}

function generateRestyledHomeBodyContent(): string {
  const logos = ['MES Connettori', 'RR Auto', 'Senza Stress Ristrutturare', 'Trenove', 'GP Meccatronica', 'STC', 'Candiani'];
  const logoHtml = logos.map((name) => '<span>' + escapeHtml(name) + '</span>').join(' · ');
  return [
    "<div class='home-static'>",
    "<nav aria-label='Principale'><a href='/tracciamento-server-side'>Tracciamento</a> · <a href='/siti-web-ai'>Siti</a> · <a href='/agenti-ai'>Agenti AI</a> · <a href='/casi-studio'>Casi studio</a> · <a href='/blog'>Blog</a> · <a href='/#contatti'>Contatti</a></nav>",
    "<header><p>TRACCIAMENTO · AUTOMAZIONI · AGENTI AI</p><h1>Il tuo marketing funziona a metà, e il problema è tecnico.</h1><p>Conversioni che non vengono tracciate. Lead che aspettano ore prima di una risposta. Dati ridigitati a mano da qualcuno che potrebbe fare altro. Sistemiamo lo strato tecnico che sta sotto al marketing: tracciamento server-side, automazioni, agenti AI.</p><a href='/tracciamento-server-side'>Vedi il tracciamento e i prezzi</a> <a href='/casi-studio/candiani-denim-tracking-server-side'>Leggi il caso studio</a></header>",
    "<section><p>Q4 Studio è uno studio tecnico. Sistemiamo la raccolta dei dati, colleghiamo gli strumenti che usi già, e automatizziamo il lavoro ripetitivo che oggi fa una persona a mano.</p></section>",
    "<div aria-label='Servizi'>TRACCIAMENTO SERVER-SIDE · CONSENT MODE · AUTOMAZIONI CRM · WHATSAPP · AGENTI AI · META ADS · DIGITAL ANALYTICS</div>",
    "<section><p>Il punto di partenza</p><h2>Prima dei dati giusti, nessuna ottimizzazione funziona.</h2><p>Il browser blocca gli script. L'ad blocker blocca i pixel. Il consenso limita quello che puoi raccogliere. Risultato: le piattaforme vedono una frazione delle conversioni reali, e ottimizzano su quella frazione.</p><p>Il tracciamento server-side sposta la raccolta dati dal browser a un server che controlliamo noi. I segnali arrivano completi, conformi, e utilizzabili dall'algoritmo.</p><p>Cosa comprende</p><ul><li>Container server-side e infrastruttura dedicata</li><li>Consent Mode v2 configurato correttamente</li><li>Conversions API per Meta, Enhanced Conversions per Google</li><li>Segnali dal CRM alle campagne, non solo l'invio del form</li><li>Documentazione di eventi e naming, che resta all'azienda</li></ul><a href='/tracciamento-server-side'>Vedi i pacchetti e i prezzi</a></section>",
    "<section><h2>Dal click al cliente. In automatico.</h2><p>Il nostro sistema di lead generation collega Meta, CRM e WhatsApp: ogni lead viene arricchito, contattato e seguito, dal primo click alla firma.</p><article><p>META ADS · T+0 s</p><h3>Il lead entra dal feed.</h3><p>Campagne Meta progettate sul profilo del cliente giusto e sull'offerta. Il form qualifica già in partenza: chi compila è davvero in target.</p></article><article><p>CRM · T+2 s</p><h3>Nel CRM prima che tu lo veda.</h3><p>Assegnato al commerciale giusto, con fonte, campagna e contesto già pronti.</p></article><article><p>WHATSAPP · T+60 s</p><h3>Primo contatto in 60 secondi.</h3><p>Un messaggio personalizzato parte mentre il lead è ancora sul telefono. La velocità di risposta è la prima leva di conversione: un lead contattato entro un minuto vale molto più di uno contattato dopo quattro ore.</p></article><article><p>ENRICHMENT · T+90 s</p><h3>Il lead diventa un dossier.</h3><p>Dati aziendali arricchiti da fonti pubbliche: dimensione, settore, segnali di priorità. Il commerciale sa con chi parla prima di chiamare.</p></article><article><p>FOLLOW-UP · GIORNI 1–7</p><h3>Ogni lead viene seguito. Sempre.</h3><p>Sequenze automatiche su più canali finché il lead risponde. Il sistema insiste, il team vende.</p></article></section>",
    "<section><h2>Automazioni che partono in due settimane, non in sei mesi.</h2><p>Non progetti da mesi di analisi. Automazioni concrete su problemi precisi: la richiesta che arriva su WhatsApp e finisce nel CRM già strutturata, il follow-up che parte da solo, il dato che smette di essere ridigitato a mano.</p><p>Ogni automazione parte da un setup contenuto e da un canone mensile chiaro. Se non risolve un problema che ci puoi raccontare in una frase, non la costruiamo.</p><p>WhatsApp · Email / PEC · Gestionale / ERP · CRM · Excel / Sheets · Calendario</p><a href='/agenti-ai'>Vedi le automazioni</a></section>",
    "<section id='services'><p>Servizi tecnici</p><h2>Tre servizi, un unico sistema.</h2><p>Rendiamo affidabili i dati, costruiamo il punto di arrivo e automatizziamo il lavoro che viene dopo. Tre linee tecniche, progettate per funzionare insieme.</p><article><h3>Tracciamento e dati</h3><p>Il pezzo tecnico che quasi nessuna agenzia sa fare. Server-side, Consent Mode, segnali dal CRM alle campagne. Dati completi e conformi, che l'algoritmo può davvero usare.</p><ul><li>Container server-side su infrastruttura dedicata</li><li>Consent Mode v2 e conformità</li><li>Conversions API e Enhanced Conversions</li><li>Documentazione di eventi e naming</li></ul><a href='/tracciamento-server-side'>Audit da 490 € · Setup da 1.500 €</a></article><article><h3>Siti web con AI</h3><p>Siti e landing page con direzione umana e strumenti AI. Asset su misura, video e movimento quando servono a raccontare meglio il progetto.</p><ul><li>Sviluppo web con strumenti AI</li><li>Asset AI creati per il progetto</li><li>Video animati e sezioni con scroll animation</li><li>Produzione foto e video reali quando serve</li></ul><a href='/siti-web-ai'>Progetti da 2.999 €</a></article><article><h3>Automazioni e agenti AI</h3><p>Automazioni su problemi precisi, con setup e canone chiari. Richieste inbound strutturate, follow-up automatici, dati che non si ridigitano più.</p><ul><li>Estrazione strutturata da WhatsApp ed email</li><li>Follow-up automatici multicanale</li><li>Integrazione con CRM e gestionale</li><li>Revisione umana dove il dato è incerto</li></ul><a href='/agenti-ai'>Setup da 490 € · Canone da 59 a 200 €/mese</a></article><article><p>Servizio complementare</p><h3>Meta Advertising</h3><p>Campagne B2B su Meta, gestite da chi sa anche sistemare il tracciamento a monte. Servizio disponibile per clienti già seguiti sul tecnico.</p><a href='/meta-advertising-b2b'>Approfondisci</a></article>",
    "<div><p>1.032.695</p><p>segnali di conversione recuperati in 90 giorni (Candiani Denim)</p><p>963.652</p><p>bloccati dalla tracking prevention del browser (Candiani Denim)</p><p>≤ 60 s</p><p>tempo di primo contatto nel nostro sistema di lead generation</p><p>8 h</p><p>tempo tipico di setup del tracciamento server-side</p></div>",
    "<div><article><p>01</p><h3>Audit</h3><p>Guardiamo come funziona oggi il pezzo che non funziona. Prezzo fisso, 3-5 giorni, e il documento resta tuo anche se ci fermiamo qui.</p></article><article><p>02</p><h3>Implementazione</h3><p>Tempi noti, prezzo noto, nessuna sorpresa a metà progetto.</p></article><article><p>03</p><h3>Manutenzione</h3><p>Quello che costruiamo resta monitorato e funzionante. Canone mensile, disdetta libera.</p></article></div></section>",
    "<section><h2>Aziende che ci hanno già scelto</h2>" + logoHtml + "</section>",
    "<section id='faq'><p>FAQ</p><h2>Domande frequenti</h2><p>Risposte chiare su come lavoriamo, cosa costa e come si inizia.</p><h3>Cos'è il tracciamento server-side, in parole semplici?</h3><p>Normalmente i dati sulle conversioni vengono raccolti dal browser del visitatore, che però blocca gli script, e dagli ad blocker, che bloccano i pixel. Il tracciamento server-side sposta la raccolta su un server dedicato: i dati arrivano completi e le piattaforme pubblicitarie possono ottimizzare su informazioni reali.</p><h3>Quanto costa e quanto tempo serve?</h3><p>L'audit parte da 490 €. Il setup completo da 1.500 € per un sito non-ecommerce, con tempi di circa una giornata di lavoro. Per gli ecommerce il tempo dipende da piattaforma e numero di prodotti: da una a tre giornate. Il canone di infrastruttura e monitoraggio parte da 100 €/mese.</p><h3>Il tracciamento server-side è conforme al GDPR?</h3><p>È lo strumento che rende la conformità più gestibile, non meno: il consenso viene rispettato a monte tramite Consent Mode v2 e i dati passano da un’infrastruttura che controlliamo. Non siamo consulenti legali e non forniamo pareri: implementiamo quello che il tuo DPO o consulente privacy definisce.</p><h3>Che tipo di automazioni fate, concretamente?</h3><p>Automazioni su problemi precisi, non progetti di trasformazione digitale. Per esempio: le richieste che arrivano su WhatsApp e finiscono nel CRM già strutturate, con una prima risposta automatica in meno di un minuto. Oppure un assistente sul sito che risponde alle domande frequenti anche fuori orario. Ogni pacchetto ha un prezzo di setup e un canone dichiarati.</p><h3>Lavorate anche con la mia agenzia?</h3><p>Sì, ed è una parte importante di quello che facciamo. Molte agenzie non hanno un tecnico interno per il tracciamento server-side o per le integrazioni: lavoriamo direttamente con loro, in white label. Il cliente resta dell’agenzia.</p><h3>Lavorate solo in Emilia?</h3><p>Il lavoro tecnico si fa in remoto, quindi seguiamo aziende in tutta Italia. Sui progetti che richiedono presenza (advertising, consulenza continuativa) lavoriamo soprattutto tra Reggio Emilia, Modena e Parma.</p><h3>Come si inizia?</h3><p>Con l’audit del tracciamento, che costa 490 € e dura 3-5 giorni. È il modo più economico per capire cosa non funziona senza impegnarsi su un progetto. Il documento che ne esce resta tuo anche se poi non procediamo.</p><h3>Meta Ads funziona anche per aziende B2B con cicli di vendita lunghi?</h3><p>Sì, se l’obiettivo non è solo il costo per lead. Ne parliamo nel dettaglio nella pagina dedicata. <a href='/meta-advertising-b2b'>Approfondisci</a></p></section>",
    "<section><h2>Costruiamo il tuo vantaggio.</h2><p>Raccontaci la tua sfida: ti mostriamo come trasformarla in un sistema che cresce.</p><a href='/tracciamento-server-side'>Vedi il tracciamento e i prezzi</a></section>",
    "<section id='contatti'><h2>Contatti</h2></section></div>",
  ].join('');
}


function generateSitemap(blogPosts: any[] = []): string {
  const buildDate = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/agenti-ai`, priority: '0.95', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/tracciamento-server-side`, priority: '0.95', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/siti-web-ai`, priority: '0.95', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/meta-advertising-b2b`, priority: '0.8', changefreq: 'monthly', lastmod: buildDate },
    { loc: `${siteUrl}${caseStudiesPath}`, priority: '0.9', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}${resourcesPath}`, priority: '0.9', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: buildDate },
    ...caseStudies.map((study) => ({
      loc: `${siteUrl}${caseStudiesPath}/${study.slug}`,
      priority: '0.85',
      changefreq: 'monthly',
      lastmod: study.datePublished
    })),
    ...seoPages.map((page) => ({
      loc: `${siteUrl}${resourcesPath}/${page.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: buildDate
    })),
    ...blogPosts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      // Usa la data reale dell'articolo (da Supabase) invece della data di build,
      // così il lastmod riflette davvero l'ultima modifica del contenuto.
      lastmod: post.date ? new Date(post.date).toISOString().split('T')[0] : buildDate
    }))
  ];

  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
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

  // Inject static home content into the Vite-built dist/index.html so non-JS
  // crawlers see the real H1/paragraphs/sections instead of an empty <div id="root">.
  const rootIndexPath = join(distDir, 'index.html');
  if (existsSync(rootIndexPath)) {
    const builtIndexHtml = readFileSync(rootIndexPath, 'utf-8');
    if (builtIndexHtml.includes('<div id="root"></div>')) {
      const withHomeContent = builtIndexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${generateRestyledHomeBodyContent()}</div>`
      );
      writeFileSync(rootIndexPath, withHomeContent, 'utf-8');
      console.log('✅ Injected static home content into dist/index.html');
    } else {
      console.warn('⚠️  dist/index.html root mount point not in the expected empty state, skipping home content injection.');
    }
  } else {
    console.warn('⚠️  dist/index.html not found, skipping home content injection.');
  }

  // Fetch blog posts from Supabase
  const blogPosts = await fetchBlogPosts();
  console.log(`📚 Fetched ${blogPosts.length} blog posts`);

  // Generate resources hub page (/risorse): canonical path used by App.tsx and data/seoPages.ts.
  // NOTE: le vecchie rotte /directory e /seo/<slug> restano solo come redirect 308 in vercel.json
  // verso /risorse e /risorse/<slug>: qui generiamo direttamente la destinazione finale, altrimenti
  // Vercel non trova alcun file statico su /risorse* (il rewrite SPA catch-all esclude "risorse")
  // e la pagina risulta 404 in produzione.
  const resourcesDir = join(distDir, resourcesPath.replace(/^\//, ''));
  ensureDir(resourcesDir);
  const resourcesHtml = generateResourcesHtml();
  const resourcesStream = createWriteStream(join(resourcesDir, 'index.html'));
  resourcesStream.write(resourcesHtml);
  resourcesStream.end();
  console.log(`✅ Generated ${resourcesPath}/index.html`);

  // Generate case studies index page (/casi-studio) and per-study detail pages.
  // Stesso motivo di /risorse: senza un file statico dedicato, il rewrite SPA
  // catch-all di vercel.json intercetterebbe /casi-studio* e servirebbe la shell
  // vuota invece del contenuto prerenderato (va escluso anche lì dal catch-all).
  const caseStudiesDir = join(distDir, caseStudiesPath.replace(/^\//, ''));
  ensureDir(caseStudiesDir);
  const caseStudiesIndexHtml = generateCaseStudiesIndexHtml();
  const caseStudiesIndexStream = createWriteStream(join(caseStudiesDir, 'index.html'));
  caseStudiesIndexStream.write(caseStudiesIndexHtml);
  caseStudiesIndexStream.end();
  console.log(`✅ Generated ${caseStudiesPath}/index.html`);

  for (const study of caseStudies) {
    const studyDir = join(caseStudiesDir, study.slug);
    ensureDir(studyDir);
    const studyHtml = generateCaseStudyDetailHtml(study);
    const studyStream = createWriteStream(join(studyDir, 'index.html'));
    studyStream.write(studyHtml);
    studyStream.end();
    console.log(`✅ Generated ${caseStudiesPath}/${study.slug}/index.html`);
  }

  // Generate blog index page
  const blogPath = join(distDir, 'blog');
  ensureDir(blogPath);
  const blogHtml = generateBlogIndexHtml();
  const blogStream = createWriteStream(join(blogPath, 'index.html'));
  blogStream.write(blogHtml);
  blogStream.end();
  console.log('✅ Generated /blog/index.html');

  // Generate AI Agents page
  const aiAgentsPath = join(distDir, 'agenti-ai');
  ensureDir(aiAgentsPath);
  const aiAgentsHtml = generateRestyledAIAgentsHtml();
  const aiAgentsStream = createWriteStream(join(aiAgentsPath, 'index.html'));
  aiAgentsStream.write(aiAgentsHtml);
  aiAgentsStream.end();
  console.log('✅ Generated /agenti-ai/index.html');

  const standalonePages = [
    { path: 'tracciamento-server-side', html: generateServerSideTrackingHtml() },
    { path: 'siti-web-ai', html: generateSitesWebAiHtml() },
    { path: 'partner-tecnico', html: generateTechnicalPartnerHtml() },
    { path: 'meta-advertising-b2b', html: generateMetaAdvertisingHtml() },
  ];
  for (const page of standalonePages) {
    const pageDir = join(distDir, page.path);
    ensureDir(pageDir);
    writeFileSync(join(pageDir, 'index.html'), page.html, 'utf-8');
    console.log(`✅ Generated /${page.path}/index.html`);
  }

  // Generate individual blog articles
  for (const post of blogPosts) {
    const postDir = join(distDir, 'blog', post.slug);
    ensureDir(postDir);
    const postHtml = generateBlogArticleHtml(post);
    const postStream = createWriteStream(join(postDir, 'index.html'));
    postStream.write(postHtml);
    postStream.end();
    console.log(`✅ Generated /blog/${post.slug}/index.html`);
  }

  // Generate SEO landing pages under /risorse/<slug>
  for (const page of seoPages) {
    const pageDir = join(distDir, resourcesPath.replace(/^\//, ''), page.slug);
    ensureDir(pageDir);
    const pageHtml = generateLandingPageHtml(page);
    const pageStream = createWriteStream(join(pageDir, 'index.html'));
    pageStream.write(pageHtml);
    pageStream.end();
    console.log(`✅ Generated ${resourcesPath}/${page.slug}/index.html`);
  }

  // Generate sitemap.xml with blog posts
  const sitemapPath = join(distDir, 'sitemap.xml');
  const sitemapStream = createWriteStream(sitemapPath);
  sitemapStream.write(generateSitemap(blogPosts));
  sitemapStream.end();
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
