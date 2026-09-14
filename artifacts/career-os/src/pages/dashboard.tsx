import { useState } from 'react';
import { Check, ChevronRight, Clock3, ExternalLink, Flame, Lightbulb, Plus, TrendingUp } from 'lucide-react';
import { PageLink, ProductShell, TopBar } from '@/components/career-shell';
import { applicationActivity, jobMatches, mockStudent, projects, readiness, roadmap, skills, todayActions } from '@/lib/mock/career-data';

import { useAuth } from '@/context/auth-context';

function ReadinessCard() {
  const { profile } = useAuth();
  const currentScore = profile?.readiness_score ?? readiness.score;
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#1f3335] p-6 text-[#f7f3e9] shadow-[0_14px_34px_hsl(222_29%_17%/.12)] sm:p-7">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-[#9bd8b9]/8" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#a9dfc4]">
              Career readiness
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-6xl font-bold leading-none tracking-[-.08em]">
                {currentScore}
              </span>
              <span className="mb-1 font-mono-ui text-sm text-[#9bd8b9]">/100</span>
            </div>
          </div>
          <span className="rounded-full bg-[#9bd8b9]/12 px-2.5 py-1 font-mono-ui text-[10px] text-[#b4e4cc]">
            {readiness.delta} this month
          </span>
        </div>
        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#9bd8b9]"
            style={{ width: `${currentScore}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-[#c5d2cc]">{readiness.label}</span>
          <span className="text-[#9bd8b9]">Next: {readiness.nextMilestone}</span>
        </div>
        <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
          <TrendingUp size={17} className="text-[#df9a78]" />
          <p className="text-xs leading-5 text-[#d5e1d9]">
            Your strongest signal is{' '}
            <strong className="font-semibold text-[#f7f3e9]">
              {profile?.target_role ? 'aligned with your target' : 'product thinking'}
            </strong>
            . Let’s make it visible.
          </p>
        </div>
      </div>
    </section>
  );
}

function ActionList() {
  const [completed, setCompleted] = useState<string[]>([]);
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Your next actions</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">Today, on purpose.</h2></div><span className="rounded-full bg-primary/10 px-2 py-1 font-mono-ui text-[10px] text-primary">{completed.length} / 3 done</span></div><div className="mt-5 divide-y divide-border">{todayActions.map((action) => { const done = completed.includes(action.id); return <div key={action.id} className={`group flex gap-3 py-4 first:pt-0 last:pb-0 ${done ? 'opacity-55' : ''}`}><button onClick={() => setCompleted((current) => done ? current.filter((id) => id !== action.id) : [...current, action.id])} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${done ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`} aria-label={done ? `Mark ${action.title} incomplete` : `Mark ${action.title} complete`} data-testid={`button-complete-${action.id}`}>{done && <Check size={12} />}</button><a href={action.href} className="min-w-0 flex-1 focus-ring" data-testid={`link-action-${action.id}`}><div className="flex items-center gap-2"><span className={`font-mono-ui text-[9px] uppercase tracking-[.12em] ${action.kind === 'Focus' ? 'text-accent' : 'text-muted-foreground'}`}>{action.kind}</span>{action.state === 'in-progress' && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}</div><p className={`mt-1 text-sm font-semibold leading-5 ${done ? 'line-through' : ''}`}>{action.title}</p><p className="mt-1 text-xs text-muted-foreground">{action.meta}</p></a><ChevronRight size={16} className="mt-6 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div>; })}</div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary" onClick={() => window.alert('Your weekly plan is ready to personalize from Roadmap.')} data-testid="button-add-action"><Plus size={14} /> Add a focus for today</button></section>;
}

function SkillGaps() {
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Signal map</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">Skills in motion</h2></div><PageLink href="/skills">View all</PageLink></div><div className="mt-6 space-y-5">{skills.map((skill) => <div key={skill.name}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold">{skill.name}</span><span className={`font-mono-ui text-[10px] ${skill.trend === 'focus' ? 'text-accent' : 'text-muted-foreground'}`}>{skill.trend === 'focus' ? 'Focus next' : `${skill.score}%`}</span></div><div className="progress-track h-2 overflow-hidden rounded-full"><div className={`h-full rounded-full ${skill.color === 'coral' ? 'progress-fill-warm' : 'progress-fill'}`} style={{ width: `${skill.score}%` }} /></div></div>)}</div><div className="mt-6 flex gap-3 rounded-xl bg-accent/8 p-3.5"><Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" /><p className="text-xs leading-5 text-muted-foreground"><strong className="text-foreground">One useful gap:</strong> algorithms is holding back otherwise strong role matches.</p></div></section>;
}

