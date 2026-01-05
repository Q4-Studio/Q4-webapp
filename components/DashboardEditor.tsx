import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { createBlogPost, updateBlogPost } from '../lib/supabase';
import { BlogPost } from '../types/blog';

interface DashboardEditorProps {
  post: BlogPost | null;
  onBack: () => void;
  onSave: () => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ post, onBack, onSave }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [category, setCategory] = useState(post?.category || 'Meta Advertising');
  const [readTime, setReadTime] = useState(post?.readTime || '5 min');
  const [authorName, setAuthorName] = useState(post?.author.name || 'Nicolò Pozzato');
  const [authorImage, setAuthorImage] = useState(post?.author.image || '/team/nicolo.jpg');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, post]);

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Il titolo è obbligatorio');
      return;
    }
    if (!slug.trim()) {
      setError('Lo slug è obbligatorio');
      return;
    }
    if (!excerpt.trim()) {
      setError('L\'estratto è obbligatorio');
      return;
    }
    if (!content.trim()) {
      setError('Il contenuto è obbligatorio');
      return;
    }
    if (!coverImage.trim()) {
      setError('L\'immagine di copertina è obbligatoria');
      return;
    }

    try {
      setIsSaving(true);

      const blogPostData = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        date: post?.date || new Date().toISOString().split('T')[0],
        readTime,
        author: {
          name: authorName,
          image: authorImage,
        },
      };

      if (post) {
        // Update existing post
        await updateBlogPost(slug, blogPostData);
      } else {
        // Create new post
        await createBlogPost(blogPostData as any);
      }

      onSave();
    } catch (err: any) {
      console.error('Error saving post:', err);
      setError(err.message || 'Errore durante il salvataggio dell\'articolo');
    } finally {
      setIsSaving(false);
    }
  };

  // Simple markdown renderer for preview
  const renderMarkdown = (md: string) => {
    return md
      .split('\n')
      .map((line) => {
        if (line.startsWith('# ')) {
          return `<h1 class="text-4xl font-bold mb-4 mt-8">${line.replace('# ', '')}</h1>`;
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-3xl font-bold mb-3 mt-6 text-indigo-300">${line.replace('## ', '')}</h2>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="text-2xl font-bold mb-2 mt-4 text-purple-300">${line.replace('### ', '')}</h3>`;
        }
        if (line.trim() === '') {
          return '<br/>';
        }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
        return `<p class="text-gray-300 leading-relaxed mb-3">${formatted}</p>`;
      })
      .join('');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#050505] text-white px-6 pt-24 pb-12"
    >
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={formRef} className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Torna alla lista
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">
              {post ? 'Modifica Articolo' : 'Nuovo Articolo'}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-all duration-300"
              >
                <Eye className="w-5 h-5" />
                {showPreview ? 'Modifica' : 'Anteprima'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salva
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}
            <div className="mb-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300">
                {category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{title || 'Titolo articolo'}</h1>
            <p className="text-xl text-gray-400 mb-8">{excerpt || 'Estratto articolo'}</p>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '*Contenuto vuoto*') }}
            />
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titolo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Inserisci il titolo dell'articolo"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug-articolo-esempio"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: yoursite.com/#blog/{slug || 'slug-articolo'}
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Meta Advertising">Meta Advertising</option>
                  <option value="AI Automation">AI Automation</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Case Study">Case Study</option>
                  <option value="Guide">Guide</option>
                </select>
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tempo di lettura *
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Autore *
                </label>
                <select
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    // Auto-set author image based on name
                    if (e.target.value === 'Nicolò Pozzato') setAuthorImage('/team/nicolo.jpg');
                    if (e.target.value === 'Sebastiano Zanardo') setAuthorImage('/team/sebastiano.jpg');
                    if (e.target.value === 'Lorenzo Bianchi') setAuthorImage('/team/lorenzo.jpg');
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Nicolò Pozzato">Nicolò Pozzato</option>
                  <option value="Sebastiano Zanardo">Sebastiano Zanardo</option>
                  <option value="Lorenzo Bianchi">Lorenzo Bianchi</option>
                </select>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Immagine Copertina (URL) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    title="Usa Unsplash o altra piattaforma per trovare immagini"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estratto *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descrizione dell'articolo (1-2 frasi)"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenuto (Markdown) *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`# Titolo principale\n\n## Sottotitolo\n\nTesto normale con **grassetto**.\n\n1. Lista ordinata\n2. Secondo elemento`}
                  rows={20}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supporto Markdown: # H1, ## H2, ### H3, **grassetto**
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEditor;
