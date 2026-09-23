import React, { useState } from 'react';
import { 
  AlertOctagon, 
  X, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowRight,
  Radio,
  Send
} from 'lucide-react';
import { EmergencyCategory, UrbanIncident } from '../types';
import { apiService } from '../services/apiService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentCreated: (incident: UrbanIncident) => void;
  onNavigateToMap: () => void;
}

const EMERGENCY_CATEGORIES: { category: EmergencyCategory; icon: string; desc: string }[] = [
  { 
    category: 'Severe flooding / waterlogging', 
    icon: '🌊', 
    desc: 'Deep standing water blocking traffic or entering basements/subways' 
  },
  { 
    category: 'Major road blockage', 
    icon: '🚧', 
    desc: 'Collapsed roadway, large sinkhole, fallen heavy structure' 
  },
  { 
    category: 'Dangerous infrastructure', 
    icon: '⚠️', 
    desc: 'Cracked bridge joint, exposed high-voltage wiring, leaning pole' 
  },
  { 
    category: 'Major drainage failure', 
    icon: '🌀', 
    desc: 'Burst stormwater culvert or high-pressure sewer backup' 
  },
  { 
    category: 'Other public-safety hazard', 
    icon: '🚨', 
    desc: 'Immediate urban physical peril requiring swift municipal intervention' 
  },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onIncidentCreated,
  onNavigateToMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('Severe flooding / waterlogging');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Intersection of 4th St & Mission St');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedEmergency, setConfirmedEmergency] = useState<{
    incident: UrbanIncident;
    emergencyCode: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a brief description of the urgent emergency.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.submitEmergencyReport({
        category: selectedCategory,
        description,
        location: {
          lat: 37.7858 + (Math.random() - 0.5) * 0.01,
          lng: -122.4065 + (Math.random() - 0.5) * 0.01,
          address
        },
        callerPhone: phone || undefined
      });

      setConfirmedEmergency(res);
      onIncidentCreated(res.incident);
    } catch (err: any) {
      alert('Failed to log emergency: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedEmergency(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border-2 border-rose-500/60 shadow-2xl shadow-rose-950/50 p-6 sm:p-8 my-8 text-slate-100 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7 stroke-[2.2] animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Immediate Public Safety Dispatch
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Emergency Urban Hazard
            </h2>
          </div>
        </div>

        {/* Critical Disclaimer Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs leading-relaxed">
          <strong className="text-rose-400 font-mono block mb-0.5">⚠️ PROTOTYPE EMERGENCY REPORTING:</strong>
          If you are witnessing a life-threatening crisis or fire, immediately contact <strong>911 / 112</strong>. This system logs critical public works threats into the CityNexus rapid intervention queue.
        </div>

        {confirmedEmergency ? (
          /* Confirmation State */
          <div className="mt-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <Flame className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                EMERGENCY DISPATCH INGESTED
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Code: {confirmedEmergency.emergencyCode}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Incident classified as <strong>Critical (Score: {confirmedEmergency.incident.priorityScore})</strong>. Pinned to the Municipal Command Center.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Category:</span>
                <span className="text-white font-semibold">{confirmedEmergency.incident.category}</span>
              </div>
              <div className="flex justify-between font-mono text-slate-400">
                <span>Location:</span>
                <span className="text-white font-semibold truncate max-w-[240px]">
                  {confirmedEmergency.incident.location.address}
                </span>
              </div>
              <div className="flex justify-between font-mono text-slate-400">
                <span>Dispatch Action:</span>
                <span className="text-teal-300 font-semibold truncate max-w-[240px]">
                  Rapid Response Team Notified
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleReset();
                  onNavigateToMap();
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-rose-950/40"
              >
                <span>View on Live City Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                SELECT EMERGENCY CLASSIFICATION:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {EMERGENCY_CATEGORIES.map((cat) => (
                  <div
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedCategory === cat.category 
                        ? 'bg-rose-500/15 border-rose-500/60 text-white font-semibold shadow-sm' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      Urgent SLA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                DESCRIBE SITUATION & IMMEDIATE RISK:
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Severe street flooding over 2 feet deep near underpass, 3 cars stalled with passengers inside, water approaching electrical transformer."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            {/* Location & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  EXACT LOCATION / CROSS STREETS:
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  CALLER PHONE (OPTIONAL):
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>DISPATCHING RAPID UNIT...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>TRANSMIT EMERGENCY DISPATCH</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