function RoadmapCard() {
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Your roadmap</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">The next three chapters.</h2></div><PageLink href="/roadmap">Open roadmap</PageLink></div><div className="mt-7 space-y-0">{roadmap.map((item, index) => <div key={item.phase} className="relative flex gap-4 pb-7 last:pb-0"><div className="relative z-10 flex shrink-0 flex-col items-center"><span className={`grid h-7 w-7 place-items-center rounded-full border font-mono-ui text-[10px] ${item.status === 'complete' ? 'border-primary bg-primary text-primary-foreground' : item.status === 'current' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground'}`}>{item.status === 'complete' ? <Check size={13} /> : item.phase}</span>{index < roadmap.length - 1 && <span className={`absolute top-7 h-full w-px ${item.status === 'complete' ? 'bg-primary' : 'bg-border'}`} />}</div><div className="pt-0.5"><div className="flex items-center gap-2"><p className={`text-sm font-semibold ${item.status === 'current' ? 'text-primary' : ''}`}>{item.title}</p>{item.status === 'current' && <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono-ui text-[8px] uppercase tracking-wider text-accent">Now</span>}</div><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>{item.status === 'current' && <div className="mt-3 flex items-center gap-3"><div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted"><div className="h-full w-[62%] rounded-full bg-primary" /></div><span className="font-mono-ui text-[10px] text-muted-foreground">{item.progress}%</span></div>}</div></div>)}</div></section>;
}

function ProjectAndJobs() {
  return <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Proof of work</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">Projects with a point of view.</h2></div><PageLink href="/projects">All projects</PageLink></div><div className="mt-6 space-y-3">{projects.map((project) => <a href="/projects" key={project.title} className="group block rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm" data-testid={`link-project-${project.title.toLowerCase()}`}><div className="flex items-start justify-between gap-3"><div><span className={`font-mono-ui text-[9px] uppercase tracking-[.12em] ${project.color === 'coral' ? 'text-accent' : 'text-primary'}`}>{project.tag}</span><p className="mt-1 text-sm font-bold">{project.title}</p><p className="mt-1 text-xs text-muted-foreground">{project.detail}</p></div><ExternalLink size={14} className="text-muted-foreground transition-colors group-hover:text-primary" /></div><div className="mt-4 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${project.color === 'coral' ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${project.progress}%` }} /></div><span className="font-mono-ui text-[9px] text-muted-foreground">{project.progress}%</span></div></a>)}</div><a href="/projects" className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary" data-testid="link-new-project"><Plus size={14} /> Add a project</a></section><section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Market signal</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">Roles worth a look.</h2></div><PageLink href="/jobs">Explore jobs</PageLink></div><div className="mt-5 divide-y divide-border">{jobMatches.map((job) => <a href="/jobs" key={job.company} className="group flex items-start gap-3 py-4 first:pt-0 last:pb-0" data-testid={`link-job-${job.company.toLowerCase()}`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary font-display text-sm font-bold text-primary">{job.company.slice(0, 1)}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{job.role}</p><p className="mt-1 text-xs text-muted-foreground">{job.company} · {job.location}</p></div><span className="shrink-0 font-mono-ui text-[11px] font-medium text-primary">{job.match}%</span></div><p className="mt-2 text-[11px] text-muted-foreground">{job.signal}</p></div><ChevronRight size={15} className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></a>)}</div></section></div>;
}

function Activity() {
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Application pulse</p><h2 className="mt-2 font-display text-[22px] font-bold tracking-[-.05em]">Keep the loop warm.</h2></div><PageLink href="/applications">Open tracker</PageLink></div><div className="mt-5 grid gap-2 md:grid-cols-3">{applicationActivity.map((item) => <a href="/applications" key={item.company} className="flex items-center gap-3 rounded-xl bg-background p-3 transition-colors hover:bg-secondary" data-testid={`link-application-${item.company.toLowerCase()}`}><div className={`h-2 w-2 rounded-full ${item.color === 'teal' ? 'bg-primary' : item.color === 'gold' ? 'bg-accent' : 'bg-muted-foreground'}`} /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{item.company}</p><p className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.role}</p></div><div className="text-right"><p className="text-[10px] font-semibold text-primary">{item.status}</p><p className="mt-0.5 font-mono-ui text-[9px] text-muted-foreground">{item.date}</p></div></a>)}</div></section>;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const firstName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : mockStudent.firstName;

  return (
    <ProductShell>
      <TopBar eyebrow="Tuesday, March 25, 2025" title={`Good morning, ${firstName}.`}>
        <button
          className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-primary sm:flex"
          data-testid="button-view-week"
        >
          <Clock3 size={14} className="text-primary" /> Weekly view
        </button>
      </TopBar>
      <div className="page-in mx-auto max-w-[1420px] space-y-5 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
          <ReadinessCard />
          <ActionList />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <SkillGaps />
          <RoadmapCard />
        </div>
        <ProjectAndJobs />
        <Activity />
        <div className="flex items-center justify-center gap-2 pb-5 pt-2 text-xs text-muted-foreground">
          <Flame size={14} className="text-accent" /> Keep showing up. Momentum is a skill.
        </div>
      </div>
    </ProductShell>
  );
}