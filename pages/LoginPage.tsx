
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // App.tsx handles navigation via auth listener
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-blue-600">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
          <span className="text-blue-600 font-black text-2xl">7K</span>
        </div>
        <h1 className="text-white text-2xl font-bold text-center mb-2">Anak Indonesia Hebat</h1>
        <p className="text-blue-100 text-sm text-center mb-8">Pelacakan Kebiasaan Baik Harian</p>

        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Sekolah</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sekolah.sch.id"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kata Sandi</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-500 text-[10px] leading-tight font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transform transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Masuk...' : 'Masuk Sekarang'}
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
             <p className="text-[9px] text-slate-400 font-medium">Sistem Pelaporan Karakter Terpusat</p>
          </div>
        </form>
      </div>
      
      <div className="p-6 text-center">
        <p className="text-blue-200 text-[10px] font-medium tracking-wide">
          7 KEBIASAAN BAIK • {currentYear}
        </p>
      </div>
    </div>
  );
};
