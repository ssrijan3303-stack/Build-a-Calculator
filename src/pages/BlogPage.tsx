import React, { useState } from 'react';
import { BlogPost } from '../types';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  ArrowLeft,
} from 'lucide-react';

interface BlogPageProps {
  posts: BlogPost[];
  onOpenEnquiry: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, onOpenEnquiry }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (selectedPost) {
    return (
      <div className="pt-24 sm:pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <article className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold uppercase tracking-wider">
              {selectedPost.category}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(selectedPost.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedPost.read_time_minutes} min read</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{selectedPost.author_name}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            {selectedPost.title}
          </h1>

          <p className="text-base text-cyan-100 font-medium leading-relaxed pb-4 border-b border-slate-800">
            {selectedPost.excerpt}
          </p>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
            {selectedPost.content}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Topics:
            </span>
            {selectedPost.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <h3 className="text-xl font-bold text-white font-['Outfit']">Looking for Technical Guidance in Varanasi?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Discuss your architecture directly with author and founder Srijan Singh.
          </p>
          <button
            onClick={onOpenEnquiry}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            Get in Touch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Technical Insights & Engineering Notes
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          SrijanTech Engineering Journal
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          In-depth architectural analysis, UPI fintech integration patterns, and modern web
          practices curated by Srijan Singh in Varanasi.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold uppercase tracking-wider text-[10px]">
                  {post.category}
                </span>
                <span>•</span>
                <span>{post.read_time_minutes} min read</span>
                <span>•</span>
                <span>By {post.author_name}</span>
              </div>

              <h2 className="text-2xl font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                {new Date(post.published_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <button
                onClick={() => setSelectedPost(post)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
