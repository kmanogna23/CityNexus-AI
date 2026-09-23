import React from 'react';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  LayoutDashboard, 
  PhoneCall, 
  AlertOctagon, 
  UserCheck, 
  LogIn, 
  Activity,
  Shield,
  Bot
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  criticalCount: number;
  userRole: UserRole;
  onOpenEmergency: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setCurrentView, 
  criticalCount,
  userRole,
  onOpenEmergency,
  onOpenLogin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  City<span className="text-emerald-400">Nexus</span> <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-medium">AI</span>
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1 font-mono">
                <span>Smart Urban Intelligence</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <Activity className="w-2.5 h-2.5 inline" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links: Exactly Home → Dashboard → Report Issue → City Map → AI Call */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'home'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                currentView === 'dashboard'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
              {criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold border border-rose-500/40">
                  {criticalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('report')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'report'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Report Issue
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'map'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              City Map
            </button>
            <button
              onClick={() => setCurrentView('assistance')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'assistance'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              AI Assistance
            </button>
          </nav>

          {/* Far Right: 🚨 Emergency button & Login button */}
          <div className="flex items-center gap-2.5">
            {/* 🚨 Emergency Button */}
            <button
              onClick={onOpenEmergency}
              className="bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm transition-all border border-rose-500/40 shadow-sm shadow-rose-950/40 flex items-center gap-1.5 active:scale-95"
              title="Report an immediate public safety hazard"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Emergency</span>
            </button>

            {/* Login / Role Button */}
            <button
              onClick={onOpenLogin}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm transition-all border border-slate-700/80 flex items-center gap-1.5 active:scale-95"
              title="Change User Role (Citizen / Municipal Admin)"
            >
              {userRole === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-xs text-amber-400 font-semibold">Admin</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-200">Citizen</span>
                </>
              )}
              <span className="hidden lg:inline text-[10px] text-slate-400 font-mono pl-1 border-l border-slate-700">Switch</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs overflow-x-auto">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2 py-1 rounded ${currentView === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentView === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Dashboard
            {criticalCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
          </button>
          <button
            onClick={() => setCurrentView('report')}
            className={`px-2 py-1 rounded ${currentView === 'report' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Report
          </button>
          <button
            onClick={() => setCurrentView('map')}
            className={`px-2 py-1 rounded ${currentView === 'map' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            City Map
          </button>
          <button
            onClick={() => setCurrentView('assistance')}
            className={`px-2 py-1 rounded ${currentView === 'assistance' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            AI Assistance
          </button>
        </div>

      </div>
    </header>
  );
};
