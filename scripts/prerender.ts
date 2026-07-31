import { seoPages, siteUrl, resourcesPath } from '../data/seoPages.ts';
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
}) {
  const {
    title,
    description,
    canonical,
    ogImage = `${siteUrl}/og-image.jpg`,
    ogImageWidth = 1200,
    ogImageHeight = 630,
    ogImageAlt = 'Q4 Studio',
    type = 'website',
    schema = [],
    bodyContent
  } = options;

  const schemaScripts = schema
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  const imageDimensionsMeta = ogImageWidth && ogImageHeight
    ? `\n  <meta property="og:image:width" content="${ogImageWidth}" />\n  <meta property="og:image:height" content="${ogImageHeight}" />`
    : '';

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
  <meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />${imageDimensionsMeta}
  <meta property="og:locale" content="it_IT" />
  <meta property="og:site_name" content="Q4 Studio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:image:alt" content="${escapeHtml(ogImageAlt)}" />
  <meta name="theme-color" content="#050505" />
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

  // Testo identico a components/AIAgents.tsx (array `faqs`) per evitare mismatch
  // tra il markup prerenderato e il contenuto renderizzato da React (cloaking).
  const faqs = [
    ['Quanto costa un agente AI?', "Dipende dal processo e dai sistemi da collegare. Per questo il percorso parte dalla mappatura: prima di investire sai esattamente quanto costa il progetto pilota e quante ore di lavoro può restituirti. Niente canoni a sorpresa, niente preventivi al buio."],
    ['In quanto tempo vedo i primi risultati?', 'Il primo agente lavora su un processo reale entro 6–8 settimane dal via. Non partiamo mai da un progetto enorme: partiamo da un processo solo, misurabile, e allarghiamo solo quando funziona.'],
    ["E se l'agente sbaglia?", "Dove conta, l'agente propone e una persona conferma: definiamo insieme cosa può fare in autonomia e cosa deve passare da un controllo umano. Ogni azione resta tracciata, quindi puoi sempre verificare cosa ha fatto e perché."],
    ['I dati della mia azienda dove finiscono?', 'Restano nei tuoi sistemi: gestionale, CRM ed email rimangono la fonte dei dati. Definiamo permessi e accessi prima di partire e lavoriamo in conformità al GDPR. Nessun dato viene usato per addestrare modelli pubblici.'],
    ['Il mio team non è tecnico. Ce la facciamo?', "Sì, ed è il punto: il team continua a usare WhatsApp, email e gestionale come sempre, perché è l'agente che si adatta ai vostri strumenti. La formazione la facciamo noi, sul vostro caso concreto."],
    ['È un chatbot?', "No. Un chatbot risponde a domande. Un agente lavora: legge documenti, aggiorna il gestionale, prepara ordini e preventivi, passa la palla a una persona quando serve. La chat è solo uno dei canali da cui riceve il lavoro."]
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  const useCases = [
    ['Ordini', 'Gli ordini arrivano da WhatsApp ed email ed entrano nel gestionale da soli', "L'agente legge messaggi e allegati, riconosce cliente, codici e quantità e crea la bozza d'ordine nel gestionale con i prezzi corretti. Una persona conferma solo quando serve."],
    ['Preventivi', 'Il preventivo parte in giornata, mentre il cliente è ancora interessato', "Estrae le specifiche dalla richiesta, recupera listini e offerte simili e compila l'offerta sul template aziendale. Una persona revisiona e invia."],
    ['Lead e vendite', 'Ogni contatto viene qualificato e richiamato mentre è ancora caldo', "Riceve il lead da form e campagne, arricchisce i dati dell'azienda, lo assegna al commerciale giusto nel CRM e prepara il primo messaggio di follow-up."],
    ['Assistenza clienti', 'Le domande ricorrenti ricevono risposta subito, anche fuori orario', 'Risponde su WhatsApp ed email a stato ordine, tempi e documenti controllando i dati reali nel gestionale, e passa i casi delicati a una persona.'],
    ['Amministrazione', 'Fatture, DDT e documenti letti, controllati e registrati', 'Legge i documenti appena arrivano, controlla che importi e quantità tornino con gli ordini, prepara le registrazioni e segnala solo le anomalie.'],
    ['Report e controllo', 'Il lunedì mattina il report è già pronto, con i numeri che contano', 'Raccoglie i dati da gestionale, CRM e fogli condivisi, calcola gli indicatori e evidenzia gli scostamenti che meritano una decisione.']
  ];

  const useCasesHtml = useCases
    .map(([area, title, description]) => `<article class="rounded-3xl border border-white/10 bg-[#0A0A0A] p-7"><p class="text-[11px] uppercase tracking-[0.08em] text-violet-300 mb-4">${escapeHtml(area)}</p><h3 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mb-4">${escapeHtml(title)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(description)}</p></article>`)
    .join('\n          ');

  const methodHtml = [
    ['Tappa 01 · Mappatura dei processi', 'Entriamo in azienda e parliamo con chi fa il lavoro. Risultato: la lista dei processi automatizzabili, ordinata per impatto, con la stima delle ore recuperabili.'],
    ['Tappa 02 · Primo agente al lavoro', "Partiamo dal processo con il miglior rapporto tra impatto e semplicità. Risultato: un agente funzionante su un processo reale, testato con i vostri dati veri."],
    ['Tappa 03 · Messa in produzione', "Integrazione completa, regole chiare su cosa l'agente fa da solo e formazione del team. Risultato: il team usa l'agente in autonomia."],
    ['Tappa 04 · Crescita e controllo', 'Monitoriamo i risultati ed estendiamo il lavoro ad altri processi. Risultato: un report mensile con ore recuperate, errori evitati e prossimi passi.']
  ]
    .map(([title, description]) => `<li class="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 class="text-2xl font-bold leading-[1.25] tracking-[-0.01em] mb-2">${escapeHtml(title)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(description)}</p></li>`)
    .join('\n              ');

  const faqHtml = faqs
    .map(([question, answer]) => `<div class="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6"><h3 class="text-lg font-semibold mb-3">${escapeHtml(question)}</h3><p class="text-gray-400 leading-relaxed">${escapeHtml(answer)}</p></div>`)
    .join('\n          ');

  const bodyContent = `
    <article class="relative pt-36 md:pt-44 pb-24 md:pb-32 px-6 bg-[#050505] text-white min-h-screen">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-violet-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="mb-10">
          <ol class="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" class="hover:text-violet-300 transition-colors">Home</a></li>
            <li>/</li>
            <li class="text-gray-300">Agenti AI</li>
          </ol>
        </nav>

        <header class="mb-16">
          <p class="text-violet-300 text-sm tracking-[0.08em] uppercase mb-5">Agenti AI · consulenza e sviluppo</p>
          <h1 class="text-[clamp(40px,6.5vw,80px)] font-bold leading-[1.1] tracking-[-0.03em] mb-6">Agenti AI su misura per togliere al tuo team il lavoro che un software può fare meglio</h1>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl">
            Leggono email e WhatsApp, inseriscono gli ordini nel gestionale, preparano i preventivi, qualificano i lead e rispondono ai clienti. Tu mantieni il controllo: l'agente propone, le persone decidono.
          </p>
        </header>

        <section class="mb-24">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Cosa fa un agente AI, in concreto</h2>
          <p class="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">Ogni agente nasce da un processo vero: come lo gestisci oggi, cosa fa l'agente al posto del team e dove resta il controllo delle persone.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            ${useCasesHtml}
          </div>
        </section>

        <section class="mb-24 rounded-3xl border border-indigo-400/30 bg-indigo-500/[0.06] p-8">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-4">Si collega agli strumenti che usi già</h2>
          <p class="text-lg text-gray-200 leading-relaxed mb-6">Nessuna piattaforma nuova da imparare, nessun cambio di gestionale. L'agente entra nei flussi esistenti: WhatsApp, email e PEC, gestionale/ERP, CRM, Excel e Google Sheets, calendario, sito e form, centralino. Se un software ha un'API, un'esportazione o anche solo una casella email, si può collegare.</p>
        </section>

        <section class="mb-24">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Non ti vendiamo un software. Ti affianchiamo finché funziona.</h2>
          <p class="text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">Q4 Studio è uno studio di consulenza: ogni tappa del percorso ha una durata, un obiettivo e un risultato concreto che ti porti a casa, anche se decidi di fermarti lì.</p>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-5">
              ${methodHtml}
          </ul>
        </section>

        <section class="mb-16">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-10">Le domande che ci fanno tutti gli imprenditori</h2>
          <div class="space-y-4">
          ${faqHtml}
          </div>
        </section>

        <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 text-center">
          <h2 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6">Porta un processo che ti ruba tempo. Ne usciamo con un piano.</h2>
          <p class="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">In 30 minuti analizziamo insieme dove oggi si perde tempo, quali dati avete già e quale agente può generare il primo risultato misurabile.</p>
          <a href="/" class="inline-flex items-center rounded-full bg-indigo-600 px-7 py-4 font-semibold text-white hover:bg-indigo-500 transition-colors">Prenota la chiamata</a>
        </section>
      </div>
    </article>
  `;

  return generateBaseHtml({
    title: 'Agenti AI per aziende | Consulenza e sviluppo su misura | Q4 Studio',
    description: 'Agenti AI che leggono email e WhatsApp, inseriscono ordini nel gestionale, preparano preventivi e qualificano i lead. Q4 Studio ti affianca dalla mappatura dei processi alla messa in produzione.',
    canonical: pageUrl,
    schema: [serviceSchema, breadcrumbSchema, faqSchema],
    bodyContent
  });
}

// Static content of the homepage (mirrors components/home2/* and HomeSeoContent.tsx)
// so non-JS crawlers see the same text React renders after hydration. Visual/animation
// chrome (GSAP, canvas, terminal typing effect) is intentionally simplified to plain
// markup: only the actual copy needs to match 1:1 to avoid cloaking.
function generateHomeBodyContent(): string {
  const tickerItems = ['LEAD GENERATION B2B', 'AGENTI AI', 'META ADS', 'CRM AUTOMATION', 'WHATSAPP FOLLOW-UP', 'DIGITAL ANALYTICS'];

  const pipelineSteps = [
    { label: 'META ADS', time: 'T+0 s', title: 'Il lead entra dal feed.', desc: "Campagne Meta progettate sul profilo del cliente giusto e sull'offerta. Il form qualifica già in partenza: chi compila è davvero in target." },
    { label: 'CRM', time: 'T+2 s', title: 'Nel CRM prima che tu lo veda.', desc: 'Assegnato al commerciale giusto, con fonte, campagna e contesto già pronti.' },
    { label: 'WHATSAPP', time: 'T+60 s', title: 'Primo contatto in 60 secondi.', desc: 'Un messaggio personalizzato parte mentre il lead è ancora sul telefono. La velocità di risposta è la prima leva di conversione.' },
    { label: 'ENRICHMENT', time: 'T+90 s', title: 'Il lead diventa un dossier.', desc: 'Dati aziendali arricchiti da fonti pubbliche: dimensione, settore, segnali di priorità. Il commerciale sa con chi parla prima di chiamare.' },
    { label: 'FOLLOW-UP', time: 'GIORNI 1–7', title: 'Ogni lead viene seguito. Sempre.', desc: 'Sequenze automatiche su più canali finché il lead risponde. Il sistema insiste, il team vende.' }
  ];

  const agentsIntegrations = ['WhatsApp', 'Email / PEC', 'Gestionale / ERP', 'CRM', 'Excel / Sheets', 'Calendario'];

  const services = [
    {
      title: 'B2B Lead Generation',
      desc: "Un sistema di acquisizione completo: posizionamento, offerta, Meta Advertising, CRM e follow-up. Il tracking è il nostro punto forte: dati di conversione precisi e conformi, che l'algoritmo può davvero usare per ottimizzare.",
      points: ["Meta Ads sul profilo del cliente giusto e sull'offerta", 'Server-Side Tracking e Consent Mode', 'Segnali di qualità dal CRM alle campagne', 'Qualifica lead e follow-up multicanale']
    },
    {
      title: 'Agenti AI & Automazioni',
      desc: "Agenti su misura per sales, back office, customer care e processi interni. Partiamo dall'audit operativo, integriamo gli strumenti già in uso e accompagniamo il team nell'adozione.",
      points: ['Audit e mappatura dei processi', 'Agenti costruiti sul caso reale', 'Integrazione con gestionale e CRM', 'Formazione e adozione del team']
    }
  ];

  const stats = [
    { value: '≤ 60 s', label: 'primo contatto al lead' },
    { value: '40 s', label: 'per processare un ordine' },
    { value: '24/7', label: 'follow-up sempre attivo' },
    { value: '100%', label: 'lead tracciati nel CRM' }
  ];

  const methodSteps = [
    { n: '01', title: 'Diagnosi', desc: 'Mappiamo business, funnel, processi e dati. Capiamo dove si perde valore e quale leva ha più impatto.' },
    { n: '02', title: 'Progetto', desc: 'Definiamo architettura, metriche e responsabilità. Campagne, CRM e agenti pensati come un unico sistema.' },
    { n: '03', title: 'Implementazione', desc: 'Mettiamo online, formiamo il team e miglioriamo sui dati reali. Utile, misurabile, adottato.' }
  ];

  const homeFaqs = [
    { q: "In pratica, cos'è la B2B Lead Generation su Meta?", a: "È l'uso strategico di Facebook e Instagram Ads per acquisire contatti aziendali qualificati, con campagne progettate sul profilo del cliente giusto, messaggio, form, CRM e segnali di qualità." },
    { q: 'Meta Ads funziona anche per aziende B2B con cicli di vendita lunghi?', a: 'Sì, se l\'obiettivo non è solo il costo per lead.' },
    { q: 'Cosa sono gli Agenti AI personalizzati?', a: "Sono sistemi costruiti sul processo commerciale dell'azienda per qualificare lead, rispondere più velocemente, assegnare contatti e automatizzare attività ripetitive." },
    { q: 'Perché collegare Meta Ads, CRM e automazioni?', a: 'Perché il CRM restituisce segnali più utili dell\'invio form. Quando questi dati rientrano nel modello di ottimizzazione, le campagne possono cercare contatti più vicini al valore commerciale reale.' }
  ];

  const tickerHtml = tickerItems.map((t) => `<span class="ticker-item">${escapeHtml(t)}</span>`).join('\n            ');

  const pipelineHtml = pipelineSteps
    .map((s, i) => `<article class="pipeline-step">
              <p class="pipeline-step-meta">0${i + 1}/05 · ${escapeHtml(s.label)} · ${escapeHtml(s.time)}</p>
              <h3>${escapeHtml(s.title)}</h3>
              <p>${escapeHtml(s.desc)}</p>
            </article>`)
    .join('\n            ');

  const integrationsHtml = agentsIntegrations.map((i) => `<span class="integration-pill">${escapeHtml(i)}</span>`).join('\n              ');

  const servicesHtml = services
    .map(
      (s) => `<article class="service-card">
              <h3>${escapeHtml(s.title)}</h3>
              <p>${escapeHtml(s.desc)}</p>
              <ul>
                ${s.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('\n                ')}
              </ul>
            </article>`
    )
    .join('\n            ');

  const statsHtml = stats
    .map((s) => `<div class="stat-tile"><p class="stat-value">${escapeHtml(s.value)}</p><p class="stat-label">${escapeHtml(s.label)}</p></div>`)
    .join('\n            ');

  const methodHtml = methodSteps
    .map((s) => `<div class="method-step"><span>${escapeHtml(s.n)}</span><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p></div>`)
    .join('\n            ');

  const faqHtml = homeFaqs
    .map((f) => `<details class="faq-item"><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`)
    .join('\n            ');

  return `
    <div class="home-static">
      <nav aria-label="Principale" class="home-nav">
        <a href="/"><img src="/logo.webp" alt="Q4 Studio" width="130" height="40" /></a>
        <div class="home-nav-links">
          <a href="/agenti-ai">Agenti AI</a>
          <a href="/blog">Blog</a>
          <a href="${resourcesPath}">Risorse</a>
        </div>
      </nav>

      <header class="hero">
        <h1>Il tuo AI<br />Marketing Partner.</h1>
        <p class="hero-sub">Lo studio di consulenza che applica l'AI al marketing: campagne che convertono, automazioni che inseguono ogni lead e agenti AI che alleggeriscono i processi del tuo team.</p>
        <div class="hero-cta">
          <a href="#contatti" class="btn-primary">Inizia il percorso</a>
          <a href="/agenti-ai" class="btn-secondary">Scopri gli Agenti AI</a>
        </div>
        <div class="hero-ticker">
          ${tickerHtml}
        </div>
      </header>

      <section class="manifesto">
        <p>Q4 Studio è uno studio di consulenza. Entriamo nei processi, applichiamo l'AI al marketing e costruiamo agenti che lavorano al fianco del tuo team.</p>
      </section>

      <section class="pipeline">
        <h2>Dal click al cliente.<br />In automatico.</h2>
        <p>Il nostro sistema di lead generation collega Meta, CRM e WhatsApp: ogni lead viene arricchito, contattato e seguito, dal primo click alla firma.</p>
        <div class="pipeline-steps">
          ${pipelineHtml}
        </div>
      </section>

      <section class="agents">
        <h2>Colleghi digitali,<br />progettati sul tuo processo.</h2>
        <p>Agenti costruiti sui processi reali dell'azienda: leggono email e messaggi, interrogano il gestionale, preparano preventivi e ordini, e coinvolgono una persona quando serve una decisione.</p>
        <div class="integrations">
          ${integrationsHtml}
        </div>
        <a href="/agenti-ai" class="btn-secondary">Esplora gli Agenti AI</a>
      </section>

      <section class="services">
        <h2>Due leve.<br />Un unico sistema.</h2>
        <p>Acquisizione B2B da un lato, automazione intelligente dall'altro. Studiamo il processo, definiamo le priorità e costruiamo sistemi misurabili.</p>
        <div class="services-grid">
          ${servicesHtml}
        </div>
        <div class="stats">
          ${statsHtml}
        </div>
        <div class="method">
          ${methodHtml}
        </div>
      </section>

      ${generateHomeSeoContentHtml(faqHtml)}

      <section class="final-cta">
        <h2>Costruiamo il tuo<br />vantaggio.</h2>
        <p>Raccontaci la tua sfida: ti mostriamo come trasformarla in un sistema che cresce.</p>
      </section>

      <section id="contatti" class="contact-anchor" aria-label="Contatti">
        <h2>Parla con un esperto</h2>
        <p>Raccontaci il tuo processo: ti proponiamo il primo passo misurabile.</p>
      </section>
    </div>
  `;
}

// Sezione "Metodo + FAQ" della home, testo identico a components/HomeSeoContent.tsx
function generateHomeSeoContentHtml(faqHtml: string): string {
  return `
      <section class="home-seo-content">
        <h2>Consulenza B2B Lead Generation su Meta</h2>
        <p>La B2B Lead Generation su Meta è un sistema di acquisizione contatti pensato per trasformare Facebook e Instagram in canali di crescita misurabile anche per aziende con cicli di vendita complessi. Il nostro ruolo non è comportarci da agenzia che esegue campagne a volume, ma da consulenti che affiancano marketing e sales nella costruzione di un funnel più leggibile, tracciabile e sostenibile.</p>
        <p>Partiamo dall'analisi del processo commerciale: chi è il cliente giusto, proposta di valore, segmentazione, creatività, domande qualificanti, instradamento al CRM e tempi di risposta ai contatti. Poi traduciamo questa diagnosi in una struttura Meta Ads che ottimizza per qualità del contatto e probabilità di diventare cliente, non solo per costo per contatto.</p>

        <h2>Meta Ads orientate alla qualità</h2>
        <p>Lavoriamo come consulenti operativi sulle campagne Meta B2B: audit account, architettura delle campagne, piano test creativo, tracking server-side e lettura dei dati commerciali. L'obiettivo è aiutare il team a capire cosa sta generando opportunità reali e cosa sta solo gonfiando il volume dei lead.</p>
        <p>L'algoritmo Andromeda dà valore ai segnali di conversione ad alta intenzione. Per questo allineiamo campagne e CRM su eventi come completamento di domande qualificanti, risposta del prospect e progressione nello stage commerciale.</p>

        <h2>Agenti AI sul processo sales</h2>
        <p>Gli Agenti AI non sono chatbot generici. Li disegniamo insieme al team, partendo da regole operative, tono di voce, CRM e punti di frizione nel processo commerciale. Il risultato è un supporto che qualifica, prioritizza e prepara il lavoro umano invece di sostituirlo.</p>
        <p>Nei progetti più maturi, l'integrazione Meta Ads + Agenti AI riduce i tempi di prima risposta, aumenta la precisione nel routing e rende il funnel meno dipendente da interventi manuali ripetitivi.</p>

        <h2>Risultati misurabili, leggibili dal team</h2>
        <p>Ogni attività viene valutata su metriche operative e metriche di business. Questo approccio evita il classico problema delle campagne che sembrano funzionare ma non producono vendite.</p>
        <p>Nei progetti B2B monitoriamo nel tempo quanti contatti diventano davvero clienti e confrontiamo i dati prima e dopo integrazione CRM, instradamento e automazioni. Quando i segnali sono più puliti, il team capisce meglio quali campagne generano conversazioni commerciali reali e quali portano solo volume.</p>

        <h2>Domande frequenti su Meta Ads B2B e Agenti AI</h2>
        <p>Abbiamo raccolto in un unico punto le risposte operative sulle campagne Meta B2B, sugli Agenti AI e sul collegamento con CRM e automazioni.</p>
        <div class="faq-list">
          ${faqHtml}
        </div>
      </section>
  `;
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
      elements.push(`<h1 class="text-[clamp(28px,4.5vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] mb-6 mt-8">${escapeHtml(line.replace('# ', ''))}</h1>`);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(`<h2 class="text-2xl md:text-3xl font-bold leading-[1.25] tracking-[-0.01em] mb-4 mt-8 text-indigo-300">${escapeHtml(line.replace('## ', ''))}</h2>`);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(`<h3 class="text-lg md:text-xl font-bold leading-[1.5] mb-3 mt-6 text-purple-300">${escapeHtml(line.replace('### ', ''))}</h3>`);
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      currentList.push(text);
    } else if (line.trim() === '') {
      flushList();
    } else if (line.trim() !== '') {
      flushList();
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      elements.push(`<p class="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">${html}</p>`);
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
    ogImage: post.coverImage,
    type: 'article',
    schema: [blogSchema, breadcrumbSchema],
    bodyContent,
  });
}

function generateSitemap(blogPosts: any[] = []): string {
  const buildDate = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/agenti-ai`, priority: '0.95', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}${resourcesPath}`, priority: '0.9', changefreq: 'weekly', lastmod: buildDate },
    { loc: `${siteUrl}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: buildDate },
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
        `<div id="root">${generateHomeBodyContent()}</div>`
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

  // Generate resources hub page (/risorse) — canonical path used by App.tsx and data/seoPages.ts.
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
  const aiAgentsHtml = generateAIAgentsHtml();
  const aiAgentsStream = createWriteStream(join(aiAgentsPath, 'index.html'));
  aiAgentsStream.write(aiAgentsHtml);
  aiAgentsStream.end();
  console.log('✅ Generated /agenti-ai/index.html');

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
