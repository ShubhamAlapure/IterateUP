import { useState, type ChangeEvent } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  RefreshCw,
  Sparkles,
  Upload,
  Edit3,
  X,
  Plus,
  Download,
  Building2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { mockStudent } from '@/lib/mock/career-data';
import { useAuth, type UserProfile } from '@/context/auth-context';

export default function ProfilePage() {
  const { profile, user, updateProfile, uploadResume, isConfigured } = useAuth();
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Synced 2 hours ago');
  const [resumeName, setResumeName] = useState(profile?.resume_name || 'Resume.pdf');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fallbacks from profile -> user metadata -> mock
  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : mockStudent.fullName);

  const targetRole = profile?.target_role || 'Software Development Engineer (SDE-1)';
  const college = profile?.college || 'MIT ADT University, Pune';
  const degree = profile?.degree || 'B.Tech Computer Engineering';
  const yearOfStudy = profile?.year_of_study || '3rd Year (Class of 2026)';
  const location = profile?.location || 'Pune, Maharashtra, India';
  const cgpa = profile?.cgpa || '8.5 / 10.0';
  const bio =
    profile?.bio ||
    'Aspiring software development engineer focused on scalable distributed systems, microservices, and algorithmic problem-solving.';
  const targetCompanies =
    profile?.target_companies && profile.target_companies.length > 0
      ? profile.target_companies
      : ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India', 'TCS Digital'];

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SA';

  // Edit Modal Form State
  const [editName, setEditName] = useState(fullName);
  const [editRole, setEditRole] = useState(targetRole);
  const [editCollege, setEditCollege] = useState(college);
  const [editDegree, setEditDegree] = useState(degree);
  const [editYear, setEditYear] = useState(yearOfStudy);
  const [editCgpa, setEditCgpa] = useState(cgpa);
  const [editLocation, setEditLocation] = useState(location);
  const [editBio, setEditBio] = useState(bio);
  const [editGithub, setEditGithub] = useState(profile?.github_username || '');
  const [editLinkedin, setEditLinkedin] = useState(profile?.linkedin_url || '');
  const [editPortfolio, setEditPortfolio] = useState(profile?.portfolio_url || '');
  const [editCompanies, setEditCompanies] = useState<string[]>(targetCompanies);
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const openEditModal = () => {
    setEditName(fullName);
    setEditRole(targetRole);
    setEditCollege(college);
    setEditDegree(degree);
    setEditYear(yearOfStudy);
    setEditCgpa(cgpa);
    setEditLocation(location);
    setEditBio(bio);
    setEditGithub(profile?.github_username || '');
    setEditLinkedin(profile?.linkedin_url || '');
    setEditPortfolio(profile?.portfolio_url || '');
    setEditCompanies(targetCompanies);
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({
      full_name: editName.trim(),
      target_role: editRole.trim(),
      college: editCollege.trim(),
      degree: editDegree.trim(),
      year_of_study: editYear.trim(),
      cgpa: editCgpa.trim(),
      location: editLocation.trim(),
      bio: editBio.trim(),
      github_username: editGithub.trim().replace(/^https?:\/\/(www\.)?github\.com\//, ''),
      linkedin_url: editLinkedin.trim(),
      portfolio_url: editPortfolio.trim(),
      target_companies: editCompanies,
    });
    setIsSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowEditModal(false);
      }, 900);
    }
  };

  const handleAddCompany = () => {
    if (newCompanyInput.trim() && !editCompanies.includes(newCompanyInput.trim())) {
      setEditCompanies([...editCompanies, newCompanyInput.trim()]);
      setNewCompanyInput('');
    }
  };

  const handleRemoveCompany = (c: string) => {
    setEditCompanies(editCompanies.filter((item) => item !== c));
  };

  const handleSimulateSync = () => {
    setIsSyncingGithub(true);
    setTimeout(() => {
      setIsSyncingGithub(false);
      setSyncStatus('Synced just now');
    }, 1200);
  };

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      const { name, error } = await uploadResume(file);
      setIsUploading(false);
      if (!error) {
        setResumeName(name || file.name);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      }
    }
  };

  return (
    <ProductShell>
      <TopBar eyebrow="Your foundation" title="Student Profile">
        <div className="flex items-center gap-2">
          <button
            onClick={openEditModal}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
            data-testid="button-edit-profile"
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={handleSimulateSync}
            disabled={isSyncingGithub}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-primary focus-ring"
          >
            <RefreshCw
              size={13}
              className={isSyncingGithub ? 'animate-spin text-primary' : 'text-muted-foreground'}
            />
            <span>{isSyncingGithub ? 'Syncing...' : 'Sync sources'}</span>
          </button>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Profile Identity Card */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#df9a78] font-display text-2xl font-bold text-[#18252b] shadow-inner">
                {initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {fullName}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold text-primary">
                    <Sparkles size={11} /> {isConfigured ? 'Live Supabase Profile' : 'Verified Student'}
                  </span>
                  <button
                    onClick={openEditModal}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                </div>
                <p className="text-sm font-medium text-foreground/80">{targetRole}</p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-primary" /> {college}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" /> {location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono-ui">
                    GPA {cgpa}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={
                  profile?.github_username
                    ? `https://github.com/${profile.github_username}`
                    : 'https://github.com'
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href={profile?.linkedin_url || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              {profile?.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary"
                >
                  <ExternalLink size={14} /> Portfolio
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{bio}</p>
          </div>

          {/* Target Companies Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
              <Building2 size={13} className="text-primary" /> Target Companies:
            </span>
            {targetCompanies.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-border bg-background/80 px-2.5 py-0.5 font-mono-ui text-[10px] text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* 2 Column: Resume Parser & Connected Integrations */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Resume Upload & Intelligence */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
                  Structured Intelligence
                </p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                  Resume & Document Evidence
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Parsed & Normalized
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{profile?.resume_name || resumeName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF document · Stored in Supabase Private Storage · 96% parser confidence
              </p>

              {uploadSuccess && (
                <p className="mt-2 text-xs font-semibold text-emerald-500">
                  New resume uploaded and saved to your Supabase profile!
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring">
                  <Upload size={13} className={isUploading ? 'animate-spin' : ''} />
                  <span>{isUploading ? 'Uploading to Supabase…' : 'Upload new version'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {profile?.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <Download size={13} /> Download Resume
                  </a>
                ) : (
                  <span className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground">
                    No PDF attached
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Skills Found
                </p>
                <p className="mt-1 font-display text-xl font-bold text-primary">14</p>
                <p className="text-[10px] text-muted-foreground">Normalized against taxonomy</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Experience
                </p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">2 Roles</p>
                <p className="text-[10px] text-muted-foreground">Quantified impact verified</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                  Projects
                </p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">3 Items</p>
                <p className="text-[10px] text-muted-foreground">Linked to public repositories</p>
              </div>
            </div>
          </section>

          {/* Connected Developer Signals */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
                  Live Integrations
                </p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                  Verified Platforms
                </h3>
              </div>
              <span className="font-mono-ui text-[10px] text-muted-foreground">{syncStatus}</span>
            </div>

            <div className="mt-5 space-y-3.5">
              {/* GitHub Card */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground">
                      <Github size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        GitHub (@{profile?.github_username || 'connected'})
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Active repositories · Commits synchronized
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Linkedin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        LinkedIn ({profile?.linkedin_url ? 'Profile linked' : 'Connect link'})
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {college} Student Network
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                </div>
              </div>

              {/* University Training & Placement Cell */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {college} Placement Cell
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {degree} · {yearOfStudy}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Linked
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Academic Profile Details */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
                Academics
              </p>
              <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                Education & Degree Credentials
              </h3>
            </div>
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors"
            >
              <Edit3 size={13} /> Edit credentials
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                Institution
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">{college}</p>
              <p className="text-[11px] text-muted-foreground">{location}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                Degree & Branch
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">{degree}</p>
              <p className="text-[11px] text-muted-foreground">{yearOfStudy}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                Cumulative CGPA
              </p>
              <p className="mt-1 font-display text-xl font-bold text-primary">{cgpa}</p>
              <p className="text-[11px] text-muted-foreground">Academic standing verified</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                Target Role
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">{targetRole}</p>
              <p className="text-[11px] text-muted-foreground">Active recruitment path</p>
            </div>
          </div>
        </section>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl font-bold">Edit Student Profile</h2>
                <p className="text-xs text-muted-foreground">
                  Update your credentials, target role, and career objectives.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check size={14} /> Profile updated successfully in Supabase!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Target Role</label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  College / University
                </label>
                <input
                  type="text"
                  required
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Degree & Branch
                  </label>
                  <input
                    type="text"
                    value={editDegree}
                    onChange={(e) => setEditDegree(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Year of Study
                  </label>
                  <input
                    type="text"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    CGPA / Percentage
                  </label>
                  <input
                    type="text"
                    value={editCgpa}
                    onChange={(e) => setEditCgpa(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Professional Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">GitHub</label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="username"
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Portfolio URL</label>
                  <input
                    type="url"
                    value={editPortfolio}
                    onChange={(e) => setEditPortfolio(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Target Companies */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Target Companies
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {editCompanies.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany(c)}
                        className="hover:text-destructive"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCompanyInput}
                    onChange={(e) => setNewCompanyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCompany();
                      }
                    }}
                    placeholder="Add target company (e.g. Uber, Flipkart)"
                    className="h-9 flex-1 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddCompany}
                    className="rounded-xl border border-border bg-card px-3 text-xs font-semibold hover:border-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Supabase…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProductShell>
  );
}
