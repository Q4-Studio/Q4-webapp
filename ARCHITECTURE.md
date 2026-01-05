# Q4 Studio - Architettura Web App

> **Documentazione tecnica** per sviluppatori e AI assistants
> Ultimo aggiornamento: 2025-01-05

---

## Indice
1. [Stack Tecnologico](#stack-tecnologico)
2. [Struttura del Progetto](#struttura-del-progetto)
3. [Componenti Principali](#componenti-principali)
4. [Sistema di Blog](#sistema-di-blog)
5. [Routing](#routing)
6. [Variabili d'Ambiente](#variabili-dambiente)
7. [Build e Deploy](#build-e-deploy)

---

## Stack Tecnologico

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animazioni**: GSAP + ScrollTrigger
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + API REST)

### Dipendenze Principali
```json
{
  "react": "^18.3.1",
  "typescript": "^5.6.2",
  "vite": "^6.4.1",
  "tailwindcss": "^3.4.1",
  "gsap": "^3.12.7",
  "lucide-react": "^0.469.0",
  "@supabase/supabase-js": "^2.x"
}
```

---

## Struttura del Progetto

```
D:\-- MAIN\- Progetti\Q4\Web Q4\
├── components/              # Componenti React
│   ├── Hero.tsx            # Sezione hero homepage
│   ├── ValueProposition.tsx # Value prop con animazioni
│   ├── Services.tsx        # Griglia servizi
│   ├── Team.tsx            # Team members
│   ├── Marquee.tsx         # Marquee animato
│   ├── ContactForm.tsx     # Form contatti (GoHighLevel webhook)
│   ├── Footer.tsx          # Footer con social links
│   ├── CustomCursor.tsx    # Cursore personalizzato
│   ├── Blog.tsx            # Lista articoli blog
│   ├── BlogArticle.tsx     # Singolo articolo
│   ├── NotFound.tsx        # Pagina 404
│   └── MagneticButton.tsx  # Button con effetto magnetico
│
├── lib/
│   └── supabase.ts         # Client Supabase + API helpers
│
├── types/
│   ├── blog.ts             # TypeScript types per blog
│   └── types.ts            # Altri types globali
│
├── public/
│   ├── logo.png            # Logo Q4 Studio
│   └── team/               # Foto team members
│       ├── nicolo.jpg
│       ├── sebastiano.jpg
│       └── lorenzo.jpg
│
├── App.tsx                 # Main app con routing
├── index.tsx               # Entry point
├── index.css               # Global styles + Tailwind
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── .env.local              # Environment variables (non in git)
├── .gitignore              # Git ignore rules
├── supabase-schema.sql     # Database schema
└── package.json            # Dependencies
```

---

## Componenti Principali

### 1. App.tsx
**Responsabilità**: Routing e state management globale

**Features**:
- Hash-based routing (`#home`, `#blog`, `#blog/slug`)
- Fetch blog posts da Supabase al mount
- Gestione stati: `currentPage`, `blogPosts`, `isLoadingBlog`, `blogError`
- Navigation handler per cambio pagina

**Pages**:
- `home`: Homepage completa (Hero, Services, Team, Contact)
- `blog`: Lista articoli
- `blog-article`: Singolo articolo
- `dashq4login`: Login dashboard (mascherato per sicurezza)
- `dashboard`: Gestione articoli blog (richiede autenticazione)
- `404`: Not found

### 2. Hero.tsx
**Responsabilità**: Hero section con animazioni orbitali

**Features**:
- Animazioni GSAP per reveal
- Orbital system 3D con SVG
- CTA button magnetico
- Responsive design

### 3. Blog.tsx
**Responsabilità**: Lista articoli blog con card grid

**Props**:
```typescript
interface BlogProps {
  posts: BlogPost[];        // Array articoli da Supabase
  isLoading: boolean;       // Loading state
  error: string | null;     // Error message
  onArticleClick: (slug: string) => void;
}
```

**Stati UI**:
- Loading: Spinner con Loader2 icon
- Error: Messaggio errore con retry
- Empty: Nessun articolo disponibile
- Success: Grid 3 colonne con cards

### 4. BlogArticle.tsx
**Responsabilità**: Render singolo articolo

**Features**:
- Markdown renderer custom (H1, H2, H3, bold, liste)
- Cover image full-width
- Author info + meta (data, tempo lettura)
- Back to blog button
- CTA autore a fine articolo
- Auto-scroll to top al mount

### 5. ContactForm.tsx
**Responsabilità**: Form contatti con validazione

**Features**:
- Form fields: nome, email, messaggio
- Validazione lato client
- Submit a GoHighLevel webhook
- Success/error feedback
- GSAP animations

---

## Sistema di Blog

### Database: Supabase PostgreSQL

**Tabella**: `blog_posts`

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,       -- Markdown format
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL,     -- es: "5 min"
  author_name TEXT NOT NULL,
  author_image TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

**Indici**:
- `idx_blog_posts_slug` on `slug`
- `idx_blog_posts_date` on `date DESC`
- `idx_blog_posts_published` on `published`

**Row Level Security (RLS)**:
- Public read access: solo post con `published = true`
- Authenticated write access: gestione completa

### API Helper Functions (lib/supabase.ts)

```typescript
// Fetch tutti i post pubblicati
getBlogPosts(): Promise<BlogPost[]>

// Fetch singolo post by slug
getBlogPostBySlug(slug: string): Promise<BlogPost | null>

// Fetch per categoria
getBlogPostsByCategory(category: string): Promise<BlogPost[]>

// CRUD (require auth)
createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost>
updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost>
deleteBlogPost(slug: string): Promise<void>
```

### BlogPost Type

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;          // Markdown
  coverImage: string;       // URL
  category: string;
  date: string;             // ISO date
  readTime: string;         // "5 min"
  author: {
    name: string;
    image: string;          // Path or URL
  };
}
```

---

## Dashboard System

Sistema di gestione articoli per collaboratori. Permette a più utenti autenticati di creare, modificare ed eliminare articoli blog in autonomia.

### Architettura

**Route Mascherata**: `/#dashq4login` (non `/#admin` per evitare bot)

**Flow**:
```
1. Utente visita /#dashq4login
2. DashboardLogin → Form email/password
3. Login Success → Redirect a /#dashboard
4. Dashboard → DashboardArticles (lista) o DashboardEditor (CRUD)
5. Logout → Torna a /#dashq4login
```

### Componenti Dashboard

#### 1. DashboardLogin.tsx (/#dashq4login)
**Responsabilità**: Pagina di login mascherata

**Features**:
- Form email/password con validazione
- Toggle visibilità password
- Error handling con messaggi user-friendly
- Loading state durante autenticazione
- GSAP animations per UI fluida
- Design coerente con resto del sito

**Props**:
```typescript
interface DashboardLoginProps {
  onLoginSuccess: () => void;  // Callback per redirect a dashboard
}
```

#### 2. Dashboard.tsx (/#dashboard)
**Responsabilità**: Container con auth guard

**Features**:
- Verifica sessione Supabase al mount
- Auth listener per session changes
- Redirect automatico a login se non autenticato
- Loading state durante check auth
- Gestione view switching (list ↔ editor)

**Props**:
```typescript
interface DashboardProps {
  onLogout: () => void;  // Callback per logout
}
```

**Views**:
- `list`: Mostra DashboardArticles
- `create`: Mostra DashboardEditor vuoto
- `edit`: Mostra DashboardEditor con post esistente

#### 3. DashboardArticles.tsx
**Responsabilità**: Lista articoli con azioni CRUD

**Features**:
- Fetch TUTTI gli articoli (published e draft)
- Grid view con thumbnail cover image
- Azioni per ogni articolo:
  - ✏️ Modifica (apre editor)
  - 🗑️ Elimina (con conferma)
- Pulsante "Nuovo Articolo"
- Logout button
- Loading/error states
- Empty state quando nessun articolo

**Props**:
```typescript
interface DashboardArticlesProps {
  onCreateNew: () => void;
  onEdit: (post: BlogPost) => void;
  onLogout: () => void;
}
```

#### 4. DashboardEditor.tsx
**Responsabilità**: Editor markdown per articoli

**Features**:
- **Form completo** con tutti i campi:
  - Titolo
  - Slug (auto-generato da titolo)
  - Categoria (dropdown)
  - Estratto (textarea)
  - Contenuto (markdown editor)
  - Cover image URL
  - Tempo lettura
  - Autore (dropdown team)
- **Toggle Preview/Edit**: Anteprima live del markdown
- **Markdown Support**: H1, H2, H3, grassetto, liste
- **Auto-save slug**: Genera slug SEO-friendly da titolo
- **Auto-set author image**: Seleziona foto in base all'autore
- **Validazione**: Tutti i campi obbligatori
- **Error handling**: Messaggi chiari in caso di errore

**Props**:
```typescript
interface DashboardEditorProps {
  post: BlogPost | null;  // null = create, BlogPost = edit
  onBack: () => void;     // Torna a lista
  onSave: () => void;     // Callback dopo save success
}
```

### Autenticazione

**Sistema**: Supabase Auth con email/password

**Auth Helper Functions** (lib/supabase.ts):
```typescript
// Login
signIn(email: string, password: string): Promise<AuthData>

// Logout
signOut(): Promise<void>

// Get session corrente
getSession(): Promise<Session | null>

// Get utente corrente
getCurrentUser(): Promise<User | null>

// Listen auth changes
onAuthStateChange(callback: (session: Session) => void)
```

### Setup Autenticazione

**Step 1: Abilita Email Auth su Supabase**
1. Dashboard Supabase → Authentication → Providers
2. Abilita "Email" provider
3. Disabilita "Confirm email" (per testing)

**Step 2: Crea Utenti per Collaboratori**
1. Dashboard Supabase → Authentication → Users
2. Click "Invite user" o "Add user"
3. Inserisci email collaboratore
4. Setta password temporanea
5. Invia credenziali al collaboratore

**Step 3: Collaboratori Accedono**
1. Visita `yoursite.com/#dashq4login`
2. Login con email/password fornite
3. Accesso a dashboard completo

### Security

**Row Level Security (RLS)**:
```sql
-- Policy read: pubblico può leggere articoli pubblicati
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Policy write: solo autenticati possono scrivere
CREATE POLICY "Allow authenticated users full access"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');
```

**Best Practices**:
- ✅ Route login mascherata (`dashq4login` non `admin`)
- ✅ Session persistente con Supabase Auth
- ✅ RLS policies per proteggere DB
- ✅ Solo chiave `anon` nel browser (mai `service_role`)
- ✅ Redirect automatico se non autenticato
- ✅ Logout sicuro con cleanup session

### Workflow Creazione Articolo

```
1. Utente fa login su /#dashq4login
2. Redirect automatico a /#dashboard
3. Click "Nuovo Articolo"
4. Compila form editor:
   - Scrive titolo → Slug auto-generato
   - Seleziona categoria
   - Scrive estratto
   - Scrive contenuto in markdown
   - Inserisce URL cover image
   - Seleziona autore → Immagine auto-settata
5. Click "Anteprima" per vedere rendering
6. Click "Salva" → Validazione
7. Se OK → Salvataggio su Supabase
8. Redirect a lista articoli
9. Articolo appare sul blog pubblico immediatamente
```

---

## Routing

### Sistema Hash-Based

**Routes**:
```
/                           → Homepage
/#blog                      → Lista blog
/#blog/:slug                → Articolo singolo
/#404                       → Not found
```

**Implementazione** (App.tsx):

```typescript
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith('blog/')) {
      const slug = hash.replace('blog/', '');
      const post = getBlogPostBySlug(slug);

      if (post) {
        setCurrentPage('blog-article');
      } else if (!isLoadingBlog) {
        setCurrentPage('404');
      }
    }
    // ... altri casi
  };

  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, [blogPosts, isLoadingBlog]);
```

**Note**:
- Il routing si ri-esegue quando cambiano `blogPosts` o `isLoadingBlog`
- Questo previene 404 falsi durante il caricamento iniziale
- Direct links funzionano correttamente dopo il fetch

---

## Variabili d'Ambiente

**File**: `.env.local` (NON committato su git)

```env
# GoHighLevel Webhook per contact form
VITE_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...

# Supabase Configuration
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # ANON key, non service_role!
```

**Accesso in codice**:
```typescript
const url = import.meta.env.VITE_WEBHOOK_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

**Sicurezza**:
- `.env.local` è escluso da git tramite `*.local` in `.gitignore`
- Usa sempre `VITE_SUPABASE_ANON_KEY` (non service_role) nel browser
- Le chiavi service_role NON possono essere usate client-side

---

## Build e Deploy

### Development
```bash
npm install
npm run dev
```
- Server: http://localhost:5173
- Hot Module Replacement attivo

### Production Build
```bash
npm run build
```
- Output: `dist/` directory
- Ottimizzazione automatica + tree-shaking
- Minificazione CSS/JS

### Preview Build
```bash
npm run preview
```
- Test della build di produzione localmente

### Deploy
La cartella `dist/` può essere deployata su:
- Vercel
- Netlify
- Cloudflare Pages
- Qualsiasi hosting statico

**Configurazione variabili d'ambiente**:
- Su piattaforma di deploy, configura le stesse variabili di `.env.local`
- Assicurati che siano prefissate con `VITE_`

---

## Patterns e Best Practices

### Animazioni GSAP
- Sempre wrappare in `gsap.context()` per cleanup
- Usare `ScrollTrigger` per animations on scroll
- Cleanup nei `return` degli `useEffect`

```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(ref.current, { ... });
  }, containerRef);

  return () => ctx.revert();
}, []);
```

### State Management
- State locale nei componenti
- Props drilling per comunicazione parent-child
- No Redux/Zustand (app semplice, non necessario)

### TypeScript
- Strict mode enabled
- Definire interfaces per props e data types
- Evitare `any`, usare `unknown` se necessario

### Styling
- Tailwind utility-first
- Custom classes per animazioni complesse
- Responsive design mobile-first

### Performance
- Lazy loading non implementato (bundle piccolo)
- Immagini ottimizzate manualmente
- GSAP tree-shaken automaticamente

---

## Troubleshooting Comuni

### 1. Blog posts non si caricano
- ✅ Verifica `.env.local` con chiavi corrette
- ✅ Controlla che `VITE_SUPABASE_ANON_KEY` sia la chiave `anon`, non `service_role`
- ✅ Verifica RLS policies su Supabase
- ✅ Controlla console browser per errori

### 2. 404 su articoli esistenti
- ✅ Verifica che l'useEffect del routing abbia `[blogPosts, isLoadingBlog]` come dipendenze
- ✅ Controlla che lo slug nel DB corrisponda all'URL
- ✅ Verifica che `published = true` nel DB

### 3. Form non invia
- ✅ Verifica `VITE_WEBHOOK_URL` in `.env.local`
- ✅ Controlla Network tab per response del webhook
- ✅ Testa il webhook URL con Postman/curl

### 4. Animazioni non funzionano
- ✅ Verifica import di GSAP e plugin
- ✅ Controlla che `gsap.registerPlugin(ScrollTrigger)` sia chiamato
- ✅ Verifica ref nei componenti

---

## Prossimi Sviluppi

### Features Pianificate
- [ ] Sistema di cache per blog posts (React Query)
- [ ] Paginazione blog (se > 20 articoli)
- [ ] Filtri per categoria
- [ ] Search bar per articoli
- [ ] Admin panel per gestione blog
- [ ] Preview mode per bozze
- [ ] Newsletter signup
- [ ] Analytics integration

### Ottimizzazioni
- [ ] Image lazy loading
- [ ] Code splitting per routes
- [ ] Service Worker per offline
- [ ] SEO meta tags dinamici

---

## Contatti e Supporto

**Team Q4 Studio**:
- Nicolò Pozzato - Meta Advertising
- Sebastiano Zanardo - Tech & Development
- Lorenzo Bianchi - AI Automation

**Repository**: [Link al repo quando disponibile]

---

*Questa documentazione deve essere aggiornata ad ogni modifica significativa dell'architettura.*
