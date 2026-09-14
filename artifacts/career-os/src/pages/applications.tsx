import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  X,
  Database,
} from 'lucide-react';
import { useEffect } from 'react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { applicationActivity, ApplicationItem } from '@/lib/mock/career-data';
import { useAuth } from '@/context/auth-context';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const stages = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'] as const;

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>(applicationActivity);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStage, setNewStage] = useState<ApplicationItem['status']>('Applied');
  const [newSalary, setNewSalary] = useState('');
  const [newNextAction, setNewNextAction] = useState('');

  // Sync from Supabase on mount
  useEffect(() => {
    if (isSupabaseConfigured && user) {
      supabase
        .from('applications')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setApplications(
              data.map((d) => ({
                id: d.id,
                company: d.company,
                role: d.role,
                status: d.status as ApplicationItem['status'],
                date: d.applied_date
                  ? new Date(d.applied_date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Recently',
                color:
                  d.status === 'Interview' || d.status === 'Offer'
                    ? 'teal'
                    : 'gold',
                location: d.location || 'Pune / Bengaluru / Remote',
                salary: d.salary || '₹60,000/mo',
                nextAction:
                  d.next_action || 'Follow up with recruiter in 5 business days',
                notes: d.notes || 'Tracked in IterateUP pipeline',
                applicationUrl: d.application_url || '#',
              }))
            );
          }
        });
    }
  }, [user]);

  const handleStatusChange = async (id: string, newStatus: ApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );

    if (isSupabaseConfigured && user) {
      await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const newItem: ApplicationItem = {
      id: `app-${Date.now()}`,
      company: newCompany.trim(),
      role: newRole.trim(),
      status: newStage,
      date: 'Today',
      color: newStage === 'Interview' ? 'teal' : newStage === 'Offer' ? 'teal' : 'gold',
      location: 'Pune / Bengaluru / Remote',
      salary: newSalary || '₹60,000/mo',
      nextAction: newNextAction || 'Follow up with recruiter in 5 business days',
      notes: 'Added from custom submission.',
      applicationUrl: 'https://careers.google.com',
    };

    if (isSupabaseConfigured && user) {
      const { data } = await supabase
        .from('applications')
        .insert({
          profile_id: user.id,
          company: newCompany.trim(),
          role: newRole.trim(),
          status: newStage,
          salary: newSalary || '₹60,000/mo',
          next_action: newNextAction || 'Follow up with recruiter in 5 business days',
          location: 'Pune / Bengaluru / Remote',
          applied_date: new Date().toISOString(),
          notes: 'Tracked via IterateUP pipeline',
        })
        .select()
        .maybeSingle();

      if (data) {
        newItem.id = data.id;
      }
    }

    setApplications([newItem, ...applications]);
    setNewCompany('');
    setNewRole('');
    setNewSalary('');
    setNewNextAction('');
    setShowAddModal(false);
  };

  const filteredApps = applications.filter((app) => {
    if (selectedStage === 'all') return true;
    return app.status.toLowerCase() === selectedStage.toLowerCase();
  });

  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const assessmentCount = applications.filter((a) => a.status === 'Assessment').length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;

  return (
    <ProductShell>
      <TopBar eyebrow="Pipeline manager" title="Application Tracker">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
        >
          <Plus size={14} /> Add application
        </button>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Pipeline Metrics Overview */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Total In Pipeline</p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">{applications.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Active tracked opportunities</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Submitted</p>
            <p className="mt-2 font-display text-3xl font-bold text-amber-500">{appliedCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting response</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Assessments (OA)</p>
            <p className="mt-2 font-display text-3xl font-bold text-indigo-500">{assessmentCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Coding screens to complete</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Interview Loops</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary">{interviewCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Pair programming & HR</p>
          </div>
        </section>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1">
            <span className="px-2 text-xs text-muted-foreground flex items-center gap-1">
              <Filter size={12} /> Stage:
            </span>
            {['all', ...stages].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStage(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                  selectedStage === st.toLowerCase() || (selectedStage === 'all' && st === 'all')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="font-mono-ui text-xs text-muted-foreground">
            Showing {filteredApps.length} entries
          </span>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary font-display text-lg font-bold text-primary shadow-inner">
                    {app.company.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
                        {app.role}
                      </h3>
                      <span className="font-mono-ui text-xs font-semibold text-muted-foreground">
                        @ {app.company}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-primary" /> {app.location}
                      </span>
                      <span>·</span>
                      <span className="font-mono-ui text-foreground font-medium">{app.salary}</span>
                      <span>·</span>
                      <span>Applied {app.date}</span>
                    </div>
                  </div>
                </div>

                {/* Stage selector dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value as ApplicationItem['status'])
                    }
                    className={`rounded-xl border px-3 py-1.5 font-mono-ui text-xs font-semibold focus:outline-none ${
                      app.status === 'Interview'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : app.status === 'Assessment'
                        ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : app.status === 'Offer'
                        ? 'border-primary/50 bg-primary/20 text-primary font-bold'
                        : 'border-border bg-background text-foreground'
                    }`}
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <a
                    href={app.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
                    title="Open application link"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Next Action & Notes */}
              <div className="mt-4 grid gap-3 rounded-xl border border-border bg-background p-3.5 sm:grid-cols-2 text-xs">
                <div>
                  <span className="font-mono-ui text-[9px] uppercase tracking-wider text-accent font-semibold">
                    Next Critical Action
                  </span>
                  <p className="mt-0.5 font-medium text-foreground">{app.nextAction}</p>
                  {app.nextActionDate && (
                    <p className="mt-1 flex items-center gap-1 font-mono-ui text-[11px] text-emerald-600 dark:text-emerald-400">
                      <Clock size={11} /> {app.nextActionDate}
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Notes & Interview Signals
                  </span>
                  <p className="mt-0.5 leading-relaxed text-muted-foreground">{app.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Application Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-5 top-5 rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>

              <h3 className="font-display text-xl font-bold">Track New Application</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Log a submitted or saved role into your IterateUP career pipeline.
              </p>

              <form onSubmit={handleAddApplication} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold">Company Name</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Cloudflare, Airbnb, Apple"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold">Role Title</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Software Engineering Intern"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold">Stage</label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as ApplicationItem['status'])}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                      {stages.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold">Hourly / Salary</label>
                    <input
                      type="text"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      placeholder="e.g. $55/hr"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold">Immediate Next Action</label>
                  <input
                    type="text"
                    value={newNextAction}
                    onChange={(e) => setNewNextAction(e.target.value)}
                    placeholder="e.g. Review STAR stories for phone screen"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"
                  >
                    Save to Pipeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}
