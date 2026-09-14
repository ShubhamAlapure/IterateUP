import { Link } from 'wouter';
import { ArrowRight, Check, ChevronRight, CircleCheck, Compass, LineChart, Sparkles, Target, Zap } from 'lucide-react';
import { DemoPill, Wordmark } from '@/components/career-shell';

export default function Landing() {
  return (
    <div className="grain mesh-bg min-h-[100dvh] overflow-hidden">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Wordmark />
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#method" className="transition-colors hover:text-foreground" data-testid="link-method">How it works</a>
          <a href="#signal" className="transition-colors hover:text-foreground" data-testid="link-signal">The signal</a>
          <Link href="/login" className="font-semibold text-foreground focus-ring" data-testid="link-login-nav">Log in</Link>
          <Link href="/signup" className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring" data-testid="link-signup-nav">Start with IterateUP</Link>
        </div>
        <Link href="/login" className="text-sm font-semibold text-primary md:hidden" data-testid="link-login-mobile">Log in</Link>
      </nav>

      <main>
        <section className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 md:grid-cols-[1.04fr_.96fr] md:pb-28 md:pt-24 lg:px-10">
          <div className="rise-in">
            <DemoPill />
            <h1 className="mt-7 max-w-[680px] font-display text-[clamp(3.5rem,7vw,6.7rem)] font-bold leading-[.95] tracking-[-.075em] text-foreground">A clearer path<br /><span className="text-primary">forward.</span></h1>
            <p className="mt-7 max-w-[510px] text-[17px] leading-8 text-muted-foreground">IterateUP turns your ambition into a focused operating system — the right skills, proof, and next move for the career you are actually building.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="group inline-flex items-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_24px_hsl(162_57%_33%/.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_hsl(162_57%_33%/.25)] focus-ring" data-testid="link-start-free">Start with your goal <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/dashboard" className="text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-primary focus-ring" data-testid="link-see-demo">Explore the demo</Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" /> Built for students</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" /> Your data stays yours</span></div>
          </div>
          <div className="relative rise-in delay-2">
            <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-[#96d8b9]/20 blur-3xl" />
            <div className="relative rounded-[28px] border border-border bg-card/90 p-3 shadow-[0_28px_80px_hsl(222_29%_17%/.1)]">
              <div className="rounded-[21px] bg-[#1f3335] p-5 text-[#f7f3e9] sm:p-7">
                <div className="flex items-start justify-between"><div><p className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#9bcdb6]">Your career readiness</p><p className="mt-2 font-display text-5xl font-bold tracking-[-.07em]">68<span className="text-xl text-[#9bcdb6]">/100</span></p></div><div className="rounded-full border border-[#9bcdb6]/25 bg-[#9bcdb6]/10 px-2.5 py-1 text-[10px] text-[#b6e5ce]">+8 this month</div></div>
                <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#405253]"><div className="h-full w-[68%] rounded-full bg-[#9bd8b9]" /></div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-[#aebebe]">Strongest signal</p><p className="mt-2 text-sm font-semibold">Product thinking</p><div className="mt-3 h-1 rounded-full bg-[#405253]"><div className="h-full w-[78%] rounded-full bg-[#df9a78]" /></div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-[#aebebe]">Next opportunity</p><p className="mt-2 text-sm font-semibold">Ship proof of work</p><p className="mt-3 text-[11px] text-[#9bcdb6]">High impact · 45 min</p></div>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#9bcdb6]/20 bg-[#9bcdb6]/10 p-4"><CircleCheck size={18} className="text-[#9bd8b9]" /><p className="text-xs leading-relaxed text-[#d3e5db]">You are closer than your resume makes it look.</p></div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-7 hidden w-48 rounded-2xl border border-border bg-card p-4 shadow-xl sm:block"><div className="flex items-center justify-between"><p className="text-xs font-semibold">This week</p><span className="font-mono-ui text-[10px] text-primary">3 / 5</span></div><div className="mt-3 flex gap-1.5">{[1,1,1,0,0].map((filled, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${filled ? 'bg-primary' : 'bg-muted'}`} />)}</div><p className="mt-3 text-[11px] text-muted-foreground">A little progress, on purpose.</p></div>
          </div>
        </section>

        <section id="method" className="border-y border-border/80 bg-card/55">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10">
            <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">The IterateUP method</p><h2 className="mt-4 max-w-[420px] font-display text-4xl font-bold leading-tight tracking-[-.06em]">Career growth, without the noise.</h2></div><p className="max-w-[520px] self-end text-base leading-7 text-muted-foreground">Most advice is a list. Your career is a system. IterateUP connects the dots between where you are, where you want to go, and what will move the needle this week.</p></div>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {[{ icon: Compass, number: '01', title: 'See yourself clearly', body: 'Map what you can do today — beyond a flat list of skills.' }, { icon: Target, number: '02', title: 'Choose the right moves', body: 'A focused roadmap built around your target, not a generic checklist.' }, { icon: Zap, number: '03', title: 'Build visible momentum', body: 'Turn small actions into proof that compounds with every week.' }].map(({ icon: Icon, number, title, body }) => <div key={number} className="group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"><div className="flex items-center justify-between"><span className="font-mono-ui text-xs text-muted-foreground">{number}</span><Icon size={20} className="text-primary transition-transform group-hover:rotate-12" /></div><h3 className="mt-12 font-display text-xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></div>)}
            </div>
          </div>
        </section>

        <section id="signal" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div><div className="flex items-center gap-2 text-primary"><LineChart size={18} /><span className="font-mono-ui text-[10px] uppercase tracking-[.18em]">One connected picture</span></div><h2 className="mt-5 max-w-[500px] font-display text-4xl font-bold leading-tight tracking-[-.06em] sm:text-5xl">Know what matters<br />before you <span className="text-accent">apply.</span></h2><p className="mt-6 max-w-[470px] text-base leading-7 text-muted-foreground">Your readiness is not a mystery number. It is a living readout of your signal, skill gaps, proof of work, and market fit.</p><Link href="/signup" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent focus-ring" data-testid="link-build-plan">Build my plan <ChevronRight size={16} /></Link></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4"><div className="col-span-2 rounded-2xl border border-border bg-card p-5 soft-shadow sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">Signal map</p><p className="mt-1 font-display text-xl font-bold tracking-[-.04em]">What makes you stand out</p></div><Sparkles size={19} className="text-accent" /></div><div className="mt-6 flex items-end gap-2">{[42,58,49,72,66,82,78,92,86,100].map((height, index) => <div key={index} className={`flex-1 rounded-t-sm ${index > 6 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${height}px` }} />)}</div><div className="mt-3 flex justify-between font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground"><span>today</span><span>your edge</span></div></div><div className="rounded-2xl border border-border bg-card p-5 soft-shadow"><p className="text-xs text-muted-foreground">Skill gaps</p><p className="mt-3 font-display text-3xl font-bold tracking-[-.06em]">02</p><p className="mt-2 text-xs leading-5 text-muted-foreground">to close for your next role</p></div><div className="rounded-2xl border border-border bg-card p-5 soft-shadow"><p className="text-xs text-muted-foreground">Best next move</p><p className="mt-3 font-display text-lg font-bold leading-tight tracking-[-.04em]">Ship &amp; share</p><p className="mt-2 text-xs leading-5 text-muted-foreground">proof that feels like you</p></div></div>
          </div>
        </section>
        <section className="bg-[#1f3335] px-5 py-20 text-[#f7f3e9] sm:px-8"><div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#9bd8b9]">Your next chapter starts small</p><h2 className="mt-4 max-w-[600px] font-display text-4xl font-bold leading-tight tracking-[-.065em] sm:text-5xl">Bring the goal.<br />We’ll find the next move.</h2></div><Link href="/signup" className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#9bd8b9] px-5 py-3.5 text-sm font-bold text-[#1f3335] transition-transform hover:-translate-y-0.5 focus-ring" data-testid="link-create-account">Create your free workspace <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></section>
      </main>
      <footer className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><Wordmark /><span>© 2025 IterateUP · Career Intelligence Platform</span></footer>
    </div>
  );
}