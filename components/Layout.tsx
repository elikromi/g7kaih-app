
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ClipboardCheck, 
  History, 
  User, 
  LogOut, 
  LayoutDashboard,
  Users
} from 'lucide-react';
import { Profile } from '../types';

interface LayoutProps {
  user: Profile;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Beranda', icon: Home, path: user.role === 'admin' ? '/admin' : user.role === 'wali_kelas' ? '/wali' : '/siswa' },
    ...(user.role === 'siswa' ? [
      { label: 'Lapor', icon: ClipboardCheck, path: '/siswa/report' },
      { label: 'Riwayat', icon: History, path: '/siswa/history' }
    ] : []),
    ...(user.role === 'wali_kelas' ? [
      { label: 'Kelas', icon: Users, path: '/wali/class' }
    ] : []),
    { label: 'Profil', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-64">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">7K</span>
          </div>
          <h1 className="text-sm font-bold text-slate-800">7 Kebiasaan Baik</h1>
        </div>
        <button onClick={onLogout} className="text-slate-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">7K</span>
          </div>
          <span className="font-bold text-lg">IndoHebat</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center uppercase font-bold text-slate-500 text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-40">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] transition-colors ${
              location.pathname === item.path 
                ? 'text-blue-600' 
                : 'text-slate-400'
            }`}
          >
            <item.icon size={20} className={location.pathname === item.path ? 'fill-blue-50' : ''} />
            <span className="text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
