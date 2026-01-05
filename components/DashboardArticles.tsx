import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plus, Edit2, Trash2, LogOut, FileText, Eye, EyeOff, Loader2 } from 'lucide-react';
import { getBlogPosts, deleteBlogPost, signOut, updateBlogPost } from '../lib/supabase';
import { BlogPost } from '../types/blog';

interface DashboardArticlesProps {
  onCreateNew: () => void;
  onEdit: (post: BlogPost) => void;
  onLogout: () => void;
}

const DashboardArticles: React.FC<DashboardArticlesProps> = ({
  onCreateNew,
  onEdit,
  onLogout,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Get ALL posts (including unpublished) for dashboard
      const allPosts = await getBlogPosts();
      setPosts(allPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Impossibile caricare gli articoli');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Sei sicuro di voler eliminare "${post.title}"?`)) return;

    try {
      setDeletingId(post.id);
      await deleteBlogPost(post.slug);
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (err: any) {
      console.error('Error deleting post:', err);
      alert('Errore durante l\'eliminazione dell\'articolo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      // Toggle published status
      await updateBlogPost(post.slug, {
        // This will need to be updated when we add published field to BlogPost type
      });
      await fetchPosts(); // Refresh list
    } catch (err: any) {
      console.error('Error toggling publish status:', err);
      alert('Errore durante l\'aggiornamento dello stato');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] text-white px-6 pt-24 pb-12"
    >
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Blog</h1>
            <p className="text-gray-400">Gestisci gli articoli del blog Q4 Studio</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Nuovo Articolo
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl font-semibold hover:border-red-500 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Esci
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400 text-lg">Caricamento articoli...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="max-w-md text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        {/* Articles List */}
        {!isLoading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <FileText className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg mb-2">Nessun articolo presente</p>
                <p className="text-gray-500 text-sm mb-6">
                  Inizia creando il tuo primo articolo
                </p>
                <button
                  onClick={onCreateNew}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Crea Articolo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-colors group"
                  >
                    {/* Cover Image Thumbnail */}
                    <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold truncate group-hover:text-indigo-300 transition-colors">
                          {post.title}
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(post.date).toLocaleDateString('it-IT')}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.author.name}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEdit(post)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-300"
                        title="Modifica"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={deletingId === post.id}
                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Elimina"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardArticles;
