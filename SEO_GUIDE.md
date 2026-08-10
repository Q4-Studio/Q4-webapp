# SEO Guide - Q4 Studio

> Ultimo aggiornamento: 2026-08-09

## Manutenzione tecnica (audit 2026-08)

- **`lastmod` sitemap**: NON deriva più dalla data di build. Le pagine bespoke usano `pageLastModified` in `data/seoPages.ts`; le pagine `/risorse/<slug>` usano il campo `lastModified` di ogni `SeoPage`. **Aggiornare a mano la data quando si modifica il contenuto di una di queste pagine**, altrimenti il segnale di freshness torna a essere falso.
- **`llms.txt`**: generato a build time da `generateLlmsTxt()` in `scripts/prerender.ts` (sovrascrive la copia statica di `public/llms.txt`), elenca automaticamente ogni pagina `/risorse/<slug>` e ogni articolo blog pubblicato — non richiede aggiornamento manuale.
- **IndexNow**: chiave pubblicata in `public/<key>.txt` (referenziata in `robots.txt`). Dopo un deploy reale su Vercel, notificare Bing/Yandex con `npm run indexnow:ping` (tutta la sitemap) o `npm run indexnow:ping -- /blog/nuovo-slug` (URL specifici). Non lanciarlo in locale/pre-deploy: notifica un URL live, ha senso solo se il sito pubblicato corrisponde già al contenuto.
- **Tailwind**: build reale via `@tailwindcss/vite` (CSS compilato in `dist/assets/`), non più `cdn.tailwindcss.com`. Il rilevamento contenuto di Tailwind v4 è automatico su tutto il repo (incluso `scripts/prerender.ts`) — non serve un `content:` config manuale.
- **404 reale**: `dist/404.html` generato da `generateNotFoundHtml()`, servito da Vercel con status 404 vero per qualsiasi path non riconosciuto (il rewrite catch-all in `vercel.json` è stato rimosso, resta solo quello per `/blog/:slug`).

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

## Pagine di offerta (bespoke, non in `seoPages.ts`)

Oltre alle pagine SEO programmatiche, il sito ha pagine di offerta con copy e prezzo dedicati, ciascuna con proprio componente React **e** proprio template mirror in `scripts/prerender.ts` (i due devono restare identici):

| Pagina | Componente | Note |
|---|---|---|
| `/tracciamento-server-side` | `ServerSideTracking.tsx` | Offerta di ingresso. Priorità massima: audit → setup → infrastruttura |
| `/agenti-ai` | `AIAgents.tsx` | Automazioni/agenti — venduti dopo, allo stesso cliente del tracciamento |
| `/meta-advertising-b2b` | `MetaAdvertisingB2B.tsx` | Servizio disponibile, non promosso in home |
| `/partner-tecnico` | `TechnicalPartner.tsx` | Landing white-label per agenzie. `noindex`, fuori dal menu — pubblico separato dal sito principale |
| `/siti-web-ai` | `SitesWebAI.tsx` | Terza offerta pubblica (cluster G, vedi Piano Editoriale Blog) |

**Nota rimozione contenuto Andromeda**: la menzione esplicita dell'algoritmo "Andromeda" di Meta è stata rimossa dal paragrafo Meta Ads Advisory in `MetaAdvertisingB2B.tsx` e dal suo mirror in `prerender.ts` (sostituita con "l'algoritmo di Meta", generico). Non reintrodurre nomi di versione/codename di algoritmi delle piattaforme ADV in nessuna pagina o articolo: restano generici e non richiedono aggiornamento quando la piattaforma rinomina l'algoritmo. Lo stesso vincolo vale per gli articoli del piano editoriale blog che toccano il funzionamento dell'algoritmo Meta/Google.

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

- `/risorse/agenti-ai-per-lead-generation`
- `/risorse/agente-vocale-ai-aziende`
- `/risorse/centralino-ai`
- `/risorse/riattivazione-database-clienti-ai`
- `/risorse/chatbot-cliniche-studi-medici`
- `/risorse/crm-automation-meta-ads`
- `/risorse/whatsapp-automation-lead-b2b`
- `/risorse/tracking-server-side-deduplicazione-eventi`
- `/risorse/reminder-automatici-appuntamenti-no-show`
- `/risorse/second-brain-aziendale-agente-ai`

