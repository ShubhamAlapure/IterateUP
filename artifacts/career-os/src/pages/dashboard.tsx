import { useState, useMemo, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Flame,
  FolderGit2,
  Lightbulb,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { PageLink, ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  buildPersonalizedDashboard,
  loadCompletedDashboardActions,
  saveCompletedDashboardActions,
  DashboardNextAction,
  PersonalizedDashboardData,
} from '@/lib/services/dashboard-engine';
import { getCachedEnrichedSignals } from '@/lib/services/profile-enricher';
import { IndustryRubricModal } from '@/components/industry-rubric-modal';

function ReadinessCard({
  data,
  onOpenRubric,
}: {
  data: PersonalizedDashboardData;
  onOpenRubric: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1f3335] p-6 text-[#f7f3e9] shadow-[0_14px_34px_hsl(222_29%_17%/.12)] sm:p-7">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-[#9bd8b9]/8" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#a9dfc4]">
                Career readiness
              </p>
              <span className="rounded-full bg-[#9bd8b9]/15 px-2 py-0.5 font-mono-ui text-[9px] text-[#9bd8b9]">
                Industry Standard · SDE-1 Bar
              </span>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-6xl font-bold leading-none tracking-[-.08em]">
                {data.readinessScore}
              </span>
              <span className="mb-1 font-mono-ui text-sm text-[#9bd8b9]">/100</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full bg-[#9bd8b9]/12 px-2.5 py-1 font-mono-ui text-[10px] text-[#b4e4cc]">
              {data.delta}
            </span>
            <button
              onClick={onOpenRubric}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#9bd8b9]/20 px-3 py-1 text-[11px] font-bold text-[#9bd8b9] transition-all hover:bg-[#9bd8b9]/30 hover:scale-105 border border-[#9bd8b9]/30 shadow-sm"
              title="Inspect 5-pillar industry rubric and point breakdown"
            >
              <ShieldCheck size={13} /> Inspect Rubric
            </button>
          </div>
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#59c996] to-[#9bd8b9] transition-all duration-500"
            style={{ width: `${data.readinessScore}%` }}
          />
        </div>

        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#c5d2cc] font-medium">{data.readinessLabel}</span>
          <span className="text-[#9bd8b9] truncate max-w-sm">Next: {data.nextMilestone}</span>
        </div>

        {/* 5-Pillar Standard Quick Badges */}
        {data.rubricPillars && data.rubricPillars.length > 0 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-white/10">
            {data.rubricPillars.map((p) => (
              <button
                key={p.id}
                onClick={onOpenRubric}
                className="rounded-xl bg-white/[0.04] p-2 text-left transition-all hover:bg-white/[0.08] hover:border-[#9bd8b9]/40 border border-white/5 group"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono-ui text-[9px] text-[#a9dfc4] truncate group-hover:text-white">
                    {p.name.split('&')[0].trim()}
                  </span>
                  <span className="font-mono-ui text-[9px] font-bold text-[#9bd8b9]">
                    {p.score}/{p.maxScore}
                  </span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#9bd8b9]"
                    style={{ width: `${(p.score / p.maxScore) * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={16} className="text-[#df9a78] shrink-0" />
            <p className="text-xs leading-5 text-[#d5e1d9]">
              Targeting <strong className="font-semibold text-[#f7f3e9]">{data.targetRole}</strong>. Code evidence verified in <strong className="font-semibold text-[#9bd8b9]">@{data.githubUsername}</strong>.
            </p>
          </div>
          <button
            onClick={onOpenRubric}
            className="text-[11px] font-mono-ui text-[#9bd8b9] hover:underline shrink-0 hidden sm:block"
          >
            How rating is calculated →
          </button>
        </div>
      </div>
    </section>
  );
}

function ActionList({
  actions,
  profileId,
}: {
  actions: DashboardNextAction[];
  profileId: string;
}) {
  const [completed, setCompleted] = useState<string[]>(() => {
    return loadCompletedDashboardActions(profileId);
  });

  const [customActions, setCustomActions] = useState<DashboardNextAction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');

  const allActions = useMemo(() => {
    return [...actions, ...customActions];
  }, [actions, customActions]);

  const toggleAction = (id: string) => {
    const updated = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];
    setCompleted(updated);
    saveCompletedDashboardActions(profileId, updated);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    const newAct: DashboardNextAction = {
      id: `custom-act-${Date.now()}`,
      kind: 'Focus',
      title: newActionTitle.trim(),
      meta: 'Custom daily focus priority',
      href: '/roadmap',
      state: 'in-progress',
      signalSource: '🎯 Custom Action',
    };
    setCustomActions([newAct, ...customActions]);
    setNewActionTitle('');
    setShowAddModal(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
            Your next actions
          </p>
          <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
            Today, on purpose.
          </h2>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-1 font-mono-ui text-[10px] text-primary font-semibold">
          {completed.length} / {allActions.length} done
        </span>
      </div>

      <div className="mt-5 divide-y divide-border">
        {allActions.map((action) => {
          const done = completed.includes(action.id);

          return (
            <div
              key={action.id}
              className={`group flex gap-3 py-4 first:pt-0 last:pb-0 transition-opacity ${
                done ? 'opacity-55' : ''
              }`}
            >
              <button
                onClick={() => toggleAction(action.id)}
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                  done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
                aria-label={done ? `Mark ${action.title} incomplete` : `Mark ${action.title} complete`}
              >
                {done && <Check size={12} />}
              </button>

              <a href={action.href} className="min-w-0 flex-1 focus-ring">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono-ui text-[9px] uppercase tracking-[.12em] font-semibold ${
                      action.kind === 'Focus'
                        ? 'text-accent'
                        : action.kind === 'Practice'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {action.kind}
                  </span>
                  {action.state === 'in-progress' && !done && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                  {action.signalSource && (
                    <span className="hidden sm:inline font-mono-ui text-[9px] text-muted-foreground">
                      · {action.signalSource}
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-sm font-semibold leading-5 ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {action.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{action.meta}</p>
              </a>

              <ChevronRight
                size={16}
                className="mt-6 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus size={14} /> Add a focus for today
      </button>

      {/* Add Focus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Add Daily Focus Action</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAction} className="space-y-4 pt-1">
              <input
                type="text"
                value={newActionTitle}
                onChange={(e) => setNewActionTitle(e.target.value)}
                placeholder="e.g. Implement Redis rate limiter test in IterateUP"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                >
                  Add Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function SkillGaps({ data }: { data: PersonalizedDashboardData }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
            Signal map
          </p>
          <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
            Skills in motion
          </h2>
        </div>
        <PageLink href="/skills">View all</PageLink>
      </div>

      <div className="mt-6 space-y-5">
        {data.skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">{skill.name}</span>
              <span
                className={`font-mono-ui text-[10px] font-bold ${
                  skill.trend === 'focus'
                    ? 'text-accent'
                    : skill.trend === 'verified'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {skill.trend === 'focus' ? 'Focus next' : `${skill.score}%`}
              </span>
            </div>
            <div className="progress-track h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  skill.color === 'coral' ? 'progress-fill-warm bg-[#df9a78]' : 'progress-fill bg-primary'
                }`}
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-xl bg-accent/10 border border-accent/20 p-3.5">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
        <p className="text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">One useful gap:</strong>{' '}
          <span className="font-semibold text-foreground">{data.topSkillGap.skill}</span> –{' '}
          {data.topSkillGap.impact}
        </p>
      </div>
    </section>
  );
}

function RoadmapCard({ phases }: { phases: PersonalizedDashboardData['roadmapPhases'] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
            Your roadmap
          </p>
          <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
            The next three chapters.
          </h2>
        </div>
        <PageLink href="/roadmap">Open roadmap</PageLink>
      </div>

      <div className="mt-7 space-y-0">
        {phases.map((item, index) => (
          <div key={item.phase} className="relative flex gap-4 pb-7 last:pb-0">
            <div className="relative z-10 flex shrink-0 flex-col items-center">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border font-mono-ui text-[10px] font-bold ${
                  item.status === 'complete'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : item.status === 'current'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {item.status === 'complete' ? <Check size={13} /> : item.phase}
              </span>
              {index < phases.length - 1 && (
                <span
                  className={`absolute top-7 h-full w-px ${
                    item.status === 'complete' ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>

            <div className="pt-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${item.status === 'current' ? 'text-primary' : 'text-foreground'}`}>
                  {item.title}
                </p>
                {item.status === 'current' && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono-ui text-[8px] uppercase tracking-wider text-accent font-bold">
                    Now
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.detail}
              </p>
              {item.status === 'current' && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="font-mono-ui text-[10px] text-muted-foreground font-semibold">
                    {item.progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectAndJobs({
  projects,
  companies,
}: {
  projects: PersonalizedDashboardData['flagshipProjects'];
  companies: PersonalizedDashboardData['topCompanyMatches'];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
      {/* Flagship Projects Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
              Proof of work
            </p>
            <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
              Projects with a point of view.
            </h2>
          </div>
          <PageLink href="/projects">All projects</PageLink>
        </div>

        <div className="mt-6 space-y-3">
          {projects.map((project) => (
            <a
              href="/projects"
              key={project.id}
              className="group block rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono-ui text-[9px] uppercase tracking-[.12em] font-bold ${
                        project.color === 'coral' ? 'text-accent' : 'text-primary'
                      }`}
                    >
                      {project.tag}
                    </span>
                    {project.isLiveRepo && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.2 font-mono-ui text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Check size={9} /> Verified Repo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-bold text-foreground truncate">{project.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.detail}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {project.stars !== undefined && project.stars > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-mono-ui text-amber-500 mr-1">
                      <Star size={10} fill="currentColor" /> {project.stars}
                    </span>
                  )}
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      project.color === 'coral' ? 'bg-accent' : 'bg-primary'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="font-mono-ui text-[9px] text-muted-foreground font-semibold">
                  {project.progress}%
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="/projects"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus size={14} /> Add or link a project
        </a>
      </section>

      {/* Target Companies & Market Matches */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
              Market signal
            </p>
            <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
              Companies calibrated to your signal.
            </h2>
          </div>
          <PageLink href="/companies">Explore companies</PageLink>
        </div>

        <div className="mt-5 divide-y divide-border">
          {companies.map((comp) => (
            <a
              href="/companies"
              key={comp.id}
              className="group flex items-start gap-3 py-4 first:pt-0 last:pb-0 transition-colors"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary font-display text-sm font-bold text-primary shadow-inner">
                {comp.logoLetter}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{comp.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {comp.locations.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono-ui text-[11px] font-bold text-primary">
                    {comp.targetFitScore}% Match
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {comp.whyTarget}
                </p>
              </div>

              <ChevronRight
                size={15}
                className="mt-2 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function Activity({ applications }: { applications: PersonalizedDashboardData['applications'] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
            Application pulse
          </p>
          <h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">
            Keep the loop warm.
          </h2>
        </div>
        <PageLink href="/companies">Target list</PageLink>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {applications.map((item) => (
          <a
            href="/companies"
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-secondary"
          >
            <div
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                item.color === 'teal'
                  ? 'bg-primary'
                  : item.color === 'gold'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{item.company}</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.role}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono-ui text-[10px] font-bold text-primary">
                {item.fitScore}% Fit
              </p>
              <p className="mt-0.5 font-mono-ui text-[9px] text-muted-foreground">{item.status}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { profile, user, updateProfile } = useAuth();
  const username = profile?.github_username || 'ShubhamAlapure';
  const [showRubricModal, setShowRubricModal] = useState(false);

  // Retrieve cached or live enriched signals
  const enrichedSignals = useMemo(() => {
    return getCachedEnrichedSignals(username);
  }, [username]);

  // Aggregate all modules person-by-person in real time
  const dashboardData = useMemo(() => {
    return buildPersonalizedDashboard(profile, enrichedSignals);
  }, [profile, enrichedSignals]);

  // Ensure user's profile row in database stays strictly aligned with the standardized score
  useEffect(() => {
    if (profile?.id && profile.readiness_score !== dashboardData.readinessScore) {
      updateProfile({ readiness_score: dashboardData.readinessScore }).catch(() => {});
    }
  }, [profile?.id, profile?.readiness_score, dashboardData.readinessScore, updateProfile]);

  const firstName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : 'Shubham';

  const todayDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const profileId = profile?.id || 'demo-student';

  return (
    <ProductShell>
      <TopBar eyebrow={todayDateStr} title={`Good morning, ${firstName}.`}>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles size={13} />
            <span>Target: {dashboardData.targetRole}</span>
          </div>
          <button
            onClick={() => setShowRubricModal(true)}
            className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-primary sm:flex"
          >
            <ShieldCheck size={14} className="text-primary" /> Industry Rubric
          </button>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-5 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
          <ReadinessCard
            data={dashboardData}
            onOpenRubric={() => setShowRubricModal(true)}
          />
          <ActionList actions={dashboardData.todayActions} profileId={profileId} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SkillGaps data={dashboardData} />
          <RoadmapCard phases={dashboardData.roadmapPhases} />
        </div>

        <ProjectAndJobs
          projects={dashboardData.flagshipProjects}
          companies={dashboardData.topCompanyMatches}
        />

        <Activity applications={dashboardData.applications} />

        <div className="flex items-center justify-center gap-2 pb-5 pt-2 text-xs text-muted-foreground">
          <Flame size={14} className="text-accent" /> Keep showing up. Momentum is a skill.
        </div>
      </div>

      <IndustryRubricModal
        isOpen={showRubricModal}
        onClose={() => setShowRubricModal(false)}
        readinessScore={dashboardData.readinessScore}
        readinessLabel={dashboardData.readinessLabel}
        targetRole={dashboardData.targetRole}
        percentileRank={dashboardData.percentileRank}
        pillars={dashboardData.rubricPillars || []}
      />
    </ProductShell>
  );
}