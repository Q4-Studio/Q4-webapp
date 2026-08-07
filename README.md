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

   L'app sarà disponibile su `http://127.0.0.1:3000`.

### Anteprima privata delle bozze

L'anteprima è disponibile **solo con il server Vite di sviluppo**. Non è una
route React e non viene inclusa nella build di produzione. È strettamente in
sola lettura: non espone comandi o endpoint di scrittura. Creazione, modifica e
pubblicazione degli articoli vengono eseguite da Codex con operazioni
controllate lato server, usando la chiave segreta disponibile solo nella
sessione locale autorizzata.

1. Copia le variabili di esempio da `.env.example` nel file ignorato
   `.env.local`. Imposta `BLOG_PREVIEW_HOST` sull'origine HTTPS esatta esposta
   da Tailscale, per esempio `https://host.tailnet-name.ts.net`. Le variabili
   `SUPABASE_SECRET_KEY`, `BLOG_PREVIEW_KEY` e
   `BLOG_PREVIEW_SESSION_SECRET` devono restare senza prefisso `VITE_` e non
   devono essere configurate su Vercel.
2. Genera chiavi casuali locali:
   ```bash
   openssl rand -base64 24  # BLOG_PREVIEW_KEY
   openssl rand -base64 48  # BLOG_PREVIEW_SESSION_SECRET
   ```
3. Avvia il listener locale:
   ```bash
   npm run dev:blog-preview
   ```
4. In un secondo terminale, esponi il listener nel tailnet tramite HTTPS:
   ```bash
   tailscale serve --bg http://127.0.0.1:3000
   ```
5. Apri `<BLOG_PREVIEW_HOST>/__draft-preview/` e inserisci la chiave. Limita
   inoltre l'accesso al dispositivo e agli utenti necessari tramite ACL
   Tailscale.

Il cookie firmato dura 30 minuti, è `HttpOnly`, `Secure` e `SameSite=Strict`.
Le pagine hanno `no-store`, `noindex` e una CSP restrittiva. Cambiare
`BLOG_PREVIEW_HOST` richiede il riavvio di Vite. Il body del login è limitato a
4 KiB. Il rate limit usa `Tailscale-User-Login` soltanto quando la connessione
arriva dal proxy loopback di Tailscale Serve; il valore viene trasformato in un
digest e non viene registrato. Le richieste loopback senza quell'header
(incluse quelle da dispositivi Tailscale con tag) condividono volutamente un
unico bucket globale. Gli header di forwarding non sono mai considerati quando
il peer TCP non è loopback. Questo segue il comportamento documentato degli
[identity header di Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve#identity-headers).

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

Gli articoli risiedono nella tabella Supabase `blog_posts`, ma il sito non
espone una dashboard, un editor o API di scrittura. Per creare o modificare un
articolo, chiedi a Codex di eseguire l'operazione controllata lato server con la
chiave segreta locale. Il contenuto supporta Markdown.

Il flusso editoriale è:

1. Codex crea o aggiorna la riga mantenendo `published = false`.
2. La bozza viene verificata tramite l'anteprima privata in sola lettura.
3. Dopo approvazione esplicita, Codex imposta `published = true` lato server.
4. Si esegue build e deploy affinché HTML prerenderizzato e sitemap riflettano
   la nuova versione pubblica.

Il client browser in `lib/supabase.ts` espone esclusivamente letture dei post
pubblicati con la chiave anon. Per le bozze usa l'anteprima privata descritta
sopra; la chiave Supabase segreta resta nei processi server-side locali
autorizzati e non entra mai nel browser.

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
