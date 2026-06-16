-- Migration: Add all columns used by the codebase to public.projects
-- Safe to run multiple times — every ADD uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year integer;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS mood_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sketch_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS material_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS materials jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS credits jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique
ON public.projects (slug);

-- Enable RLS (idempotent — does nothing if already on)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first so re-running doesn't error
DROP POLICY IF EXISTS "Anyone can read published projects" ON public.projects;
DROP POLICY IF EXISTS "Admin read all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- Unauthenticated visitors: only published projects
CREATE POLICY "Anyone can read published projects"
  ON public.projects FOR SELECT
  TO anon
  USING (published = true);

-- Authenticated admin: full read access (including unpublished)
CREATE POLICY "Admin read all projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin: full write access
CREATE POLICY "Authenticated users can manage projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);
