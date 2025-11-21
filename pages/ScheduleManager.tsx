import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/mockService';
import { SignageUnit, Playlist, ScheduleAssignment } from '../types';
import { Calendar, Clock, Save, Trash2, Monitor, ListVideo } from 'lucide-react';

const ScheduleManager = () => {
  const [signages, setSignages] = useState<SignageUnit[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [schedules, setSchedules] = useState<ScheduleAssignment[]>([]);
  
  // Form State
  const [selectedSignage, setSelectedSignage] = useState<string>('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [s, p] = await Promise.all([
        ApiService.getSignages(),
        ApiService.getPlaylists()
      ]);
      setSignages(s);
      setPlaylists(p);
      // Mock getting existing schedules
      // In real app: const sch = await ApiService.getSchedules();
      // setSchedules(sch); 
    };
    loadData();
  }, []);

  const handleCreateSchedule = async () => {
    if (!selectedSignage || !selectedPlaylist || !startDate || !endDate) return;
    
    setIsSaving(true);
    
    const newSchedule: ScheduleAssignment = {
      id: `sch-${Date.now()}`,
      signage_id: selectedSignage,
      playlist_id: selectedPlaylist,
      start_time: `${startDate}T${startTime}:00Z`,
      end_time: `${endDate}T${endTime}:00Z`,
      priority: 1
    };

    try {
      await ApiService.createSchedule(newSchedule);
      setSchedules([...schedules, newSchedule]);
      // Reset form
      setSelectedSignage('');
      setSelectedPlaylist('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await ApiService.deleteSchedule(id);
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Form */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold text-white">Create Schedule</h2>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          
          {/* Signage Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Select Signage Unit</label>
            <div className="relative">
                <Monitor className="absolute left-3 top-3 text-slate-500" size={18} />
                <select 
                    value={selectedSignage}
                    onChange={(e) => setSelectedSignage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">-- Choose Display --</option>
                    {signages.map(s => (
                        <option key={s.id} value={s.id}>{s.hostname} ({s.location})</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Playlist Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Select Playlist</label>
            <div className="relative">
                <ListVideo className="absolute left-3 top-3 text-slate-500" size={18} />
                <select 
                    value={selectedPlaylist}
                    onChange={(e) => setSelectedPlaylist(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">-- Choose Playlist --</option>
                    {playlists.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.items.length} items)</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Start Date</label>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                />
                <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm mt-2"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">End Date</label>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                />
                <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm mt-2"
                />
            </div>
          </div>

          <button 
            onClick={handleCreateSchedule}
            disabled={isSaving || !selectedSignage || !selectedPlaylist}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isSaving ? 'Saving...' : <><Save size={18} /> Publish Schedule</>}
          </button>

        </div>
      </div>

      {/* Right: List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-white mb-6">Active Schedules</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             {schedules.length === 0 ? (
                 <div className="p-10 text-center text-slate-500">
                     <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                     <p>No active schedules found. Create one to start displaying content.</p>
                 </div>
             ) : (
                 <table className="w-full text-left">
                    <thead className="bg-slate-950 text-xs text-slate-400 uppercase">
                        <tr>
                            <th className="p-4">Signage</th>
                            <th className="p-4">Playlist</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        {schedules.map(sch => {
                            const signage = signages.find(s => s.id === sch.signage_id);
                            const playlist = playlists.find(p => p.id === sch.playlist_id);
                            return (
                                <tr key={sch.id} className="hover:bg-slate-800/30">
                                    <td className="p-4 font-medium text-white">
                                        {signage?.hostname}
                                        <div className="text-xs text-slate-500">{signage?.location}</div>
                                    </td>
                                    <td className="p-4">{playlist?.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-green-400">From: {new Date(sch.start_time).toLocaleDateString()}</span>
                                            <span className="text-slate-600">→</span>
                                            <span className="text-red-400">To: {new Date(sch.end_time).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(sch.id)}
                                            className="text-slate-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                 </table>
             )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;