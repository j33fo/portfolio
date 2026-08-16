-- Create custom tables for Gabriel's Portfolio content

-- 1. Profiles Table (user profiles for authorization)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'fas fa-code',
  category text DEFAULT 'Project',
  tags text[] DEFAULT '{}'::text[],
  github_url text,
  live_url text,
  sort_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Labs/Experiments Table
CREATE TABLE IF NOT EXISTS public.labs (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  icon text DEFAULT 'fas fa-flask',
  status text DEFAULT 'active',
  tags text[] DEFAULT '{}'::text[],
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Labs
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;

-- 4. Open Source Table
CREATE TABLE IF NOT EXISTS public.opensource (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  language text,
  stars integer DEFAULT 0,
  github_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on OpenSource
ALTER TABLE public.opensource ENABLE ROW LEVEL SECURITY;

-- 5. Writeups Table
CREATE TABLE IF NOT EXISTS public.writeups (
  id text PRIMARY KEY,
  title text NOT NULL,
  date date,
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_time integer DEFAULT 0,
  summary text,
  tags text[] DEFAULT '{}'::text[],
  link text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Writeups
ALTER TABLE public.writeups ENABLE ROW LEVEL SECURITY;

-- 6. Site Status Table
CREATE TABLE IF NOT EXISTS public.site_status (
  id text PRIMARY KEY DEFAULT 'main',
  current_title text,
  current_description text,
  next_title text,
  next_description text,
  updates jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Site Status
ALTER TABLE public.site_status ENABLE ROW LEVEL SECURITY;

-- 7. Apps Table (for beta testers select options)
CREATE TABLE IF NOT EXISTS public.apps (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Apps
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- 8. Beta Signups Table
CREATE TABLE IF NOT EXISTS public.beta_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  app_id text REFERENCES public.apps(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Beta Signups
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Profiles Policies
CREATE POLICY "Allow users to read their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Allow public read access to projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Labs Policies
CREATE POLICY "Allow public read access to labs" ON public.labs
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to labs" ON public.labs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- OpenSource Policies
CREATE POLICY "Allow public read access to opensource" ON public.opensource
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to opensource" ON public.opensource
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Writeups Policies
CREATE POLICY "Allow public read access to writeups" ON public.writeups
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to writeups" ON public.writeups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Site Status Policies
CREATE POLICY "Allow public read access to site_status" ON public.site_status
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to site_status" ON public.site_status
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Apps Policies
CREATE POLICY "Allow public read access to apps" ON public.apps
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to apps" ON public.apps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Beta Signups Policies
CREATE POLICY "Allow public insert access to beta_signups" ON public.beta_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to beta_signups" ON public.beta_signups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Automatically create profiles table record when a new user registers.
-- First user to register becomes the 'admin', others default to 'viewer'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN 'admin'
      ELSE 'viewer'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- SEED DATA (FROM PORTFOLIO JSON FILES)
-- ==========================================

-- Seed Apps
INSERT INTO public.apps (id, name)
VALUES 
  ('stringdex-go', 'StringDex Go')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Seed Projects
INSERT INTO public.projects (id, name, description, icon, category, tags, github_url, live_url, sort_order, featured)
VALUES
  ('project-1', 'Resume Checker AI', 'AI-driven platform designed to help job seekers optimize their resumes.', 'fas fa-globe', 'Web App', ARRAY['React', 'Node.js', 'PostgreSQL'], 'https://github.com/j33fo/resume-checker-ai', 'https://resume-checker-ai-ten.vercel.app/', 0, false),
  ('project-2', 'StringDex GO: Search Strings for Pokémon GO', 'A web application that allows users to search for Pokémon GO strings and related', 'fas fa-mobile-alt', 'Mobile App', ARRAY['Gradle', 'Java', 'Android Studio'], '#', 'https://www.amazon.co.uk/dp/B0H576SBYB/ref=sr_1_1?s=mobile-apps&sr=1-1', 1, false),
  ('project-3', 'AI Debt Payoff', 'Manage accounts, track spending, and get practical recommendations in one place.', 'fas fa-laptop-code', 'Web App', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'], '#', 'https://ai-debt-payoff.vercel.app/', 2, false)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  github_url = EXCLUDED.github_url,
  live_url = EXCLUDED.live_url,
  sort_order = EXCLUDED.sort_order,
  featured = EXCLUDED.featured;

-- Seed Labs/Experiments
INSERT INTO public.labs (id, title, description, icon, status, tags, sort_order)
VALUES
  ('lab-1', 'Local AI Project', 'Experimenting with locally hosted LLMs using Ollama on a Samsung Galaxy S10.', 'fas fa-brain', 'in_progress', ARRAY['#llm', '#local-deployment', '#ai', '#ollama', '#samsung-galaxy-s10'], 0),
  ('lab-2', 'Cluster Setup & Orchestration', 'Building and managing a local Kubernetes cluster on Raspbery pi''s .', 'fas fa-server', 'active', ARRAY['#kubernetes', '#infrastructure', '#docker', 'Raspberry pi', '#cluster'], 1)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order;

-- Seed Open Source Projects
INSERT INTO public.opensource (id, name, description, language, stars, github_url, sort_order)
VALUES
  ('os-1', 'Useful Libraryof AI prompts', 'A helpful library that solves prompting problem of almost all AI platforms.', 'TXT', 140000, 'https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools', 0),
  ('os-2', 'Awesome Database Design', 'A curated collection of resources, tutorials, tools, and best practices for designing efficient and scalable databases.', 'Bookmarks', 795, 'https://github.com/sujeet-agrahari/awesome-database-design', 1),
  ('os-3', 'Computer Science & Programming Resources', 'Path to a free self-taught education in Computer Science!', 'Markdown', 205000, 'https://github.com/sujeet-agrahari/computer-science-programming-resources', 2)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  language = EXCLUDED.language,
  stars = EXCLUDED.stars,
  github_url = EXCLUDED.github_url,
  sort_order = EXCLUDED.sort_order;

-- Seed Writeups/Articles
INSERT INTO public.writeups (id, title, date, published_at, read_time, summary, tags, link)
VALUES
  ('article-1', 'Setting Up Local Kubernetes', '2026-06-14', '2026-06-14 00:00:00+00', 8, 'A comprehensive guide to setting up a Kubernetes cluster locally with some learnings along the way.', ARRAY['#kubernetes', '#infrastructure', '#tutorial'], '#'),
  ('article-2', 'Building Android Apps with AI Assistance', '2026-06-10', '2026-06-10 00:00:00+00', 5, 'How I use AI tools to streamline Android development workflow and improve productivity.', ARRAY['#android', '#ai', '#development'], '#'),
  ('article-3', 'Lessons Learned: Running LLMs Locally', '2026-06-05', '2026-06-05 00:00:00+00', 10, 'Technical deep dive into the challenges and solutions for hosting language models on consumer hardware.', ARRAY['#llm', '#ai', '#infrastructure'], '#')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  published_at = EXCLUDED.published_at,
  read_time = EXCLUDED.read_time,
  summary = EXCLUDED.summary,
  tags = EXCLUDED.tags,
  link = EXCLUDED.link;

-- Seed Site Status
INSERT INTO public.site_status (id, current_title, current_description, next_title, next_description, updates)
VALUES
  (
    'main',
    'Currently Working On',
    'Building a Kubernetes-based AI platform for local LLM inference with custom fine-tuning capabilities. Using Docker, Python, and FastAPI.',
    'Up Next',
    'Exploring RAG (Retrieval-Augmented Generation) patterns. Planning to build a personal knowledge base system that can run offline.',
    '[{"project": "Project X", "update": "Released v2.0 with new features", "date": "2026-06-14"}, {"project": "AI Lab", "update": "Achieved 92% accuracy on custom dataset", "date": "2026-06-12"}, {"project": "Infrastructure", "update": "Migrated cluster to new hardware", "date": "2026-06-08"}]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET 
  current_title = EXCLUDED.current_title,
  current_description = EXCLUDED.current_description,
  next_title = EXCLUDED.next_title,
  next_description = EXCLUDED.next_description,
  updates = EXCLUDED.updates;
