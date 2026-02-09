
-- Enable RLS
-- TABLES

-- 1. Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profiles (Auth linked)
CREATE TYPE user_role AS ENUM ('admin', 'wali_kelas', 'siswa');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'siswa',
  school_id UUID REFERENCES schools(id),
  class_id UUID REFERENCES classes(id),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Reports
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  status BOOLEAN DEFAULT false,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, habit_id, date)
);

-- 6. Teacher Notes
CREATE TABLE teacher_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_notes ENABLE ROW LEVEL SECURITY;

-- Profiles: Admin see all, Teacher see class, Student see self
CREATE POLICY "Profiles visibility" ON profiles FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'wali_kelas') AND class_id = (SELECT class_id FROM profiles WHERE id = auth.uid()))
);

-- Daily Reports: Student can CRUD their own, Teacher can read class, Admin can read all
CREATE POLICY "Daily reports student access" ON daily_reports FOR ALL USING (
  auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'wali_kelas') AND (SELECT class_id FROM profiles WHERE id = daily_reports.student_id) = (SELECT class_id FROM profiles WHERE id = auth.uid()))
);

-- Habits: Read by all, CRUD by admin
CREATE POLICY "Habits read access" ON habits FOR SELECT USING (true);
CREATE POLICY "Habits admin access" ON habits FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- SEED DATA (Habits)
INSERT INTO habits (title) VALUES 
('Bangun Pagi'),
('Beribadah'),
('Berolahraga'),
('Makan Sehat dan Bergizi'),
('Gemar Belajar'),
('Bermasyarakat'),
('Tidur Cepat');
