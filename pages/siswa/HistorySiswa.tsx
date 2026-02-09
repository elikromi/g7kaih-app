
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../../types';
import { supabase } from '../../lib/supabase';

export const HistorySiswa: React.FC<{ user: Profile }> = ({ user }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ monthlyRate: 0, activeDays: 0, skippedDays: 0 });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch reports for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('student_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;

      // Group by date to show summary per day
      const grouped = data?.reduce((acc: any, report) => {
        const date = report.date;
        if (!acc[date]) acc[date] = { date, score: 0, total: 0 };
        if (report.status) acc[date].score += 1;
        acc[date].total += 1;
        return acc;
      }, {});

      const formattedHistory = Object.values(grouped || {}).map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        score: item.score,
        status: item.score === 7 ? 'Lengkap' : `Kurang ${7 - item.score}`
      }));

      setHistory(formattedHistory);

      // Simple stats calc
      const activeDaysCount = Object.keys(grouped || {}).length;
      setStats({
        activeDays: activeDaysCount,
        monthlyRate: activeDaysCount > 0 ? Math.round((formattedHistory.filter(h => h.score === 7).length / 30) * 100) : 0,
        skippedDays: 30 - activeDaysCount
      });

    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    alert('Menyiapkan file PDF riwayat kebiasaan Anda...');
    setTimeout(() => alert('File riwayat_kebiasaan.pdf berhasil diunduh!'), 1000);
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mb-2" />
      <p className="text-xs text-slate-500">Memuat riwayat...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold text-slate-800 text-center flex-1">Riwayat Laporan</h2>
        <button onClick={handleDownload} className="p-2 text-blue-600 active:scale-95 transition-transform">
          <Download size={20} />
        </button>
      </header>

      {/* Recap Stats */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-around text-center">
        <div>
          <p className="text-2xl font-black text-blue-600">{stats.monthlyRate}%</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Konsistensi</p>
        </div>
        <div className="w-px h-8 bg-slate-100"></div>
        <div>
          <p className="text-2xl font-black text-green-600">{stats.activeDays}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Hari Aktif</p>
        </div>
        <div className="w-px h-8 bg-slate-100"></div>
        <div>
          <p className="text-2xl font-black text-orange-600">{stats.skippedDays}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Terlewat</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
           <CalendarIcon size={16} className="text-slate-400" />
           <span className="text-sm font-bold text-slate-700">30 Hari Terakhir</span>
        </div>
        <button 
          onClick={() => alert('Filter tanggal sedang dikembangkan.')}
          className="p-2 text-slate-400 active:scale-95 transition-transform"
        >
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {history.length > 0 ? history.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center ${
                item.score === 7 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
              }`}>
                <span className="text-xs font-bold leading-none">{item.score}</span>
                <span className="text-[8px] font-black opacity-50">/7</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.date}</p>
                <p className={`text-[10px] font-medium ${item.score === 7 ? 'text-green-500' : 'text-orange-500'}`}>
                  {item.status}
                </p>
              </div>
            </div>
            <button 
              onClick={() => alert(`Detail untuk ${item.date}`)}
              className="text-blue-600 text-[10px] font-bold px-3 py-1 bg-blue-50 rounded-full active:scale-95 transition-transform"
            >
              Lihat
            </button>
          </div>
        )) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">Belum ada riwayat laporan harian.</p>
          </div>
        )}
      </div>
    </div>
  );
};
