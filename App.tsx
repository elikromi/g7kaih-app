
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
import { supabase } from './lib/supabase';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        console.error("Connection Error:", err);
        if (err.message === 'Failed to fetch') {
          setError("Gagal terhubung ke Database. Pastikan URL di lib/supabase.ts sudah benar dan Anda memiliki koneksi internet.");
        } else {
          setError(err.message || "Terjadi kesalahan saat memuat sesi.");
        }
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
      setLoading(false);
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;

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

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Sinkronisasi Sistem...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-lg font-bold text-slate-800">Koneksi Terputus</h2>
      <p className="text-sm text-slate-500 mt-2 mb-6 max-w-xs mx-auto">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
      >
        <RefreshCw size={18} />
        Coba Hubungkan Kembali
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
