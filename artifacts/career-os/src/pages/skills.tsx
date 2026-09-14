import { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Link } from 'wouter';
import { ProductShell, TopBar } from '@/components/career-shell';
import { SkillGapItem } from '@/lib/mock/career-data';
import { useAuth } from '@/context/auth-context';
import {
  computeTailoredReadiness,
  generateTailoredSkillGaps,
  fetchStudentCustomSkills,
  saveStudentCustomSkill,
} from '@/lib/services/skills-readiness-engine';
import {
  getCachedEnrichedSignals,
  fetchAndEnrichStudentProfile,
  cleanGithubUsername,
  EnrichedSignalData,
} from '@/lib/services/profile-enricher';

export default function SkillsPage() {
  const { profile, updateProfile } = useAuth();

  // Selected benchmark role: 'primary' (user's target role) | 'swe' | 'fullstack' | 'data'
  const [selectedRole, setSelectedRole] = useState<'primary' | 'swe' | 'fullstack' | 'data'>('primary');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [customSkills, setCustomSkills] = useState<SkillGapItem[]>([]);
  const [isRefreshingSignals, setIsRefreshingSignals] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Cached or live GitHub signals
  const [enrichedData, setEnrichedData] = useState<EnrichedSignalData | null>(() => {
    const gh = profile?.github_username || 'ShubhamAlapure';
    return getCachedEnrichedSignals(gh);
  });

  // Load custom student skills from Supabase or local persistence
  useEffect(() => {
    if (profile?.id) {
      fetchStudentCustomSkills(profile.id).then((saved) => {
        if (saved && saved.length > 0) {
          setCustomSkills(saved);
        }
      });
    }
  }, [profile?.id]);

  // Handle manual re-sync with student's GitHub evidence
  const handleRefreshSignals = async () => {
    const gh = cleanGithubUsername(profile?.github_username || 'ShubhamAlapure');
    if (!gh) return;
    setIsRefreshingSignals(true);
    setRefreshMessage(null);
    try {
      const live = await fetchAndEnrichStudentProfile(gh, profile?.linkedin_url || '', profile?.target_role);
      setEnrichedData(live);
      setRefreshMessage(`Refreshed live evidence from @${gh} (${live.publicReposCount} repos)`);
      setTimeout(() => setRefreshMessage(null), 3500);
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setIsRefreshingSignals(false);
    }
  };

  // Determine active benchmark role string
  const activeBenchmarkRole = useMemo(() => {
    if (selectedRole === 'swe') return 'Software Development Engineer - Backend (SDE-1)';
    if (selectedRole === 'fullstack') return 'Full-Stack Engineer (React & Node/Go)';
    if (selectedRole === 'data') return 'Data & AI Systems Engineer';
    return profile?.target_role || 'Software Development Engineer (SDE-1)';
  }, [selectedRole, profile?.target_role]);

  // Compute 8-dimension readiness tailored to profile and active role
  const readinessResult = useMemo(() => {
    return computeTailoredReadiness(profile, enrichedData, activeBenchmarkRole);
  }, [profile, enrichedData, activeBenchmarkRole]);

  // Generate tailored skill gaps
  const gaps = useMemo(() => {
    return generateTailoredSkillGaps(profile, selectedRole === 'primary' ? 'swe' : selectedRole, customSkills);
  }, [profile, selectedRole, customSkills]);

  // Filter gaps by priority
  const filteredGaps = useMemo(() => {
    return gaps.filter((item) => {
      if (filterPriority === 'all') return true;
      return item.priority.toLowerCase() === filterPriority.toLowerCase();
    });
  }, [gaps, filterPriority]);

  // Add custom skill and persist to Supabase
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setIsAddingSkill(true);
    try {
      const added = await saveStudentCustomSkill(profile?.id || 'demo-student', {
        name: newSkillName.trim(),
        category: newSkillCategory,
        priority: 'Medium',
      });
      setCustomSkills((prev) => [added, ...prev]);
      setNewSkillName('');
      setShowAddModal(false);
    } catch (err) {
      console.warn('Failed to add custom skill:', err);
    } finally {
      setIsAddingSkill(false);
    }
  };

  const primaryRoleTitle = profile?.target_role || 'Product-minded Software Engineer';
  const shortPrimaryRole = primaryRoleTitle.split('(')[0]?.trim() || primaryRoleTitle;

  return (
    <ProductShell>
      <TopBar eyebrow="Intelligence engine" title="Skills & Readiness Breakdown">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshSignals}
            disabled={isRefreshingSignals}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:text-foreground focus-ring disabled:opacity-50"
            title="Re-sync signals from GitHub"
          >
            <RefreshCw size={13} className={isRefreshingSignals ? 'animate-spin text-primary' : ''} />
            <span className="hidden sm:inline">Re-sync signals</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
          >
            <Plus size={14} /> Add skill
          </button>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {refreshMessage && (
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs text-primary font-medium animate-fadeIn">
            <span className="flex items-center gap-2">
              <Sparkles size={14} /> {refreshMessage}
            </span>
            <button onClick={() => setRefreshMessage(null)} className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
        )}

        {/* Readiness Score Breakdown Header */}
        <section className="relative overflow-hidden rounded-2xl bg-[#1f3335] p-6 text-[#f7f3e9] shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9bd8b9]/30 bg-[#9bd8b9]/10 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-wider text-[#b4e4cc]">
                  <Sparkles size={11} /> Configurable Scoring Engine
                </span>
                {profile?.onboarding_completed && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] text-emerald-300">
                    <UserCheck size={11} /> Profile Tailored
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold tracking-tight">{readinessResult.overallScore}</span>
                <span className="font-mono-ui text-lg text-[#9bd8b9]">/ 100</span>
                <span className="rounded-full bg-[#9bd8b9]/15 px-2.5 py-0.5 font-mono-ui text-xs text-[#b4e4cc]">
                  {readinessResult.delta} this month
                </span>
              </div>
              <p className="mt-2 text-sm text-[#d5e1d9]">
                Target role benchmark:{' '}
                <span className="font-semibold text-white">{activeBenchmarkRole}</span>
              </p>
            </div>

            {/* Target Role Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
              <button
                onClick={() => setSelectedRole('primary')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  selectedRole === 'primary' ? 'bg-[#9bd8b9] text-[#1f3335]' : 'text-[#d5e1d9] hover:text-white'
                }`}
              >
                <Zap size={11} className={selectedRole === 'primary' ? 'text-[#1f3335]' : 'text-[#9bd8b9]'} />
                {shortPrimaryRole}
              </button>
              <button
                onClick={() => setSelectedRole('fullstack')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedRole === 'fullstack' ? 'bg-[#9bd8b9] text-[#1f3335]' : 'text-[#d5e1d9] hover:text-white'
                }`}
              >
                Full-Stack
              </button>
              <button
                onClick={() => setSelectedRole('swe')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedRole === 'swe' ? 'bg-[#9bd8b9] text-[#1f3335]' : 'text-[#d5e1d9] hover:text-white'
                }`}
              >
                Backend SDE
              </button>
              <button
                onClick={() => setSelectedRole('data')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedRole === 'data' ? 'bg-[#9bd8b9] text-[#1f3335]' : 'text-[#d5e1d9] hover:text-white'
                }`}
              >
                Data / AI
              </button>
            </div>
          </div>

          {/* 8 Categories Grid */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {readinessResult.categories.map((item) => (
              <div key={item.category} className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a9bebe] font-medium truncate pr-1">{item.category}</span>
                    <span className="font-mono-ui text-[10px] text-[#9bd8b9] shrink-0">{item.weight}</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">{item.score}%</span>
                    <span className="font-mono-ui text-[10px] text-[#9bd8b9]">{item.trend}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#9bd8b9]" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
                <p className="mt-2.5 truncate text-[10px] text-[#aebebe]" title={item.status}>
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Gap Analysis Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Target Requirement Delta</p>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">Identified Skill Gaps</h3>
              <p className="text-xs text-muted-foreground">
                Gaps are dynamically derived by contrasting your verified resume &amp; GitHub code evidence with current 2025–2026 {activeBenchmarkRole} postings.
              </p>
            </div>

            {/* Priority Filters */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1">
              <span className="px-2 text-xs text-muted-foreground flex items-center gap-1">
                <Filter size={12} /> Priority:
              </span>
              {['all', 'high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    filterPriority === p ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Gap Cards List */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredGaps.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.category}
                      </span>
                      <h4 className="mt-1 font-display text-lg font-bold text-foreground">{item.name}</h4>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono-ui text-[10px] font-bold shrink-0 ${
                        item.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : item.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  {/* Level & Gap Meter */}
                  <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-muted-foreground">Current: </span>
                        <strong className="text-foreground">{item.currentLevel}%</strong>
                      </div>
                      <div className="font-mono-ui font-semibold text-rose-500">
                        Δ Gap: {item.gap}%
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target: </span>
                        <strong className="text-foreground">{item.targetLevel}%</strong>
                      </div>
                    </div>
                    <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                      {/* Current level fill */}
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-primary"
                        style={{ width: `${item.currentLevel}%` }}
                      />
                      {/* Gap overlay */}
                      <div
                        className="absolute top-0 h-full bg-rose-400/40"
                        style={{ left: `${item.currentLevel}%`, width: `${item.gap}%` }}
                      />
                    </div>
                  </div>

                  {/* Evidence Found */}
                  <div className="mt-3">
                    <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Verified Evidence</p>
                    <ul className="mt-1 space-y-1">
                      {item.evidence.map((ev, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Action */}
                  <div className="mt-4 rounded-xl bg-accent/8 p-3 text-xs leading-relaxed text-foreground">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={14} className="mt-0.5 shrink-0 text-accent" />
                      <div>
                        <p className="font-semibold text-foreground">Action to close gap:</p>
                        <p className="mt-0.5 text-muted-foreground">{item.recommendedAction}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource CTA */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="truncate text-xs text-muted-foreground pr-2">{item.suggestedResource}</span>
                  <Link
                    href={item.resourceHref}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:text-accent"
                  >
                    Start learning <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Skill Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="font-display text-xl font-bold">Add Custom Skill</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter a technical or systems skill to benchmark against your career roadmap and save to Supabase.
              </p>
              <form onSubmit={handleAddSkill} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Skill Name</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. GraphQL, Kubernetes, Redis, Apache Kafka"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option>Frontend Engineering</option>
                    <option>Backend Engineering</option>
                    <option>Core Computer Science</option>
                    <option>Infrastructure & DevOps</option>
                    <option>Architecture & System Design</option>
                    <option>Data & AI Systems</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingSkill}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
                  >
                    {isAddingSkill ? 'Saving...' : 'Add to Skill Gap Map'}
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
