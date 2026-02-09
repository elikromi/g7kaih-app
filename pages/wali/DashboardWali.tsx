
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Search, 
  ChevronRight,
  UserPlus,
  Loader2
} from 'lucide-react';
import { Profile } from '../../types';
import { supabase } from '../../lib/supabase';

export const DashboardWali: React.FC<{ user: Profile }> = ({ user }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, reported: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Fetch all students in this class
      const { data: studentsData, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('class_id', user.class_id)
        .eq('role', 'siswa');

      if (studentError) throw studentError;

      // 2. Fetch today's reports for these students
      const { data: reportsData, error: reportsError } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('date', today)
        .in('student_id', studentsData?.map(s => s.id) || []);

      if (reportsError) throw reportsError;

      // 3. Process data
      const processed = (studentsData || []).map(student => {
        const studentReports = (reportsData || []).filter(r => r.student_id === student.id);
        const completedCount = studentReports.filter(r => r.status).length;
        // Simple logic: last update is from the latest report entry
        const latestEntry = studentReports.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
          ...student,
          completed: completedCount,
          total: 7, // Fixed 7 habits
          lastUpdate: latestEntry ? new Date(latestEntry.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'
        };
      });

      setStudents(processed);
      setStats({
        total: processed.length,
        reported: processed.filter(s => s.completed > 0).length
      });

    } catch (err) {
      console.error("Error fetching class data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    alert('Menyiapkan laporan Excel untuk Kelas Anda...');
    setTimeout(() => alert('Laporan berhasil diunduh!'), 1000);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mb-2" />
      <p className="text-xs text-slate-500">Memuat data kelas...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Panel Wali Kelas</h2>
        <p className="text-sm text-slate-500">Kelas Aktif • Monitor Harian</p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/wali/class')}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
            <Users size={20} />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Siswa</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-3">
            <CheckCircle size={20} />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.reported}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sudah Lapor</p>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button 
          onClick={() => navigate('/wali/class')}
          className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          <UserPlus size={16} />
          Kelola Siswa
        </button>
        <button 
          onClick={handleDownload}
          className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm active:scale-95 transition-transform"
        >
          Unduh Excel
        </button>
      </div>

      {/* Student List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800">Status Hari Ini</h3>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 bg-slate-100 border-none rounded-full text-[10px] focus:ring-1 focus:ring-blue-500 w-24 sm:w-32"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredStudents.length > 0 ? filteredStudents.map((student) => (
            <Link 
              key={student.id} 
              to={`/wali/student/${student.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-slate-50 hover:border-blue-200 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                    student.completed === 7 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {student.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{student.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-medium">Lapor: {student.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">{student.completed}/{student.total}</div>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${student.completed === 7 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(student.completed / student.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">Tidak ada siswa ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* Evaluation Section */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-2">Evaluasi Kelas</h3>
        <p className="text-xs text-slate-400 mb-4 italic leading-relaxed">
          Pantau progres harian siswa untuk memastikan pembentukan karakter 7 Kebiasaan Baik berjalan optimal di kelas Anda.
        </p>
        <button 
          onClick={() => navigate('/wali/class')}
          className="w-full bg-white text-slate-900 font-bold py-3 rounded-2xl text-xs hover:bg-slate-100 active:scale-95 transition-all"
        >
          Lihat Statistik Lengkap
        </button>
      </div>
    </div>
  );
};
