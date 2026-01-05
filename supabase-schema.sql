-- ============================================
-- Q4 Studio Blog Database Schema
-- ============================================
--
-- Instructions:
-- 1. Go to your Supabase project: https://app.supabase.com
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to create the tables
-- ============================================

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_image TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

-- Create policy to allow authenticated users to manage all posts
-- You can customize this based on your authentication setup
CREATE POLICY "Allow authenticated users full access"
  ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on UPDATE
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Insert sample data (optional)
-- ============================================
-- This inserts the existing blog post from your code
-- You can remove this if you want to start with an empty database

INSERT INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  cover_image,
  category,
  date,
  read_time,
  author_name,
  author_image,
  published
) VALUES (
  'algoritmo-andromeda-meta-creativita-leva-competitiva',
  'Algoritmo Andromeda di Meta: la creatività come leva competitiva',
  'Nel nuovo scenario Ads guidato dall''algoritmo Andromeda, la creatività diventa la vera leva competitiva. Scopri come Meta ha rivoluzionato il targeting privilegiando la rilevanza contestuale.',
  '# Algoritmo Andromeda di Meta: la creatività come leva competitiva

Nel nuovo scenario Ads, guidato dall''algoritmo **Andromeda di Meta**, la creatività diventa la vera **leva competitiva**.

Andromeda, infatti, non privilegia più il targeting selettivo, ma premia la **rilevanza contestuale**, la **qualità del messaggio** e la **capacità di generare interazioni autentiche**.

## Come funziona Andromeda

Il sistema sfrutta l''**intelligenza artificiale** per combinare automaticamente centinaia di varianti creative — immagini, video e testo — adattandole dinamicamente ai **comportamenti** e agli **interessi dell''utente** in tempo reale.

In questo contesto, la creatività non è più solo estetica, ma un **elemento tattico di targeting**, in grado di "auto-selezionare" il pubblico più reattivo attraverso segnali di engagement.

## Cosa cambia per gli advertiser

1. **Focus sulla qualità creativa**: Non basta più targetizzare bene, serve creare contenuti che generano interazioni autentiche
2. **Test continui**: L''algoritmo premia chi testa multiple varianti creative
3. **Rilevanza contestuale**: Il messaggio giusto al momento giusto conta più del pubblico "perfetto"
4. **Performance-driven**: I segnali di engagement determinano chi vede le tue ads

## Il nostro approccio

In Q4 Studio, sfruttiamo Andromeda creando **decine di varianti creative** per ogni campagna, lasciando che sia l''algoritmo a identificare le combinazioni vincenti per ogni micro-segmento di pubblico.

Il risultato? **CPL più bassi** e **conversion rate più alti**, perché ogni utente vede esattamente il messaggio più rilevante per lui.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
  'Meta Advertising',
  '2025-01-04',
  '5 min',
  'Nicolò Pozzato',
  '/team/nicolo.jpg',
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Success message
-- ============================================
-- If you see this, your database schema has been created successfully!
-- Now update your .env.local file with your Supabase credentials.
