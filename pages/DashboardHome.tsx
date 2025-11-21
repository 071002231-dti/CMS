import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  HardDrive,
  PlayCircle,
  AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ApiService } from '../services/mockService';
import { SignageUnit, SignageStatus } from '../types';

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}-500`}>
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className={`text-xs mt-2 font-medium text-${color}-400`}>{subtext}</p>
    </div>
  </div>
);

const DashboardHome = () => {
  const [signages, setSignages] = useState<SignageUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await ApiService.getSignages();
      setSignages(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="text-white">Loading dashboard...</div>;

  const onlineCount = signages.filter(s => s.status === SignageStatus.ONLINE).length;
  const offlineCount = signages.filter(s => s.status === SignageStatus.OFFLINE).length;
  
  const chartData = [
    { name: 'Online', value: onlineCount, color: '#3b82f6' }, // blue-500
    { name: 'Offline', value: offlineCount, color: '#ef4444' }, // red-500
    { name: 'Maintenance', value: 0, color: '#f59e0b' } // amber-500
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">System Overview</h2>
          <p className="text-slate-400 mt-1">Monitoring 7 Units • FTI Campus Network</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Healthy
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Signages" 
          value={signages.length} 
          subtext="4K Portrait Mode Configured" 
          icon={MonitorIcon} 
          color="blue" 
        />
        <StatCard 
          title="Online Units" 
          value={onlineCount} 
          subtext={`${Math.round((onlineCount/signages.length)*100)}% Uptime`} 
          icon={Wifi} 
          color="green" 
        />
        <StatCard 
          title="Offline Units" 
          value={offlineCount} 
          subtext="Requires attention" 
          icon={WifiOff} 
          color="red" 
        />
        <StatCard 
          title="Storage" 
          value="45%" 
          subtext="124GB / 256GB Used (Avg)" 
          icon={HardDrive} 
          color="purple" 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Signage Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                  <th className="pb-3 pl-2">Hostname</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Resolution</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800">
                {signages.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 pl-2 font-medium text-white">{unit.hostname}</td>
                    <td className="py-3 text-slate-400">{unit.location}</td>
                    <td className="py-3 text-slate-400 text-xs font-mono">{unit.resolution}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${unit.status === SignageStatus.ONLINE ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Uptime Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2">Network Health</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-slate-200">Maintenance Required</p>
                <p className="text-xs text-slate-400 mt-1">FTI-SIGNAGE-05 has been offline for 2 hours. Check Wi-Fi connectivity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon helper
const MonitorIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

export default DashboardHome;