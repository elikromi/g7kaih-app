import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardSiswa } from './pages/siswa/DashboardSiswa';
import { DailyReportForm } from './pages/siswa/DailyReportForm';
import { HistorySiswa } from './pages/siswa/HistorySiswa';
import { DashboardWali } from './pages/wali/DashboardWali';
import { ClassDetail } from './pages/wali/ClassDetail';
import { StudentDetail } from './pages/wali/StudentDetail';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { UserProfile } from './pages/UserProfile';
import { Profile, UserRole } from './types';
import { supabase, isConfigured } from './lib/supabase';
import { AlertCircle, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error("Auth session check failed:", err);
        setError("Gagal menghubungkan ke server. Periksa koneksi internet atau konfigurasi database.");
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        localStorage.removeItem('app_user');
      }
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser(data);
        localStorage.setItem('app_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('app_user');
  };

  if (!isConfigured) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
          <Settings size={32} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Konfigurasi Diperlukan</h1>
        <p className="text-slate-500 text-sm max-w-xs mb-6">
          Silakan masukkan <strong>Supabase URL</strong> dan <strong>Anon Key</strong> di file <code>lib/supabase.ts</code> untuk mengaktifkan fitur production.
        </p>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left w-full max-w-md">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Langkah-langkah:</p>
          <ol className="text-xs text-slate-600 space-y-2 list-decimal ml-4">
            <li>Buka dashboard Supabase.</li>
            {/* Perbaikan di baris bawah ini: menggunakan &gt; */}
            <li>Ke menu Settings &gt; API.</li>
            <li>Salin Project URL dan anon public key.</li>
            <li>Tempel ke file <code>lib/supabase.ts</code>.</li>
          </ol>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Menghubungkan ke Server...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-lg font-bold text-slate-800">Kesalahan Koneksi</h2>
      <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100">
        Coba Lagi
      </button>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : <Navigate to="/" />} 
        />
        
        <Route element={user ? <Layout user={user} onLogout={logout} /> : <Navigate to="/login" />}>
          <Route path="/" element={<HomeRedirect role={user?.role} />} />
          <Route path="/siswa" element={<DashboardSiswa user={user!} />} />
          <Route path="/siswa/report" element={<DailyReportForm user={user!} />} />
          <Route path="/siswa/history" element={<HistorySiswa user={user!} />} />
          <Route path="/wali" element={<DashboardWali user={user!} />} />
          <Route path="/wali/class" element={<ClassDetail user={user!} />} />
          <Route path="/wali/student/:id" element={<StudentDetail user={user!} />} />
          <Route path="/admin" element={<DashboardAdmin user={user!} />} />
          <Route path="/profile" element={<UserProfile user={user!} onLogout={logout} />} />
        </Route>
      </Routes>
    </Router>
  );
};

const HomeRedirect: React.FC<{ role?: UserRole }> = ({ role }) => {
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'wali_kelas') return <Navigate to="/wali" />;
  if (role === 'siswa') return <Navigate to="/siswa" />;
  return <Navigate to="/login" />;
};

export default App;