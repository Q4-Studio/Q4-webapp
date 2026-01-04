import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../App';

gsap.registerPlugin(ScrollTrigger);

interface BlogProps {
  onArticleClick: (slug: string) => void;
}

const Blog: React.FC<BlogProps> = ({ onArticleClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-40 pb-32 px-6 bg-[#050505] text-white min-h-screen">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <span className="text-indigo-500 font-mono tracking-widest mb-6 block text-sm uppercase">
            Insights & Strategie
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Il nostro <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Guide pratiche, case study e strategie avanzate per scalare il tuo business con Meta Advertising e Automazioni AI.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className="group relative bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
              onClick={() => onArticleClick(post.slug)}
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30">
                  <span className="text-indigo-300 text-xs font-medium">{post.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=4f46e5&color=fff&size=64`;
                      }}
                    />
                    <span className="text-sm text-gray-500">{post.author.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                    <span>Leggi</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* Coming Soon Message (se ci sono pochi articoli) */}
        {blogPosts.length < 3 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Altri articoli in arrivo presto...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
