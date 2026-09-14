import { useState } from 'react';
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
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { mockStudent } from '@/lib/mock/career-data';

import { useAuth } from '@/context/auth-context';

export default function ProfilePage() {
  const { profile, uploadResume, isConfigured } = useAuth();
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Synced 2 hours ago');
  const [resumeName, setResumeName] = useState(profile?.resume_name || 'Aarav_Sharma_Resume_2026.pdf');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fullName = profile?.full_name || mockStudent.fullName;
  const targetRole = profile?.target_role || mockStudent.target;
  const college = profile?.college || mockStudent.school;
  const location = profile?.location || mockStudent.location;
  const cgpa = profile?.cgpa || mockStudent.gpa;
  const bio = profile?.bio || mockStudent.bio;
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST';

  const handleSimulateSync = () => {
    setIsSyncingGithub(true);
    setTimeout(() => {
      setIsSyncingGithub(false);
      setSyncStatus('Synced just now');
    }, 1200);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <button
          onClick={handleSimulateSync}
          disabled={isSyncingGithub}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-primary focus-ring"
        >
          <RefreshCw size={13} className={isSyncingGithub ? 'animate-spin text-primary' : 'text-muted-foreground'} />
          <span>{isSyncingGithub ? 'Syncing...' : 'Sync sources'}</span>
        </button>
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
                href={profile?.github_username ? `https://github.com/${profile.github_username}` : 'https://github.com'}
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
              <a
                href={profile?.portfolio_url || 'https://aaravsharma.dev'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{bio}</p>
          </div>
        </section>

        {/* 2 Column: Resume Parser & Connected Integrations */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Resume Upload & Intelligence */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Structured Intelligence</p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">Resume & Document Evidence</h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Parsed & Normalized
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{resumeName}</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF document · Uploaded March 2025 · 96% parser confidence</p>

              {uploadSuccess && (
                <p className="mt-2 text-xs font-semibold text-emerald-500">
                  New resume uploaded and parsed into structured profile!
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring">
                  <Upload size={13} className={isUploading ? 'animate-spin' : ''} />
                  <span>{isUploading ? 'Uploading to Supabase…' : 'Upload new version'}</span>
                  <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} disabled={isUploading} className="hidden" />
                </label>
                <a
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert('Demo: Downloading ' + resumeName); }}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  View parsed JSON
                </a>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Skills Found</p>
                <p className="mt-1 font-display text-xl font-bold text-primary">14</p>
                <p className="text-[10px] text-muted-foreground">Normalized against taxonomy</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Experience</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">2 Roles</p>
                <p className="text-[10px] text-muted-foreground">Quantified impact verified</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Projects</p>
                <p className="mt-1 font-display text-xl font-bold text-foreground">3 Items</p>
                <p className="text-[10px] text-muted-foreground">Linked to public repositories</p>
              </div>
            </div>
          </section>

          {/* Connected Developer Signals */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Live Integrations</p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">Verified Platforms</h3>
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
                      <p className="text-xs font-bold text-foreground">GitHub (@aaravsharma)</p>
                      <p className="text-[11px] text-muted-foreground">34 Repos · 482 Commits this year</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[9px] text-muted-foreground">TypeScript 58%</span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[9px] text-muted-foreground">Python 24%</span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[9px] text-muted-foreground">Rust 18%</span>
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
                      <p className="text-xs font-bold text-foreground">LinkedIn (in/aaravsharma-dev)</p>
                      <p className="text-[11px] text-muted-foreground">500+ Connections · COEP Tech Network</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                </div>
              </div>

              {/* COEP Placement System */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">COEP Training &amp; Placement Cell</p>
                      <p className="text-[11px] text-muted-foreground">Institutional verified student ID: 112103048</p>
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

        {/* Education & Work Experience */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Education */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-primary" />
              <h3 className="font-display text-lg font-bold tracking-tight">Education & Coursework</h3>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">COEP Technological University, Pune</h4>
                    <p className="text-xs text-primary font-medium">B.Tech in Computer Engineering (3rd Year)</p>
                  </div>
                  <span className="font-mono-ui text-xs font-semibold text-muted-foreground">2022 – 2026</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Department of Computer Engineering &amp; IT · CGPA: 8.94 / 10.0
                </p>
                <div className="mt-3">
                  <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Key Coursework:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {['Data Structures & Algorithms', 'Design & Analysis of Algorithms', 'Operating Systems', 'Database Management Systems (DBMS)', 'Computer Networks'].map((course) => (
                      <span key={course} className="rounded-md bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              <h3 className="font-display text-lg font-bold tracking-tight">Work & Leadership Experience</h3>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Veritas Technologies / Makers Lab Pune</h4>
                    <p className="text-xs text-primary font-medium">Software Engineering Intern</p>
                  </div>
                  <span className="font-mono-ui text-xs font-semibold text-muted-foreground">Jun 2024 – Aug 2024</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Built prototype web applications in React 18, TypeScript, and Node.js for cloud analytics dashboards. Reduced query latency by 40% using optimized Redis caching and pagination.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">COEP Computer Society of India (CSI)</h4>
                    <p className="text-xs text-primary font-medium">Technical Secretary &amp; Web Lead</p>
                  </div>
                  <span className="font-mono-ui text-xs font-semibold text-muted-foreground">Sep 2023 – Present</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Lead weekly technical workshops for 120+ students on DSA problem-solving and modern web architecture. Manage the annual flagship technical festival portal.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Certifications & Target Preferences */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Certifications */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-primary" />
              <h3 className="font-display text-lg font-bold tracking-tight">Certifications & Credentials</h3>
            </div>
            <div className="mt-5 space-y-3.5">
              <div className="flex items-start justify-between rounded-xl border border-border bg-background p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">AWS Certified Cloud Practitioner</h4>
                  <p className="text-[11px] text-muted-foreground">Amazon Web Services · Issued Nov 2024 · ID: AWS-849204</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-primary">Active</span>
              </div>
              <div className="flex items-start justify-between rounded-xl border border-border bg-background p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">NPTEL Elite+Silver in Programming &amp; Algorithms</h4>
                  <p className="text-[11px] text-muted-foreground">IIT Kharagpur / Ministry of Education, India · Top 2% National</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-primary">Verified</span>
              </div>
            </div>
          </section>

          {/* Target Role & Career Preferences */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              <h3 className="font-display text-lg font-bold tracking-tight">Target Role & Search Parameters</h3>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-background p-3.5">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Target Roles</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {mockStudent.targetRoles.map((role) => (
                    <span key={role} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-3.5">
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Preferred Locations</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {mockStudent.preferredLocations.map((loc) => (
                    <span key={loc} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProductShell>
  );
}