**Nota**: le 7 pagine precedenti su Meta Ads B2B locali (Verona, Reggio Emilia, Modena, Parma, Mantova), lead generation generica e l'algoritmo Andromeda sono state ritirate nell'ambito del rebrand verso il posizionamento tech/AI e redirect 301 a `/risorse` (vedi `vercel.json`).

## Blog

Il blog usa **rotte reali** (`/blog` e `/blog/:slug`), non più hash routes.

- La lista blog è prerendata come shell statica
- Gli articoli singoli vengono renderizzati client-side da Supabase
- Ogni articolo ha schema `BlogPosting` dinamico
- I link interni usano URL assoluti: `https://www.q4.studio/blog/<slug>`

**Nota**: per il prerendering completo degli articoli del blog, servirebbe fetch da Supabase in fase di build. Attualmente la shell statica fornisce meta tags corretti ma il contenuto dinamico è disponibile solo dopo l'hydration.

**Nota redazione**: la UI dashboard (`Dashboard.tsx`/`DashboardEditor.tsx`/`DashboardLogin.tsx`) è stata rimossa dalla build pubblica. Gli articoli si scrivono/inseriscono direttamente nella tabella `blog_posts` (come bozza, `published=false`) e si rivedono in locale con `npm run dev:blog-preview` (`server/draftPreviewPlugin.ts`, dev-only, protetto da sessione e sempre `noindex`) prima di impostare `published=true`.

## Technical SEO

- `components/SEOHead.tsx`: gestisce title, description, canonical, Open Graph, Twitter card e robots tags dinamicamente
- `components/SeoDirectory.tsx`: renderizza `ItemList` schema e breadcrumb UI
- `components/SeoLandingPage.tsx`: renderizza `Service`, `FAQPage` e `BreadcrumbList` schema per ogni pagina SEO
- `public/sitemap.xml`: generato dinamicamente in build da `scripts/prerender.ts`
- `public/robots.txt`: consente la scansione delle route pubbliche. L'anteprima
  bozze è middleware dev-only, non esiste nella build e invia anche `noindex`.
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

- `/risorse/agenti-ai-per-il-back-office`
- `/risorse/automazione-preventivi-e-ordini`
- `/risorse/digital-analytics-per-pmi`
- `/risorse/siti-web-ai-per-pmi-b2b`

Prima di aggiungerle, definisci intento di ricerca, angolo pagina e proof point unici per ciascuna, mantenendo l'angolo tech/AI del nuovo posizionamento invece di quello sulla lead generation.

## Piano Editoriale Blog — Cluster Keyword (2026)

Base: posizionamento "tecnico del marketing". Offerta di ingresso = tracciamento server-side; agenti/automazioni e siti web AI sono venduti **dopo**, allo stesso cliente. Ogni articolo TOFU/MOFU chiude con CTA verso `/tracciamento-server-side` (mai verso posizionamenti abbandonati come "AI Marketing Partner").

### Cluster

| Cluster | Tema | Funnel | Priorità |
|---|---|---|---|
| **A** | Tracciamento server-side (server-side tagging, Consent Mode v2, Conversions API, Enhanced Conversions, audit) | Entry offer | Massima |
| **B** | Modificatori geo (Reggio Emilia, Modena, Parma, Emilia Romagna) applicati ai termini core | — | Volume basso, intento locale altissimo — sempre applicare a A |
| **C** | Automazioni/CRM/WhatsApp (venduto dopo A) | MOFU/BOFU | Alta |
| **D** | Agenti AI (contenuti di autorità, non conversione diretta — non usare in pagine di offerta, solo blog) | TOFU | Media |
| **E** | Problema/dolore (perché Google Ads non traccia tutto, client-side vs server-side, ecc.) | TOFU | Apripista, alta |
| **F** | Competitor/comparativo (costo audit, costo server-side tagging) | BOFU | Alta |
| **G** | Siti web con AI (`/siti-web-ai`, mai in home sopra la fold) | TOFU/MOFU/BOFU | In corso |

### Roadmap articoli (22 totali) — stato

