import { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Cpu,
  ExternalLink,
  Filter,
  GraduationCap,
  Layers,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  buildPersonalizedCurriculum,
  checkCandidateLinkedInCertifications,
  generateAiCourseAdvisorRecommendation,
  PersonalizedCourse,
  CoursePlatform,
} from '@/lib/services/learning-engine';
import { getCachedEnrichedSignals } from '@/lib/services/profile-enricher';

export default function CoursesPage() {
  const { profile } = useAuth();
  const username = profile?.github_username || 'ShubhamAlapure';

  // Filters state
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [costFilter, setCostFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Interactive UI state
  const [showLinkedInDetails, setShowLinkedInDetails] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<PersonalizedCourse | null>(null);

  // AI Advisor modal state
  const [showAiAdvisorModal, setShowAiAdvisorModal] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiTargetCompany, setAiTargetCompany] = useState<string>(
    profile?.target_companies?.[0] || 'Razorpay'
  );
  const [aiPlatform, setAiPlatform] = useState<string>('Coursera');
  const [aiAdvisorResult, setAiAdvisorResult] = useState<{
    recommendedCourseTitle: string;
    platform: string;
    provider: string;
    url: string;
    whyThisCourse: string;
    hiringManagerPerspective: string;
    estimatedEffort: string;
  } | null>(null);

  // Enriched LinkedIn & GitHub signals
  const enrichedSignals = useMemo(() => {
    return getCachedEnrichedSignals(username);
  }, [username]);

  // Build Personalized Curricula strictly targeted to user's role and verified credentials
  const { courses: filteredCourses, linkedInAudit } = useMemo(() => {
    return buildPersonalizedCurriculum(
      profile,
      enrichedSignals,
      platformFilter,
      costFilter,
      difficultyFilter
    );
  }, [profile, enrichedSignals, platformFilter, costFilter, difficultyFilter]);

  // Handle AI Advisor run
  const handleRunAiAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    try {
      const res = await generateAiCourseAdvisorRecommendation(profile, aiTargetCompany, aiPlatform);
      setAiAdvisorResult(res);
    } catch (err) {
      console.warn('AI Advisor error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';

  return (
    <ProductShell>
      <TopBar eyebrow="Learning engine" title="Targeted Coursework & Curricula">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiAdvisorModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary shadow-sm hover:bg-primary/20 focus-ring"
            title="Get AI-powered course recommendations tailored to target company"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden sm:inline">AI Curriculum Advisor</span>
          </button>
          <span className="font-mono-ui text-xs text-muted-foreground hidden md:inline">
            {filteredCourses.length} curated resources
          </span>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner with Learning Engine Logic strictly role-oriented */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                  <Target size={11} /> Target Role: {targetRole}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={12} /> {linkedInAudit.totalCredentialsCount} LinkedIn Licenses & Certs Verified
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Precision Learning for Specific Gaps
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Zero generic course catalogs. Our learning engine automatically scanned your verified LinkedIn credentials to avoid repeating what you already know, prioritizing <strong className="text-foreground">Coursera, Udemy, NPTEL</strong>, and premier platforms to close verified gaps for <strong className="text-foreground">{targetRole}</strong>.
              </p>
            </div>

            {/* Quick action to inspect verified credentials */}
            <button
              onClick={() => setShowLinkedInDetails(!showLinkedInDetails)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted focus-ring shrink-0"
            >
              <Award size={15} className="text-primary" />
              <span>{showLinkedInDetails ? 'Hide Credentials' : 'Check LinkedIn Credentials'}</span>
              {showLinkedInDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expandable LinkedIn Credentials Drawer */}
          {showLinkedInDetails && (
            <div className="mt-6 border-t border-border pt-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-mono-ui text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Verified Licenses & Certifications from LinkedIn Profile
                </h4>
                <span className="font-mono-ui text-[11px] text-primary">
                  Source: {profile?.linkedin_url || 'linkedin.com/in/shubham-alapure'}
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {linkedInAudit.certifications.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono-ui text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          {c.credentialId || 'ACCREDITED'}
                        </span>
                        <span className="font-mono-ui text-[10px] text-muted-foreground">{c.issueDate}</span>
                      </div>
                      <h5 className="mt-2 font-display text-xs font-bold text-foreground leading-snug">
                        {c.title}
                      </h5>
                    </div>
                    <p className="mt-2 font-mono-ui text-[10px] text-muted-foreground">
                      Issuer: {c.issuer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Detected Preferred Platforms:</span>
                {linkedInAudit.preferredPlatforms.map((plat) => (
                  <span
                    key={plat}
                    className="rounded-lg bg-primary/10 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-primary"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter size={12} /> Platform:
            </span>
            {[
              { label: 'All Platforms', value: 'all' },
              { label: 'Coursera', value: 'coursera' },
              { label: 'Udemy', value: 'udemy' },
              { label: 'NPTEL / SWAYAM', value: 'nptel' },
              { label: 'takeUforward', value: 'takeuforward' },
              { label: 'Specialized', value: 'specialized' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatformFilter(p.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  platformFilter === p.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Cost & Level Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cost Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
              {[
                { label: 'All Costs', value: 'all' },
                { label: 'Free', value: 'free' },
                { label: 'Free to Audit', value: 'audit' },
                { label: 'Paid', value: 'paid' },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCostFilter(c.value)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    costFilter === c.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
              {['all', 'intermediate', 'advanced'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                    difficultyFilter === d
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCourses.map((course) => {
            const isVerifiedOnLinkedIn = !!course.linkedInVerifiedStatus;

            return (
              <div
                key={course.id}
                className={`flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all hover:shadow-md ${
                  isVerifiedOnLinkedIn
                    ? 'border-emerald-500/40 bg-card hover:border-emerald-500'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div>
                  {/* Platform, Badge & Rating Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Platform Badge */}
                        <span
                          className={`rounded-md px-2.5 py-0.5 font-mono-ui text-[10px] font-bold ${
                            course.platform === 'Coursera'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : course.platform === 'Udemy'
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                              : course.platform === 'NPTEL'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                              : course.platform === 'takeUforward'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-primary/15 text-primary'
                          }`}
                        >
                          {course.platform}
                        </span>

                        <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold text-secondary-foreground">
                          {course.tag}
                        </span>

                        {/* LinkedIn Verified Badge */}
                        {isVerifiedOnLinkedIn && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={11} /> {course.linkedInVerifiedStatus?.statusText}
                          </span>
                        )}
                      </div>

                      <p className="mt-2.5 text-xs font-semibold text-muted-foreground">{course.provider}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0">
                      <Star size={13} fill="currentColor" />
                      <span>{course.rating}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">({course.reviewCount})</span>
                    </div>
                  </div>

                  {/* Meta details: Duration, Difficulty, Cost, Certificate */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} className="text-primary" /> {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap size={13} className="text-primary" /> {course.difficulty}
                    </span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-foreground">
                      {course.cost}
                    </span>
                    {course.certificate && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Award size={13} /> Official Certificate
                      </span>
                    )}
                  </div>

                  {/* Skill Gap & Reason for Recommendation */}
                  <div className="mt-5 space-y-2.5 rounded-xl border border-border bg-background p-4 text-xs">
                    <div>
                      <span className="font-mono-ui text-[9px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                        <Zap size={11} /> Addresses Target Role Gap:
                      </span>
                      <p className="mt-0.5 font-semibold text-foreground">{course.skillGapAddressed}</p>
                    </div>
                    <div>
                      <span className="font-mono-ui text-[9px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                        <Target size={11} /> Why Recommended for {targetRole}:
                      </span>
                      <p className="mt-0.5 text-muted-foreground leading-relaxed">
                        {course.reasonForRecommendation}
                      </p>
                    </div>
                  </div>

                  {/* Core Topics Covered */}
                  <div className="mt-4">
                    <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
                      Core Topics Covered:
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {course.skillsCovered.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-secondary-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Link & Syllabus Modal Trigger */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline focus-ring"
                  >
                    <BookOpen size={13} /> Inspect Syllabus
                  </button>

                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
                    title={`Open official ${course.platform} course website`}
                  >
                    <span>Start Course</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Syllabus / Course Inspection Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 space-y-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute right-5 top-5 rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-bold text-primary">
                  {selectedCourse.platform}
                </span>
                <span className="font-mono-ui text-xs text-muted-foreground">
                  {selectedCourse.duration}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground">
                {selectedCourse.title}
              </h2>
              <p className="text-xs text-muted-foreground">{selectedCourse.provider}</p>

              {/* Verified LinkedIn Credentials Sync Status */}
              {selectedCourse.linkedInVerifiedStatus && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={15} /> LinkedIn Sync: {selectedCourse.linkedInVerifiedStatus.statusText}
                  </div>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-300">
                    Your profile holds verified credential: <strong>{selectedCourse.linkedInVerifiedStatus.matchedCertificationTitle}</strong> ({selectedCourse.linkedInVerifiedStatus.issuer}). You can fast-track directly to advanced assignments!
                  </p>
                </div>
              )}

              {/* Syllabus breakdown */}
              {selectedCourse.syllabusModules && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <BookOpen size={14} className="text-primary" /> Curated Syllabus Modules
                  </h4>
                  <div className="mt-3 space-y-2">
                    {selectedCourse.syllabusModules.map((mod, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="font-mono-ui text-[10px] font-bold text-primary shrink-0">
                          Module {idx + 1}:
                        </span>
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {selectedCourse.prerequisites && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <GraduationCap size={14} className="text-accent" /> Prerequisites Verified
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {selectedCourse.prerequisites.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Destination URL & Enroll CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Official Platform: <strong className="text-foreground">{selectedCourse.platform}</strong> ({selectedCourse.cost})
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 sm:flex-initial rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Close
                  </button>
                  <a
                    href={selectedCourse.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
                  >
                    <span>Open Destination Website</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Curriculum Advisor Modal */}
        {showAiAdvisorModal && (
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
                    AI Curriculum & Certification Advisor
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Matches your verified LinkedIn credentials and target role against hiring bars at top product firms.
                  </p>
                </div>
                <button
                  onClick={() => setShowAiAdvisorModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRunAiAdvisor} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Target Company Bar</label>
                  <input
                    type="text"
                    value={aiTargetCompany}
                    onChange={(e) => setAiTargetCompany(e.target.value)}
                    placeholder="e.g. Razorpay, Swiggy, Google, PhonePe, Cred"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Preferred Course Platform</label>
                  <select
                    value={aiPlatform}
                    onChange={(e) => setAiPlatform(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Coursera">Coursera (Professional Certificates & Specializations)</option>
                    <option value="Udemy">Udemy (Deep Hands-On Engineering Implementation)</option>
                    <option value="NPTEL">NPTEL / SWAYAM (IIT Academic Certification & Rigor)</option>
                    <option value="takeUforward">takeUforward / Striver (Algorithmic Rounds & SDE Sheets)</option>
                  </select>
                </div>

                <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Target Role Analyzed:</span>{' '}
                  <span className="text-primary font-bold">{targetRole}</span>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  {isGeneratingAi ? (
                    <>
                      <Cpu size={14} className="animate-spin text-primary-foreground" />
                      Analyzing LinkedIn credentials & company bars...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate Targeted Curriculum Recommendation
                    </>
                  )}
                </button>
              </form>

              {aiAdvisorResult && (
                <div className="mt-4 space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-primary/20 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-primary">
                      {aiAdvisorResult.platform} Recommendation
                    </span>
                    <span className="font-mono-ui text-[10px] text-muted-foreground">
                      {aiAdvisorResult.estimatedEffort}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-foreground">
                    {aiAdvisorResult.recommendedCourseTitle}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{aiAdvisorResult.provider}</p>

                  <div className="space-y-2 border-t border-border pt-2 text-xs">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Why this closes your gap:</strong> {aiAdvisorResult.whyThisCourse}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Hiring Manager Angle:</strong> {aiAdvisorResult.hiringManagerPerspective}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <a
                      href={aiAdvisorResult.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
                    >
                      <span>Open Course on {aiAdvisorResult.platform}</span>
                      <ExternalLink size={13} />
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
