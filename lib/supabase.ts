import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '../types/blog';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholderConfiguration =
  supabaseUrl === 'https://placeholder.supabase.co' ||
  supabaseAnonKey === 'placeholder-key';

// Il repository include valori fittizi per far partire il progetto senza
// esporre credenziali. In quel caso il blog resta vuoto, ma non tenta una
// richiesta di rete destinata a fallire nel browser.
export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) && !isPlaceholderConfiguration;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  date: string;
  read_time: string;
  author_name: string;
  author_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Transform database record to BlogPost type
const transformBlogPost = (dbPost: BlogPostDB): BlogPost => ({
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
});

// ============================================
// Blog Posts API
// ============================================

/**
 * Fetch all published blog posts ordered by date (newest first)
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }

  return (data || []).map(transformBlogPost);
};

/**
 * Fetch a single blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Post not found
      return null;
    }
    console.error('Error fetching blog post:', error);
    throw error;
  }

  return data ? transformBlogPost(data) : null;
};

/**
 * Fetch blog posts by category
 */
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts by category:', error);
    throw error;
  }

  return (data || []).map(transformBlogPost);
};