1. Perché Google Ads e Meta non tracciano più tutte le conversioni — E, TOFU — **✅ pubblicato** (`/blog/perche-google-ads-non-traccia-tutte-le-conversioni`)
2. Server-side tagging per PMI: cos'è e quanto costa — A, TOFU/MOFU — 🔧 bozza scritta, in revisione
3. Client-side vs server-side tagging: la differenza che cambia il ROAS — E, MOFU — 🔧 bozza scritta, in revisione
4. Consent Mode v2: guida pratica per chi fa ADV in Italia — A, MOFU
5. Conversions API Meta: come recuperare i segnali persi dai browser — A, MOFU (link caso Candiani)
6. Enhanced Conversions su Google Ads: setup e primi risultati attesi — A, MOFU (quick win KD7)
7. Quanto costa un audit di tracciamento — F, BOFU
8. Server-side tagging: quanto costa davvero (guida prezzi 2026) — F, BOFU
9. Caso studio: 1M+ segnali recuperati in 90 giorni (Candiani) — A, BOFU
10. Automazioni WhatsApp per PMI: messaggi → lead nel CRM — C, MOFU
11. WhatsApp Business API + CRM: guida per chi risponde a mano — C, TOFU/MOFU
12. Agenti AI per PMI: cosa ha senso automatizzare (e cosa no) — D, TOFU
13. Perché il tracciamento è il primo investimento tech, non l'ultimo — A/B, BOFU (pillar page candidata di `/tracciamento-server-side`, linka #2, #4-#9)
14. Chatbot WhatsApp per aziende: come funziona e quanto costa — C, MOFU/BOFU
15. Rispondere ai clienti su WhatsApp senza restare incollato al telefono — C, TOFU
16. GoHighLevel in Italia: cos'è e perché lo usiamo — C, TOFU
17. Agente AI o chatbot? La differenza che conta — D, TOFU
18. Cosa sono davvero gli agenti AI (senza hype) — D, TOFU
19. Automazione AI per piccole imprese: da dove iniziare (e da dove no) — D, TOFU
20. Quanto costa un sito web animato e curato nel 2026 (e perché è cambiato) — G, BOFU — Prezzo esplicito da 3.000€; angolo "cosa è cambiato" (225€/ora vs 70€/ora di mercato)
21. Sito fatto dall'AI o sito fatto con l'AI: non è la stessa cosa — G, TOFU/MOFU — articolo cardine del cluster: prompt generico (commodity) vs AI come moltiplicatore del lavoro tecnico (asset custom, direzione umana)
22. Caso studio: il sito di GP Meccatronica, dal brief alla pubblicazione (con prezzi) — G, BOFU — case study con prezzo reale, CTA verso `/siti-web-ai`

Articoli 1-3: scritti e verificati con le skill `blog`/`seo` (ricerca → scrittura → SEO-check → review 100 punti). Articolo 1 pubblicato (`published=true`); articolo 2 pronto come bozza (86/100); articolo 3 ancora in revisione. **Stato link incrociati (aggiornato dopo il de-link di sicurezza)**: l'articolo 1 al momento NON linka #2/#3 (rimossi temporaneamente perché non ancora live, per evitare link morti in produzione — vedi conversazione). Quando #2 e #3 saranno pubblicati, reinserire in #1 i link a `/blog/server-side-tagging-pmi` e `/blog/client-side-vs-server-side-tagging-differenza-roas`. **Prima di ogni audit SEO**: verificare lo stato reale dei link nel `content` di Supabase, non fidarsi solo di questa nota — può disallinearsi dal contenuto live.

**Vincolo cluster G**: prima degli articoli #20-22 va pubblicata la pagina `/siti-web-ai` (fatto, `SitesWebAI.tsx`). L'angolo "fatto dall'AI vs fatto con l'AI" va ripetuto in ogni contenuto del cluster, non solo nell'articolo #21.

**Nota cannibalizzazione — CRM/WhatsApp (cluster C)**: il tema "CRM con automazioni WhatsApp" non ha una pagina programmatica dedicata. L'intento si sovrappone a `/risorse/whatsapp-automation-lead-b2b` e `/risorse/crm-automation-meta-ads`. Si è scelto di rafforzare `whatsapp-automation-lead-b2b` invece di creare una terza pagina in competizione sulla stessa query. Gli articoli blog #10, #11, #14, #15, #16 (cluster C) toccano gli stessi intenti: linkarli a `whatsapp-automation-lead-b2b` come pagina di destinazione approfondita, non trattarli come alternative a quella pagina.
