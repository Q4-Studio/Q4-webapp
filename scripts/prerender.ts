import { seoPages, siteUrl } from '../data/seoPages.ts';
import { createClient } from '@supabase/supabase-js';
import { createWriteStream, mkdirSync, existsSync, copyFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, '..', 'dist');

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
  type?: 'website' | 'article';
  schema?: object[];
  bodyContent: string;
}) {
  const { title, description, canonical, ogImage = `${siteUrl}/og-image.jpg`, type = 'website', schema = [], bodyContent } = options;

  const schemaScripts = schema
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

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
</head>
<body>
  <div id="root">
    ${bodyContent}
  </div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;
}

function generateLandingPageHtml(page: typeof seoPages[0]): string {
  const pageUrl = `${siteUrl}/seo/${page.slug}`;
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
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${siteUrl}/directory` },
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
    .map((p) => `<a href="/seo/${p.slug}" class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-gray-300 hover:text-white hover:border-indigo-400/50 transition-colors">${escapeHtml(p.title)}</a>`)
    .join('\n            ');

  const bodyContent = `
    <article class="relative pt-36 pb-28 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-5xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-indigo-300 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/directory" class="hover:text-indigo-300 transition-colors">Directory</a></li>
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
    name: 'Directory SEO Q4 Studio',
    itemListElement: seoPages.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.title,
      url: `${siteUrl}/seo/${page.slug}`
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${siteUrl}/directory` }
    ]
  };

  const pagesHtml = seoPages
    .map((page) => `
      <a href="/seo/${page.slug}" class="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-indigo-400/50 hover:bg-indigo-500/[0.06] transition-all duration-300">
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
            <li class="text-gray-300">Directory</li>
          </ol>
        </nav>

        <p class="text-indigo-400 font-mono text-sm tracking-[0.35em] uppercase mb-6">Directory</p>
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6">Risorse su Lead Generation B2B, Meta Ads e Agenti AI</h1>
        <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-14">
          Questa directory raccoglie le pagine verticali di Q4 Studio. Ogni pagina approfondisce un intento di ricerca specifico con dati, confronti, cluster semantici e FAQ.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${pagesHtml}
        </div>
      </div>
    </section>
  `;

  return generateBaseHtml({
    title: 'Directory servizi B2B Lead Generation e AI | Q4 Studio',
    description: 'Directory SEO Q4 Studio: tutte le pagine su Meta Ads B2B, lead generation, automazioni CRM, WhatsApp e Agenti AI.',
    canonical: `${siteUrl}/directory`,
    schema: [itemListSchema, breadcrumbSchema],
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
    { loc: `${siteUrl}/directory`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    ...seoPages.map((page) => ({
      loc: `${siteUrl}/seo/${page.slug}`,
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

  // Generate directory page
  const directoryPath = join(distDir, 'directory');
  ensureDir(directoryPath);
  const directoryHtml = generateDirectoryHtml();
  const directoryStream = createWriteStream(join(directoryPath, 'index.html'));
  directoryStream.write(directoryHtml);
  directoryStream.end();
  console.log('✅ Generated /directory/index.html');

  // Generate blog index page
  const blogPath = join(distDir, 'blog');
  ensureDir(blogPath);
  const blogHtml = generateBlogIndexHtml();
  const blogStream = createWriteStream(join(blogPath, 'index.html'));
  blogStream.write(blogHtml);
  blogStream.end();
  console.log('✅ Generated /blog/index.html');

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

  // Generate SEO landing pages
  for (const page of seoPages) {
    const pageDir = join(distDir, 'seo', page.slug);
    ensureDir(pageDir);
    const pageHtml = generateLandingPageHtml(page);
    const pageStream = createWriteStream(join(pageDir, 'index.html'));
    pageStream.write(pageHtml);
    pageStream.end();
    console.log(`✅ Generated /seo/${page.slug}/index.html`);
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
