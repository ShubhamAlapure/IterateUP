-- ==============================================================================
-- IterateUP: Supabase Database Schema, Row Level Security (RLS), & Storage
-- ==============================================================================
-- Run this script directly in the Supabase Dashboard -> SQL Editor.
-- It configures PostgreSQL tables, Auth hooks, RLS policies, and Storage buckets.
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (1-to-1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    college TEXT DEFAULT 'COEP Technological University, Pune',
    degree TEXT DEFAULT 'B.Tech Computer Engineering',
    year_of_study TEXT DEFAULT '3rd Year (Class of 2026)',
    cgpa TEXT DEFAULT '8.94 / 10.0',
    location TEXT DEFAULT 'Pune, Maharashtra, India',
    bio TEXT DEFAULT 'Aspiring Backend / Full-Stack Systems Engineer with strong algorithmic fundamentals and experience building high-throughput microservices.',
    target_role TEXT DEFAULT 'Software Development Engineer - Backend (SDE-1)',
    target_companies TEXT[] DEFAULT ARRAY['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India', 'TCS Digital'],
    preferred_locations TEXT[] DEFAULT ARRAY['Pune', 'Bengaluru', 'Remote'],
    resume_url TEXT,
    resume_name TEXT,
    github_username TEXT DEFAULT 'aaravsharma-dev',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/in/aaravsharma-dev',
    portfolio_url TEXT DEFAULT 'https://aaravsharma.dev',
    readiness_score INTEGER DEFAULT 60,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Applications Tracking Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Saved', -- Saved, Applied, Assessment, Interview, Offer, Rejected
    salary TEXT,
    location TEXT,
    applied_date TIMESTAMP WITH TIME ZONE,
    next_action TEXT,
    next_action_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    application_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Student Skills Table
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL,
    current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
    target_level INTEGER NOT NULL DEFAULT 4 CHECK (target_level BETWEEN 1 AND 5),
    priority TEXT DEFAULT 'Medium', -- High, Medium, Low
    evidence TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Auto-Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and re-create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 8. RLS Policies for Applications
DROP POLICY IF EXISTS "Users can manage own applications" ON public.applications;
CREATE POLICY "Users can manage own applications"
    ON public.applications FOR ALL
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

-- 9. RLS Policies for Skills
DROP POLICY IF EXISTS "Users can manage own skills" ON public.student_skills;
CREATE POLICY "Users can manage own skills"
    ON public.student_skills FOR ALL
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

-- 10. Supabase Storage Configuration for Private Resumes Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow authenticated users to manage their own resume files
DROP POLICY IF EXISTS "Users can upload own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage own resumes" ON storage.objects;

CREATE POLICY "Users can manage own resumes"
    ON storage.objects FOR ALL
    TO authenticated
    USING (
        bucket_id = 'resumes' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            owner = auth.uid()
        )
    )
    WITH CHECK (
        bucket_id = 'resumes' AND (
            (storage.foldername(name))[1] = auth.uid()::text OR
            owner = auth.uid()
        )
    );
