import { useState, useRef, type ChangeEvent } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Link2,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Globe,
  Database
} from 'lucide-react';
import { DemoPill, Wordmark } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';

const steps = [
  { path: '/onboarding', label: 'Start' },
  { path: '/onboarding/career-goal', label: 'Direction' },
  { path: '/onboarding/profile', label: 'Profile' },
  { path: '/onboarding/connect', label: 'Connect' },
];

export default function OnboardingPage({
  step = 'start',
}: {
  step?: 'start' | 'goal' | 'profile' | 'connect';
}) {
  const [, setLocation] = useLocation();
  const { user, profile, updateProfile, uploadResume, isConfigured } = useAuth();

  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [githubUrl, setGithubUrl] = useState(profile?.github_username || '');
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'Software Development Engineer (SDE-1)');
  const [collegeName, setCollegeName] = useState(profile?.college || 'COEP Technological University, Pune');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const content = {
    start: {
      eyebrow: 'Let’s make this useful',
      title: 'Start with the direction, not the destination.',
      body: 'IterateUP gets smarter when it understands what you are moving toward. There is no perfect answer here — just a useful first one.',
      options: [
        'I am exploring what fits (Early exploration)',
        'I have a role in mind (SDE / Backend / Frontend)',
        'I am ready to apply (Active recruiting season)',
        'Preparing for campus placements (Tier 1/2 college drive)',
      ],
    },
    goal: {
      eyebrow: 'Step 1 of 3 · Direction',
      title: 'What would feel like a win this year?',
      body: 'Choose your primary milestone. We will orient your roadmaps, gap assessments, and project builds around it.',
      options: [
        'Land my first tech internship (₹40k–₹85k/mo)',
        'Clear campus placement at product company (₹12–24+ LPA)',
        'Build 2-3 production-grade portfolio microservices',
        'Master DSA & system design for high-bar technical rounds',
      ],
    },
    profile: {
      eyebrow: 'Step 2 of 3 · Your profile',
      title: 'Tell us where you are starting from.',
      body: 'A rough picture is enough. We use this to separate what is already working from what deserves focus.',
      options: [
        'I have 1-2 projects and good foundational DSA',
        'I have completed web basics and want to specialize',
        'I have prior internship or freelance client experience',
        'I am starting fresh and want step-by-step guidance',
      ],
    },
    connect: {
      eyebrow: 'Step 3 of 3 · Connect & Upload',
      title: 'Attach your resume or profile link.',
      body: 'Connect your materials to Supabase Storage. IterateUP extracts skills and verifies competencies automatically.',
      options: [],
    },
  }[step];

  const handleResumeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setErrorMessage(null);

    try {
      const { url, name, error } = await uploadResume(file);
      if (error) {
        setErrorMessage(error.message || 'Failed to upload resume to storage. Please check bucket permissions.');
      } else {
        const sizeKb = Math.round(file.size / 1024);
        setUploadedFile({
          name: name || file.name,
          size: `${sizeKb} KB`,
        });
        setSelected('resume');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing resume upload.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleContinue = async () => {
    setErrorMessage(null);

    // Save state at each transition
    if (index === 0) {
      if (selected) {
        await updateProfile({ bio: `Stage: ${selected}` });
      }
      setLocation(nextPath);
      return;
    }

    if (index === 1) {
      if (selected) {
        await updateProfile({
          target_role: targetRole,
          bio: `${profile?.bio || ''} | Milestone: ${selected}`.trim(),
        });
      }
      setLocation(nextPath);
      return;
    }

    if (index === 2) {
      await updateProfile({
        college: collegeName,
        target_role: targetRole,
      });
      setLocation(nextPath);
      return;
    }

    // Step 3: finalize onboarding
    setSubmitting(true);
    try {
      await updateProfile({
        linkedin_url: linkedinUrl,
        github_username: githubUrl.replace('https://github.com/', ''),
        onboarding_completed: true,
        readiness_score: 68,
      });

      window.setTimeout(() => {
        setLocation('/dashboard');
      }, 350);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not finalize profile.');
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
            data-testid="link-onboarding-login"
          >
            Skip to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[760px] px-5 pb-16 pt-9 sm:px-8 sm:pt-16">
        {/* Progress Tracker */}
        <div className="mb-14 flex items-center justify-between">
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
              {content.eyebrow}
            </p>
            {isConfigured && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <Database size={12} /> Supabase PostgreSQL
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-[600px] font-display text-4xl font-bold leading-[1.03] tracking-[-.065em] sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-[540px] text-base leading-7 text-muted-foreground">
            {content.body}
          </p>

          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'profile' && (
            <div className="mt-7 space-y-4 rounded-2xl border border-border bg-background p-5">
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  College / University
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. COEP Technological University, Pune"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Target Engineering Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Software Development Engineer - Backend (SDE-1)"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          )}

          {step !== 'connect' ? (
            <div className="mt-7 grid gap-3">
              {content.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelected(option)}
                  className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md ${
                    selected === option
                      ? 'border-primary bg-primary/7 shadow-sm'
                      : 'border-border bg-background'
                  }`}
                  data-testid={`button-option-${option.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <span>
                    <span className="block text-sm font-semibold">{option}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {selected === option
                        ? 'Selected for your personalized path.'
                        : 'Select this baseline.'}
                    </span>
                  </span>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border ${
                      selected === option
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-transparent group-hover:border-primary/40'
                    }`}
                  >
                    <Check size={13} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-7 space-y-4">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleResumeChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {/* Resume upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingResume}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-primary/40 ${
                  uploadedFile || profile?.resume_name
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : selected === 'resume'
                    ? 'border-primary bg-primary/7'
                    : 'border-border bg-background'
                }`}
                data-testid="button-connect-resume"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  {uploadingResume ? (
                    <Upload size={18} className="animate-bounce" />
                  ) : uploadedFile || profile?.resume_name ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <FileText size={18} />
                  )}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">
                    {uploadingResume
                      ? 'Uploading to Supabase Storage…'
                      : uploadedFile
                      ? `Uploaded: ${uploadedFile.name} (${uploadedFile.size})`
                      : profile?.resume_name
                      ? `Current Resume: ${profile.resume_name}`
                      : 'Upload Resume PDF'}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {uploadedFile || profile?.resume_name
                      ? 'Saved to secure private Supabase Storage bucket.'
                      : 'Upload your latest CV (.pdf format) for automated skill extraction.'}
                  </span>
                </span>
                <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
                  {uploadedFile || profile?.resume_name ? 'Replace' : 'Browse File'}
                </span>
              </button>

              {/* Profile Links */}
              <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Globe size={14} className="text-primary" /> Profile Links (Optional)
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="username"
                    className="h-10 w-full rounded-xl border border-input bg-card px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>
          )}

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
              disabled={(index !== 3 && !selected && step !== 'profile') || submitting || uploadingResume}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              data-testid="button-onboarding-continue"
            >
              {submitting ? (
                'Configuring your workspace…'
              ) : index === 3 ? (
                <>
                  <span>Open IterateUP Workspace</span>
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
          You can change any answer later from workspace settings. This is a personalized starting point.
        </p>
      </div>
    </div>
  );
}