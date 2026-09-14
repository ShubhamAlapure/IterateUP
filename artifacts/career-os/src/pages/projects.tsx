import { useState } from 'react';
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  FileCode2,
  FolderGit2,
  Github,
  Layers,
  Lightbulb,
  Plus,
  Rocket,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { projects, ProjectDetail } from '@/lib/mock/career-data';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status.toLowerCase().replaceAll(' ', '-') === statusFilter;
  });

  return (
    <ProductShell>
      <TopBar eyebrow="Proof of work engine" title="Personalized Projects">
        <button
          onClick={() => setSelectedProject(projects[0])}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-primary"
        >
          <Sparkles size={13} className="text-primary" />
          <span>Inspect Architecture Blueprint</span>
        </button>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner Explaining the Engine */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">
                Skill-Gap Guided Builds
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Proof of Work with an Opinion
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Every project below is recommended because it closes a specific gap identified between your current resume and target software engineering roles.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background p-1.5">
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
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono-ui text-[10px] font-bold ${
                      proj.color === 'coral'
                        ? 'bg-[#df9a78]/15 text-[#df9a78]'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    {proj.tag}
                  </span>
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
                      className={`h-full rounded-full ${
                        proj.color === 'coral' ? 'bg-[#df9a78]' : 'bg-primary'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Why this project & gap addressed */}
                <div className="mt-5 space-y-3 rounded-xl border border-border bg-background p-3.5 text-xs">
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-accent font-semibold">
                      Why This Project?
                    </span>
                    <p className="mt-0.5 leading-normal text-muted-foreground">{proj.whyThisProject}</p>
                  </div>
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-primary font-semibold">
                      Skill Gap Addressed:
                    </span>
                    <p className="mt-0.5 leading-normal text-foreground font-medium">{proj.skillGapAddressed}</p>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-secondary-foreground"
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
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary"
                    aria-label="GitHub repo"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
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

              <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                {selectedProject.title} Specification
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{selectedProject.detail}</p>

              {/* Overview & Architecture */}
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Rocket size={14} className="text-primary" /> Architectural Overview
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {selectedProject.specification.overview}
                  </p>
                  <div className="mt-3 rounded-lg bg-secondary/50 p-2.5 font-mono text-[11px] text-foreground">
                    <code>{selectedProject.specification.architecture}</code>
                  </div>
                </div>

                {/* Key Skills Learner gains */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Lightbulb size={14} className="text-accent" /> What this signals to recruiters
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
                        <span className="font-mono-ui text-[10px] text-primary">{idx + 1}.</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended README Structure */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="text-xs font-bold text-foreground">Recommended Portfolio README Section</h4>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] text-foreground">
{`### System Architecture & Trade-offs
- Why ${selectedProject.techStack[0]} over alternative frameworks
- Database indexing strategy to handle concurrent reads
- Sub-second latency benchmark report with k6`}
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold"
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
      </div>
    </ProductShell>
  );
}
