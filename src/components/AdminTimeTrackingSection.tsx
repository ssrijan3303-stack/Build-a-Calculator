import React, { useState, useEffect } from 'react';
import { Project, TimeEntry } from '../types';
import {
  getProjects,
  getTimeEntries,
  createTimeEntry,
  deleteTimeEntry,
  updateProjectProgress,
} from '../services/db';
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderGit2,
  Hourglass,
  Layers,
  Save,
  Activity,
  Filter,
} from 'lucide-react';

interface AdminTimeTrackingSectionProps {
  onShowToast: (msg: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'planning', label: 'Planning' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'waiting_for_client', label: 'Waiting for Client' },
  { value: 'completed', label: 'Completed' },
  { value: 'maintenance', label: 'Maintenance' },
];

export const AdminTimeTrackingSection: React.FC<AdminTimeTrackingSectionProps> = ({
  onShowToast,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');

  // Manual Time Entry Form States
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('13:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(210);
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [loggedBy, setLoggedBy] = useState<string>('Srijan Singh (Founder & Developer)');

  // Project Progress Quick Edit
  const [editStatus, setEditStatus] = useState<string>('development');
  const [editProgress, setEditProgress] = useState<number>(50);
  const [editExpectedCompletion, setEditExpectedCompletion] = useState<string>('');
  const [editWorkSummary, setEditWorkSummary] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const projs = await getProjects();
    const entries = await getTimeEntries();
    setProjects(projs);
    setTimeEntries(entries);
    if (projs.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projs[0].id);
      syncProjectEditState(projs[0]);
    }
  };

  const syncProjectEditState = (proj: Project) => {
    setEditStatus(proj.status || 'development');
    setEditProgress(proj.progress_percentage ?? 50);
    setEditExpectedCompletion(proj.expected_completion || proj.target_delivery_date || '');
    setEditWorkSummary(proj.work_summary || '');
  };

  const handleSelectProjectChange = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      syncProjectEditState(proj);
    }
  };

  // Auto-calculate duration when start or end time changes
  const calculateDuration = (start: string, end: string) => {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      let diff = endMin - startMin;
      if (diff < 0) diff += 24 * 60; // Crosses midnight
      return diff;
    } catch {
      return 60;
    }
  };

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    setDurationMinutes(calculateDuration(val, endTime));
  };

  const handleEndTimeChange = (val: string) => {
    setEndTime(val);
    setDurationMinutes(calculateDuration(startTime, val));
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    await updateProjectProgress(selectedProjectId, {
      status: editStatus as any,
      progress_percentage: Number(editProgress),
      expected_completion: editExpectedCompletion,
      work_summary: editWorkSummary,
    });

    onShowToast('Project progress & status updated successfully!');
    loadData();
  };

  const handleCreateTimeEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert('Please select a project');
      return;
    }
    if (!taskDescription.trim()) {
      alert('Please provide a work/task description');
      return;
    }

    const proj = projects.find((p) => p.id === selectedProjectId);
    const projectName = proj ? proj.title : 'Project Work';

    await createTimeEntry({
      project_id: selectedProjectId,
      project_name: projectName,
      customer_email: proj?.customer_email,
      date: entryDate,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: Number(durationMinutes) || 60,
      description: taskDescription.trim(),
      entry_type: 'manual', // Strictly manually entered
      logged_by: loggedBy.trim() || 'Srijan Singh (Founder)',
    });

    setTaskDescription('');
    onShowToast('Manual work time entry recorded successfully!');
    loadData();
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Delete this logged work entry?')) return;
    await deleteTimeEntry(id);
    onShowToast('Time entry deleted.');
    loadData();
  };

  const filteredEntries =
    filterProjectId === 'all'
      ? timeEntries
      : timeEntries.filter((t) => t.project_id === filterProjectId);

  const totalLoggedMinutes = filteredEntries.reduce(
    (acc, curr) => acc + (curr.duration_minutes || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Explicit Note Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3.5 text-xs text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold block font-['Outfit'] mb-0.5">
            Manual Time Tracking Policy:
          </strong>
          All project work entries are strictly manual logs. There are no automated fake timers.
          Customers can view their project’s verified logged hours, task descriptions, and
          milestones directly in their dashboard.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. PROJECT STATUS & PROGRESS CONTROLLER */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Update Project Status &amp; Progress
            </h3>
          </div>

          <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleSelectProjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Project Lifecycle Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 capitalize"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={editExpectedCompletion}
                  onChange={(e) => setEditExpectedCompletion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-slate-400 font-medium">Progress Percentage (%)</label>
                <span className="font-mono text-cyan-400 font-bold">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Current Work Summary &amp; Next Steps
              </label>
              <textarea
                rows={3}
                value={editWorkSummary}
                onChange={(e) => setEditWorkSummary(e.target.value)}
                placeholder="e.g., Completed database schema & UPI webhook integration. Currently implementing customer profile view."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Status &amp; Progress Updates</span>
            </button>
          </form>
        </div>

        {/* 2. MANUAL TIME ENTRY / LOG WORK FORM */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Log Manual Work / Time Entry
            </h3>
          </div>

          <form onSubmit={handleCreateTimeEntry} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Duration (Minutes)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-400 whitespace-nowrap text-[11px] font-mono">
                    ({Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Logged By</label>
                <input
                  type="text"
                  value={loggedBy}
                  onChange={(e) => setLoggedBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Work / Task Description
              </label>
              <textarea
                rows={3}
                required
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detail the modules coded, bugs squashed, test suites executed, or deployment tasks accomplished."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Manual Work Entry</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. LOGGED TIME ENTRIES TABLE */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Logged Work History &amp; Time Records
            </h3>
            <p className="text-xs text-slate-400">
              Total Recorded: <strong className="text-cyan-400 font-mono">{Math.floor(totalLoggedMinutes / 60)} hrs {totalLoggedMinutes % 60} mins</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterProjectId}
              onChange={(e) => setFilterProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-950/60 border border-slate-800">
            No logged work entries found for this project filter. Use the form above to record work.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Hours Window</th>
                  <th className="py-3 px-3 text-right">Duration</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-3">Logged By</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredEntries.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {t.project_name}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                      {t.start_time} – {t.end_time}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 font-bold text-right whitespace-nowrap">
                      {Math.floor(t.duration_minutes / 60)}h {t.duration_minutes % 60}m
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {t.description}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {t.logged_by}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteEntry(t.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
