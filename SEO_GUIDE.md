# SEO Guide - Q4 Studio

This project now uses a three-layer crawl structure for programmatic SEO.

## Crawl Structure

1. Homepage: `https://q4studio.it/`
2. Directory page: `https://q4studio.it/directory`
3. Programmatic SEO pages: `https://q4studio.it/seo/<slug>`

The footer contains the small directory link. The directory links to every SEO landing page, so Google can discover the full third layer from one crawl path.

## Programmatic Pages

All SEO landing pages are defined in `data/seoPages.ts`.

Each page includes:

- `slug`: clean URL segment
- `metaTitle`: title tag
- `description`: meta description and page intro
- `keyword`: primary search intent
- `audience`, `pain`, `solution`, `proof`: body sections
- `services`: service bullets
- `faqs`: visible FAQ content and FAQ schema

Rendered pages:

- `/seo/b2b-lead-generation-meta-ads`
- `/seo/meta-ads-b2b-verona`
- `/seo/agenti-ai-per-lead-generation`
- `/seo/crm-automation-meta-ads`
- `/seo/whatsapp-automation-lead-b2b`
- `/seo/algoritmo-andromeda-meta-b2b`

## Technical SEO

- `components/SEOHead.tsx` manages title, description, canonical, Open Graph, Twitter card and robots tags.
- `components/SeoDirectory.tsx` outputs an `ItemList` schema for the directory.
- `components/SeoLandingPage.tsx` outputs `Service` and `FAQPage` schema for each SEO page.
- `public/sitemap.xml` lists the homepage, directory and all programmatic SEO pages.
- `public/robots.txt` allows `/directory` and `/seo/`, while excluding dashboard/login routes.
- `vercel.json` rewrites `/directory` and `/seo/:slug` to the SPA entry so direct visits work in production.

## Current Limitation

The blog still uses hash routes (`/#blog` and `/#blog/<slug>`), so blog posts should not be treated as strong canonical SEO pages yet. If blog SEO becomes a priority, migrate blog routes to real paths (`/blog` and `/blog/<slug>`) and generate sitemap entries from Supabase.

## Maintenance Rules

- Add new SEO pages only in `data/seoPages.ts`.
- Add the same new page to `public/sitemap.xml`.
- Keep FAQ text visible on the page and aligned with JSON-LD.
- Use one primary intent per page. Do not create near-duplicate pages just to target small keyword variations.
- Keep canonical URLs on `https://q4studio.it`.

## Next SEO Expansion

Recommended next pages:

- `/seo/lead-generation-b2b-industriale`
- `/seo/meta-ads-per-consulenza-b2b`
- `/seo/automazioni-ai-per-sales-team`
- `/seo/conversion-api-meta-ads-b2b`
- `/seo/agenzia-lead-generation-verona`

Before adding them, define a unique search intent, page angle and proof point for each one.
