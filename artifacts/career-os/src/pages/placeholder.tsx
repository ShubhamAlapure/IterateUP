import { ArrowRight, BookOpen, BriefcaseBusiness, Building2, Layers3, MessageSquareText, Route, Send, Settings, Sparkles, UserRound } from 'lucide-react';
import { Link } from 'wouter';
import { ProductShell, TopBar } from '@/components/career-shell';

const details: Record<string, { eyebrow: string; title: string; description: string; icon: typeof Sparkles }> = {
  profile: { eyebrow: 'Your foundation', title: 'Profile', description: 'A living view of your story, strengths, and the signals you want the right people to notice.', icon: UserRound },
  skills: { eyebrow: 'Your foundation', title: 'Skills', description: 'See what is working, what needs reps, and which skill gap is worth closing next.', icon: Sparkles },
  roadmap: { eyebrow: 'Your foundation', title: 'Roadmap', description: 'A focused sequence of moves that turns your target role into visible progress.', icon: Route },
  projects: { eyebrow: 'Build your edge', title: 'Projects', description: 'Proof of work with enough context to show how you think, not just what you shipped.', icon: Layers3 },
  courses: { eyebrow: 'Build your edge', title: 'Courses', description: 'Learning recommendations connected to the skills and roles you care about.', icon: BookOpen },
  companies: { eyebrow: 'Build your edge', title: 'Companies', description: 'A thoughtful shortlist of places where your interests and signal could meet.', icon: Building2 },
  jobs: { eyebrow: 'Make your move', title: 'Jobs', description: 'Roles ranked by fit and timing, so browsing becomes a deliberate part of your plan.', icon: BriefcaseBusiness },
  applications: { eyebrow: 'Make your move', title: 'Applications', description: 'A calm tracker for every conversation, follow-up, and next step.', icon: Send },
  interview: { eyebrow: 'Make your move', title: 'Interview room', description: 'Practice with context from your target roles and your own evolving story.', icon: MessageSquareText },
  settings: { eyebrow: 'Workspace', title: 'Settings', description: 'Tune your workspace, privacy, and the signals IterateUP uses to guide you.', icon: Settings },
};

export default function PlaceholderPage({ section }: { section: keyof typeof details }) {
  const item = details[section];
  const Icon = item.icon;
  return <ProductShell><TopBar eyebrow={item.eyebrow} title={item.title} /><div className="page-in mx-auto max-w-[980px] px-5 py-8 sm:px-8 lg:px-11"><div className="rounded-[24px] border border-border bg-card p-7 shadow-[0_18px_50px_hsl(222_29%_17%/.05)] sm:p-12"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon size={22} /></span><p className="mt-8 font-mono-ui text-[10px] uppercase tracking-[.17em] text-accent">Coming into focus</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-.065em]">{item.title} is ready for your input.</h2><p className="mt-4 max-w-[510px] text-base leading-7 text-muted-foreground">{item.description}</p><div className="mt-10 rounded-2xl border border-dashed border-border bg-background p-5"><div className="flex items-start gap-3"><div className="mt-0.5 h-2 w-2 rounded-full bg-accent" /><div><p className="text-sm font-semibold">This demo section is intentionally lightweight</p><p className="mt-1 text-xs leading-5 text-muted-foreground">The dashboard is the first surface. This route is linked and ready for the next product pass, without pretending there is data here yet.</p></div></div></div><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg focus-ring" data-testid={`link-return-dashboard-${section}`}>Return to overview <ArrowRight size={16} /></Link></div></div></ProductShell>;
}