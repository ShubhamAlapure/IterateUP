import { useState, useEffect } from 'react';
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  FolderGit2,
  GraduationCap,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  cleanGithubUsername,
  fetchAndEnrichStudentProfile,
} from '@/lib/services/profile-enricher';
import { computeTailoredReadiness } from '@/lib/services/skills-readiness-engine';

export default function SettingsPage() {
  const { profile, updateProfile, isConfigured } = useAuth();

  // Career Targets State
  const [primaryTargetRole, setPrimaryTargetRole] = useState(
    profile?.target_role || profile?.preferences?.primaryTargetRole || 'Full-Stack Engineer (React & Node/Go)'
  );
  const [secondaryRole, setSecondaryRole] = useState(
    profile?.secondary_role || profile?.preferences?.secondaryRole || 'Full-Stack SDE Intern'
  );
  const [targetGraduation, setTargetGraduation] = useState(
    profile?.target_graduation || profile?.preferences?.targetGraduation || 'May / June 2026'
  );
  const [minCompensation, setMinCompensation] = useState(
    profile?.min_target_compensation ||
      profile?.preferences?.minTargetCompensation ||
      '₹60,000/mo (Internship) · ₹14 LPA (Full-time)'
  );

  // Target Companies State
  const [targetCompanies, setTargetCompanies] = useState<string[]>(
    profile?.target_companies && profile.target_companies.length > 0
      ? profile.target_companies
      : ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India']
  );
  const [newCompanyInput, setNewCompanyInput] = useState('');

  // Daily Career Copilot Alerts State
  const [dailyDigest, setDailyDigest] = useState<boolean>(
    profile?.preferences?.notifications?.dailyDigest ?? true
  );
  const [dailyDigestTime, setDailyDigestTime] = useState<string>(
    profile?.preferences?.notifications?.dailyDigestTime || '08:30 AM IST'
  );
  const [jobAlerts, setJobAlerts] = useState<boolean>(
    profile?.preferences?.notifications?.jobAlerts ?? true
  );
  const [interviewReminders, setInterviewReminders] = useState<boolean>(
    profile?.preferences?.notifications?.interviewReminders ?? true
  );

  // Academics & Location State
  const [college, setCollege] = useState(profile?.college || 'MIT ADT University Pune');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech Computer Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.year_of_study || '3rd Year (Class of 2026)');
  const [cgpa, setCgpa] = useState(profile?.cgpa || '8.5 / 10.0');
  const [locationStr, setLocationStr] = useState(profile?.location || 'Pune, Maharashtra, India');

  // Handles & Bio State
  const [githubUsername, setGithubUsername] = useState(profile?.github_username || 'ShubhamAlapure');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || 'https://linkedin.com/in/shubham-alapure');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url || '');
  const [bio, setBio] = useState(
    profile?.bio ||
      'Aspiring engineer with strong algorithmic foundations, building robust distributed systems and web products.'
  );

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState(
    profile?.preferences?.privacy?.profileVisibility || 'Verified Product Companies & Campus Mentors'
  );
  const [universityAffiliation, setUniversityAffiliation] = useState(
    profile?.preferences?.privacy?.universityAffiliation ||
      'Authorized for College Placement Cell & Career Advisor Guidance'
  );

  // UI status states
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings & preferences saved to Supabase!');

  // Sync state if profile loads asynchronously
  useEffect(() => {
    if (profile) {
      if (profile.target_role) setPrimaryTargetRole(profile.target_role);
      if (profile.secondary_role) setSecondaryRole(profile.secondary_role);
      if (profile.target_graduation) setTargetGraduation(profile.target_graduation);
      if (profile.min_target_compensation) setMinCompensation(profile.min_target_compensation);
      if (profile.college) setCollege(profile.college);
      if (profile.degree) setDegree(profile.degree);
      if (profile.year_of_study) setYearOfStudy(profile.year_of_study);
      if (profile.cgpa) setCgpa(profile.cgpa);
      if (profile.location) setLocationStr(profile.location);
      if (profile.github_username) setGithubUsername(profile.github_username);
      if (profile.linkedin_url) setLinkedinUrl(profile.linkedin_url);
      if (profile.portfolio_url) setPortfolioUrl(profile.portfolio_url);
      if (profile.bio) setBio(profile.bio);
      if (profile.target_companies && profile.target_companies.length > 0) {
        setTargetCompanies(profile.target_companies);
      }
      if (profile.preferences?.notifications) {
        setDailyDigest(profile.preferences.notifications.dailyDigest);
        setDailyDigestTime(profile.preferences.notifications.dailyDigestTime || '08:30 AM IST');
        setJobAlerts(profile.preferences.notifications.jobAlerts);
        setInterviewReminders(profile.preferences.notifications.interviewReminders);
      }
      if (profile.preferences?.privacy) {
        setProfileVisibility(profile.preferences.privacy.profileVisibility || 'Verified Product Companies & Campus Mentors');
        setUniversityAffiliation(profile.preferences.privacy.universityAffiliation || 'Authorized for College Placement Cell & Career Advisor Guidance');
      }
    }
  }, [profile]);

  // Handle Target Company Add & Remove
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyInput.trim()) return;
    const name = newCompanyInput.trim();
    if (!targetCompanies.includes(name)) {
      setTargetCompanies([...targetCompanies, name]);
    }
    setNewCompanyInput('');
  };

  const handleRemoveCompany = (name: string) => {
    setTargetCompanies(targetCompanies.filter((c) => c !== name));
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const cleanGh = cleanGithubUsername(githubUsername);
      const isRoleOrGhChanged =
        cleanGh !== profile?.github_username ||
        primaryTargetRole !== profile?.target_role ||
        linkedinUrl !== profile?.linkedin_url;

      let signals = null;
      if (isRoleOrGhChanged && cleanGh) {
        signals = await fetchAndEnrichStudentProfile(cleanGh, linkedinUrl.trim(), primaryTargetRole);
      }

      const interimProfile = {
        ...profile,
        target_role: primaryTargetRole.trim(),
        college: college.trim(),
        degree: degree.trim(),
        year_of_study: yearOfStudy.trim(),
        cgpa: cgpa.trim(),
        github_username: cleanGh,
        linkedin_url: linkedinUrl.trim(),
      };
      const tailored = computeTailoredReadiness(interimProfile as any, signals, primaryTargetRole);
      const newScore = tailored.overallScore;

      await updateProfile({
        target_role: primaryTargetRole.trim(),
        secondary_role: secondaryRole.trim(),
        target_graduation: targetGraduation.trim(),
        min_target_compensation: minCompensation.trim(),
        target_companies: targetCompanies,
        college: college.trim(),
        degree: degree.trim(),
        year_of_study: yearOfStudy.trim(),
        cgpa: cgpa.trim(),
        location: locationStr.trim(),
        github_username: cleanGh,
        linkedin_url: linkedinUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        bio: bio.trim(),
        readiness_score: newScore,
        ...(signals
          ? {
              skills_count: signals.skillsFoundCount,
              experience_count: signals.experienceCount,
              projects_count: signals.projectsCount,
              synced_projects: signals.projects,
              synced_skills: signals.skills,
              github_synced_at: new Date().toISOString(),
            }
          : {}),
        preferences: {
          primaryTargetRole: primaryTargetRole.trim(),
          secondaryRole: secondaryRole.trim(),
          targetGraduation: targetGraduation.trim(),
          minTargetCompensation: minCompensation.trim(),
          notifications: {
            dailyDigest,
            dailyDigestTime,
            jobAlerts,
            interviewReminders,
          },
          privacy: {
            profileVisibility,
            universityAffiliation,
          },
        },
      });

      setToastMessage(
        isRoleOrGhChanged
          ? 'Settings saved & signals re-analyzed! All 5 engines recalibrated.'
          : 'Settings & preferences saved to Supabase successfully!'
      );
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProductShell>
      <TopBar eyebrow="Workspace control" title="Settings & Preferences">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60 focus-ring"
        >
          {isSaving ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={13} />
              <span>Save changes</span>
            </>
          )}
        </button>
      </TopBar>

      <div className="page-in mx-auto max-w-[1000px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {saveToast && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Career Targets Section */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Sliders size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Career Targets</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              These inputs calibrate your Career Readiness Score, Proof-of-Work Projects, and Coursework priorities.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold text-foreground">Primary Target Role</label>
                <input
                  type="text"
                  value={primaryTargetRole}
                  onChange={(e) => setPrimaryTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer (React & Node/Go)"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Secondary Target Role</label>
                <input
                  type="text"
                  value={secondaryRole}
                  onChange={(e) => setSecondaryRole(e.target.value)}
                  placeholder="e.g. Full-Stack SDE Intern or Backend Systems"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Target Graduation Window</label>
                <input
                  type="text"
                  value={targetGraduation}
                  onChange={(e) => setTargetGraduation(e.target.value)}
                  placeholder="e.g. May / June 2026"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Minimum Compensation Target</label>
                <input
                  type="text"
                  value={minCompensation}
                  onChange={(e) => setMinCompensation(e.target.value)}
                  placeholder="e.g. ₹60,000/mo (Internship) · ₹14 LPA (Full-time)"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Target Companies Section */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Building2 size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Target Companies</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Prioritize company benchmarks that calibrate your 3-pillar match scores on the Target Companies page.
            </p>

            {/* Existing Company Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {targetCompanies.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  <span>{comp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(comp)}
                    className="text-muted-foreground hover:text-destructive"
                    title={`Remove ${comp}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Company Form */}
            <div className="mt-4 flex max-w-md items-center gap-2">
              <input
                type="text"
                value={newCompanyInput}
                onChange={(e) => setNewCompanyInput(e.target.value)}
                placeholder="Add target company (e.g. CRED, Google, Stripe)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCompany}
                className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 shrink-0"
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </section>

          {/* Daily Career Copilot Alerts */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Bell size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">
                Daily Career Copilot &amp; Alerts
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure how IterateUP prompts your morning priority checklist and upcoming deadlines.
            </p>

            <div className="mt-5 space-y-3.5 text-xs">
              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Morning Priorities Digest</p>
                  <p className="text-muted-foreground">
                    Receive your top 3 daily actions at {dailyDigestTime}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">High-Fit Job Match Alerts (85%+)</p>
                  <p className="text-muted-foreground">
                    Notify immediately when a new internship or SDE role matches your verified skills
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={jobAlerts}
                  onChange={(e) => setJobAlerts(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Interview Countdown &amp; STAR Practice Reminders</p>
                  <p className="text-muted-foreground">
                    Alert 24 hours prior to active technical coding &amp; architecture rounds
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={interviewReminders}
                  onChange={(e) => setInterviewReminders(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>

          {/* Academic & Campus Context */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Academic &amp; Campus Context</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Calibrates campus placement drive windows and institutional network benchmarks.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold text-foreground">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. MIT ADT University Pune"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Degree &amp; Major</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Engineering"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Year of Study</label>
                <input
                  type="text"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  placeholder="e.g. 3rd Year (Class of 2026)"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">Current CGPA</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g. 8.5 / 10.0"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-foreground">Location</label>
                <input
                  type="text"
                  value={locationStr}
                  onChange={(e) => setLocationStr(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra, India"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Developer Handles & Integrations */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <FolderGit2 size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">Developer Profiles &amp; Signals</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Connected handles feed code proof-of-work into your Readiness Score and Project Engine.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block font-semibold text-foreground">GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. ShubhamAlapure"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/shubham-alapure"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-foreground">Portfolio / Personal Website</label>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="e.g. https://shubhamalapure.dev"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-foreground">Developer Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Privacy & Student Data Protection */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              <Shield size={18} />
              <h3 className="font-display text-lg font-bold text-foreground">
                Privacy &amp; Data Boundaries
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Your data stays yours. We do not sell student resumes or publish your profile to unverified recruiters.
            </p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="rounded-xl border border-border bg-background p-3.5">
                <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Profile Visibility
                </span>
                <p className="mt-1 font-semibold text-foreground">
                  {profileVisibility}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-3.5">
                <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Institutional Connection
                </span>
                <p className="mt-1 font-semibold text-foreground">
                  {universityAffiliation}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  College placement portal is authorized for career advisor guidance.
                </p>
              </div>
            </div>
          </section>

          {/* Save Action Footer */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Changes sync directly to Supabase PostgreSQL &amp; local memory.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60 focus-ring"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ProductShell>
  );
}
