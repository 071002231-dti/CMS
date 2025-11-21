import React, { useState } from 'react';
import { Save, Shield, Users, Server, RefreshCw } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'api'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-slate-400 mt-1">Manage global configurations, access control, and API connections.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800 mb-8">
        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={Server} label="General" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Users & Roles" />
        <TabButton active={activeTab === 'api'} onClick={() => setActiveTab('api')} icon={Shield} label="API & Security" />
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Global Display Settings</h3>
              <div className="grid gap-6">
                <InputGroup label="System Name" defaultValue="FTI Digital Signage CMS" />
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Default Slide Duration (sec)" type="number" defaultValue="10" />
                   <InputGroup label="Transition Effect" type="select" defaultValue="fade">
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="none">None</option>
                   </InputGroup>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Maintenance</h3>
              <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
                <div>
                    <p className="text-white font-medium">Clear Cache</p>
                    <p className="text-sm text-slate-400">Force all signage units to re-download content on next heartbeat.</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-amber-500 border border-amber-500/30 bg-amber-500/10 rounded hover:bg-amber-500/20">
                    Execute
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Registered Users</h3>
                <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700">
                    + Add User
                </button>
             </div>
             
             <div className="overflow-hidden rounded-lg border border-slate-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400">
                        <tr>
                            <th className="p-3 font-medium">Username</th>
                            <th className="p-3 font-medium">Role</th>
                            <th className="p-3 font-medium">Last Login</th>
                            <th className="p-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                            <td className="p-3">admin_main</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">Administrator</span></td>
                            <td className="p-3 text-slate-500">Just now</td>
                            <td className="p-3 text-right"><button className="text-blue-400 hover:underline">Edit</button></td>
                        </tr>
                        <tr>
                            <td className="p-3">fti_editor</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">Editor</span></td>
                            <td className="p-3 text-slate-500">2 hours ago</td>
                            <td className="p-3 text-right"><button className="text-blue-400 hover:underline">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
             </div>
             <p className="text-xs text-slate-500 italic">
                * If integrated with WordPress, user management should be done via WP Admin Dashboard.
             </p>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">WordPress / XAMPP Integration</h3>
                <div className="space-y-4">
                    <InputGroup label="API Base URL" defaultValue="http://localhost/wordpress/wp-json/fti-signage/v1" helpText="The endpoint where the Client App fetches data." />
                    <InputGroup label="Secret Key (API Key)" type="password" defaultValue="sk_live_51234567890" helpText="Shared secret for authenticating signage units." />
                </div>
            </div>
             <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Heartbeat Configuration</h3>
                <p className="text-sm text-slate-400 mb-4">Control how often signage units report their status.</p>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Interval (Seconds)" type="number" defaultValue="60" />
                    <InputGroup label="Offline Threshold (Seconds)" type="number" defaultValue="180" />
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-blue-500 text-blue-400'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const InputGroup = ({ label, type = "text", defaultValue, helpText, children }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
    {children ? (
        <select className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none">
            {children}
        </select>
    ) : (
        <input 
        type={type} 
        defaultValue={defaultValue} 
        className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
    )}
    {helpText && <p className="text-xs text-slate-600">{helpText}</p>}
  </div>
);

export default SettingsPage;