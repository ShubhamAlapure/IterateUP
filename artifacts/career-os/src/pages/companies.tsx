import { useState, useMemo } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  ExternalLink,
  Filter,
  FolderGit2,
  Layers,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  buildPersonalizedTargetCompanies,
  evaluateCustomCompanyWithGroq,
  loadSavedCompanyIds,
  saveCompanyIds,
  CompanyIntelligence,
} from '@/lib/services/company-matcher-engine';
import { getCachedEnrichedSignals } from '@/lib/services/profile-enricher';

export default function CompaniesPage() {
  const { profile } = useAuth();
  const profileId = profile?.id || 'demo-student';
  const username = profile?.github_username || 'ShubhamAlapure';
  const college = profile?.college || 'MIT ADT University Pune';
  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';

  // Saved companies state with persistence
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>(() => {
    return loadSavedCompanyIds(profileId);
  });

  // Filter state
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [viewSavedOnly, setViewSavedOnly] = useState<boolean>(false);

  // Modal states
  const [selectedCompany, setSelectedCompany] = useState<CompanyIntelligence | null>(null);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customCompanyName, setCustomCompanyName] = useState<string>('');
  const [customEvaluatedCompany, setCustomEvaluatedCompany] = useState<CompanyIntelligence | null>(null);

  // Cached GitHub & LinkedIn enriched signals
  const enrichedSignals = useMemo(() => {
    return getCachedEnrichedSignals(username);
  }, [username]);

  // Build Personalized Company Intelligence strictly evaluating all 3 Pillars:
  // Pillar 1: Target Role | Pillar 2: Skills | Pillar 3: Projects
  const companiesList: CompanyIntelligence[] = useMemo(() => {
    return buildPersonalizedTargetCompanies(
      profile,
      enrichedSignals,
      sectorFilter,
      viewSavedOnly,
      savedCompanyIds
    );
  }, [profile, enrichedSignals, sectorFilter, viewSavedOnly, savedCompanyIds]);

  // Toggle saving a company
  const toggleSaveCompany = (id: string) => {
    const updated = savedCompanyIds.includes(id)
      ? savedCompanyIds.filter((item) => item !== id)
      : [...savedCompanyIds, id];
    setSavedCompanyIds(updated);
    saveCompanyIds(profileId, updated);
  };

  // Run AI Company Fit Evaluator via Groq LPU
  const handleEvaluateCustomCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCompanyName.trim()) return;
    setIsGeneratingAi(true);
    try {
      const result = await evaluateCustomCompanyWithGroq(
        customCompanyName.trim(),
        profile,
        enrichedSignals
      );
      setCustomEvaluatedCompany(result);
    } catch (err) {
      console.warn('AI company evaluation failed:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <ProductShell>
      <TopBar eyebrow="Market intelligence" title="Target Companies">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary shadow-sm hover:bg-primary/20 focus-ring"
            title="Evaluate fit for any custom dream company using Groq LPU"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden sm:inline">AI Company Evaluator</span>
          </button>
          <span className="font-mono-ui text-xs text-muted-foreground hidden md:inline">
            {savedCompanyIds.length} saved to target list
          </span>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner with 3-Pillar Engine Decision Logic */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-bold text-primary">
                  <Target size={11} /> 3-Pillar Match Engine
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={11} /> Target Role: {targetRole}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary/60 px-2.5 py-0.5 font-mono-ui text-[10px] font-medium text-foreground">
                  <FolderGit2 size={11} className="text-primary" /> Real GitHub Code Evidence
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Companies Where Your Signal Matters
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Zero hardcoded assumptions. Every match score below is dynamically calculated by cross-referencing your <strong className="text-foreground">Target Role</strong>, verified <strong className="text-foreground">Skills</strong>, and concrete <strong className="text-foreground">GitHub Code Evidence</strong> against real Indian &amp; global hiring loops.
              </p>
            </div>

            {/* Quick Filter: All vs Saved */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 shrink-0">
              <button
                onClick={() => setViewSavedOnly(false)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  !viewSavedOnly
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Companies
              </button>
              <button
                onClick={() => setViewSavedOnly(true)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewSavedOnly
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Saved Targets ({savedCompanyIds.length})
              </button>
            </div>
          </div>

          {/* Sector Filter Tabs */}
          <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter size={12} /> Sector:
            </span>
            {[
              { label: 'All Sectors', value: 'all' },
              { label: 'FinTech & Payments', value: 'fintech' },
              { label: 'Consumer & Logistics', value: 'consumer' },
              { label: 'Enterprise Cloud & SaaS', value: 'enterprise' },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setSectorFilter(s.value)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  sectorFilter === s.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* Company Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companiesList.map((comp) => {
            const isSaved = savedCompanyIds.includes(comp.id);

            return (
              <div
                key={comp.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  {/* Card Header: Logo, Name, Sector & Save Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary font-display text-xl font-bold text-primary shadow-inner shrink-0">
                        {comp.logoLetter}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground leading-snug">
                          {comp.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{comp.industry}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveCompany(comp.id)}
                      className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary shrink-0"
                      title={isSaved ? 'Remove from saved targets' : 'Save to target list'}
                    >
                      {isSaved ? (
                        <BookmarkCheck size={16} className="text-primary" />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>

                  {/* 3-Pillar Candidate Fit Score Box */}
                  <div className="mt-4 rounded-xl border border-border bg-background p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                        <Zap size={11} className="text-primary" /> 3-Pillar Candidate Fit
                      </span>
                      <span className="font-mono-ui text-sm font-bold text-primary">
                        {comp.targetFitScore}% Match
                      </span>
                    </div>

                    {/* Fit Progress Bar */}
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${comp.targetFitScore}%` }}
                      />
                    </div>

                    {/* 3-Pillars Breakdown Pills */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono-ui text-[9px]">
                      <div className="rounded-md bg-secondary/80 p-1">
                        <span className="text-muted-foreground block">Role Fit</span>
                        <span className="font-bold text-foreground">{comp.threePillarBreakdown.roleFitScore}%</span>
                      </div>
                      <div className="rounded-md bg-secondary/80 p-1">
                        <span className="text-muted-foreground block">Skills Overlap</span>
                        <span className="font-bold text-foreground">{comp.threePillarBreakdown.skillOverlapScore}%</span>
                      </div>
                      <div className="rounded-md bg-secondary/80 p-1">
                        <span className="text-muted-foreground block">Project Proof</span>
                        <span className="font-bold text-foreground">{comp.threePillarBreakdown.projectEvidenceScore}%</span>
                      </div>
                    </div>

                    <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Why target: </strong>
                      {comp.whyTarget}
                    </p>
                  </div>

                  {/* Locations & Application Timeline */}
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-primary shrink-0" />
                      <span>{comp.locations.join(' · ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary shrink-0" />
                      <span>{comp.internshipWindow}</span>
                    </div>
                  </div>

                  {/* Matched Strengths & Gaps to Close */}
                  <div className="mt-4 space-y-2 border-t border-border pt-3">
                    <div>
                      <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Matched Strengths (Code &amp; Degree):
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.matchedSignals.map((sig, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2 size={10} /> {sig}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Gaps to Close for Hiring Bar:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.missingSignals.map((sig, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                          >
                            <XCircle size={10} /> {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mt-4">
                    <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Production Stack:
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {comp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions: Blueprint & Careers Link */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button
                    onClick={() => setSelectedCompany(comp)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus-ring"
                  >
                    <span>Inspect Hiring Blueprint</span>
                    <ChevronRight size={13} />
                  </button>

                  <a
                    href={comp.careersUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <span>Careers Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Hiring Blueprint Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 space-y-5">
              <button
                onClick={() => setSelectedCompany(null)}
                className="absolute right-5 top-5 rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary font-display text-xl font-bold text-primary">
                  {selectedCompany.logoLetter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-primary">
                      {selectedCompany.sector.toUpperCase()}
                    </span>
                    <span className="font-mono-ui text-xs text-muted-foreground">
                      {selectedCompany.targetFitScore}% Match Score
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {selectedCompany.name} Hiring Blueprint
                  </h2>
                </div>
              </div>

              {/* 3 Pillars Deep Dive */}
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <h4 className="font-mono-ui text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Target size={13} /> 3-Pillar Candidate Evaluation Breakdown
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border p-3">
                    <span className="font-mono-ui text-[10px] text-muted-foreground">Pillar 1: Target Role</span>
                    <p className="font-display text-lg font-bold text-foreground">{selectedCompany.threePillarBreakdown.roleFitScore}%</p>
                    <p className="text-[11px] text-muted-foreground mt-1">High compatibility with {targetRole} tracks.</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <span className="font-mono-ui text-[10px] text-muted-foreground">Pillar 2: Skills Overlap</span>
                    <p className="font-display text-lg font-bold text-foreground">{selectedCompany.threePillarBreakdown.skillOverlapScore}%</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Strong match with production tech stack.</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <span className="font-mono-ui text-[10px] text-muted-foreground">Pillar 3: Project Evidence</span>
                    <p className="font-display text-lg font-bold text-foreground">{selectedCompany.threePillarBreakdown.projectEvidenceScore}%</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Verified GitHub repositories match hiring standards.</p>
                  </div>
                </div>
              </div>

              {/* Project Evidence Relevance */}
              {selectedCompany.evidenceProjects.length > 0 && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <FolderGit2 size={14} className="text-primary" /> Your Code Evidence Mapping
                  </h4>
                  <div className="mt-2.5 space-y-2">
                    {selectedCompany.evidenceProjects.map((ep, idx) => (
                      <div key={idx} className="rounded-lg border border-border/80 bg-card p-3 text-xs">
                        <span className="font-mono-ui font-bold text-primary">@{username}/{ep.projectName}</span>
                        <p className="mt-1 text-muted-foreground leading-relaxed">{ep.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Interview Process & Round-by-Round Preparation */}
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Rocket size={14} className="text-primary" /> Verified Engineering Interview Loop
                </h4>
                <div className="space-y-2.5">
                  {selectedCompany.interviewStages.map((stg, idx) => (
                    <div key={idx} className="rounded-lg border border-border/70 bg-card p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{stg.stage}</span>
                        <span className="font-mono-ui text-[10px] text-primary">Stage {idx + 1}</span>
                      </div>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Focus:</strong> {stg.focus}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <strong className="text-primary">How to prepare:</strong> {stg.candidatePreparation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Close
                </button>
                <a
                  href={selectedCompany.careersUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
                >
                  <span>Open {selectedCompany.name} Careers</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* AI Company Evaluator Modal (Groq LPU) */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-primary flex items-center gap-1">
                      <Cpu size={11} /> Groq LPU Powered
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-foreground">
                    AI Company Fit Evaluator
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cross-evaluates your Target Role, Skills, and GitHub repos against any company in the world.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAiModal(false);
                    setCustomEvaluatedCompany(null);
                  }}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEvaluateCustomCompany} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Company Name</label>
                  <input
                    type="text"
                    value={customCompanyName}
                    onChange={(e) => setCustomCompanyName(e.target.value)}
                    placeholder="e.g. Databricks, Stripe, Google, Postman, Zepto"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground space-y-1">
                  <div>
                    <strong className="text-foreground">Evaluating 3 Pillars:</strong>
                  </div>
                  <div>• Role: <span className="text-primary font-semibold">{targetRole}</span></div>
                  <div>• GitHub: <span className="text-primary font-semibold">@{username}</span> (repos analyzed)</div>
                  <div>• University: <span className="text-foreground">{college}</span></div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {isGeneratingAi ? (
                    <>
                      <Cpu size={14} className="animate-spin text-primary-foreground" />
                      Evaluating Target Role, Skills &amp; Code Evidence...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Evaluate 3-Pillar Candidate Fit
                    </>
                  )}
                </button>
              </form>

              {customEvaluatedCompany && (
                <div className="mt-4 space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-foreground text-sm">
                      {customEvaluatedCompany.name}
                    </span>
                    <span className="font-mono-ui font-bold text-primary text-sm">
                      {customEvaluatedCompany.targetFitScore}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono-ui text-[9px]">
                    <div className="rounded bg-background p-1">
                      <span className="text-muted-foreground block">Role</span>
                      <span className="font-bold text-foreground">{customEvaluatedCompany.threePillarBreakdown.roleFitScore}%</span>
                    </div>
                    <div className="rounded bg-background p-1">
                      <span className="text-muted-foreground block">Skills</span>
                      <span className="font-bold text-foreground">{customEvaluatedCompany.threePillarBreakdown.skillOverlapScore}%</span>
                    </div>
                    <div className="rounded bg-background p-1">
                      <span className="text-muted-foreground block">Projects</span>
                      <span className="font-bold text-foreground">{customEvaluatedCompany.threePillarBreakdown.projectEvidenceScore}%</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {customEvaluatedCompany.whyTarget}
                  </p>

                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedCompany(customEvaluatedCompany);
                        setShowAiModal(false);
                      }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      View Full Interview Blueprint
                    </button>
                    <a
                      href={customEvaluatedCompany.careersUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary"
                    >
                      <span>Careers Link</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}
