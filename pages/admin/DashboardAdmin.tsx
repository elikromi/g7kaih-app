
import React from 'react';
import { 
  Building2, 
  School, 
  Users, 
  Settings,
  TrendingUp,
  FileText,
  Plus
} from 'lucide-react';
import { Profile } from '../../types';

export const DashboardAdmin: React.FC<{ user: Profile }> = ({ user }) => {
  const currentYear = new Date().getFullYear();

  const handleManagementClick = (title: string) => {
    alert(`Modul manajemen "${title}" akan dibuka. Fitur ini memerlukan akses basis data utama.`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Manajemen Master Data Sekolah • {currentYear}</p>
      </header>

      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Sekolah Aktif', val: '1', icon: Building2, color: 'bg-blue-500' },
          { label: 'Total Siswa', val: '450', icon: Users, color: 'bg-indigo-500' },
          { label: 'Kepatuhan', val: '84%', icon: TrendingUp, color: 'bg-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Menu Management */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleManagementClick('Sekolah')}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-blue-500 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <School size={20} />
          </div>
          <p className="text-sm font-bold text-slate-800">Kelola Sekolah</p>
          <p className="text-[10px] text-slate-400 font-medium">Atur info & tahun ajaran</p>
        </button>
        <button 
          onClick={() => handleManagementClick('Wali Kelas')}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-blue-500 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Users size={20} />
          </div>
          <p className="text-sm font-bold text-slate-800">Wali Kelas</p>
          <p className="text-[10px] text-slate-400 font-medium">CRUD guru & akses kelas</p>
        </button>
        <button 
          onClick={() => handleManagementClick('Data Kebiasaan')}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-blue-500 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Settings size={20} />
          </div>
          <p className="text-sm font-bold text-slate-800">Data Kebiasaan</p>
          <p className="text-[10px] text-slate-400 font-medium">Atur 7 kebiasaan aktif</p>
        </button>
        <button 
          onClick={() => handleManagementClick('Laporan Master')}
          className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-blue-500 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <FileText size={20} />
          </div>
          <p className="text-sm font-bold text-slate-800">Laporan Master</p>
          <p className="text-[10px] text-slate-400 font-medium">Ekspor PDF seluruh sekolah</p>
        </button>
      </section>

      {/* Recent Activity Log */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Aktivitas Terkini</h3>
          <button 
            onClick={() => handleManagementClick('Aktivitas')}
            className="text-blue-600 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <Plus size={14} /> Tambah Data
          </button>
        </div>
        <div className="space-y-4">
          {[
            { act: 'Wali Kelas baru ditambahkan', time: 'Baru saja' },
            { act: 'Siswa mereset password melalui admin', time: '1 jam yang lalu' },
            { act: 'Laporan bulanan sekolah digenerate', time: 'Hari ini' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <div>
                <p className="text-xs text-slate-700 font-medium">{item.act}</p>
                <p className="text-[10px] text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
