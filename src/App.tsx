import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { MunicipalDashboard } from './components/MunicipalDashboard';
import { ReportIssue } from './components/ReportIssue';
import { CityMap } from './components/CityMap';
import { AIAssistance } from './components/AIAssistance';
import { EmergencyModal } from './components/EmergencyModal';
import { LoginModal } from './components/LoginModal';
import { IssueDetailsModal } from './components/IssueDetailsModal';
import { UrbanIncident, IssueStatus, UrbanIssueCategory, UserRole } from './types';
import { apiService } from './services/apiService';
import { SAMPLE_INCIDENTS } from './data/sampleIncidents';
import { Building2, Activity, Shield } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [incidents, setIncidents] = useState<UrbanIncident[]>(SAMPLE_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<UrbanIncident | null>(null);
  const [voiceDraft, setVoiceDraft] = useState<{ category?: UrbanIssueCategory; description?: string } | undefined>(undefined);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const [stats, setStats] = useState({
    total: SAMPLE_INCIDENTS.length,
    critical: SAMPLE_INCIDENTS.filter(i => i.severity === 'Critical').length,
    high: SAMPLE_INCIDENTS.filter(i => i.severity === 'High').length,
    resolved: SAMPLE_INCIDENTS.filter(i => i.status === 'Resolved').length,
    totalDuplicatesMerged: 8,
  });

  // Fetch incidents & stats from server
  const loadIncidents = async () => {
    try {
      const data = await apiService.getIncidents();
      if (data && data.length > 0) {
        setIncidents(data);
        const crit = data.filter(i => i.severity === 'Critical').length;
        const hi = data.filter(i => i.severity === 'High').length;
        const res = data.filter(i => i.status === 'Resolved').length;
        const dupes = data.reduce((acc, i) => acc + (i.duplicateCount > 1 ? i.duplicateCount - 1 : 0), 0);
        setStats({
          total: data.length,
          critical: crit,
          high: hi,
          resolved: res,
          totalDuplicatesMerged: dupes,
        });
      }
    } catch (e) {
      console.warn('Using client-side fallback store:', e);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  // When a new incident is created via Report or Emergency or AI Call
  const handleIncidentCreated = (newInc: UrbanIncident) => {
    setIncidents(prev => [newInc, ...prev]);
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      critical: newInc.severity === 'Critical' ? prev.critical + 1 : prev.critical,
      high: newInc.severity === 'High' ? prev.high + 1 : prev.high,
      totalDuplicatesMerged: newInc.duplicateCount > 1 ? prev.totalDuplicatesMerged + (newInc.duplicateCount - 1) : prev.totalDuplicatesMerged
    }));
  };

  // Status update
  const handleUpdateStatus = async (id: string, newStatus: IssueStatus, assignedTeam?: string) => {
    try {
      await apiService.updateIncident(id, { status: newStatus, ...(assignedTeam ? { assignedTeam } : {}) });
    } catch (err) {
      console.warn('Offline status update fallback:', err);
    }

    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: newStatus,
          ...(assignedTeam ? { assignedTeam } : {}),
          updatedAt: new Date().toISOString()
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => prev ? {
        ...prev,
        status: newStatus,
        ...(assignedTeam ? { assignedTeam } : {}),
        updatedAt: new Date().toISOString()
      } : null);
    }

    loadIncidents();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Main Navigation (Order: Home → Dashboard → Report Issue → City Map → AI Assistance | 🚨 Emergency | Login) */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        criticalCount={stats.critical}
        userRole={userRole}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            setCurrentView={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            stats={stats}
            sampleIncidents={incidents}
          />
        )}

        {currentView === 'dashboard' && (
          <MunicipalDashboard
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onUpdateStatus={handleUpdateStatus}
            onRefresh={loadIncidents}
            userRole={userRole}
            onSwitchRole={(role) => setUserRole(role)}
          />
        )}

        {currentView === 'report' && (
          <ReportIssue
            onIncidentCreated={handleIncidentCreated}
            setCurrentView={setCurrentView}
            initialDraft={voiceDraft}
          />
        )}

        {currentView === 'map' && (
          <CityMap
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {(currentView === 'assistance' || currentView === 'aicall') && (
          <AIAssistance
            onIncidentCreated={handleIncidentCreated}
            onDraftReady={(draft) => {
              setVoiceDraft(draft);
              setCurrentView('report');
            }}
            setCurrentView={setCurrentView}
          />
        )}
      </main>

      {/* Full Incident Dossier Modal */}
      {selectedIncident && (
        <IssueDetailsModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Emergency Reporting Interface Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onIncidentCreated={handleIncidentCreated}
        onNavigateToMap={() => {
          setIsEmergencyOpen(false);
          setCurrentView('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Role Selection & Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentRole={userRole}
        onSelectRole={(role) => setUserRole(role)}
        setCurrentView={setCurrentView}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">CityNexus AI</span>
            <span className="text-slate-600">•</span>
            <span>AI-Powered Urban Issue Intelligence & Response Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button onClick={() => setCurrentView('home')} className="hover:text-emerald-400">Home</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-400">Dashboard</button>
            <button onClick={() => setCurrentView('report')} className="hover:text-emerald-400">Report Issue</button>
            <button onClick={() => setCurrentView('map')} className="hover:text-emerald-400">City Map</button>
            <button onClick={() => setCurrentView('assistance')} className="hover:text-emerald-400">AI Assistance</button>
            <button onClick={() => setIsEmergencyOpen(true)} className="text-rose-400 hover:text-rose-300 font-bold">🚨 Emergency</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            SDG 11 Sustainable Cities & Communities • UrbanTech Hackathon
          </div>
        </div>
      </footer>

    </div>
  );
}
