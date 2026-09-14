import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="mesh-bg flex min-h-[100dvh] items-center justify-center px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Compass size={26} /></span>
        <p className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.18em] text-accent">Off the map</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.065em]">This path doesn’t exist yet.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">The page you were looking for may have moved, or it is still taking shape.</p>
        <Link href="/dashboard" className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground focus-ring" data-testid="link-404-dashboard"><ArrowLeft size={15} /> Back to overview</Link>
      </div>
    </div>
  );
}
