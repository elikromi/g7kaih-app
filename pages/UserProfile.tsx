
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  ChevronRight,
  Bell,
  Lock,
  Moon,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Profile } from '../types';

interface UserProfileProps {
  user: Profile;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleAction = (label: string) => {
    alert(`Fitur "${label}" sedang disinkronkan dengan server sekolah.`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  // Academic year: Start of year is July (6)
  const academicYear = currentMonth >= 6 
    ? `${currentYear}/${currentYear + 1}` 
    : `${currentYear - 1}/${currentYear}`;

  return (
    <div className={`space-y-6 transition-colors duration-300`}>
      <header className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-black uppercase shadow-inner border-4 border-white">
            {user.name.charAt(0)}
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <h2 className={`mt-4 text-xl font-bold text-slate-800`}>{user.name}</h2>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <Shield size={14} />
          {user.role.replace('_', ' ').toUpperCase()}
        </p>
      </header>

      <div className={`rounded-3xl p-2 shadow-sm border bg-white border-slate-100`}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50`}>
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Nama Akun</p>
                <p className={`text-sm font-semibold text-slate-700`}>{user.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50`}>
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email Terdaftar</p>
                <p className={`text-sm font-semibold text-slate-700`}>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className={`px-2 font-bold text-sm text-slate-800`}>Aplikasi</h3>
        <div className={`rounded-3xl overflow-hidden shadow-sm border bg-white border-slate-100`}>
          {[
            { icon: Bell, label: 'Notifikasi', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Lock, label: 'Ganti Password', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Moon, label: 'Mode Gelap', color: 'text-purple-500', bg: 'bg-purple-50', toggle: true },
            { icon: HelpCircle, label: 'Bantuan', color: 'text-green-500', bg: 'bg-green-50' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => item.toggle ? toggleDarkMode() : handleAction(item.label)}
              className={`w-full flex items-center justify-between p-4 transition-colors border-b last:border-0 hover:bg-slate-50 border-slate-50`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <span className={`text-sm font-bold text-slate-700`}>{item.label}</span>
              </div>
              {item.toggle ? (
                <div className={`w-10 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-purple-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'left-5' : 'left-1'}`}></div>
                </div>
              ) : (
                <ChevronRight size={18} className="text-slate-300" />
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="px-4 pb-4 text-center">
        <button 
          onClick={onLogout}
          className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all mb-4"
        >
          <LogOut size={20} />
          Keluar Log Sesi
        </button>
        <p className="text-[10px] text-slate-400 font-medium">
          Dikelola oleh Sekolah • Tahun Ajaran {academicYear}
        </p>
        <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold tracking-widest">
          © {currentYear} Indonesia Hebat
        </p>
      </div>
    </div>
  );
};
