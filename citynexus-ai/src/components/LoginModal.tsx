import React from 'react';
import { 
  Users, 
  Shield, 
  CheckCircle2, 
  X, 
  Building2, 
  PlusCircle, 
  LayoutDashboard, 
  PhoneCall, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  setCurrentView: (view: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  setCurrentView
}) => {
  if (!isOpen) return null;

  const handleChoose = (role: UserRole) => {
    onSelectRole(role);
    if (role === 'admin') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('report');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 animate-fade-in">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1 pb-5 border-b border-slate-800">
          <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
            HACKATHON DEMO AUTHENTICATION
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Select Your Role
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Experience CityNexus AI through the perspective of a local resident or a municipal operations director.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          
          {/* Card 1: Citizen */}
          <div 
            onClick={() => handleChoose('citizen')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
              currentRole === 'citizen'
                ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                {currentRole === 'citizen' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold">
                    ACTIVE
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
                Citizen Resident
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Active reporting persona for city residents.
              </p>

              {/* Capabilities */}
              <ul className="mt-4 space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Report issues with photo & voice</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive 📞 AI Voice Call</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Submit emergency hazard alerts</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Track resolution progress</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-6 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Login as Citizen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Municipal Admin */}
          <div 
            onClick={() => handleChoose('admin')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
              currentRole === 'admin'
                ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                {currentRole === 'admin' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-slate-950 font-bold">
                    ACTIVE
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300">
                Municipal Admin
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Operations lead / Public Works Director.
              </p>

              {/* Capabilities */}
              <ul className="mt-4 space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Full Command Center access</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>0–100 Priority Queue triage</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Assign repair crews & status</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Weekly velocity & impact analytics</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="mt-6 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Login as Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
