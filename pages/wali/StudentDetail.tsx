
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MessageCircle, 
  Calendar, 
  BarChart2, 
  CheckCircle2, 
  Circle,
  Send,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Profile } from '../../types';
import { supabase } from '../../lib/supabase';

export const StudentDetail: React.FC<{ user: Profile }> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch student profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, schools(name), classes(name)')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;
      setStudent(profileData);

      // 2. Fetch today's habits
      const { data: habitsData } = await supabase.from('habits').select('*').eq('is_active', true);
      const { data: todayReports } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('student_id', id)
        .eq('date', today);

      const mergedHabits = (habitsData || []).map(h => {
        const report = todayReports?.find(r => r.habit_id === h.id);
        return {
          ...h,
          status: report ? report.status : false,
          time: report ? new Date(report.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'
        };
      });
      setReports(mergedHabits);

      // 3. Fetch weekly stats (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const { data: weeklyData } = await supabase
        .from('daily_reports')
        .select('date, status')
        .eq('student_id', id)
        .gte('date', lastWeek.toISOString().split('T')[0]);

      // Process weekly data for chart
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const statsMap: Record<string, number> = {};
      
      weeklyData?.forEach(r => {
        if (r.status) {
          statsMap[r.date] = (statsMap[r.date] || 0) + 1;
        }
      });

      const formattedStats = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        formattedStats.push({
          day: days[d.getDay()],
          val: statsMap[dateStr] || 0
        });
      }
      setWeeklyStats(formattedStats);

    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNote = async () => {
    if (!note.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from('teacher_notes')
        .insert({
          teacher_id: user.id,
          student_id: id,
          note: note
        });

      if (error) throw error;
      
      setNote('');
      alert('Catatan berhasil disimpan dan dikirim!');
    } catch (err: any) {
      alert("Gagal menyimpan catatan: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mb-2" />
      <p className="text-xs text-slate-500">Memuat rincian siswa...</p>
    </div>
  );

  if (!student) return <div className="p-10 text-center">Siswa tidak ditemukan.</div>;

  const currentScore = reports.filter(r => r.status).length;
  const scorePercent = Math.round((currentScore / reports.length) * 100);

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
          <p className="text-xs text-slate-500">Profil & Progres Siswa</p>
        </div>
      </header>

      {/* Info Card */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status Akademik</p>
          <p className="text-sm font-bold text-slate-700">{student.classes?.name || 'Kelas Belum Set'}</p>
          <p className="text-xs text-slate-500">{student.schools?.name || 'Sekolah Belum Set'}</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-blue-600">{scorePercent}%</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hari Ini</p>
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="text-blue-500" />
          <h3 className="font-bold text-slate-800">Progres 7 Hari Terakhir</h3>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <YAxis hide domain={[0, 7]} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{fill: '#2563eb', strokeWidth: 2, r: 4}} 
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Today's Habits List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800">Laporan Hari Ini</h3>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Calendar size={12} /> {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
        <div className="space-y-2">
          {reports.map((habit) => (
            <div key={habit.id} className="bg-white p-3 rounded-2xl border border-slate-50 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={habit.status ? 'text-green-500' : 'text-slate-200'}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{habit.title}</p>
                  <p className="text-[10px] text-slate-400">Pukul: {habit.time}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                habit.status ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
              }`}>
                {habit.status ? 'SELESAI' : 'BELUM'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher Note Input */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 p-4 flex gap-3">
        <div className="relative flex-1">
          <MessageCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ketik catatan evaluasi..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleSendNote}
          disabled={sending || !note.trim()}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 transition-all"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};
