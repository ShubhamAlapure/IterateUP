import { type FormEvent, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, AlertCircle, Sparkles, Database } from 'lucide-react';
import { DemoPill, Wordmark } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [, setLocation] = useLocation();
  const { signUp, signIn, signInWithOAuth, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMessage(null);
    setOauthLoading(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        if (error.message?.toLowerCase().includes('not enabled') || error.message?.toLowerCase().includes('unsupported provider')) {
          setErrorMessage(
            `${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not enabled yet in your Supabase project. Enable it in your Supabase Dashboard under Authentication -> Providers.`
          );
        } else {
          setErrorMessage(error.message || `Failed to initiate ${provider} sign-in.`);
        }
        setOauthLoading(null);
      }
      // If successful, Supabase redirects the browser to the provider URL
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during social sign in.');
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          setErrorMessage(error.message || 'Failed to create account. Please check your credentials.');
          setLoading(false);
          return;
        }
        setLocation('/onboarding');
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }
        setLocation('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain mesh-bg min-h-[100dvh]">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Wordmark />
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-ring" data-testid="link-back-home">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </nav>

      <main className="mx-auto grid max-w-[1000px] items-center gap-14 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:pt-24">
        <div className="hidden md:block">
          <DemoPill />
          <h1 className="mt-7 max-w-[390px] font-display text-5xl font-bold leading-[.98] tracking-[-.07em]">
            {isSignup ? 'Start with where you want to go.' : 'Good to see you again.'}
          </h1>
          <p className="mt-6 max-w-[350px] text-base leading-7 text-muted-foreground">
            {isSignup ? 'Your ambition deserves a plan that can keep up.' : 'Pick up exactly where your momentum left off.'}
          </p>

          <div className="mt-10 space-y-4 text-sm text-muted-foreground">
            {['Personalized next actions', 'One connected view of your progress', 'A calm place to build your edge'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/12 text-primary">
                  <Check size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground backdrop-blur-sm">
            <Database size={14} className={isConfigured ? 'text-emerald-500' : 'text-amber-500'} />
            <span>
              {isConfigured
                ? 'Connected to Supabase PostgreSQL & Auth'
                : 'Sandbox Mode (Add Supabase keys to .env for live cloud sync)'}
            </span>
          </div>
        </div>

        <div className="rounded-[26px] border border-border bg-card p-6 shadow-[0_24px_70px_hsl(222_29%_17%/.08)] sm:p-9">
          <div className="mb-8 md:hidden">
            <DemoPill />
          </div>

          <h2 className="font-display text-3xl font-bold tracking-[-.055em]">
            {isSignup ? 'Create your workspace' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? 'A few focused questions, then your path gets clearer.' : 'Your IterateUP workspace is waiting.'}
          </p>

          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social OAuth Options */}
          <div className="mt-7 space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={oauthLoading !== null || loading}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-foreground/20 focus-ring disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {oauthLoading === 'google'
                  ? 'Redirecting to Google…'
                  : isSignup
                  ? 'Sign up with Google'
                  : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={oauthLoading !== null || loading}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-foreground/20 focus-ring disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>
                {oauthLoading === 'github'
                  ? 'Redirecting to GitHub…'
                  : isSignup
                  ? 'Sign up with GitHub'
                  : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 text-center text-xs text-muted-foreground">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold">Your full name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10"
                  data-testid="input-auth-name"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Email address</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu or name@example.com"
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10"
                data-testid="input-auth-email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Password</span>
              <div className="relative">
                <input
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10"
                  data-testid="input-auth-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3 grid h-6 w-6 place-items-center text-muted-foreground hover:text-foreground focus-ring"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
              data-testid="button-submit-auth"
            >
              {loading ? (
                <span>Connecting to workspace…</span>
              ) : isSignup ? (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Open my workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <LockKeyhole size={13} /> Your workspace is private and secured by Row Level Security
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : 'New to IterateUP?'}{' '}
            <Link
              href={isSignup ? '/login' : '/signup'}
              className="font-semibold text-primary hover:text-accent focus-ring"
              data-testid="link-switch-auth"
            >
              {isSignup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
export default AuthPage;