import React, { useState } from 'react';
import { Project } from '../types';
import {
  X,
  ExternalLink,
  Code,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ProjectImage } from './ProjectImage';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartSimilarProject: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onStartSimilarProject,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'overview' | 'features' | 'tech'>('preview');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-xs text-slate-400">Interactive Concept &amp; Live Demo</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Title Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                {project.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 block text-center">
                Est: ₹{project.estimated_cost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-800 overflow-x-auto">
            {(['preview', 'overview', 'features', 'tech'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-3.5 text-xs font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'preview' ? '🖥️ Live Website Preview' : tab === 'tech' ? 'Tech Stack & Architecture' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Browser Mockup Chrome */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
                {/* Browser URL Bar */}
                <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 max-w-md mx-auto bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
                    <span className="text-emerald-400">🔒</span>
                    <span className="text-slate-400">https://</span>
                    <span className="text-white font-medium">demo.srijantech.in</span>
                    <span className="text-cyan-400">/{project.slug}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    Live Concept
                  </span>
                </div>

                {/* Preview Image */}
                <div className="relative group/view bg-slate-950 overflow-hidden">
                  <ProjectImage
                    src={project.thumbnail_url}
                    alt={`${project.title} Preview`}
                    className="w-full h-auto max-h-[480px] object-cover object-top"
                    slug={project.slug}
                    category={project.category}
                    title={project.title}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>⚡ High-resolution desktop preview designed &amp; rendered by SrijanTech</span>
                <span className="text-cyan-400 font-medium">100% Production Ready Architecture</span>
              </div>
            </div>
          )}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Concept & Engineering Scope
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.detailed_case_study || project.description}
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Project Type:</span>
                  <p className="font-semibold text-white mt-0.5">{project.category}</p>
                </div>
                <div>
                  <span className="text-slate-400">Architecture:</span>
                  <p className="font-semibold text-white mt-0.5">Vite + React + PostgreSQL / UPI</p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Timeline:</span>
                  <p className="font-semibold text-white mt-0.5">2 - 4 Weeks</p>
                </div>
                <div>
                  <span className="text-slate-400">Approximate Budget:</span>
                  <p className="font-semibold text-cyan-400 mt-0.5">
                    ₹{project.estimated_cost.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                Key Engineered Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                Technologies Employed
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                Every solution at SrijanTech is delivered with clean TypeScript type safety,
                semantic modularity, relational database schemas, and seamless Indian UPI payment
                reconciliation.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Presented by <strong className="text-slate-300">SrijanTech Varanasi</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartSimilarProject(project.title);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
            >
              <span>Build a Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
