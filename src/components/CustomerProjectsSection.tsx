import React, { useState, useEffect } from 'react';
import { Project, TimeEntry } from '../types';
import { getProjects, getTimeEntries } from '../services/db';
import {
  Layers,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderGit2,
  Hourglass,
  ChevronDown,
  ChevronUp,
  Activity,
  Tag,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface CustomerProjectsSectionProps {
  customerEmail: string;
  defaultView?: 'all' | 'progress' | 'time';
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inquiry: { label: 'Inquiry', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  enquiry: { label: 'Inquiry', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  discussion: { label: 'Discussion', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  planning: { label: 'Planning', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  design: { label: 'Design', color: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
  development: { label: 'Development', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  testing: { label: 'Testing', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  waiting_for_client: {
    label: 'Waiting for Client',
    color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  },
  completed: { label: 'Completed', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  maintenance: { label: 'Maintenance', color: 'bg-teal-500/15 text-teal-400 border-teal-500/30' },
  in_progress: { label: 'Development', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
};

export const CustomerProjectsSection: React.FC<CustomerProjectsSectionProps> = ({
  customerEmail,
  defaultView = 'all',
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [customerEmail]);

  const loadData = async () => {
    setLoading(true);
    const allProjects = await getProjects();
    const allTime = await getTimeEntries();

    // STRICT CUSTOMER DATA ISOLATION:
    // Only return projects belonging specifically to this customer!
    // Never fall back to another client's projects.
    const userProjects = allProjects.filter((p) => {
      if (p.customer_email && p.customer_email.toLowerCase() === customerEmail.toLowerCase()) {
        return true;
      }
      return false;
    });

    setProjects(userProjects);
    setTimeEntries(allTime);
    if (userProjects.length > 0) {
      setExpandedProjectId(userProjects[0].id);
    }
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading verified project data from database...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>
              {defaultView === 'progress'
                ? 'Project Milestones & Timeline'
                : defaultView === 'time'
                ? 'Work & Time Tracking Summary'
                : 'My Projects & Delivery Milestones'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updates, milestones, and manual engineering time entries verified by
            SrijanTech.
          </p>
        </div>
        <span className="text-xs text-cyan-400 font-mono">
          {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No data available yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            There are no active projects linked to <strong className="text-slate-200">{customerEmail}</strong>{' '}
            at this time. Once your project brief is approved or invoice advance is confirmed by Srijan
            Singh, your project schedule, milestones, and work logs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            const statusKey = proj.status || 'inquiry';
            const statusConfig = STATUS_LABELS[statusKey] || {
              label: String(statusKey).replace(/_/g, ' '),
              color: 'bg-slate-800 text-slate-300 border-slate-700',
            };

            const projTimeEntries = timeEntries.filter((t) => t.project_id === proj.id);
            const totalMinutes = projTimeEntries.reduce(
              (acc, curr) => acc + (curr.duration_minutes || 0),
              0
            );
            const totalHours = Math.floor(totalMinutes / 60);
            const remMinutes = totalMinutes % 60;

            const progress =
              proj.progress_percentage !== undefined
                ? proj.progress_percentage
                : proj.status === 'completed'
                ? 100
                : proj.status === 'testing'
                ? 85
                : proj.status === 'development'
                ? 60
                : proj.status === 'design'
                ? 35
                : 15;

            // Milestones from project or default roadmap
            const milestones =
              proj.milestones && proj.milestones.length > 0
                ? proj.milestones
                : [
                    { id: 'm1', title: '1. Architecture & Schema Design', status: 'completed' as const },
                    { id: 'm2', title: '2. UI/UX & Responsive Views', status: 'completed' as const },
                    {
                      id: 'm3',
                      title: '3. API, Payment & Business Logic',
                      status: (progress >= 60 ? 'completed' : 'in_progress') as 'completed' | 'in_progress',
                    },
                    {
                      id: 'm4',
                      title: '4. QA, Security Audit & Deployment',
                      status: (progress >= 90
                        ? 'completed'
                        : progress >= 60
                        ? 'in_progress'
                        : 'pending') as 'completed' | 'in_progress' | 'pending',
                    },
                  ];

            return (
              <div
                key={proj.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl transition-all"
              >
                {/* Project Header Bar */}
                <div
                  onClick={() => toggleExpand(proj.id)}
                  className="p-6 cursor-pointer hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-white font-['Outfit']">{proj.title}</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                        {proj.project_type || proj.category || 'Software Solution'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Progress preview */}
                    <div className="w-36 hidden sm:block">
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-400 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Total Logged Work Time */}
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Logged Work
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {totalHours}h {remMinutes}m
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800 space-y-6 bg-slate-950/40">
                    {/* Progress Bar & Schedule Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Start Date
                        </span>
                        <span className="text-white font-medium">
                          {proj.start_date || 'Project Initiated'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Expected Completion
                        </span>
                        <span className="text-white font-medium">
                          {proj.expected_completion || proj.target_delivery_date || 'Target Scheduled'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Last Updated
                        </span>
                        <span className="text-cyan-400 font-medium">
                          {proj.last_updated
                            ? new Date(proj.last_updated).toLocaleDateString('en-IN')
                            : 'Recently Updated'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Verified Work Duration
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {totalHours} hrs {remMinutes} mins ({projTimeEntries.length} entries)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Overall Milestone Execution</span>
                        <span className="text-cyan-400 font-mono font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones Roadmap */}
                    {(defaultView === 'all' || defaultView === 'progress') && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          <span>Project Milestones</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {milestones.map((ms, idx) => (
                            <div
                              key={ms.id || idx}
                              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                                ms.status === 'completed'
                                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                                  : ms.status === 'in_progress'
                                  ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  ms.status === 'completed'
                                    ? 'bg-emerald-400'
                                    : ms.status === 'in_progress'
                                    ? 'bg-cyan-400 animate-pulse'
                                    : 'bg-slate-600'
                                }`}
                              />
                              <span className="font-medium truncate">{ms.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work / Time Summary */}
                    {(defaultView === 'all' || defaultView === 'time') && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span>Logged Work &amp; Time Entries (Manual Log)</span>
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            Total:{' '}
                            <strong className="text-white">
                              {totalHours}h {remMinutes}m
                            </strong>
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>
                            Time entries are manually recorded by the engineering team for verified
                            development, testing, and deployment sessions. No automated fake timers.
                          </span>
                        </div>

                        {projTimeEntries.length === 0 ? (
                          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                            No time entries logged for this project yet.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase text-[10px]">
                                <tr>
                                  <th className="py-2.5 px-3">Date</th>
                                  <th className="py-2.5 px-3">Time Window</th>
                                  <th className="py-2.5 px-3 text-right">Duration</th>
                                  <th className="py-2.5 px-4">Task &amp; Work Description</th>
                                  <th className="py-2.5 px-3 text-right">Logged By</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                {projTimeEntries.map((t) => (
                                  <tr key={t.id} className="hover:bg-slate-900/40">
                                    <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                                      {t.date}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">
                                      {t.start_time} – {t.end_time}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold text-right whitespace-nowrap">
                                      {Math.floor(t.duration_minutes / 60)}h{' '}
                                      {t.duration_minutes % 60}m
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-200">{t.description}</td>
                                    <td className="py-2.5 px-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                                      {t.logged_by || 'SrijanTech Team'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
