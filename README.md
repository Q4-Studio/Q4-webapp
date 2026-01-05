# Q4 Studio - Website

Sito web ufficiale di **Q4 Studio**, agenzia specializzata in Meta Advertising, AI Automation e Lead Generation.

## Stack Tecnologico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animazioni**: GSAP + ScrollTrigger
- **Backend**: Supabase (PostgreSQL)
- **Forms**: GoHighLevel webhook integration

## Setup Locale

### Prerequisiti
- Node.js 18+
- Account Supabase (per blog system)
- Account GoHighLevel (per contact form)

### Installazione

1. **Clona il repository**
   ```bash
   git clone [repository-url]
   cd "Web Q4"
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**

   Crea un file `.env.local` nella root del progetto:
   ```env
   # GoHighLevel Webhook per contact form
   VITE_WEBHOOK_URL=your_gohighlevel_webhook_url

   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **IMPORTANTE**: Usa la chiave `anon` di Supabase, NON la `service_role`!

4. **Setup Database Supabase**

   - Vai su [Supabase Dashboard](https://app.supabase.com)
   - Crea un nuovo progetto (o usa uno esistente)
   - Vai in SQL Editor
   - Copia e incolla il contenuto di `supabase-schema.sql`
   - Esegui lo script per creare le tabelle

5. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

   L'app sarà disponibile su `http://localhost:5173`

## Build per Produzione

```bash
npm run build
```

Il build ottimizzato sarà generato nella cartella `dist/`.

Per testare la build in locale:
```bash
npm run preview
```

## Struttura del Progetto

```
Web Q4/
├── components/         # Componenti React
├── lib/               # Utilities (Supabase client)
├── types/             # TypeScript types
├── public/            # Assets statici
├── App.tsx            # Main app con routing
└── index.tsx          # Entry point
```

Per dettagli completi sull'architettura, vedi [ARCHITECTURE.md](./ARCHITECTURE.md).

## Features

- **Homepage**: Hero animato, value proposition, servizi, team
- **Blog System**: Articoli dinamici da Supabase con markdown support
- **Contact Form**: Integrazione diretta con GoHighLevel
- **Custom Cursor**: Esperienza utente premium
- **Animazioni GSAP**: Scroll-triggered animations fluide
- **Responsive Design**: Mobile-first approach

## Gestione Blog

Gli articoli del blog sono gestiti tramite Supabase. Per aggiungere/modificare articoli:

1. Accedi al dashboard Supabase
2. Vai nella tabella `blog_posts`
3. Inserisci/modifica articoli
4. Il contenuto supporta Markdown

Le funzioni helper sono disponibili in `lib/supabase.ts`.

## Deploy

L'app può essere deployata su qualsiasi piattaforma di hosting statico:

- **Vercel** (consigliato)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

Ricorda di configurare le variabili d'ambiente sulla piattaforma di deploy.

## Team

- **Nicolò Pozzato** - Meta Advertising Specialist
- **Sebastiano Zanardo** - Tech Lead & Developer
- **Lorenzo Bianchi** - AI Automation Expert

## Documentazione

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentazione tecnica completa
- [supabase-schema.sql](./supabase-schema.sql) - Schema database

## License

© 2025 Q4 Studio. All rights reserved.
