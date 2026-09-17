import React, { useState } from 'react';
import { Project } from '../types';
import {
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Code2,
  Sparkles,
} from 'lucide-react';
import { ProjectImage } from '../components/ProjectImage';

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenDemo?: (project: Project) => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onSelectProject,
  onOpenDemo,
  onOpenEnquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleDemoClick = (project: Project) => {
    if (onOpenDemo) {
      onOpenDemo(project);
    } else {
      onSelectProject(project);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          Featured Concepts & Functional Demos
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Engineered Digital Prototypes
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore our demonstration architectures crafted to illustrate real-world functional capabilities—from
          retail POS &amp; school portals to high-converting e-commerce storefronts.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-cyan-950/30"
          >
            <div>
              {/* Large Realistic Website Screenshot / Preview */}
              <div
                onClick={() => handleDemoClick(project)}
                className="relative cursor-pointer overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/90 mb-5 group/img"
              >
                <div className="w-full aspect-[16/10] overflow-hidden bg-slate-950">
                  <ProjectImage
                    src={project.thumbnail_url}
                    alt={`${project.title} - Website Preview Screenshot`}
                    className="w-full h-full aspect-[16/10]"
                    slug={project.slug}
                    category={project.category}
                    title={project.title}
                  />
                </div>

                {/* Subtle Overlay Gradient & Pill on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                  <span className="text-[11px] font-bold text-cyan-300 bg-slate-900/90 border border-cyan-500/30 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    Interactive Prototype
                  </span>
                  <span className="text-[11px] font-semibold text-white bg-blue-600/90 px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm shadow-md">
                    <span>Open Live Demo</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Concept Label Pill */}
                <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-slate-700/80 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-300">
                  Live Concept
                </div>
              </div>

              {/* Category Badge & Cost */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Est: ₹{project.estimated_cost.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Title & Description */}
              <h3
                onClick={() => onSelectProject(project)}
                className="text-xl font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
              >
                {project.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Key Features */}
              <div className="space-y-1.5 mb-5">
                {project.features.slice(0, 2).map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Details & Bright Blue Live Demo → */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-5 gap-2">
              <button
                onClick={() => onSelectProject(project)}
                className="col-span-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => handleDemoClick(project)}
                className="col-span-3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Live Demo →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white font-['Outfit']">Have a Custom Project in Mind?</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          We turn unique business workflows into dependable digital products. Share your vision
          with Srijan Singh for a tailored roadmap and transparent quotation.
        </p>
        <button
          onClick={() => onOpenEnquiry()}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          Start Your Project Consultation
        </button>
      </div>
    </div>
  );
};
