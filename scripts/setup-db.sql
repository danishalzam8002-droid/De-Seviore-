-- SQL Setup Script for De Seviore Supabase Database

-- 1. Admins Table
-- Tracks user roles for dashboard access
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Member', -- Admin Utama, Member
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Members Table
-- Directory of batch members
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    pob TEXT,
    dob TEXT,
    phone TEXT,
    ig TEXT,
    quote TEXT,
    role TEXT DEFAULT 'Anggota',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Kitab Table (Library)
CREATE TABLE IF NOT EXISTS public.kitab (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    category TEXT DEFAULT 'Fiqih',
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Albums Table
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    drive_link TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Gallery Table (Single Moments)
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Requests Table (Admin Approval Flow)
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE
    data JSONB NOT NULL,
    target_id UUID,
    requested_by TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Batch Info Table (Single Row)
CREATE TABLE IF NOT EXISTS public.batch_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    history TEXT,
    philosophy TEXT,
    video_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Note: Ensure Row Level Security (RLS) is configured in Supabase 
-- to allow public read but restricted write access.
