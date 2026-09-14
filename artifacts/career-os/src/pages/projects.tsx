import { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  FileCode2,
  FolderGit2,
  Github,
  GitPullRequest,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  Rocket,
  Sparkles,
  Star,
  Target,
  Terminal,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  buildPersonalizedProjects,
  generateAiCustomProjectBlueprint,
  loadSavedCustomProjects,
  saveCustomProjects,
  PersonalizedProject,
} from '@/lib/services/project-engine';
import {
  getCachedEnrichedSignals,
  fetchAndEnrichStudentProfile,
  cleanGithubUsername,
  EnrichedSignalData,
} from '@/lib/services/profile-enricher';

export default function ProjectsPage() {
  const { profile } = useAuth();
  const profileId = profile?.id || 'demo-student';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PersonalizedProject | null>(null);

  // Custom added projects state
  const [customProjects, setCustomProjects] = useState<PersonalizedProject[]>(() => {
    return loadSavedCustomProjects(profileId);
  });

  // AI Architect modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSkillGap, setAiSkillGap] = useState('Distributed Caching & Redis');
  const [aiTargetCompany, setAiTargetCompany] = useState(profile?.target_companies?.[0] || 'Razorpay');

  // Manual Add Project Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newGithub, setNewGithub] = useState('');

  // Cached/live signals
  const [enrichedData, setEnrichedData] = useState<EnrichedSignalData | null>(() => {
    const gh = profile?.github_username || 'ShubhamAlapure';
    return getCachedEnrichedSignals(gh);
  });

  // Build personalized projects list from real GitHub repos and role skill gaps
  const projectList: PersonalizedProject[] = useMemo(() => {
    return buildPersonalizedProjects(profile, enrichedData, customProjects);
  }, [profile, enrichedData, customProjects]);

  // Filter projects by status
  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      if (statusFilter === 'all') return true;
      return p.status.toLowerCase().replaceAll(' ', '-') === statusFilter;
    });
  }, [projectList, statusFilter]);

  // Handle AI Project Generation
  const handleGenerateAiProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    try {
      const generated = await generateAiCustomProjectBlueprint(profile, aiSkillGap, aiTargetCompany);
      const updated = [generated, ...customProjects];
      setCustomProjects(updated);
      saveCustomProjects(profileId, updated);
      setSelectedProject(generated);
      setShowAiModal(false);
    } catch (err) {
      console.warn('AI Project generation failed:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handle manual project addition
  const handleManualAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const techArray = newTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProj: PersonalizedProject = {
      id: `manual-proj-${Date.now()}`,
      title: newTitle.trim(),
      detail: newDetail.trim() || 'Custom software engineering proof-of-work project.',
      tag: 'Custom Proof of Work',
      progress: 50,
      color: 'teal',
      whyThisProject: `Demonstrates hands-on engineering initiative closing specific competencies for ${profile?.target_role || 'SDE'} roles.`,
      skillGapAddressed: techArray.slice(0, 3).join(', ') || 'Software Architecture',
      whatYouWillLearn: [
        'Modular system design with clear component separation',
        'End-to-end implementation from data schema to user interface',
        'Comprehensive testing and production deployment',
      ],
      techStack: techArray.length > 0 ? techArray : ['TypeScript', 'React', 'Node.js'],
      githubUrl: newGithub.trim() || `https://github.com/${profile?.github_username || 'candidate'}`,
      status: 'In Progress',
      isLiveRepo: false,
      specification: {
        overview: newDetail.trim() || 'Custom candidate-engineered software project.',
        architecture: `Client Interface -> API Service -> Database Storage`,
        milestones: [
          'Design core entities and database relations',
          'Implement business logic and API endpoints',
          'Deploy application with live URL and benchmark report',
        ],
      },
    };

    const updated = [newProj, ...customProjects];
    setCustomProjects(updated);
    saveCustomProjects(profileId, updated);
    setNewTitle('');
    setNewDetail('');
    setNewTech('');
    setNewGithub('');
    setShowAddModal(false);
  };

  const ghUsername = profile?.github_username || 'ShubhamAlapure';
  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';

  return (
    <ProductShell>
      <TopBar eyebrow="Proof of work engine" title="Personalized Projects">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary shadow-sm hover:bg-primary/20 focus-ring"
            title="Generate a custom proof-of-work project with Groq LPU"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden sm:inline">AI Project Architect</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 focus-ring"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Link / Add Project</span>
          </button>
          <button
            onClick={() => setSelectedProject(projectList[0])}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <FileCode2 size={13} />
            <span>Blueprint</span>
          </button>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner Explaining the Engine */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary font-bold">
                  Skill-Gap Guided Builds
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono-ui text-[10px] text-emerald-600 dark:text-emerald-400">
                  <UserCheck size={11} /> Live GitHub Evidence
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Proof of Work with an Opinion
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Zero mock projects. Every build below is directly sourced from your verified GitHub repositories (@{ghUsername}) or architected to close specific gaps for your target role: <strong className="text-foreground">{targetRole}</strong>.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background p-1.5 shrink-0">
              {['all', 'in-progress', 'planned', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st.replaceAll('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono-ui text-[10px] font-bold ${
                        proj.color === 'coral'
                          ? 'bg-[#df9a78]/15 text-[#df9a78]'
                          : proj.color === 'gold'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {proj.tag}
                    </span>
                    {proj.isLiveRepo && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={10} /> Verified Repo
                      </span>
                    )}
                  </div>
                  <span className="font-mono-ui text-[10px] text-muted-foreground">{proj.status}</span>
                </div>

                <h3 className="mt-3 font-display text-xl font-bold text-foreground">{proj.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{proj.detail}</p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">Build Progress</span>
                    <span className="font-mono-ui text-[11px] font-semibold text-primary">{proj.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.color === 'coral'
                          ? 'bg-[#df9a78]'
                          : proj.color === 'gold'
                          ? 'bg-amber-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Why this project & gap addressed */}
                <div className="mt-5 space-y-3 rounded-xl border border-border bg-background p-3.5 text-xs">
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                      <Target size={11} /> Why This Project?
                    </span>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">{proj.whyThisProject}</p>
                  </div>
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                      <Zap size={11} /> Skill Gap Addressed:
                    </span>
                    <p className="mt-0.5 leading-relaxed text-foreground font-medium">{proj.skillGapAddressed}</p>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-secondary-foreground font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent focus-ring"
                >
                  <FileCode2 size={13} /> View Blueprint
                </button>

                <div className="flex items-center gap-2">
                  {proj.stars !== undefined && proj.stars > 0 && (
                    <span className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 font-mono-ui text-[10px] text-muted-foreground">
                      <Star size={11} className="text-amber-500" /> {proj.stars}
                    </span>
                  )}
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary"
                    aria-label="GitHub repo"
                    title="Open GitHub Repository"
                  >
                    <Github size={14} />
                  </a>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary"
                      aria-label="Live demo"
                      title="Open Live Deployment"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blueprint Specification Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 space-y-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold text-primary">
                  Architecture Blueprint
                </span>
                <span className="font-mono-ui text-xs text-muted-foreground">
                  {selectedProject.status}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground">
                {selectedProject.title} Specification
              </h2>
              <p className="text-xs text-muted-foreground">{selectedProject.detail}</p>

              {/* Overview & Architecture */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Rocket size={14} className="text-primary" /> Architectural Overview
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {selectedProject.specification.overview}
                  </p>
                  <div className="mt-3 rounded-lg bg-secondary/60 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
                    <code>{selectedProject.specification.architecture}</code>
                  </div>
                </div>

                {/* Key Skills Learner gains */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Lightbulb size={14} className="text-accent" /> What this signals to technical recruiters
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {selectedProject.whatYouWillLearn.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Terminal size={14} className="text-primary" /> Implementation Milestones
                  </h4>
                  <div className="mt-2.5 space-y-2">
                    {selectedProject.specification.milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono-ui text-[10px] text-primary font-bold">{idx + 1}.</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Portfolio README Section */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="text-xs font-bold text-foreground">Recommended Portfolio README Section</h4>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] text-foreground">
{`### System Architecture & Trade-offs
- Why ${selectedProject.techStack[0]} was chosen over alternative frameworks
- Database indexing strategy to handle concurrent reads with PostgreSQL / Redis
- Sub-second latency benchmark report under simulated concurrent traffic`}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Close
                </button>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                >
                  <Github size={14} /> Open Repository
                </a>
              </div>
            </div>
          </div>
        )}

        {/* AI Project Architect Modal */}
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
                    AI Proof-of-Work Architect
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Synthesize a custom engineering build tailored to your dream company and verified skill gap.
                  </p>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleGenerateAiProject} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Skill Gap to Address</label>
                  <select
                    value={aiSkillGap}
                    onChange={(e) => setAiSkillGap(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  >
                    <option>Distributed Caching & Redis</option>
                    <option>Docker Containerization & CI/CD Pipelines</option>
                    <option>Production PostgreSQL & Indexing</option>
                    <option>High-Throughput Asynchronous Event Queues</option>
                    <option>Semantic Vector Search & RAG Knowledge Engine</option>
                    <option>Next.js 15 Streaming SSR & Web Vitals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Target Company Standard</label>
                  <input
                    type="text"
                    value={aiTargetCompany}
                    onChange={(e) => setAiTargetCompany(e.target.value)}
                    placeholder="e.g. Razorpay, PhonePe, Swiggy, Atlassian"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Synthesizing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} /> Synthesize Blueprint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manual Add / Link Project Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Link / Add Project</h3>
                  <p className="text-xs text-muted-foreground">
                    Add any personal repository or planned build to your Proof-of-Work portfolio.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualAddProject} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Project Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. PeerUP Distributed Collaboration Platform"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">One-Line Description</label>
                  <input
                    type="text"
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                    placeholder="e.g. Real-time collaboration network with WebSockets and Redis"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="e.g. TypeScript, React, Node.js, Redis"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">GitHub URL (optional)</label>
                  <input
                    type="url"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                  >
                    Add to Portfolio
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
