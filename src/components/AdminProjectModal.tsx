import React, { useState, useEffect } from 'react';
import { Project, Customer, MilestoneItem, ProjectStatus } from '../types';
import { saveProject } from '../services/db';
import { X, FolderGit2, Plus, Trash2, CheckCircle2, Calendar, Clock, Layers, Sparkles } from 'lucide-react';

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  customers: Customer[];
  onProjectSaved: (saved: Project) => void;
  initialCustomerEmail?: string;
}

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
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

export const AdminProjectModal: React.FC<AdminProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  customers,
  onProjectSaved,
  initialCustomerEmail,
}) => {
  const [title, setTitle] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [category, setCategory] = useState('Full-Stack Web App');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(35000);
  const [status, setStatus] = useState<ProjectStatus>('development');
  const [progress, setProgress] = useState<number>(20);
  const [startDate, setStartDate] = useState('');
  const [expectedCompletion, setExpectedCompletion] = useState('');
  const [technologies, setTechnologies] = useState('React, TypeScript, Tailwind, Node.js');
  const [features, setFeatures] = useState('Real-Time Updates, UPI Instant Checkout, Admin Control');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);

  // New milestone draft
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setCustomerEmail(project.customer_email || '');
      setCustomerName(project.customer_name || '');
      setCategory(project.category || 'Full-Stack Web App');
      setDescription(project.description || '');
      setBudget(project.estimated_cost || 0);
      setStatus(project.status || 'development');
      setProgress(project.progress_percentage || 0);
      setStartDate(project.start_date || '');
      setExpectedCompletion(project.expected_completion || project.target_delivery_date || '');
      setTechnologies(project.technologies?.join(', ') || '');
      setFeatures(project.features?.join(', ') || '');
      setDemoUrl(project.demo_url || '');
      setNotes(project.notes || project.work_summary || '');
      setMilestones(project.milestones ? [...project.milestones] : []);
    } else {
      setTitle('');
      setCustomerEmail(initialCustomerEmail || '');
      const match = customers.find((c) => c.email.toLowerCase() === (initialCustomerEmail || '').toLowerCase());
      setCustomerName(match ? match.full_name : '');
      setCategory('Full-Stack Web App');
      setDescription('');
      setBudget(35000);
      setStatus('development');
      setProgress(15);
      setStartDate(new Date().toISOString().split('T')[0]);
      setExpectedCompletion(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setTechnologies('React, TypeScript, Tailwind, Node.js');
      setFeatures('Responsive UI, UPI Integration, Dashboard');
      setDemoUrl('');
      setNotes('');
      setMilestones([
        {
          id: `m-1`,
          title: 'Project Discovery & Architecture',
          description: 'Scope lock, wireframes, and tech stack approval',
          status: 'completed',
          completed_at: new Date().toISOString(),
        },
        {
          id: `m-2`,
          title: 'UI Design & Core Development',
          description: 'Frontend components and backend API services',
          status: 'in_progress',
          due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        },
        {
          id: `m-3`,
          title: 'Testing, Deployment & Client Handover',
          description: 'Final UAT testing, server deployment, and training',
          status: 'pending',
          due_date: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
        },
      ]);
    }
  }, [project, isOpen, initialCustomerEmail, customers]);

  if (!isOpen) return null;

  const handleCustomerSelect = (email: string) => {
    setCustomerEmail(email);
    const match = customers.find((c) => c.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (match) setCustomerName(match.full_name);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const newM: MilestoneItem = {
      id: `ms-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim() || undefined,
      status: 'pending',
      due_date: newMilestoneDueDate || undefined,
      created_at: new Date().toISOString(),
    };
    setMilestones([...milestones, newM]);
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setNewMilestoneDueDate('');
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus: MilestoneItem['status'] =
          m.status === 'pending' ? 'in_progress' : m.status === 'in_progress' ? 'completed' : 'pending';
        return {
          ...m,
          status: nextStatus,
          completed_at: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const matchCust = customers.find(
        (c) => c.email.toLowerCase().trim() === customerEmail.toLowerCase().trim()
      );

      const saved = await saveProject({
        id: project?.id,
        title: title.trim(),
        customer_id: matchCust?.id,
        customer_name: customerName.trim() || matchCust?.full_name,
        customer_email: customerEmail.trim() || undefined,
        category: category.trim(),
        description: description.trim(),
        detailed_case_study: description.trim(),
        estimated_cost: Number(budget),
        status,
        progress_percentage: Number(progress),
        start_date: startDate || undefined,
        expected_completion: expectedCompletion || undefined,
        target_delivery_date: expectedCompletion || undefined,
        technologies: technologies.split(',').map((s) => s.trim()).filter(Boolean),
        features: features.split(',').map((s) => s.trim()).filter(Boolean),
        demo_url: demoUrl.trim() || undefined,
        notes: notes.trim(),
        work_summary: notes.trim(),
        milestones,
      });

      onProjectSaved(saved);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {project ? 'Edit Project & Milestones' : 'Create New Project'}
              </h3>
              <p className="text-xs text-slate-400">Manage deliverables, budget, timelines, and progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto grow">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              {error}
            </div>
          )}

          {/* Title & Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ganga Ayurvedic ERP Portal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Assigned Customer</label>
              <select
                value={customerEmail}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Select Customer Account --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.email}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Full-Stack Web App">Full-Stack Web App</option>
                <option value="Mobile App (Android/iOS)">Mobile App (Android/iOS)</option>
                <option value="ERP & Business Automation">ERP &amp; Business Automation</option>
                <option value="E-Commerce Platform">E-Commerce Platform</option>
                <option value="Custom API & Microservices">Custom API &amp; Microservices</option>
                <option value="AI Integration & Logic">AI Integration &amp; Logic</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Project Budget (INR ₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Status & Progress Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Lifecycle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {PROJECT_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">Progress Percentage</label>
                <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Start Date & Expected Completion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Expected Completion</label>
              <input
                type="date"
                value={expectedCompletion}
                onChange={(e) => setExpectedCompletion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Project Scope &amp; Details</label>
            <textarea
              rows={2}
              placeholder="High-level description of client requirements and key goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Technologies & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Technologies (Comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind, Node.js"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Key Features (Comma separated)</label>
              <input
                type="text"
                placeholder="Responsive UI, UPI Integration, Dashboard"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Project Milestones ({milestones.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400">Click circle to toggle status</span>
            </div>

            {/* List */}
            <div className="space-y-2">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                        m.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : m.status === 'in_progress'
                          ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                          : 'border-slate-600 text-transparent hover:border-slate-400'
                      }`}
                      title={`Status: ${m.status}. Click to advance.`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div
                        className={`font-semibold ${
                          m.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {m.title}
                      </div>
                      {m.description && <div className="text-[11px] text-slate-400">{m.description}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.due_date && (
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {m.due_date}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : m.status === 'in_progress'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Milestone Sub-form */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="New milestone title..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Short description..."
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="date"
                  value={newMilestoneDueDate}
                  onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                  title="Add Milestone"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Internal Notes / Work Summary */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Work Summary / Internal Notes</label>
            <input
              type="text"
              placeholder="e.g. Next review call scheduled with client on Monday 11 AM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
