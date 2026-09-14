import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  college?: string;
  degree?: string;
  year_of_study?: string;
  cgpa?: string;
  location?: string;
  bio?: string;
  target_role?: string;
  target_companies?: string[];
  preferred_locations?: string[];
  resume_url?: string;
  resume_name?: string;
  github_username?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  readiness_score?: number;
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  uploadResume: (file: File) => Promise<{ url: string | null; name: string | null; error: Error | null }>;
}

const LOCAL_STORAGE_USER_KEY = 'iterateup_sandbox_user';
const LOCAL_STORAGE_PROFILE_KEY = 'iterateup_sandbox_profile';

const defaultDemoProfile: UserProfile = {
  id: 'sandbox-aarav-sharma',
  email: 'aarav.sharma@coep.ac.in',
  full_name: 'Aarav Sharma',
  college: 'COEP Technological University, Pune',
  degree: 'B.Tech Computer Engineering',
  year_of_study: '3rd Year (Class of 2026)',
  cgpa: '8.94 / 10.0',
  location: 'Pune, Maharashtra, India',
  bio: 'Aspiring Backend / Full-Stack Systems Engineer with strong algorithmic fundamentals and experience building high-throughput microservices.',
  target_role: 'Software Development Engineer - Backend (SDE-1)',
  target_companies: ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India', 'TCS Digital'],
  preferred_locations: ['Pune', 'Bengaluru', 'Remote'],
  resume_name: 'Aarav_Sharma_Resume_2026.pdf',
  resume_url: '#',
  github_username: 'aaravsharma-dev',
  linkedin_url: 'https://linkedin.com/in/aaravsharma-dev',
  portfolio_url: 'https://aaravsharma.dev',
  readiness_score: 68,
  onboarding_completed: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student profile from Supabase
  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userFullName?: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Note on profiles table:', error.message);
        // Fallback profile if SQL schema has not been executed yet
        setProfile({
          id: userId,
          email: userEmail || '',
          full_name: userFullName || (userEmail ? userEmail.split('@')[0] : 'Student'),
          college: 'COEP Technological University, Pune',
          degree: 'B.Tech Computer Engineering',
          year_of_study: '3rd Year',
          cgpa: '8.94 / 10.0',
          location: 'Pune, Maharashtra',
          target_role: 'Software Development Engineer (SDE-1)',
          readiness_score: 60,
          onboarding_completed: false,
        });
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback row creation if trigger hasn't completed
        const newProfile: Partial<UserProfile> = {
          id: userId,
          email: userEmail || '',
          full_name: userFullName || (userEmail ? userEmail.split('@')[0] : 'Student'),
          college: 'COEP Technological University, Pune',
          degree: 'B.Tech Computer Engineering',
          year_of_study: '3rd Year',
          cgpa: '8.94 / 10.0',
          location: 'Pune, Maharashtra',
          target_role: 'Software Development Engineer (SDE-1)',
          readiness_score: 60,
          onboarding_completed: false,
        };
        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .maybeSingle();
        if (createdProfile) {
          setProfile(createdProfile as UserProfile);
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchProfile(
            currentSession.user.id,
            currentSession.user.email,
            currentSession.user.user_metadata?.full_name
          );
        }
        setIsLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(
            newSession.user.id,
            newSession.user.email,
            newSession.user.user_metadata?.full_name
          );
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Sandbox fallback mode
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          setProfile(defaultDemoProfile);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        setProfile(defaultDemoProfile);
      }
      setIsLoading(false);
      return undefined;
    }
  }, [fetchProfile]);

  // Sign up
  const signUp = async (email: string, password: string, fullName: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        // Ensure profile row exists
        await fetchProfile(data.user.id, email, fullName);
      }

      return { error: null, data };
    } else {
      // Sandbox fallback
      const mockUser = {
        id: 'sandbox-' + Date.now(),
        email,
        user_metadata: { full_name: fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const newProfile: UserProfile = {
        id: mockUser.id,
        email,
        full_name: fullName,
        college: 'COEP Technological University, Pune',
        degree: 'B.Tech Computer Engineering',
        year_of_study: '3rd Year (Class of 2026)',
        cgpa: '8.94 / 10.0',
        location: 'Pune, Maharashtra, India',
        target_role: 'Software Development Engineer - Backend (SDE-1)',
        target_companies: ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India'],
        preferred_locations: ['Pune', 'Bengaluru', 'Remote'],
        readiness_score: 60,
        onboarding_completed: false,
      };

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
      setUser(mockUser);
      setProfile(newProfile);

      return { error: null, data: { user: mockUser } };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email, data.user.user_metadata?.full_name);
      }

      return { error: null, data };
    } else {
      // Sandbox fallback
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      const existingProfile = storedProfile ? JSON.parse(storedProfile) : defaultDemoProfile;
      const updatedProfile = { ...existingProfile, email };

      const mockUser = {
        id: existingProfile.id || 'sandbox-' + Date.now(),
        email,
        user_metadata: { full_name: existingProfile.full_name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
      setUser(mockUser);
      setProfile(updatedProfile);

      return { error: null, data: { user: mockUser } };
    }
  };

  // Sign in with OAuth (Google, GitHub, etc.)
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    } else {
      const mockUser = {
        id: 'sandbox-' + Date.now(),
        email: `student@${provider}.com`,
        user_metadata: { full_name: 'Shubham Alapure' },
        app_metadata: { provider },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const newProfile: UserProfile = {
        ...defaultDemoProfile,
        id: mockUser.id,
        email: mockUser.email || '',
        full_name: 'Shubham Alapure',
      };

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
      setUser(mockUser);
      setProfile(newProfile);
      return { error: null };
    }
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    }
    setUser(null);
    setSession(null);
    setProfile(defaultDemoProfile);
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates } as UserProfile;
    setProfile(updated);

    if (isSupabaseConfigured && user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update Supabase profile:', error.message);
        return { error };
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }

    return { error: null };
  };

  // Upload resume to Supabase Storage
  const uploadResume = async (file: File) => {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (isSupabaseConfigured && user) {
      const filePath = `${user.id}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Failed to upload resume to Supabase Storage:', error.message);
        return { url: null, name: null, error };
      }

      // Generate signed URL valid for 1 year
      const { data: signedData, error: signedError } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      const resumeUrl = signedData?.signedUrl || '';
      await updateProfile({
        resume_url: resumeUrl,
        resume_name: file.name,
      });

      return { url: resumeUrl, name: file.name, error: signedError || null };
    } else {
      // Sandbox fallback: store pseudo URL and filename
      const fakeUrl = URL.createObjectURL(file);
      await updateProfile({
        resume_url: fakeUrl,
        resume_name: file.name,
      });
      return { url: fakeUrl, name: file.name, error: null };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        updateProfile,
        uploadResume,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
