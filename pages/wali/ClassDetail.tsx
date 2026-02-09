
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  UserPlus, 
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { Profile } from '../../types';

const MOCK_STUDENTS = [
  { id: 's1', name: 'Andi Pratama', completed: 5, total: 7, lastUpdate: '08:30', parent: 'Bapak Rudi' },
  { id: 's2', name: 'Budi Santoso', completed: 7, total: 7, lastUpdate: '07:15', parent: 'Ibu Ani' },
  { id: 's3', name: 'Citra Kirana', completed: 0, total: 7, lastUpdate: '-', parent: 'Bapak Slamet' },
  { id: 's4', name: 'Dedi Kurniawan', completed: 4, total: 7, lastUpdate: '09:45', parent: 'Ibu Wati' },
  { id: 's5', name: 'Eka Putri', completed: 6, total: 7, lastUpdate: '08:00', parent: 'Bapak Joko' },
  { id: 's6', name: 'Farhan Hakim', completed: 7, total: 7, lastUpdate: '06:30', parent: 'Ibu Sari' },
];

export const ClassDetail: React.FC<{ user: Profile }> = ({ user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    alert('Buka formulir pendaftaran siswa baru ke Kelas ' + (user.class_id || 'X-1'));
  };

  const handleFilter = () => {
    alert('Filter berdasarkan: Status Lapor, Nama, atau Urutan Absen.');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Siswa</h2>
          <p className="text-xs text-slate-500">Kelas {user.class_id || 'X-1'} • 32 Siswa</p>
        </div>
      </header>

      {/* Search and Action */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button 
          onClick={handleFilter}
          className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-500 active:scale-95 transition-transform"
        >
          <Filter size={20} />
        </button>
      </div>

      <button 
        onClick={handleAddStudent}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
      >
        <UserPlus size={20} />
        Tambah Siswa Baru
      </button>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <div 
            key={student.id} 
            onClick={() => navigate(`/wali/student/${student.id}`)}
            className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-500 uppercase">
                  {student.name.substring(0, 2)}
                </div>
                {student.completed === 7 ? (
                  <div className="absolute -top-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center">
                    <CheckCircle size={10} className="text-white" />
                  </div>
                ) : student.completed === 0 ? (
                  <div className="absolute -top-1 -right-1 bg-red-400 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center">
                    <XCircle size={10} className="text-white" />
                  </div>
                ) : null}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">{student.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Ortu: {student.parent}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-slate-800">{student.completed}/7</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Habits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
