import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Users, 
  ShieldAlert, 
  Building2,
  Calendar,
  Send,
  HelpCircle
} from 'lucide-react';
import { UrbanIncident, IssueStatus } from '../types';

interface IssueDetailsModalProps {
  incident: UrbanIncident | null;
  onClose: () => void;
  onUpdateStatus: (incidentId: string, status: IssueStatus, assignedTeam?: string) => void;
}

const TEAMS = [
  'Road Infrastructure Dept (Crew R-4)',
  'Bureau of Water & Municipal Utilities',
  'Stormwater & Environmental Hydraulics',
  'Sanitation & Waste Logistics Division',
  'Public Utilities Commission - Lighting',
  'Hazardous Materials Response Unit',
  'Emergency Road Rapid Dispatch'
];

export const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  incident,
  onClose,
  onUpdateStatus,
}) => {
  if (!incident) return null;

  const [currentStatus, setCurrentStatus] = useState<IssueStatus>(incident.status);
  const [assignedTeam, setAssignedTeam] = useState<string>(incident.assignedTeam || TEAMS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onUpdateStatus(incident.id, currentStatus, assignedTeam);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 300);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">🔴 Critical Severity</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">🟠 High Severity</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-bold font-mono">🟡 Medium Severity</span>;
      default:
        return <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">🟢 Low Severity</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {incident.id}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Urban Intelligence Dossier
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Title & Image Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Preview */}
            <div className="md:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img 
                src={incident.imageUrl} 
                alt={incident.title}
                className="w-full h-52 object-cover" 
              />
              <div className="p-2.5 bg-slate-950 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800">
                <span>📍 {incident.location.district}</span>
                <span>{incident.duplicateCount} citizen reports</span>
              </div>
            </div>

            {/* Core Info */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-xs font-semibold text-slate-200">
                  {incident.category}
                </span>
                {getSeverityBadge(incident.severity)}
              </div>

              <h2 className="text-xl font-bold text-white leading-tight">
                {incident.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {incident.description}
              </p>

              <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{incident.location.address} ({incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)})</span>
              </div>
            </div>

          </div>

          {/* Explainable Priority Score Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Explainable Priority Score Breakdown
                </span>
              </div>
              <span className={`text-lg font-extrabold font-mono ${
                incident.priorityScore >= 80 ? 'text-rose-400' :
                incident.priorityScore >= 60 ? 'text-amber-400' : 'text-yellow-300'
              }`}>
                {incident.priorityScore} / 100
              </span>
            </div>

            {/* Detailed Point Allocation Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Severity</div>
                <div className="text-sm font-mono font-bold text-slate-200">{incident.scoreBreakdown?.severity || 30} <span className="text-[10px] text-slate-500">/35</span></div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Nearby Reports</div>
                <div className="text-sm font-mono font-bold text-slate-200">{incident.scoreBreakdown?.nearbyReports || 15} <span className="text-[10px] text-slate-500">/20</span></div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Public Safety</div>
                <div className="text-sm font-mono font-bold text-slate-200">{incident.scoreBreakdown?.publicSafety || 14} <span className="text-[10px] text-slate-500">/15</span></div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Environmental</div>
                <div className="text-sm font-mono font-bold text-slate-200">{incident.scoreBreakdown?.environmentalImpact || 12} <span className="text-[10px] text-slate-500">/10</span></div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400">Location Critical</div>
                <div className="text-sm font-mono font-bold text-slate-200">{incident.scoreBreakdown?.locationImportance || 9} <span className="text-[10px] text-slate-500">/10</span></div>
              </div>
            </div>

            {/* Explanation Reasons */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                Key Contributing Decision Factors:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {incident.priorityExplanation.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Secondary Urban Risk */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>⚠️ Potential Secondary Urban Risk Analysis</span>
            </div>
            <p className="text-[11px] text-rose-200/90 pl-5 leading-relaxed">
              "{incident.potentialRisk}"
            </p>
          </div>

          {/* Recommended Municipal Action */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended Municipal Directive</span>
            </div>
            <p className="text-[11px] text-emerald-200 pl-5">
              {incident.recommendedAction}
            </p>
          </div>

          {/* Duplicate Clustering Details */}
          {incident.duplicateCount > 1 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Merged Duplicate Citizen Reports ({incident.duplicateCount} Total)</span>
              </div>
              <p className="text-[11px] text-amber-200/90 pl-5">
                {incident.duplicateNotes || `Consolidated multiple citizen reports within spatial proximity to prevent redundant municipal dispatch.`}
              </p>
            </div>
          )}

          {/* Municipal Action Controls: Status & Team Assignment */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase font-mono">
              Municipal Dispatch & Workflow Controls
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  RESOLUTION WORKFLOW STATUS
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as IssueStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Reported">Reported</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Assigned Team */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  ASSIGNED FIELD CREW / UNIT
                </label>
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {TEAMS.map((team, idx) => (
                    <option key={idx} value={team}>{team}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 font-mono">
                Reported by {incident.citizenReporter || 'Citizen'}
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Save & Update Incident State'}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
