import { createClient } from '@supabase/supabase-js';
import { BlogPost } from '../types/blog';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

/**
 * Create a new blog post (requires authentication)
 */
export const createBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      category: post.category,
      date: post.date,
      read_time: post.readTime,
      author_name: post.author.name,
      author_image: post.author.image,
      published: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }

  return transformBlogPost(data);
};

/**
 * Update an existing blog post (requires authentication)
 */
export const updateBlogPost = async (
  slug: string,
  updates: Partial<Omit<BlogPost, 'id'>>
): Promise<BlogPost> => {
  const dbUpdates: Partial<BlogPostDB> = {};

  if (updates.title) dbUpdates.title = updates.title;
  if (updates.excerpt) dbUpdates.excerpt = updates.excerpt;
  if (updates.content) dbUpdates.content = updates.content;
  if (updates.coverImage) dbUpdates.cover_image = updates.coverImage;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.date) dbUpdates.date = updates.date;
  if (updates.readTime) dbUpdates.read_time = updates.readTime;
  if (updates.author?.name) dbUpdates.author_name = updates.author.name;
  if (updates.author?.image) dbUpdates.author_image = updates.author.image;

  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }

  return transformBlogPost(data);
};

/**
 * Delete a blog post (requires authentication)
 */
export const deleteBlogPost = async (slug: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};
