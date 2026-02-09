
export type UserRole = 'admin' | 'wali_kelas' | 'siswa';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  school_id: string | null;
  class_id: string | null;
  email: string;
  created_at: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
}

export interface DailyReport {
  id: string;
  student_id: string;
  habit_id: string;
  date: string;
  status: boolean;
  note: string | null;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
}

export interface TeacherNote {
  id: string;
  teacher_id: string;
  student_id: string;
  note: string;
  date: string;
}
