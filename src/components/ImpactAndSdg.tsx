import React from 'react';
import { 
  Globe2, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Clock, 
  Leaf, 
  HeartHandshake, 
  Cpu, 
  BarChart3, 
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

export const ImpactAndSdg: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
          <Award className="w-4 h-4" />
          <span>URBANTECH HACK 2026 • SUSTAINABLE CITIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          UN SDG 11 Alignment & Impact Simulation
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          How UrbanPulse AI delivers measurable civic intelligence toward United Nations Sustainable Development Goal 11: Making cities inclusive, safe, resilient, and sustainable.
        </p>
      </div>

      {/* 5 Pillars of SDG 11 Alignment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Core SDG 11 Alignment Architecture
          </h2>
          <span className="text-xs font-mono text-emerald-400">Target Framework</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Sustainable Cities */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sustainable Cities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimizes municipal fleet routing and reduces unnecessary inspection dispatches by merging spatial duplicate reports, directly curbing municipal carbon emissions.
            </p>
            <div className="text-[11px] font-mono text-emerald-400/90 pt-1 border-t border-slate-800">
              Target 11.6 • Municipal waste & environmental footprint
            </div>
          </div>

          {/* 2. Safe Cities */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Safe Cities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prioritizes life-threatening road craters, exposed high-voltage wiring, and unlit pedestrian crossings within minutes, protecting cyclists, transit riders, and vulnerable pedestrians.
            </p>
            <div className="text-[11px] font-mono text-rose-400/90 pt-1 border-t border-slate-800">
              Target 11.2 • Safe, accessible transport & vulnerable road users
            </div>
          </div>

          {/* 3. Inclusive Cities */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Inclusive Cities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Democratizes citizen reporting through accessible multimodal interfaces, including natural language browser speech recognition and one-click visual reporting.
            </p>
            <div className="text-[11px] font-mono text-cyan-400/90 pt-1 border-t border-slate-800">
              Target 11.3 • Participatory, integrated human settlement planning
            </div>
          </div>

          {/* 4. Resilient Cities */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Resilient Cities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Models secondary urban risks (such as accumulated waste choking drainage grates prior to heavy storms) to mitigate flash flooding and infrastructure failure before it occurs.
            </p>
            <div className="text-[11px] font-mono text-amber-400/90 pt-1 border-t border-slate-800">
              Target 11.b • Disaster risk reduction & holistic climate resilience
            </div>
          </div>

          {/* 5. Smart Urban Services */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 md:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Urban Services</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides municipal directors with an explainable decision-support dashboard, replacing opaque complaint backlogs with transparent, objective triage metrics and GIS hazard density mapping.
            </p>
            <div className="text-[11px] font-mono text-teal-400/90 pt-1 border-t border-slate-800">
              Target 11.a • Positive economic, social & environmental links across metropolitan zones
            </div>
          </div>

        </div>
      </div>

      {/* Prototype Impact Simulation Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-emerald-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROTOTYPE SIMULATION MODEL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Civic Efficiency & Sustainability Simulation
            </h2>
          </div>

          {/* Mandatory Disclaimer Label */}
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-400">
            Illustrative prototype scenario / simulated model
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The following metrics represent projected operational efficiencies modeled for a metropolitan district of 250,000 citizens deploying UrbanPulse AI compared against traditional legacy 311 telephone ticket systems.
        </p>

        {/* 4 Metric Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Duplicate Reports</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-slate-500 line-through font-mono">31%</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">12%</span>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono mt-1 font-semibold">
              -61% Redundant Trips
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Spatial proximity clustering stops multiple trucks sent to identical pothole.</p>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Average Triage Time</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-slate-500 line-through font-mono">48 min</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">15 min</span>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono mt-1 font-semibold">
              -69% Processing Latency
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Instant multimodal severity calculation replaces manual phone queue review.</p>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">High-Risk Detection</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-slate-500 line-through font-mono">72%</span>
              <span className="text-2xl font-extrabold text-teal-400 font-mono">91%</span>
            </div>
            <div className="text-[11px] text-teal-400/90 font-mono mt-1 font-semibold">
              +19% Rapid Interception
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Early warning rules identify hazardous secondary consequences early.</p>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Fleet Fuel Avoided</div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">4.2 tons</span>
            </div>
            <div className="text-[11px] text-cyan-400/90 font-mono mt-1 font-semibold">
              CO₂ / Month Avoided
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Estimated municipal fuel savings from consolidated dispatch routes.</p>
          </div>

        </div>

      </div>

    </div>
  );
};
