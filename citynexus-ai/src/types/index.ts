export type UrbanIssueCategory =
  | 'Pothole / Road Damage'
  | 'Garbage / Waste Overflow'
  | 'Water Leakage'
  | 'Drainage / Drain Blockage'
  | 'Broken Streetlight';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus =
  | 'Reported'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export interface ScoreBreakdown {
  severity: number;           // max 35
  nearbyReports: number;      // max 20
  publicSafety: number;       // max 15
  environmentalImpact: number;// max 10
  locationImportance: number; // max 10
  total: number;              // 0-100
}

export interface UrbanIncident {
  id: string;
  title: string;
  description: string;
  category: UrbanIssueCategory;
  severity: IssueSeverity;
  confidence: number;         // 0.0 - 1.0 (e.g. 0.94)
  priorityScore: number;      // 0 - 100
  scoreBreakdown: ScoreBreakdown;
  priorityExplanation: string[];
  recommendedAction: string;
  potentialRisk: string;      // AI secondary risk assessment
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  imageUrl: string;
  status: IssueStatus;
  duplicateCount: number;     // number of duplicate citizen reports merged
  duplicateNotes?: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam?: string;
  citizenReporter?: string;
}

export interface AIAnalysisResult {
  issueType: UrbanIssueCategory;
  severity: IssueSeverity;
  confidence: number;
  priorityScore: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  recommendedAction: string;
  potentialRisk: string;
  duplicateDetected: boolean;
  duplicateCount: number;
  duplicateMessage?: string;
}

export interface VoiceAssistantResponse {
  transcript: string;
  detectedCategory: UrbanIssueCategory;
  severity: IssueSeverity;
  summary: string;
  aiResponse: string;
  suggestedAction: string;
  readyToReport: boolean;
}

export type UserRole = 'citizen' | 'admin';

export type EmergencyCategory =
  | 'Severe flooding / waterlogging'
  | 'Major road blockage'
  | 'Dangerous infrastructure'
  | 'Major drainage failure'
  | 'Other public-safety hazard';

export interface EmergencyReportInput {
  category: EmergencyCategory;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  callerPhone?: string;
  immediateRiskAssessment?: string;
}

export type AICallStatus = 'idle' | 'calling' | 'connected' | 'ended';

export interface AICallReport {
  callId: string;
  durationSeconds: number;
  transcript: string;
  detectedIssue: UrbanIssueCategory;
  severity: IssueSeverity;
  location: string;
  recommendedAction: string;
  summary: string;
  aiCallNotes?: string;
}

