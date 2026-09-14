import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Landing from '@/pages/landing';
import { AuthPage } from '@/pages/auth';
import OnboardingPage from '@/pages/onboarding';
import Dashboard from '@/pages/dashboard';
import ProfilePage from '@/pages/profile';
import SkillsPage from '@/pages/skills';
import RoadmapPage from '@/pages/roadmap';
import ProjectsPage from '@/pages/projects';
import CoursesPage from '@/pages/courses';
import CompaniesPage from '@/pages/companies';
import JobsPage from '@/pages/jobs';
import ApplicationsPage from '@/pages/applications';
import InterviewPage from '@/pages/interview';
import SettingsPage from '@/pages/settings';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login"><AuthPage mode="login" /></Route>
        <Route path="/signup"><AuthPage mode="signup" /></Route>
        <Route path="/onboarding"><OnboardingPage step="start" /></Route>
        <Route path="/onboarding/career-goal"><OnboardingPage step="goal" /></Route>
        <Route path="/onboarding/profile"><OnboardingPage step="profile" /></Route>
        <Route path="/onboarding/connect"><OnboardingPage step="connect" /></Route>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/skills" component={SkillsPage} />
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/companies" component={CompaniesPage} />
        <Route path="/jobs" component={JobsPage} />
        <Route path="/applications" component={ApplicationsPage} />
        <Route path="/interview" component={InterviewPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

import { AuthProvider, useAuth } from '@/context/auth-context';

function OnboardingRedirector({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    // If student is signed in, has a profile row, and onboarding_completed is false,
    // enforce completing onboarding before accessing dashboard and workspaces.
    if (
      !isLoading &&
      user &&
      profile &&
      profile.onboarding_completed === false &&
      !location.startsWith('/onboarding') &&
      location !== '/login' &&
      location !== '/signup' &&
      location !== '/'
    ) {
      setLocation('/onboarding');
    }
  }, [isLoading, user, profile, location, setLocation]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <OnboardingRedirector>
              <Router />
            </OnboardingRedirector>
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
