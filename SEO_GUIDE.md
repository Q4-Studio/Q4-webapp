# SEO Guide - Q4 Studio

> Ultimo aggiornamento: 2026-05-03

## Architettura SEO

Il progetto usa una **struttura a 3 livelli** con **prerendering build-time** per garantire che Google e i motori AI vedano il contenuto completo senza eseguire JavaScript.

### Livelli

1. **Homepage**: `https://www.q4.studio/`
2. **Directory**: `https://www.q4.studio/directory`
3. **Pagine SEO programmatiche**: `https://www.q4.studio/seo/<slug>`
4. **Blog**: `https://www.q4.studio/blog` e `https://www.q4.studio/blog/<slug>`

### Prerendering (SSG)

Il prerendering avviene in fase di build (`npm run build`) tramite lo script `scripts/prerender.ts`.

Per ogni rotta SEO nota, lo script genera un file `index.html` statico nella cartella `dist/`:

- `dist/directory/index.html`
- `dist/seo/<slug>/index.html`
- `dist/blog/index.html`
- `dist/sitemap.xml`

Ogni file HTML contiene:
- Meta tags completi (title, description, canonical, OG, Twitter)
- Schema.org JSON-LD (Service, FAQPage, BreadcrumbList)
- Contenuto visibile completo (crawler non necessitano di JS)
- Mount point SPA (`<div id="root">`) per l'hydration client-side

Vercel serve automaticamente i file statici per i path corrispondenti. Le rotte non statiche fallbackano all'SPA (`index.html`).

## Pagine SEO Programmatiche

Tutte le pagine di atterraggio SEO sono definite in `data/seoPages.ts`.

Ogni pagina include:

- `slug`: segmento URL pulito
- `metaTitle`: title tag
- `description`: meta description e intro pagina
- `keyword`: intento di ricerca primario
- `directAnswer`: risposta diretta per GEO (motori AI)
- `audience`, `pain`, `solution`, `proof`: sezioni body
- `dataPoints`: dati numerici e statistiche
- `clusters`: cluster di keyword con contenuto semantico (4 argomenti correlati per pagina)
- `comparisonTable`: tabella comparativa HTML per GEO
- `services`: bullet dei servizi
- `faqs`: FAQ visibili e schema JSON-LD (4 domande per pagina)

Pagine attuali:

- `/seo/b2b-lead-generation-meta-ads`
- `/seo/meta-ads-b2b-verona`
- `/seo/agenti-ai-per-lead-generation`
- `/seo/crm-automation-meta-ads`
- `/seo/whatsapp-automation-lead-b2b`
- `/seo/algoritmo-andromeda-meta-b2b`

## Blog

Il blog usa **rotte reali** (`/blog` e `/blog/:slug`), non più hash routes.

- La lista blog è prerendata come shell statica
- Gli articoli singoli vengono renderizzati client-side da Supabase
- Ogni articolo ha schema `BlogPosting` dinamico
- I link interni usano URL assoluti: `https://www.q4.studio/blog/<slug>`

**Nota**: per il prerendering completo degli articoli del blog, servirebbe fetch da Supabase in fase di build. Attualmente la shell statica fornisce meta tags corretti ma il contenuto dinamico è disponibile solo dopo l'hydration.

## Technical SEO

- `components/SEOHead.tsx`: gestisce title, description, canonical, Open Graph, Twitter card e robots tags dinamicamente
- `components/SeoDirectory.tsx`: renderizza `ItemList` schema e breadcrumb UI
- `components/SeoLandingPage.tsx`: renderizza `Service`, `FAQPage` e `BreadcrumbList` schema per ogni pagina SEO
- `public/sitemap.xml`: generato dinamicamente in build da `scripts/prerender.ts`
- `public/robots.txt`: allow `/directory`, `/seo/`, `/blog/`; disallow dashboard/login
- `vercel.json`: rewrites SPA fallback per rotte non statiche

## Schema.org in uso

Per ogni pagina SEO programmatica:

1. **Service**: descrive il servizio, provider, area servita
2. **FAQPage**: domande e risposte visibili sulla pagina
3. **BreadcrumbList**: navigazione breadcrumb con 3 livelli

Per la directory:

1. **ItemList**: elenco delle pagine SEO
2. **BreadcrumbList**: Home → Directory

Per il blog:

1. **BlogPosting**: articolo singolo con author, publisher, date
2. **Organization**: nella homepage

## Strategia Contenuti (Keyword Clustering + GEO)

Ogni pagina SEO targetta non una singola keyword ma un **cluster semantico** di 50-100 keyword correlate, distribuite in:

- Heading principale e secondari
- Sezione `directAnswer` (risposta diretta per AI)
- 4 sezioni `clusters` con contenuto semantico espanso
- Tabella comparativa HTML (`comparisonTable`)
- 4 FAQ strutturate con schema
- Dati numerici concreti (`dataPoints`)

Questo approccio massimizza sia la SEO tradizionale che la **GEO** (Generative Engine Optimization) per Perplexity, ChatGPT e Gemini.

## Regole di Manutenzione

- Aggiungi nuove pagine SEO solo in `data/seoPages.ts`
- Lo script `prerender.ts` rigenera automaticamente sitemap e pagine statiche in build
- Mantieni il testo FAQ visibile sulla pagina e allineato con il JSON-LD
- Usa un intento primario per pagina. Non creare pagine quasi-duplicate per piccole variazioni di keyword
- Canonical URL su `https://www.q4.studio`
- Ogni pagina deve avere almeno 1200-1500 parole equivalenti di contenuto

## SEO Checklist per Nuove Pagine

Prima di aggiungere una pagina, verifica:

- [ ] Intento di ricerca definito e diverso dalle pagine esistenti
- [ ] Angolo editoriale unico
- [ ] `directAnswer` di 1-2 frasi
- [ ] Almeno 4 cluster semantici con contenuto originale
- [ ] Tabella comparativa rilevante
- [ ] Almeno 4 FAQ specifiche
- [ ] Almeno 4 `dataPoints` con numeri concreti
- [ ] Proof point reale (cliente, caso studio o dato interno)

## Prossime Espansioni Raccomandate

- `/seo/lead-generation-b2b-industriale`
- `/seo/meta-ads-per-consulenza-b2b`
- `/seo/automazioni-ai-per-sales-team`
- `/seo/conversion-api-meta-ads-b2b`
- `/seo/agenzia-lead-generation-verona`

Prima di aggiungerle, definisci intento di ricerca, angolo pagina e proof point unici per ciascuna.
