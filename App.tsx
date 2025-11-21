import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  FolderOpen, 
  CalendarDays, 
  Settings, 
  FileText,
  Menu,
  X,
  BookOpen
} from 'lucide-react';

// Pages
import DashboardHome from './pages/DashboardHome';
import ArchitectureBlueprint from './pages/ArchitectureBlueprint';
import ContentManager from './pages/ContentManager';
import SignageList from './pages/SignageList';
import PlayerClient from './pages/PlayerClient';
import SettingsPage from './pages/Settings';
import ScheduleManager from './pages/ScheduleManager';

// Types
import { SignageUnit } from './types';
import { ApiService } from './services/mockService';

// --- Layout Components ---

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="./logo.png"
              onError={(e) => {
                // Fallback to remote URL if local logo.png is not found
                e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Logo_UII_%28Universitas_Islam_Indonesia%29.png/180px-Logo_UII_%28Universitas_Islam_Indonesia%29.png";
              }}
              alt="UII Logo" 
              className="w-8 h-auto" 
            />
            <h1 className="text-xl font-bold text-white tracking-tight">FTI CMS</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="px-3 py-4">
          <div className="mb-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/signages" icon={Monitor} label="Signage Units" active={location.pathname === '/signages'} />
          <SidebarItem to="/content" icon={FolderOpen} label="Content Library" active={location.pathname === '/content'} />
          <SidebarItem to="/schedule" icon={CalendarDays} label="Scheduling" active={location.pathname === '/schedule'} />
          
          <div className="mt-8 mb-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <SidebarItem to="/blueprint" icon={BookOpen} label="Panduan & Dokumentasi" active={location.pathname === '/blueprint'} />
          <SidebarItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-slate-900/50 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-200">
            <Menu size={24} />
          </button>
          <span className="font-semibold">FTI Signage</span>
          <div className="w-6"></div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Player Route - Standalone, no layout */}
        <Route path="/player/:id" element={<PlayerClient />} />
        
        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout><DashboardHome /></AdminLayout>} />
        <Route path="/signages" element={<AdminLayout><SignageList /></AdminLayout>} />
        <Route path="/content" element={<AdminLayout><ContentManager /></AdminLayout>} />
        <Route path="/blueprint" element={<AdminLayout><ArchitectureBlueprint /></AdminLayout>} />
        <Route path="/schedule" element={<AdminLayout><ScheduleManager /></AdminLayout>} />
        <Route path="/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;