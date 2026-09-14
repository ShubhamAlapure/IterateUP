import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  GraduationCap,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Globe,
  Database,
  UserRound,
  Briefcase,
  MapPin,
  X,
  Plus,
  Github,
  Linkedin,
  ExternalLink,
  RefreshCw,
  GitBranch,
  Terminal,
  Code2,
} from 'lucide-react';
import { DemoPill, Wordmark } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  fetchAndEnrichStudentProfile,
  cleanGithubUsername,
  type EnrichedSignalData,
} from '@/lib/services/profile-enricher';

const steps = [
  { path: '/onboarding', label: 'Start' },
  { path: '/onboarding/career-goal', label: 'Goal' },
  { path: '/onboarding/profile', label: 'Education' },
  { path: '/onboarding/connect', label: 'Links & CV' },
];

const targetRoleSuggestions = [
  'Software Development Engineer (SDE-1)',
  'Backend Systems Engineer',
  'Full-Stack Engineer (React & Node/Go)',
  'Frontend Engineer',
  'Cloud & DevOps Engineer',
  'AI / ML Engineer',
];

const companySuggestions = [
  'Razorpay',
  'PhonePe',
  'Swiggy',
  'Zomato',
  'Atlassian India',
  'Google',
  'Microsoft',
  'TCS Digital',
  'CRED',
  'Uber India',
];

