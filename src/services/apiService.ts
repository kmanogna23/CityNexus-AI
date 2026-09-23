import { UrbanIncident, AIAnalysisResult, VoiceAssistantResponse } from '../types';

export interface IncidentFilters {
  category?: string;
  severity?: string;
  status?: string;
  search?: string;
}

export const apiService = {
  async getIncidents(filters?: IncidentFilters): Promise<UrbanIncident[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/incidents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const json = await res.json();
    return json.data || [];
  },

  async getIncidentById(id: string): Promise<UrbanIncident> {
    const res = await fetch(`/api/incidents/${id}`);
    if (!res.ok) throw new Error('Incident not found');
    const json = await res.json();
    return json.data;
  },

  async createIncident(incident: Partial<UrbanIncident>): Promise<UrbanIncident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    const json = await res.json();
    return json.data;
  },

  async updateIncident(id: string, updates: Partial<UrbanIncident>): Promise<UrbanIncident> {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update incident');
    const json = await res.json();
    return json.data;
  },

  async analyzeIssue(data: {
    description: string;
    category?: string;
    image?: string;
    location?: { lat: number; lng: number; address: string };
  }): Promise<AIAnalysisResult> {
    const res = await fetch('/api/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'AI Analysis failed');
    }
    const json = await res.json();
    return json.data;
  },

  async voiceAssistant(transcript: string): Promise<VoiceAssistantResponse> {
    const res = await fetch('/api/voice-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
    if (!res.ok) throw new Error('Voice assistant request failed');
    const json = await res.json();
    return json.data;
  },

  async processAICall(params: {
    transcript: string;
    durationSeconds?: number;
    callerLocation?: string;
  }): Promise<any> {
    const res = await fetch('/api/ai-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('AI Call request failed');
    const json = await res.json();
    return json.data;
  },

  async submitEmergencyReport(data: {
    category: string;
    description: string;
    location: { lat: number; lng: number; address: string };
    callerPhone?: string;
  }): Promise<{ incident: UrbanIncident; emergencyCode: string }> {
    const res = await fetch('/api/emergency-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Emergency dispatch failed');
    const json = await res.json();
    return { incident: json.data, emergencyCode: json.emergencyCode };
  },

  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return json.data;
  }
};
