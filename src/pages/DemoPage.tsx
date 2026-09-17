import React, { useState } from 'react';
import { Project } from '../types';
import { ProjectImage } from '../components/ProjectImage';
import {
  Sparkles,
  ExternalLink,
  Play,
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface DemoPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenDemo: (project: Project) => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

const DEMO_CATEGORIES = [
  'All',
  'Websites',
  'Web Applications',
  'Mobile Apps',
  'AI Solutions',
  'Cybersecurity',
  'Other Digital Solutions',
] as const;

export const DemoPage: React.FC<DemoPageProps> = ({
  projects,
  onSelectProject,
  onOpenDemo,
  onOpenEnquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map or match project categories to demo categories
  const filteredProjects = projects.filter((project) => {
    // Search query match
    const matchesSearch =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.technologies &&
        project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;

    if (selectedCategory === 'Websites') {
      return (
        project.project_type?.toLowerCase().includes('website') ||
        project.category?.toLowerCase().includes('website') ||
        project.slug.includes('website')
      );
    }
    if (selectedCategory === 'Web Applications') {
      return (
        project.project_type?.toLowerCase().includes('app') ||
        project.project_type?.toLowerCase().includes('application') ||
        project.slug.includes('portal') ||
        project.slug.includes('school')
      );
    }
    if (selectedCategory === 'Mobile Apps') {
      return (
        project.project_type?.toLowerCase().includes('mobile') ||
        project.category?.toLowerCase().includes('mobile') ||
        project.slug.includes('mobile')
      );
    }
    if (selectedCategory === 'AI Solutions') {
      return (
        project.project_type?.toLowerCase().includes('ai') ||
        project.category?.toLowerCase().includes('ai') ||
        project.slug.includes('ai')
      );
    }
    if (selectedCategory === 'Cybersecurity') {
      return (
        project.project_type?.toLowerCase().includes('security') ||
        project.category?.toLowerCase().includes('cyber') ||
        project.slug.includes('security')
      );
    }
    if (selectedCategory === 'Other Digital Solutions') {
      return true;
    }

    return true;
  });

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Required Heading and Subheading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-semibold text-cyan-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Demonstrations</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Explore Our Demos
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          Experience our digital solutions through interactive demos and real project concepts.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {DEMO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or tech..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Demo Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
          <p className="text-slate-400 text-sm">
            No demos found matching the selected category or search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((proj) => {
            return (
              <div
                key={proj.id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div>
                  {/* Preview Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <ProjectImage
                      slug={proj.slug}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category Overlay */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-cyan-300">
                      {proj.category || 'Digital Solution'}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-cyan-400 transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>

                    {/* Technologies (Only if genuinely known) */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.technologies.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-cyan-300/90"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions: View Demo & View Details */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenDemo(proj)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>View Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectProject(proj)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all"
                  >
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Demo Assistance Callout */}
      <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white font-['Outfit']">
            Need a tailored concept built for your business?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            We build interactive prototypes and proof-of-concept solutions customized to your
            exact operational model.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenEnquiry('Custom Interactive Concept')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all shrink-0"
        >
          <span>Request Custom Concept</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
