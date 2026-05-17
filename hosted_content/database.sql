
-- ==========================================================
-- FULL SUPABASE SQL SCHEMA & SEED DATA (REPAIR & SYNC)
-- Project: Smile Agency Dental Clinic
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES & MIGRATIONS (Ensuring columns exist)

-- Site Global Content
CREATE TABLE IF NOT EXISTS site_content (
    id INT PRIMARY KEY,
    ka_data JSONB DEFAULT '{}'::jsonb,
    en_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members (Adding 'type' column if it was missing from previous versions)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ka TEXT NOT NULL,
    name_en TEXT NOT NULL,
    role_ka TEXT NOT NULL,
    role_en TEXT NOT NULL,
    image_url TEXT,
    bio_ka TEXT,
    bio_en TEXT,
    education_ka TEXT,
    education_en TEXT,
    specialization_ka TEXT,
    specialization_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRITICAL FIX: Add 'type' column if it doesn't exist in existing table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='type') THEN
        ALTER TABLE team_members ADD COLUMN type TEXT DEFAULT 'doctor';
    END IF;
END $$;

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_ka TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ka TEXT NOT NULL,
    content_en TEXT NOT NULL,
    category_ka TEXT NOT NULL,
    category_en TEXT NOT NULL,
    excerpt_ka TEXT,
    excerpt_en TEXT,
    image_url TEXT,
    post_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    doctor TEXT,
    concern TEXT,
    message TEXT,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SECURITY (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Idempotent)
DO $$ 
BEGIN
    -- Site Content
    DROP POLICY IF EXISTS "Allow public all site_content" ON site_content;
    CREATE POLICY "Allow public all site_content" ON site_content FOR ALL USING (true);

    -- Team Members
    DROP POLICY IF EXISTS "Allow public all team" ON team_members;
    CREATE POLICY "Allow public all team" ON team_members FOR ALL USING (true);

    -- Blog Posts
    DROP POLICY IF EXISTS "Allow public all blog" ON blog_posts;
    CREATE POLICY "Allow public all blog" ON blog_posts FOR ALL USING (true);

    -- Leads
    DROP POLICY IF EXISTS "Allow public all leads" ON leads;
    CREATE POLICY "Allow public all leads" ON leads FOR ALL USING (true);
END $$;

-- 5. SEED DATA (Only if table is empty)

-- Initial Site Content Row
INSERT INTO site_content (id, ka_data, en_data)
SELECT 1, '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM site_content);

-- Initial Team Members
INSERT INTO team_members (name_ka, name_en, role_ka, role_en, image_url, is_active, type)
SELECT 'თეა გოცირიძე', 'Tea Gotsiridze', 'კლინიკის ხელმძღვანელი / იმპლანტოლოგი', 'Clinic Head / Implantologist', 'https://framerusercontent.com/images/NL9ZihxOkco4TeWtDDi8fz20.jpg', true, 'doctor'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name_ka = 'თეა გოცირიძე');

INSERT INTO team_members (name_ka, name_en, role_ka, role_en, image_url, is_active, type)
SELECT 'გიორგი ბერიძე', 'Giorgi Beridze', 'თერაპევტი / ორთოდონტი', 'Therapist / Orthodontist', 'https://framerusercontent.com/images/Es82GeniQfvbrLe8GIg5ctOEq6M.jpg', true, 'doctor'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name_ka = 'გიორგი ბერიძე');

INSERT INTO team_members (name_ka, name_en, role_ka, role_en, image_url, is_active, type)
SELECT 'ნინო კაპანაძე', 'Nino Kapanadze', 'ბავშვთა სტომატოლოგი', 'Pediatric Dentist', 'https://framerusercontent.com/images/0JhnuSVKqzhBvoFbmldufpEA.jpg', true, 'doctor'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name_ka = 'ნინო კაპანაძე');

INSERT INTO team_members (name_ka, name_en, role_ka, role_en, image_url, is_active, type)
SELECT 'დავით მახარაძე', 'David Makharadze', 'ყბა-სახის ქირურგი', 'Maxillofacial Surgeon', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800', true, 'doctor'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name_ka = 'დავით მახარაძე');

INSERT INTO team_members (name_ka, name_en, role_ka, role_en, image_url, is_active, type)
SELECT 'მარიამ ალანია', 'Mariam Alania', 'ადმინისტრატორი', 'Administrator', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', true, 'administration'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name_ka = 'მარიამ ალანია');

-- Initial Blog Post
INSERT INTO blog_posts (slug, title_ka, title_en, content_ka, content_en, category_ka, category_en, excerpt_ka, excerpt_en, image_url, post_date)
SELECT 'implant-care', 'როგორ მოვუაროთ იმპლანტებს?', 'How to Care for Implants?', 'დენტალური იმპლანტაცია არის დაკარგული კბილის აღდგენის საუკეთესო გზა...', 'Dental implantation is the best way to restore a lost tooth...', 'იმპლანტოლოგია', 'Implantology', 'კბილის იმპლანტაცია თანამედროვე სტომატოლოგიის ერთ-ერთი ყველაზე ეფექტური მეთოდია...', 'Dental implantation is one of the most effective methods...', 'https://framerusercontent.com/images/PCHp4YGU02Gr9bhVeNxl3NlwDeE.jpg', '12 თებერვალი, 2026'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'implant-care');

-- 6. STORAGE INSTRUCTIONS
-- Create a PUBLIC bucket named 'media' in Supabase Storage.
-- Policies for 'media' bucket:
-- 1. SELECT: Allow all (public)
-- 2. INSERT: Allow all (or authenticated)
-- 3. UPDATE/DELETE: Allow all (or authenticated)

