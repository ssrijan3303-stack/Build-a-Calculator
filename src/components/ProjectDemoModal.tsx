import React, { useState } from 'react';
import { Project } from '../types';
import {
  X,
  ExternalLink,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  Zap,
} from 'lucide-react';
import { ProjectImage } from './ProjectImage';

interface ProjectDemoModalProps {
  project: Project | null;
  onClose: () => void;
  onStartProject: (projectTitle: string) => void;
}

export const ProjectDemoModal: React.FC<ProjectDemoModalProps> = ({
  project,
  onClose,
  onStartProject,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isReloading, setIsReloading] = useState(false);
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'preview' | 'features' | 'tech'>('preview');

  if (!project) return null;

  const handleRefresh = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 400);
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[420px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-6xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-6xl mb-3 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-lg">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <span>← Back to Projects</span>
          </button>
          <div className="hidden sm:block h-4 w-[1px] bg-slate-800" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight">{project.title}</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              Live Demo
            </span>
          </div>
        </div>

        {/* Center: Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop 16:9 View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet 768px View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile 390px View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: CTA & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onStartProject(project.title);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Order This Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Browser Mockup Frame */}
      <div
        className={`w-full ${getContainerWidth()} bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col`}
      >
        {/* Browser Top Chrome / Address Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="text-white font-medium">demo.srijantech.in</span>
            <span className="text-cyan-400">/{project.slug}</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={handleRefresh}
              className={`p-1.5 hover:text-white transition-colors ${isReloading ? 'animate-spin' : ''}`}
              title="Reload Demo"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Sub-header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">{project.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-cyan-300 font-mono text-[11px]">
              Turnkey Production: ₹{project.estimated_cost.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveInteractiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeInteractiveTab === 'preview'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Visual
            </button>
            <button
              onClick={() => setActiveInteractiveTab('features')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeInteractiveTab === 'features'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Features &amp; Modules
            </button>
            <button
              onClick={() => setActiveInteractiveTab('tech')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeInteractiveTab === 'tech'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tech Architecture
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="relative bg-slate-950 overflow-y-auto max-h-[70vh] min-h-[400px]">
          {isReloading ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Loading live prototype view...</span>
            </div>
          ) : (
            <>
              {activeInteractiveTab === 'preview' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full relative shadow-inner">
                    <ProjectImage
                      src={project.thumbnail_url}
                      alt={`${project.title} Live Interface`}
                      className="w-full h-auto object-cover object-top block"
                      slug={project.slug}
                      category={project.category}
                      title={project.title}
                    />
                  </div>
                  {/* Floating Action Banner in Demo */}
                  <div className="w-full p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-white">Need this customized for your business brand?</div>
                      <div className="text-slate-400 text-[11px]">Includes domain setup, SSL, hosting, and UPI payment integration.</div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onStartProject(project.title);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
                    >
                      Get Quote for {project.title} →
                    </button>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'features' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                      Included Modules &amp; Business Capabilities
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      Every project built by SrijanTech is delivered as a turnkey, production-grade application engineered for Indian business conditions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-white block">{feat}</span>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            Integrated with real-time feedback, responsive UI, and backend state persistence.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Full Source Code &amp; Database Included</div>
                        <div className="text-[11px] text-slate-400">Complete ownership with zero vendor lock-in.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onStartProject(project.title);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                    >
                      Commission Similar Build
                    </button>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'tech' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                      Full-Stack Architecture &amp; Technology Stack
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {project.detailed_case_study || project.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                        <Code2 className="w-4 h-4" />
                        <span>Frontend</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">React 18 + TypeScript</div>
                      <div className="text-[11px] text-slate-400">Tailwind CSS, Motion UI, Lucide Icons</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                        <Layers className="w-4 h-4" />
                        <span>Database &amp; APIs</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">PostgreSQL / Supabase</div>
                      <div className="text-[11px] text-slate-400">IndexedDB local fallback + REST APIs</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <Zap className="w-4 h-4" />
                        <span>Payments &amp; Ops</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">UPI Instant Settlement</div>
                      <div className="text-[11px] text-slate-400">Dynamic QR locks &amp; WhatsApp Notifications</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Designed &amp; Developed by</span>
            <strong className="text-white">SrijanTech Varanasi</strong>
            <span className="text-cyan-400 font-medium">⚡ 100% Reliable Deployment</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onStartProject(project.title);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
            >
              Start Project Inquiry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
