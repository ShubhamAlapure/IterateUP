import { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Bot,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  FileCheck,
  Filter,
  GitBranch,
  Github,
  GraduationCap,
  Layers,
  Lightbulb,
  Linkedin,
  MessageSquare,
  Plus,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Target,
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
  auditCandidateSkillsWithAI,
  EnhancedSkillGapItem,
  StructuredEvidence,
} from '@/lib/services/skills-readiness-engine';
import {
  getCachedEnrichedSignals,
  fetchAndEnrichStudentProfile,
  cleanGithubUsername,
  EnrichedSignalData,
} from '@/lib/services/profile-enricher';

export default function SkillsPage() {
  const { profile, updateProfile } = useAuth();

  // Selected benchmark role: 'primary' (student's saved target role) | 'swe' | 'fullstack' | 'data'
  const [selectedRole, setSelectedRole] = useState<'primary' | 'swe' | 'fullstack' | 'data'>('primary');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isAuditingAI, setIsAuditingAI] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [customSkills, setCustomSkills] = useState<SkillGapItem[]>([]);
  const [isRefreshingSignals, setIsRefreshingSignals] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Cached or live GitHub and LinkedIn signals
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

  // Handle manual re-sync with student's GitHub & LinkedIn evidence
  const handleRefreshSignals = async () => {
    const gh = cleanGithubUsername(profile?.github_username || 'ShubhamAlapure');
    if (!gh) return;
    setIsRefreshingSignals(true);
    setRefreshMessage(null);
    try {
      const live = await fetchAndEnrichStudentProfile(gh, profile?.linkedin_url || '', profile?.target_role);
      setEnrichedData(live);
      setRefreshMessage(`Synced deep signals from GitHub @${gh} & LinkedIn in/${live.linkedinHandle || 'profile'}`);
      setTimeout(() => setRefreshMessage(null), 4000);
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setIsRefreshingSignals(false);
    }
  };

  // Determine active benchmark role string strictly from student's profile or selector
  const studentTargetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';

  const activeBenchmarkRole = useMemo(() => {
    if (selectedRole === 'swe') return 'Software Development Engineer - Backend (SDE-1)';
    if (selectedRole === 'fullstack') return 'Full-Stack Engineer (React & Node/Go)';
    if (selectedRole === 'data') return 'Data & AI Systems Engineer';
    return studentTargetRole;
  }, [selectedRole, studentTargetRole]);

  // Compute 8-dimension readiness tailored to profile and active role
  const readinessResult = useMemo(() => {
    return computeTailoredReadiness(profile, enrichedData, activeBenchmarkRole);
  }, [profile, enrichedData, activeBenchmarkRole]);

  // Generate tailored skill gaps deeply evaluating GitHub and LinkedIn
  const gaps: EnhancedSkillGapItem[] = useMemo(() => {
    return generateTailoredSkillGaps(profile, activeBenchmarkRole, customSkills, enrichedData);
  }, [profile, activeBenchmarkRole, customSkills, enrichedData]);

  // Filter gaps by priority
  const filteredGaps = useMemo(() => {
    return gaps.filter((item) => {
      if (filterPriority === 'all') return true;
      return item.priority.toLowerCase() === filterPriority.toLowerCase();
    });
  }, [gaps, filterPriority]);

  // Run AI Candidate Deep Audit using Groq LPU
  const handleRunAiAudit = async () => {
    setShowAuditModal(true);
    setIsAuditingAI(true);
    try {
      const result = await auditCandidateSkillsWithAI(profile, activeBenchmarkRole, enrichedData);
      setAiAuditResult(result);
    } catch (err) {
      console.warn('AI audit error:', err);
    } finally {
      setIsAuditingAI(false);
    }
  };

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

  const shortPrimaryRole = studentTargetRole.split('(')[0]?.trim() || studentTargetRole;
  const ghHandle = profile?.github_username || 'ShubhamAlapure';
  const liHandle = enrichedData?.linkedinHandle || (profile?.linkedin_url ? cleanGithubUsername(profile.linkedin_url) : 'shubham-alapure');

  return (
    <ProductShell>
      <TopBar eyebrow="Intelligence engine" title="Skills & Readiness Breakdown">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAudit}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary shadow-sm transition-all hover:bg-primary/20 focus-ring"
            title="Deep Candidate Evaluation powered by Groq LPU AI"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden sm:inline">AI Deep Audit</span>
          </button>
          <button
            onClick={handleRefreshSignals}
            disabled={isRefreshingSignals}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:text-foreground focus-ring disabled:opacity-50"
            title="Re-sync GitHub & LinkedIn signals"
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
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] text-emerald-300">
                  <UserCheck size={11} /> Target Role Tailored
                </span>
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
                <span className="font-semibold text-white underline decoration-[#9bd8b9]/40 underline-offset-4">
                  {activeBenchmarkRole}
                </span>
              </p>
            </div>

            {/* Target Role Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
              <button
                onClick={() => setSelectedRole('primary')}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  selectedRole === 'primary' ? 'bg-[#9bd8b9] text-[#1f3335] shadow-sm' : 'text-[#d5e1d9] hover:text-white'
                }`}
                title={`Your saved goal: ${studentTargetRole}`}
              >
                <Target size={12} className={selectedRole === 'primary' ? 'text-[#1f3335]' : 'text-[#9bd8b9]'} />
                Your Goal: {shortPrimaryRole}
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

        {/* Deep Signal Evidence Banner */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                Deep Evidence Engine Active
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Live Synced
                </span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Analyzing GitHub repositories (<strong className="text-foreground">@{ghHandle}</strong>) and LinkedIn profile (<strong className="text-foreground">in/{liHandle}</strong>) across Projects, Endorsed Skills, Certifications, and Posts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunAiAudit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              <Bot size={14} /> Run Deep Groq AI Audit
            </button>
          </div>
        </div>

        {/* Skill Gap Analysis Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Target Requirement Delta</p>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">Identified Skill Gaps</h3>
              <p className="text-xs text-muted-foreground">
                Gaps are derived by deeply analyzing your verified GitHub code and LinkedIn profile evidence against current 2025–2026 <strong className="text-foreground font-semibold">{activeBenchmarkRole}</strong> hiring criteria.
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

                  {/* Deep Structured Evidence Section */}
                  <div className="mt-4 space-y-2">
                    <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                      <FileCheck size={11} className="text-primary" /> Verified Cross-Platform Evidence
                    </p>
                    <div className="space-y-1.5">
                      {(item.structuredEvidence || []).slice(0, 4).map((ev: StructuredEvidence, i: number) => {
                        const isGithub = ev.sourceType === 'github';
                        const isProject = ev.sourceType === 'linkedin_project';
                        const isCert = ev.sourceType === 'linkedin_cert';
                        const isPost = ev.sourceType === 'linkedin_post';
                        const isSkill = ev.sourceType === 'linkedin_skill';

                        return (
                          <div
                            key={i}
                            className="rounded-xl border border-border/80 bg-background/70 p-2.5 text-xs leading-relaxed"
                          >
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                              {isGithub && <Github size={12} className="text-primary shrink-0" />}
                              {isProject && <Briefcase size={12} className="text-blue-500 shrink-0" />}
                              {isCert && <GraduationCap size={12} className="text-emerald-500 shrink-0" />}
                              {isPost && <Share2 size={12} className="text-purple-500 shrink-0" />}
                              {isSkill && <CheckCircle2 size={12} className="text-teal-500 shrink-0" />}
                              <span className="truncate text-[11px] text-muted-foreground">{ev.sourceLabel}</span>
                            </div>
                            <p className="mt-1 text-xs text-foreground/90 pl-4">{ev.detail}</p>
                          </div>
                        );
                      })}
                    </div>
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

        {/* Deep AI Audit Modal */}
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-bold text-primary flex items-center gap-1">
                      <Cpu size={11} /> Groq LPU Powered (gpt-oss-120b)
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] text-emerald-600 dark:text-emerald-400">
                      Sub-200ms Inference
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                    Candidate AI Deep Audit
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Target Role Benchmark: <strong className="text-foreground">{activeBenchmarkRole}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {isAuditingAI ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw size={24} className="mx-auto animate-spin text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Deeply scanning GitHub code &amp; LinkedIn signals...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auditing repositories, project case studies, certifications, and builder posts against {activeBenchmarkRole} standards.
                  </p>
                </div>
              ) : aiAuditResult ? (
                <div className="space-y-4 text-xs">
                  {/* Executive Recruiter Summary */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-wider text-primary font-bold">
                      Hiring Manager Executive Summary
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground font-medium">
                      {aiAuditResult.recruiterExecutiveSummary}
                    </p>
                  </div>

                  {/* Top Strengths */}
                  <div>
                    <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono-ui">
                      Verified Candidate Strengths
                    </h5>
                    <div className="mt-2 space-y-2">
                      {(aiAuditResult.topStrengths || []).map((s: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-border bg-background p-3">
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500" /> {s.name}
                          </p>
                          <p className="mt-1 text-muted-foreground pl-4 leading-relaxed">{s.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Role Gaps */}
                  <div>
                    <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono-ui">
                      Critical Hiring Gaps to Close
                    </h5>
                    <div className="mt-2 space-y-2">
                      {(aiAuditResult.criticalGaps || []).map((g: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground flex items-center gap-1.5">
                              <AlertCircle size={13} className="text-rose-500" /> {g.name}
                            </p>
                            <span className="font-mono-ui text-[10px] font-bold text-rose-500">
                              Δ Gap: {g.gapScore}%
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground pl-4 leading-relaxed">
                            <strong className="text-foreground">Required Action: </strong>
                            {g.action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setShowAuditModal(false)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                    >
                      Close &amp; Apply to Roadmap
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

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
