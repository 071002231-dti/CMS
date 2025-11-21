import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/mockService';
import { SignageUnit, SignageStatus } from '../types';
import { Play } from 'lucide-react';

const SignageList = () => {
  const [signages, setSignages] = useState<SignageUnit[]>([]);

  useEffect(() => {
    ApiService.getSignages().then(setSignages);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Registered Signage Units</h2>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950">
            <tr className="text-xs text-slate-400 uppercase tracking-wider">
              <th className="p-4 border-b border-slate-800">Hostname / ID</th>
              <th className="p-4 border-b border-slate-800">Location</th>
              <th className="p-4 border-b border-slate-800">MAC Address</th>
              <th className="p-4 border-b border-slate-800">Status</th>
              <th className="p-4 border-b border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {signages.map((unit) => (
              <tr key={unit.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{unit.hostname}</div>
                  <div className="text-xs text-slate-500 font-mono">{unit.id}</div>
                </td>
                <td className="p-4 text-slate-300">{unit.location}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{unit.mac_address}</td>
                <td className="p-4">
                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                        ${unit.status === SignageStatus.ONLINE 
                            ? 'bg-green-950 border-green-900 text-green-400' 
                            : 'bg-red-950 border-red-900 text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${unit.status === SignageStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {unit.status}
                    </span>
                </td>
                <td className="p-4 text-right">
                  {/* Removed target="_blank" to fix ERR_FILE_NOT_FOUND on some local setups */}
                  <Link 
                    to={`/player/${unit.hostname}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    <Play size={12} />
                    Launch Player
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignageList;