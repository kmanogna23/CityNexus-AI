import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Search, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Building2, 
  ChevronRight, 
  ExternalLink,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Sparkles,
  Shield,
  Radio,
  Flame,
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import { UrbanIncident, IssueStatus, UrbanIssueCategory, IssueSeverity, UserRole } from '../types';

interface MunicipalDashboardProps {
  incidents: UrbanIncident[];
  onSelectIncident: (incident: UrbanIncident) => void;
  onUpdateStatus: (incidentId: string, newStatus: IssueStatus) => void;
  onRefresh: () => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export const MunicipalDashboard: React.FC<MunicipalDashboardProps> = ({
  incidents,
  onSelectIncident,
  onUpdateStatus,
  onRefresh,
  userRole,
  onSwitchRole,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  // Overview metrics
  const total = incidents.length;
  const critical = incidents.filter(i => i.severity === 'Critical').length;
  const high = incidents.filter(i => i.severity === 'High').length;
  const medium = incidents.filter(i => i.severity === 'Medium').length;
  const low = incidents.filter(i => i.severity === 'Low').length;
  const resolved = incidents.filter(i => i.status === 'Resolved').length;
  const inProgress = incidents.filter(i => i.status === 'In Progress').length;
  const pending = total - resolved;

  const totalDuplicates = incidents.reduce((acc, i) => acc + (i.duplicateCount > 1 ? i.duplicateCount - 1 : 0), 0);

  // Category counts
  const categoriesCount: Record<UrbanIssueCategory, number> = {
    'Pothole / Road Damage': incidents.filter(i => i.category === 'Pothole / Road Damage').length,
    'Garbage / Waste Overflow': incidents.filter(i => i.category === 'Garbage / Waste Overflow').length,
    'Water Leakage': incidents.filter(i => i.category === 'Water Leakage').length,
    'Drainage / Drain Blockage': incidents.filter(i => i.category === 'Drainage / Drain Blockage').length,
    'Broken Streetlight': incidents.filter(i => i.category === 'Broken Streetlight').length,
  };

  // Immediate Attention Queue (Critical issues requiring instant response)
  const immediateAttentionList = incidents
    .filter(i => i.status !== 'Resolved' && (i.severity === 'Critical' || i.priorityScore >= 80))
    .slice(0, 3);

  // Top Priority Queue (sorted by priorityScore descending, non-resolved)
  const priorityQueue = [...incidents]
    .filter(i => i.status !== 'Resolved')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 5);

  // Filtered list for the main table
  const filteredIncidents = incidents.filter(inc => {
    if (filterCategory !== 'All' && inc.category !== filterCategory) return false;
    if (filterSeverity !== 'All' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && inc.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = inc.title.toLowerCase().includes(q) ||
                    inc.description.toLowerCase().includes(q) ||
                    inc.location.address.toLowerCase().includes(q) ||
                    inc.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 space-y-8">
      
      {/* Role Banner / Observer Notice */}
      {userRole === 'citizen' && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <span>
              You are viewing this Municipal Operations Center in <strong>Citizen Observer Mode</strong>.
            </span>
          </div>
          <button
            onClick={() => onSwitchRole('admin')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono font-medium transition-colors"
          >
            Switch to Municipal Admin Role →
          </button>
        </div>
      )}

      {/* Municipal Operations Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-emerald-400 text-xs">
            <Building2 className="w-4 h-4" />
            <span>MUNICIPAL URBAN COMMAND & DECISION SUPPORT SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            City Operations Control Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Automated AI hazard triage, GIS cross-department queue, and field crew dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Triage Engine: Online</span>
          </div>

          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Immediate Attention Alert Box (if critical issues exist) */}
      {immediateAttentionList.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase font-mono">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>Immediate Attention Hotspots ({immediateAttentionList.length} Active Critical Cases)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Response SLA &lt; 30 Minutes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {immediateAttentionList.map(item => (
              <div 
                key={item.id}
                onClick={() => onSelectIncident(item)}
                className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/30 hover:border-rose-400/60 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-rose-400 font-bold">SCORE: {item.priorityScore}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">{item.status}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-200">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  📍 {item.location.address}
                </p>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Risk: {item.potentialRisk}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Issues */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Monitored</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">{total}</div>
          <div className="text-[10px] text-slate-500 mt-1">Citywide incident tickets</div>
        </div>

        {/* Critical Issues */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-900/40">
          <div className="text-[11px] font-mono uppercase text-rose-400">🔴 Critical</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono mt-1">{critical}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">Immediate life hazard</div>
        </div>

        {/* High Priority Issues */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-900/40">
          <div className="text-[11px] font-mono uppercase text-amber-400">🟠 High Priority</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">{high}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Priority dispatch queue</div>
        </div>

        {/* Medium Priority */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono uppercase text-yellow-400">🟡 Medium</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-yellow-300 font-mono mt-1">{medium}</div>
          <div className="text-[10px] text-slate-500 mt-1">Scheduled routine repairs</div>
        </div>

        {/* Pending Triage vs Resolved */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-900/30">
          <div className="text-[11px] font-mono uppercase text-cyan-400">Pending Triage</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1">{pending}</div>
          <div className="text-[10px] text-slate-500 mt-1">Active resolution work</div>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-900/40">
          <div className="text-[11px] font-mono uppercase text-emerald-400">🟢 Resolved</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">{resolved}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Verified closed cases</div>
        </div>

      </div>

      {/* Middle Section: Priority Queue & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Priority Queue (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Top Priority Urban Dispatch Queue
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Ranked by 0–100 Rubric</span>
          </div>

          <div className="space-y-3">
            {priorityQueue.map((item) => {
              const isCrit = item.severity === 'Critical' || item.priorityScore >= 80;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCrit 
                      ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20' 
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shadow-md ${
                        item.priorityScore >= 80 ? 'bg-rose-500 text-white' :
                        item.priorityScore >= 60 ? 'bg-amber-500 text-slate-950' : 'bg-yellow-500 text-slate-950'
                      }`}>
                        {item.priorityScore}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {item.category}
                          </span>
                          {item.duplicateCount > 1 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              {item.duplicateCount} citizen reports
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                      item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      item.status === 'Assigned' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                    📍 {item.location.address}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="truncate pr-2">
                      <strong className="text-emerald-400">Action:</strong> {item.recommendedAction}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectIncident(item)}
                      className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Inspect Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {userRole === 'admin' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateStatus(item.id, item.status === 'Assigned' ? 'In Progress' : 'Assigned')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
                        >
                          {item.status === 'Reported' ? 'Assign Team' : 'Progress Work'}
                        </button>
                        <button
                          onClick={() => onUpdateStatus(item.id, 'Resolved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        Admin controls locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics, Resolution Trends & Categories (Right) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Weekly Inflow vs Resolution Trend */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">7-Day Resolution Velocity</h3>
                <p className="text-xs text-slate-400">Incoming hazards vs verified repairs</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">+18.5% efficiency</span>
            </div>

            {/* Simple CSS Bar Trend */}
            <div className="grid grid-cols-7 gap-2 pt-2 items-end h-28 border-b border-slate-800 pb-2 text-center">
              {[
                { day: 'Mon', reported: 6, resolved: 5 },
                { day: 'Tue', reported: 8, resolved: 7 },
                { day: 'Wed', reported: 5, resolved: 6 },
                { day: 'Thu', reported: 9, resolved: 8 },
                { day: 'Fri', reported: 7, resolved: 9 },
                { day: 'Sat', reported: 4, resolved: 5 },
                { day: 'Sun', reported: 3, resolved: 4 },
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-20">
                    <div 
                      className="w-2.5 bg-amber-500/70 rounded-t"
                      style={{ height: `${(d.reported / 10) * 100}%` }}
                      title={`Reported: ${d.reported}`}
                    />
                    <div 
                      className="w-2.5 bg-emerald-500 rounded-t"
                      style={{ height: `${(d.resolved / 10) * 100}%` }}
                      title={`Resolved: ${d.resolved}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/70"></span> Reported
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Resolved
              </span>
            </div>
          </div>

          {/* Issue Category Analytics */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Category Distribution</h3>
                <span className="text-[11px] font-mono text-emerald-400">Live Telemetry</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Municipal infrastructure breakdown</p>
            </div>

            {/* Visual Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Potholes / Road Damage</span>
                  <span className="text-slate-400 font-mono">{categoriesCount['Pothole / Road Damage']} ({Math.round((categoriesCount['Pothole / Road Damage'] / total) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${(categoriesCount['Pothole / Road Damage'] / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Garbage / Waste Overflow</span>
                  <span className="text-slate-400 font-mono">{categoriesCount['Garbage / Waste Overflow']} ({Math.round((categoriesCount['Garbage / Waste Overflow'] / total) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(categoriesCount['Garbage / Waste Overflow'] / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Water Leakage</span>
                  <span className="text-slate-400 font-mono">{categoriesCount['Water Leakage']} ({Math.round((categoriesCount['Water Leakage'] / total) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${(categoriesCount['Water Leakage'] / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Drainage / Drain Blockage</span>
                  <span className="text-slate-400 font-mono">{categoriesCount['Drainage / Drain Blockage']} ({Math.round((categoriesCount['Drainage / Drain Blockage'] / total) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(categoriesCount['Drainage / Drain Blockage'] / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Broken Streetlights</span>
                  <span className="text-slate-400 font-mono">{categoriesCount['Broken Streetlight']} ({Math.round((categoriesCount['Broken Streetlight'] / total) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${(categoriesCount['Broken Streetlight'] / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Incident Management Master Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Master Incident Registry</h3>
            <p className="text-xs text-slate-400">Search, filter by urgency, and update field crew dispatches.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="Pothole / Road Damage">Potholes</option>
              <option value="Garbage / Waste Overflow">Garbage</option>
              <option value="Water Leakage">Water Leaks</option>
              <option value="Drainage / Drain Blockage">Drainage</option>
              <option value="Broken Streetlight">Streetlights</option>
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter ID, address..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Score & ID</th>
                <th className="py-3 px-4">Issue & Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Duplicates</th>
                <th className="py-3 px-4">Status & Dispatch</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No incidents match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Score & ID */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          inc.priorityScore >= 80 ? 'bg-rose-500 text-white' :
                          inc.priorityScore >= 60 ? 'bg-amber-500 text-slate-950' :
                          inc.priorityScore >= 30 ? 'bg-yellow-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                        }`}>
                          {inc.priorityScore}
                        </span>
                        <span className="text-slate-400 text-[11px]">{inc.id}</span>
                      </div>
                    </td>

                    {/* Issue Title & Category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white truncate max-w-xs">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{inc.category}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="truncate max-w-[200px] text-slate-300">{inc.location.address}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{inc.location.district}</div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        inc.severity === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        inc.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>

                    {/* Duplicates */}
                    <td className="py-3 px-4 font-mono">
                      {inc.duplicateCount > 1 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/30">
                          {inc.duplicateCount} merged
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">1 report</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      {userRole === 'admin' ? (
                        <select
                          value={inc.status}
                          onChange={(e) => onUpdateStatus(inc.id, e.target.value as IssueStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-md border bg-slate-950 font-sans ${
                            inc.status === 'Resolved' ? 'text-emerald-400 border-emerald-500/40' :
                            inc.status === 'In Progress' ? 'text-blue-400 border-blue-500/40' :
                            inc.status === 'Assigned' ? 'text-purple-400 border-purple-500/40' :
                            'text-amber-400 border-amber-500/40'
                          }`}
                        >
                          <option value="Reported">Reported</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border font-sans ${
                          inc.status === 'Resolved' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
                          inc.status === 'In Progress' ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
                          inc.status === 'Assigned' ? 'text-purple-400 border-purple-500/40 bg-purple-500/10' :
                          'text-amber-400 border-amber-500/40 bg-amber-500/10'
                        }`}>
                          {inc.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectIncident(inc)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
