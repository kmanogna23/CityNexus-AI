import React, { useState } from 'react';
import { 
  PhoneCall, 
  Bot, 
  MessageSquare, 
  Sparkles, 
  Radio, 
  Headphones, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { AICall } from './AICall';
import { VoiceAssistant } from './VoiceAssistant';
import { UrbanIncident, UrbanIssueCategory } from '../types';

interface AIAssistanceProps {
  onIncidentCreated: (incident: UrbanIncident) => void;
  onDraftReady: (draft: { category: UrbanIssueCategory; description: string }) => void;
  setCurrentView: (view: string) => void;
}

export const AIAssistance: React.FC<AIAssistanceProps> = ({
  onIncidentCreated,
  onDraftReady,
  setCurrentView,
}) => {
  const [activeTab, setActiveTab] = useState<'call' | 'chat'>('call');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>MULTIMODAL CIVIC AI ASSISTANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Assistance Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Report urban hazards or get immediate municipal guidance via voice call or interactive text/voice chat.
            </p>
          </div>

          {/* Dual Mode Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('call')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === 'call'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>AI Voice Call</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Chatbot</span>
            </button>
          </div>
        </div>

        {/* Tab 1: AI Call */}
        {activeTab === 'call' && (
          <div className="animate-fade-in">
            <AICall
              onIncidentCreated={onIncidentCreated}
              setCurrentView={setCurrentView}
            />
          </div>
        )}

        {/* Tab 2: AI Chatbot */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <VoiceAssistant
              onDraftReady={onDraftReady}
              setCurrentView={setCurrentView}
            />
          </div>
        )}

      </div>
    </div>
  );
};