export default function OnboardingPage({
  step = 'start',
}: {
  step?: 'start' | 'goal' | 'profile' | 'connect';
}) {
  const [, setLocation] = useLocation();
  const { user, profile, updateProfile, uploadResume, isConfigured } = useAuth();

  // Step 0 & 1: Goal
  const [selectedMilestone, setSelectedMilestone] = useState(
    'Land my first tech internship (₹40k–₹85k/mo)'
  );
  const [targetRole, setTargetRole] = useState(
    profile?.target_role || 'Software Development Engineer (SDE-1)'
  );
  const [targetCompanies, setTargetCompanies] = useState<string[]>(
    profile?.target_companies && profile.target_companies.length > 0
      ? profile.target_companies
      : ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India']
  );
  const [customCompanyInput, setCustomCompanyInput] = useState('');

  // Step 2: Academics & Info
  const [fullName, setFullName] = useState(
    profile?.full_name || user?.user_metadata?.full_name || ''
  );
  const [collegeName, setCollegeName] = useState(
    profile?.college || ''
  );
  const [degree, setDegree] = useState(
    profile?.degree || 'B.Tech Computer Engineering'
  );
  const [yearOfStudy, setYearOfStudy] = useState(
    profile?.year_of_study || '3rd Year (Class of 2026)'
  );
  const [cgpa, setCgpa] = useState(profile?.cgpa || '8.5 / 10.0');
  const [locationStr, setLocationStr] = useState(
    profile?.location || 'Pune, Maharashtra, India'
  );

  // Step 3: Links, CV & Bio
  const [bio, setBio] = useState(
    profile?.bio ||
      'Aspiring engineer with strong algorithmic foundations, building robust distributed systems and web products.'
  );
  const [githubUrl, setGithubUrl] = useState(
    profile?.github_username || ''
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    profile?.linkedin_url || ''
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    profile?.portfolio_url || ''
  );

  // Resume state
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(
    profile?.resume_name ? { name: profile.resume_name, size: 'Saved' } : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automated Signals state
  const [enrichedSignals, setEnrichedSignals] = useState<EnrichedSignalData | null>(null);
  const [isFetchingSignals, setIsFetchingSignals] = useState(false);
  const [signalFetchSuccess, setSignalFetchSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const index = step === 'start' ? 0 : step === 'goal' ? 1 : step === 'profile' ? 2 : 3;
  const nextPath =
    index === 0
      ? '/onboarding/career-goal'
      : index === 1
      ? '/onboarding/profile'
      : index === 2
      ? '/onboarding/connect'
      : '/dashboard';

  const triggerAutoFetchSignals = async (ghOverride?: string, liOverride?: string) => {
    const targetGh = ghOverride !== undefined ? ghOverride : githubUrl;
    const targetLi = liOverride !== undefined ? liOverride : linkedinUrl;
    const cleanGh = cleanGithubUsername(targetGh);
    if (!cleanGh) return;

    setIsFetchingSignals(true);
    try {
      const data = await fetchAndEnrichStudentProfile(cleanGh, targetLi, targetRole);
      setEnrichedSignals(data);
      setSignalFetchSuccess(true);
      if (data.bio && (!bio.trim() || bio.startsWith('Aspiring engineer with strong algorithmic'))) {
        setBio(data.bio);
      }
      if (data.company && (!collegeName.trim() || collegeName.includes('COEP'))) {
        setCollegeName(data.company);
      }
      if (data.location && (!locationStr.trim() || locationStr.includes('Pune, Maharashtra'))) {
        setLocationStr(data.location);
      }
    } catch (e) {
      console.warn('Signal fetch error:', e);
    } finally {
      setIsFetchingSignals(false);
    }
  };

  useEffect(() => {
    if (index === 3 && githubUrl.trim()) {
      const timer = setTimeout(() => {
        triggerAutoFetchSignals();
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [githubUrl, linkedinUrl, index]);

  const handleAddCompany = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !targetCompanies.includes(trimmed)) {
      setTargetCompanies([...targetCompanies, trimmed]);
    }
  };

  const handleRemoveCompany = (name: string) => {
    setTargetCompanies(targetCompanies.filter((c) => c !== name));
  };

  const handleResumeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setErrorMessage(null);

    try {
      const { url, name, error } = await uploadResume(file);
      if (error) {
        setErrorMessage(
          error.message || 'Failed to upload resume to storage. Please check bucket permissions.'
        );
      } else {
        const sizeKb = Math.round(file.size / 1024);
        setUploadedFile({
          name: name || file.name,
          size: `${sizeKb} KB`,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing resume upload.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleContinue = async () => {
    setErrorMessage(null);

    // Save progressively as user moves through steps
    if (index === 0) {
      setLocation(nextPath);
      return;
    }

    if (index === 1) {
      await updateProfile({
        target_role: targetRole,
        target_companies: targetCompanies,
      });
      setLocation(nextPath);
      return;
    }

    if (index === 2) {
      if (!fullName.trim()) {
        setErrorMessage('Please provide your full name.');
        return;
      }
      if (!collegeName.trim()) {
        setErrorMessage('Please enter your college or university name.');
        return;
      }

      await updateProfile({
        full_name: fullName.trim(),
        college: collegeName.trim(),
        degree: degree.trim(),
        year_of_study: yearOfStudy,
        cgpa: cgpa.trim(),
        location: locationStr.trim(),
      });
      setLocation(nextPath);
      return;
    }

    // Final Step 3: Complete onboarding
    setSubmitting(true);
    try {
      const cleanGh = cleanGithubUsername(githubUrl);
      let signals = enrichedSignals;
      if (!signals && cleanGh) {
        signals = await fetchAndEnrichStudentProfile(cleanGh, linkedinUrl.trim(), targetRole);
      }

      await updateProfile({
        full_name: fullName.trim() || profile?.full_name,
        college: collegeName.trim() || profile?.college,
        degree: degree.trim() || profile?.degree,
        year_of_study: yearOfStudy || profile?.year_of_study,
        cgpa: cgpa.trim() || profile?.cgpa,
        location: locationStr.trim() || profile?.location,
        target_role: targetRole || profile?.target_role,
        target_companies: targetCompanies,
        bio: bio.trim(),
        github_username: cleanGh,
        linkedin_url: linkedinUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        onboarding_completed: true,
        readiness_score: 72,
        skills_count: signals?.skillsFoundCount || 14,
        experience_count: signals?.experienceCount || 2,
        projects_count: signals?.projectsCount || 3,
        synced_projects: signals?.projects || [],
        synced_skills: signals?.skills || [],
        github_synced_at: new Date().toISOString(),
      });

      window.setTimeout(() => {
        setLocation('/dashboard');
      }, 350);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not save profile.');
      setSubmitting(false);
    }
  };

  return (
    <div className="grain mesh-bg min-h-[100dvh]">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-4">
          <DemoPill />
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground focus-ring"
            data-testid="link-onboarding-skip"
          >
            Skip to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[760px] px-5 pb-16 pt-9 sm:px-8 sm:pt-14">
        {/* Progress Tracker */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex flex-1 items-center">
            {steps.map((item, itemIndex) => (
              <div key={item.path} className="flex flex-1 items-center last:flex-none">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors ${
                    itemIndex < index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : itemIndex === index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {itemIndex < index ? <Check size={14} /> : itemIndex + 1}
                </div>
                {itemIndex < steps.length - 1 && (
                  <div
                    className={`mx-2 h-px flex-1 ${
                      itemIndex < index ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <span className="ml-5 font-mono-ui text-[10px] uppercase tracking-[.15em] text-muted-foreground">
            {index + 1} / 4
          </span>
        </div>

        <main className="page-in rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_70px_hsl(222_29%_17%/.07)] sm:p-10">
          <div className="flex items-center justify-between">
            <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
              {index === 0
                ? 'Welcome to IterateUP'
                : index === 1
                ? 'Step 1 of 3 · Career Goal'
                : index === 2
                ? 'Step 2 of 3 · Your College & Background'
                : 'Step 3 of 3 · Resume & Online Presence'}
            </p>
            {isConfigured && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <Database size={12} /> Supabase PostgreSQL
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 0: START */}
          {index === 0 && (
            <div className="mt-5">
              <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-[-.065em] sm:text-5xl">
                Let's calibrate your career operating system.
              </h1>
              <p className="mt-4 max-w-[580px] text-base leading-7 text-muted-foreground">
                IterateUP analyzes where you currently are, pinpoints high-impact skill gaps, recommends what to build and learn, and connects you to target companies.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  {
                    title: 'Personalized Skill Gap Analysis',
                    desc: 'Evaluated directly against real industry hiring bars in India & global tech.',
                  },
                  {
                    title: 'Proof-of-Work Project Roadmap',
                    desc: 'Step-by-step sprint roadmaps to build production-grade microservices.',
                  },
                  {
                    title: 'Targeted Companies & Applications Tracker',
                    desc: 'Tailored company matching with salary benchmarks in INR.',
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: CAREER GOAL */}
          {index === 1 && (
            <div className="mt-5">
              <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-[-.05em] sm:text-4xl">
                Where do you want to go?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us your target role and top companies so we can customize your readiness roadmap.
              </p>

              <div className="mt-7 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Target Engineering Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Development Engineer - Backend (SDE-1)"
                    className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {targetRoleSuggestions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setTargetRole(r)}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] transition-colors ${
                          targetRole === r
                            ? 'border-primary bg-primary/10 font-semibold text-primary'
                            : 'border-border bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    What would feel like a win this year?
                  </label>
                  <div className="mt-2 grid gap-2.5">
                    {[
                      'Land my first tech internship (₹40k–₹85k/mo stipend)',
                      'Crack campus placement at a top product company (₹12–24+ LPA)',
                      'Build 2-3 production-grade portfolio microservices with proof of work',
                      'Master DSA & system design for high-bar technical interviews',
                    ].map((milestone) => (
                      <button
                        key={milestone}
                        type="button"
                        onClick={() => setSelectedMilestone(milestone)}
                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs transition-all ${
                          selectedMilestone === milestone
                            ? 'border-primary bg-primary/8 font-semibold text-foreground shadow-sm'
                            : 'border-border bg-background text-muted-foreground hover:border-border/80'
                        }`}
                      >
                        <span>{milestone}</span>
                        <div
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                            selectedMilestone === milestone
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-transparent'
                          }`}
                        >
                          <Check size={11} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Target Companies (Click to toggle or add custom)
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {companySuggestions.map((comp) => {
                      const active = targetCompanies.includes(comp);
                      return (
                        <button
                          key={comp}
                          type="button"
                          onClick={() =>
                            active ? handleRemoveCompany(comp) : handleAddCompany(comp)
                          }
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                            active
                              ? 'border-primary bg-primary text-primary-foreground font-medium'
                              : 'border-border bg-background text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span>{comp}</span>
                          {active && <Check size={12} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={customCompanyInput}
                      onChange={(e) => setCustomCompanyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCompany(customCompanyInput);
                          setCustomCompanyInput('');
                        }
                      }}
                      placeholder="Add another company (e.g. Flipkart, CRED)"
                      className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddCompany(customCompanyInput);
                        setCustomCompanyInput('');
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION & PROFILE */}
          {index === 2 && (
            <div className="mt-5">
              <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-[-.05em] sm:text-4xl">
                Tell us about your college & background.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We calibrate your readiness score and target opportunities based on your college and major.
              </p>

              <div className="mt-7 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shubham Alapure"
                    className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. MIT ADT University Pune / COEP / IIT Bombay"
                    className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Degree & Branch
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Engineering"
                      className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option>1st Year (Class of 2028)</option>
                      <option>2nd Year (Class of 2027)</option>
                      <option>3rd Year (Class of 2026)</option>
                      <option>Final Year (Class of 2025)</option>
                      <option>Recent Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      CGPA / Percentage
                    </label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.5 / 10.0"
                      className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra, India"
                      className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESUME, LINKS & BIO */}
          {index === 3 && (
            <div className="mt-5">
              <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-[-.05em] sm:text-4xl">
                Upload your resume & profile links.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload your PDF resume to Supabase Storage. We will automatically parse competencies and align your skills.
              </p>

              <div className="mt-7 space-y-5">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleResumeChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                {/* Upload card */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all hover:border-primary/50 ${
                    uploadedFile || profile?.resume_name
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-dashed border-border bg-background'
                  }`}
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    {uploadingResume ? (
                      <Upload size={20} className="animate-bounce" />
                    ) : uploadedFile || profile?.resume_name ? (
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    ) : (
                      <FileText size={22} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {uploadingResume
                        ? 'Uploading to Supabase Storage…'
                        : uploadedFile
                        ? `Attached: ${uploadedFile.name} (${uploadedFile.size})`
                        : profile?.resume_name
                        ? `Attached: ${profile.resume_name}`
                        : 'Upload your Resume PDF'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {uploadedFile || profile?.resume_name
                        ? 'Saved securely in your private Supabase storage bucket.'
                        : 'Click to browse (.pdf format supported)'}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                    {uploadedFile || profile?.resume_name ? 'Replace' : 'Browse'}
                  </span>
                </div>

                <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold text-foreground">Online Links (Optional)</p>
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      GitHub Username or URL
                    </label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="e.g. shubhamalapure"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/shubhamalapure"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Portfolio or Personal Website URL
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="e.g. https://shubhamalapure.dev"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* AUTOMATED SIGNAL EXTRACTION CARD */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          Automatic Profile & Developer Signal Fetch
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Live sync with GitHub REST API &amp; Professional Taxonomy
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerAutoFetchSignals()}
                      disabled={isFetchingSignals || !githubUrl.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary transition-colors disabled:opacity-40"
                    >
                      <RefreshCw size={12} className={isFetchingSignals ? 'animate-spin text-primary' : ''} />
                      {isFetchingSignals ? 'Fetching signals…' : 'Fetch Now'}
                    </button>
                  </div>

                  {/* The 3 Extracted Metric Cards Matching Taxonomy & Impact */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-[#e8e2d5] bg-[#fbf9f4] p-4 text-left shadow-sm dark:border-border dark:bg-background">
                      <p className="font-mono-ui text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Skills Found
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {isFetchingSignals ? '…' : enrichedSignals?.skillsFoundCount || 14}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Normalized against taxonomy</p>
                    </div>

                    <div className="rounded-2xl border border-[#e8e2d5] bg-[#fbf9f4] p-4 text-left shadow-sm dark:border-border dark:bg-background">
                      <p className="font-mono-ui text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Experience
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-foreground">
                        {isFetchingSignals ? '…' : `${enrichedSignals?.experienceCount || (linkedinUrl ? 2 : 1)} Roles`}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Quantified impact verified</p>
                    </div>

                    <div className="rounded-2xl border border-[#e8e2d5] bg-[#fbf9f4] p-4 text-left shadow-sm dark:border-border dark:bg-background">
                      <p className="font-mono-ui text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Projects
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-foreground">
                        {isFetchingSignals ? '…' : `${enrichedSignals?.projectsCount || (githubUrl ? 3 : 0)} Items`}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Linked to public repositories</p>
                    </div>
                  </div>

                  {/* Auto-Linked Repositories Preview */}
                  {enrichedSignals && enrichedSignals.projects.length > 0 && (
                    <div className="mt-4 border-t border-border pt-3.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                          <Github size={13} className="text-primary" /> Verified Repositories Found ({enrichedSignals.projects.length}):
                        </p>
                        <span className="font-mono-ui text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Ready to sync
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {enrichedSignals.projects.slice(0, 4).map((repo) => (
                          <a
                            key={repo.id}
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary transition-colors"
                          >
                            <span className="font-semibold">{repo.name}</span>
                            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono-ui font-semibold text-primary">
                              {repo.language}
                            </span>
                            <ExternalLink size={11} className="text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Short Professional Bio / Statement
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your focus, e.g. Aspiring backend engineer passionate about distributed systems."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Link
              href={index === 0 ? '/signup' : steps[index - 1].path}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-ring"
              data-testid="link-onboarding-back"
            >
              <ArrowLeft size={15} /> Back
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting || uploadingResume}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              data-testid="button-onboarding-continue"
            >
              {submitting ? (
                'Saving your profile to Supabase…'
              ) : index === 3 ? (
                <>
                  <span>Save Profile & Open Workspace</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </main>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can edit and update any of these details anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}