import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Grid2X2,
  Layers3,
  LogOut,
  Menu,
  MessageSquareText,
  Route,
  Send,
  Settings,
  Sparkles,
  UserRound,
  X,
  Database,
} from 'lucide-react';
import { mockStudent, navGroups } from '@/lib/mock/career-data';
import { useAuth } from '@/context/auth-context';

const iconMap = {
  grid: Grid2X2,
  user: UserRound,
  sparkles: Sparkles,
  route: Route,
  layers: Layers3,
  book: BookOpen,
  building: Building2,
  briefcase: BriefcaseBusiness,
  send: Send,
  message: MessageSquareText,
};

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 focus-ring" data-testid="link-brand">
      <span
        className={`grid h-8 w-8 place-items-center rounded-[10px] ${
          light ? 'bg-[#96d8b9] text-[#18252b]' : 'bg-[#225f50] text-[#f7f3e9]'
        }`}
      >
        <span className="font-display text-lg font-bold leading-none">i</span>
      </span>
      <span
        className={`font-display text-[17px] font-bold tracking-[-.04em] ${
          light ? 'text-[#f7f3e9]' : 'text-foreground'
        }`}
      >
        IterateUP
      </span>
    </Link>
  );
}

export function DemoPill({ dark = false }: { dark?: boolean }) {
  const { isConfigured } = useAuth();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[.14em] ${
        dark
          ? 'border-[#88cdb0]/30 bg-[#88cdb0]/10 text-[#a9dfc4]'
          : isConfigured
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-primary/20 bg-primary/8 text-primary'
      }`}
      data-testid="status-demo"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isConfigured ? 'bg-emerald-500' : 'bg-accent'
        }`}
      />
      {isConfigured ? 'Supabase Live' : 'Demo Workspace'}
    </span>
  );
}

export function ProductShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { profile, user, signOut, isConfigured } = useAuth();

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : mockStudent.fullName);

  const targetRole = profile?.target_role || mockStudent.target;
  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SA';

  const handleSignOut = async () => {
    await signOut();
    setLocation('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <button
        className="fixed right-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-xl bg-sidebar text-sidebar-foreground shadow-lg md:hidden"
        onClick={() => setMobileOpen((value) => !value)}
        aria-label="Toggle navigation"
        data-testid="button-toggle-navigation"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-30 flex w-[252px] flex-col px-4 py-5 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 px-2 flex items-center justify-between">
          <Wordmark light />
        </div>

        {/* User Card with dropdown */}
        <div className="relative mb-6">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/70 px-3 py-3 text-left transition-colors hover:bg-sidebar-accent"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#df9a78] font-display text-sm font-bold text-[#18252b]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{fullName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{targetRole}</p>
            </div>
            <ChevronDown size={14} className="ml-auto text-sidebar-foreground/50 shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-sidebar-border bg-sidebar p-2 shadow-2xl">
              <div className="px-2 py-1.5 text-xs text-sidebar-foreground/60">
                <p className="truncate font-medium text-sidebar-foreground">{profile?.email || user?.email || 'aarav.sharma@coep.ac.in'}</p>
                <p className="mt-0.5 text-[10px] text-emerald-400 flex items-center gap-1">
                  <Database size={10} /> {isConfigured ? 'Supabase Connected' : 'Sandbox Storage'}
                </p>
              </div>
              <div className="my-1 h-px bg-sidebar-border" />
              <Link
                href="/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <UserRound size={14} /> View Student Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Settings size={14} /> Account Settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-destructive hover:bg-destructive/15"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 font-mono-ui text-[9px] uppercase tracking-[.17em] text-sidebar-foreground/40">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  const active = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors focus-ring ${
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                          : 'text-sidebar-foreground/68 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      }`}
                      data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
                      <span>{item.label}</span>
                      {item.label === 'Skills' && (
                        <span className="ml-auto rounded-full bg-[#df9a78]/20 px-1.5 py-0.5 font-mono-ui text-[9px] text-[#f0af8d]">
                          2
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="mt-5 space-y-1 border-t border-sidebar-border pt-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-ring"
            data-testid="link-nav-settings"
          >
            <Settings size={16} /> Settings
          </Link>
          <div className="mt-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
            <p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#96d8b9]">
              This week
            </p>
            <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/70">
              Small, consistent moves compound. You are 3 actions from your weekly target.
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sidebar-border">
              <div className="h-full w-[58%] rounded-full bg-sidebar-primary" />
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-[100dvh] md:pl-[252px]">{children}</main>
    </div>
  );
}

export function TopBar({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-11">
      <div>
        <p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-[25px] font-bold tracking-[-.045em] text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <DemoPill />
      </div>
    </header>
  );
}

export function PageLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-accent focus-ring"
      data-testid={`link-more-${href.slice(1)}`}
    >
      {children}
      <ArrowUpRight size={13} />
    </Link>
  );
}