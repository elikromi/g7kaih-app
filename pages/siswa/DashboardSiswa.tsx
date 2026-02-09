
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Trophy, 
  Flame, 
  ArrowRight,
  CheckCircle2,
  ClipboardCheck
} from 'lucide-react';
import { Profile } from '../../types';
import { supabase } from '../../lib/supabase';

export const DashboardSiswa: React.FC<{ user: Profile }> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ todayCompleted: 0, streak: 12, totalHabits: 7 });
  const [recentHabits, setRecentHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Get total habits count
      const { count: totalCount } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // 2. Get today's completed reports
      const { data: todayReports } = await supabase
        .from('daily_reports')
        .select('*, habits(title)')
        .eq('student_id', user.id)
        .eq('date', today)
        .eq('status', true);

      setStats({
        todayCompleted: todayReports?.length || 0,
        streak: 12, // Placeholder for streak logic (complex SQL)
        totalHabits: totalCount || 7
      });

      setRecentHabits(todayReports || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium mb-1">Semangat Pagi!</p>
          <h2 className="text-2xl font-bold mb-4">{user.name.split(' ')[0]} 👋</h2>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
              <p className="text-[10px] uppercase font-bold text-blue-100 mb-1">Capaian Hari Ini</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold leading-none">{stats.todayCompleted}</span>
                <span className="text-sm text-blue-100 font-medium">/ {stats.totalHabits}</span>
              </div>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
              <p className="text-[10px] uppercase font-bold text-blue-100 mb-1">Streak Harian</p>
              <div className="flex items-center gap-1">
                <Flame size={16} className="text-orange-300" />
                <span className="text-2xl font-bold leading-none">{stats.streak}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      <button 
        onClick={() => navigate('/siswa/report')}
        className="w-full bg-white border border-blue-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ClipboardCheck size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800">Lapor Kebiasaan Baru</h3>
            <p className="text-xs text-slate-500">Sudahkah kamu berbuat baik hari ini?</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </button>

      <section className="space-y-3">
        <h3 className="font-bold text-slate-800 px-1">Baru Saja Selesai</h3>
        <div className="space-y-2">
          {recentHabits.length > 0 ? recentHabits.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-sm font-medium text-slate-700">{item.habits.title}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Tercatat</span>
            </div>
          )) : (
            <div className="py-8 text-center bg-slate-100/50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-medium">Belum ada laporan hari ini</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 flex gap-4 items-center">
        <div className="w-12 h-12 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
          <Trophy size={24} />
        </div>
        <div>
          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-1">Misi Indonesia Hebat</p>
          <p className="text-xs text-blue-600 leading-relaxed font-medium italic">
            "Karakter unggul dibentuk dari disiplin harian yang tak pernah lelah."
          </p>
        </div>
      </div>
    </div>
  );
};
