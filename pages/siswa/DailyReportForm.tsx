
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Check, 
  MessageSquare 
} from 'lucide-react';
import { Profile, Habit } from '../../types';
import { supabase } from '../../lib/supabase';

export const DailyReportForm: React.FC<{ user: Profile }> = ({ user }) => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [reports, setReports] = useState<Record<string, { status: boolean; note: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabitsAndCurrentReports();
  }, []);

  const fetchHabitsAndCurrentReports = async () => {
    try {
      // 1. Fetch all active habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('is_active', true);
      
      if (habitsError) throw habitsError;
      setHabits(habitsData || []);

      // 2. Fetch today's reports for this student
      const { data: reportsData, error: reportsError } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('student_id', user.id)
        .eq('date', today);

      if (reportsError) throw reportsError;

      // 3. Initialize state
      const initialReports: Record<string, { status: boolean; note: string }> = {};
      habitsData?.forEach(h => {
        const existing = reportsData?.find(r => r.habit_id === h.id);
        initialReports[h.id] = {
          status: existing ? existing.status : false,
          note: existing ? existing.note || '' : ''
        };
      });
      setReports(initialReports);

    } catch (err) {
      console.error("Error loading data:", err);
      alert("Gagal memuat data laporan harian.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id: string) => {
    setReports(prev => ({
      ...prev,
      [id]: { ...prev[id], status: !prev[id].status }
    }));
  };

  const setNote = (id: string, note: string) => {
    setReports(prev => ({
      ...prev,
      [id]: { ...prev[id], note }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payloads = Object.entries(reports).map(([habit_id, data]) => ({
        student_id: user.id,
        habit_id,
        date: today,
        status: data.status,
        note: data.note
      }));

      const { error } = await supabase
        .from('daily_reports')
        .upsert(payloads, { onConflict: 'student_id,habit_id,date' });

      if (error) throw error;

      alert('Laporan berhasil disimpan! Kamu hebat!');
      navigate('/siswa');
    } catch (err: any) {
      console.error("Error saving:", err);
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const completedCount = Object.values(reports).filter(r => r.status).length;
  const totalCount = habits.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800">Laporan Harian</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Progress Tracker */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">Progres Kamu</span>
          <span className="text-sm font-black text-blue-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Habit Cards */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const report = reports[habit.id] || { status: false, note: '' };
          return (
            <div 
              key={habit.id} 
              className={`bg-white rounded-3xl p-5 shadow-sm border transition-all ${
                report.status ? 'border-green-100 ring-2 ring-green-50' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{habit.title}</h3>
                    <p className="text-xs text-slate-500">Sudah dilakukan hari ini?</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(habit.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    report.status 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Check size={20} />
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <MessageSquare size={16} />
                </div>
                <input 
                  type="text"
                  placeholder="Catatan (opsional)..."
                  value={report.note}
                  onChange={(e) => setNote(habit.id, e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 left-0 right-0 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 ${
            saving ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} />
              Simpan Laporan Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
};
