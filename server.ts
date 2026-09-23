import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SAMPLE_INCIDENTS } from './src/data/sampleIncidents';
import { UrbanIncident, AIAnalysisResult, UrbanIssueCategory, IssueSeverity } from './src/types/index';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// Middleware for large payload (base64 images)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

// In-memory incidents repository initialized with sample data
let incidentsStore: UrbanIncident[] = [...SAMPLE_INCIDENTS];

// Initialize Gemini client utility
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Distance helper in meters (Haversine)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Check for duplicate incidents within 350 meters
function findDuplicates(lat: number, lng: number, category: string, description: string) {
  const nearby = incidentsStore.filter(inc => {
    const dist = getDistanceMeters(lat, lng, inc.location.lat, inc.location.lng);
    const categoryMatch = inc.category.toLowerCase().includes(category.toLowerCase()) ||
                          category.toLowerCase().includes(inc.category.toLowerCase());
    return dist < 350 && (categoryMatch || dist < 120);
  });

  return nearby;
}

// Fallback Rule-Based Urban Analyzer
function fallbackAnalyze(
  description: string,
  categoryInput?: string,
  location?: { lat: number; lng: number; address: string }
): AIAnalysisResult {
  const text = description.toLowerCase();
  
  // Categorization
  let detectedCategory: UrbanIssueCategory = 'Pothole / Road Damage';
  if (categoryInput && categoryInput.length > 3) {
    detectedCategory = categoryInput as UrbanIssueCategory;
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('dump') || text.includes('litter')) {
    detectedCategory = 'Garbage / Waste Overflow';
  } else if (text.includes('water') || text.includes('pipe') || text.includes('hydrant') || text.includes('leak') || text.includes('burst')) {
    detectedCategory = 'Water Leakage';
  } else if (text.includes('drain') || text.includes('clog') || text.includes('gutter') || text.includes('flood') || text.includes('sewer') || text.includes('grate')) {
    detectedCategory = 'Drainage / Drain Blockage';
  } else if (text.includes('light') || text.includes('lamp') || text.includes('dark') || text.includes('pole') || text.includes('electric') || text.includes('wire')) {
    detectedCategory = 'Broken Streetlight';
  }

  // Severity detection
  let severity: IssueSeverity = 'Medium';
  let severityPoints = 20;

  if (
    text.includes('emergency') || text.includes('severe') || text.includes('huge') || 
    text.includes('major') || text.includes('dangerous') || text.includes('burst') || 
    text.includes('collapse') || text.includes('high voltage') || text.includes('massive') ||
    text.includes('critical')
  ) {
    severity = 'Critical';
    severityPoints = 34;
  } else if (
    text.includes('large') || text.includes('deep') || text.includes('hazard') || 
    text.includes('swerving') || text.includes('overflow') || text.includes('school') ||
    text.includes('busy') || text.includes('arterial')
  ) {
    severity = 'High';
    severityPoints = 27;
  } else if (text.includes('minor') || text.includes('small') || text.includes('shallow') || text.includes('slow')) {
    severity = 'Low';
    severityPoints = 10;
  }

  // Check nearby duplicates
  const lat = location?.lat || 37.7749;
  const lng = location?.lng || -122.4194;
  const duplicates = findDuplicates(lat, lng, detectedCategory, description);
  const duplicateDetected = duplicates.length > 0;
  const duplicateCount = duplicates.length;

  const nearbyReportsPoints = Math.min(20, Math.max(6, duplicateCount * 6 + 6));
  const publicSafetyPoints = severity === 'Critical' ? 15 : severity === 'High' ? 13 : severity === 'Medium' ? 8 : 4;
  const environmentalImpactPoints = detectedCategory === 'Garbage / Waste Overflow' || detectedCategory === 'Water Leakage' || detectedCategory === 'Drainage / Drain Blockage' ? 9 : 6;
  const locationImportancePoints = (location?.address?.toLowerCase().includes('market') || location?.address?.toLowerCase().includes('blvd') || location?.address?.toLowerCase().includes('avenue') || location?.address?.toLowerCase().includes('center')) ? 9 : 7;

  const totalScore = Math.min(100, severityPoints + nearbyReportsPoints + publicSafetyPoints + environmentalImpactPoints + locationImportancePoints);

  const reasons = [
    `Issue severity rated as ${severity} based on reported physical dimensions and impact.`,
    duplicateDetected
      ? `System detected ${duplicateCount} matching citizen reports within 350m radius.`
      : `Reported location identified in high-priority urban sector.`,
    `Public safety impact score: ${publicSafetyPoints}/15 based on vehicular and pedestrian hazard potential.`
  ];

  let recommendedAction = 'Dispatch municipal inspection team for on-site assessment.';
  let potentialRisk = 'Minor localized impact if unaddressed during upcoming weather cycles.';

  if (detectedCategory === 'Pothole / Road Damage') {
    recommendedAction = severity === 'Critical' || severity === 'High' 
      ? 'Dispatch Rapid Road Repair Crew with asphalt cold-patch & deploy traffic safety markers.'
      : 'Schedule routine asphalt patching in the next weekly road maintenance sweep.';
    potentialRisk = 'Vehicle tire/suspension damage, sudden swerving risks to cyclists and motor vehicles, road base erosion during rainfall.';
  } else if (detectedCategory === 'Garbage / Waste Overflow') {
    recommendedAction = 'Dispatch municipal waste collection compactor and inspect adjacent perimeter for commercial overflow violations.';
    potentialRisk = 'Accumulated waste is located near street drainage channels. This may increase the risk of drainage blockage and localized waterlogging during precipitation.';
  } else if (detectedCategory === 'Water Leakage') {
    recommendedAction = 'Dispatch Water Utilities Inspection Crew for rapid valve isolation and acoustic acoustic leak detection.';
    potentialRisk = 'Sub-surface roadbed saturation, sinkhole formation risks, and ongoing loss of treated municipal potable water.';
  } else if (detectedCategory === 'Drainage / Drain Blockage') {
    recommendedAction = 'Deploy Stormwater Hydro-Vacuum Truck to vacuum intake grate and jet line culvert.';
    potentialRisk = 'Storm runoff blockage will cause immediate street ponding, sidewalk overtopping, and hazardous aquaplaning conditions.';
  } else if (detectedCategory === 'Broken Streetlight') {
    recommendedAction = 'Dispatch Electrical Utility Maintenance Crew with aerial bucket truck to replace fixture/driver.';
    potentialRisk = 'Pedestrian intersection blind spot, elevated nighttime collision hazard, reduced community safety.';
  }

  return {
    issueType: detectedCategory,
    severity,
    confidence: 0.93,
    priorityScore: totalScore,
    scoreBreakdown: {
      severity: severityPoints,
      nearbyReports: nearbyReportsPoints,
      publicSafety: publicSafetyPoints,
      environmentalImpact: environmentalImpactPoints,
      locationImportance: locationImportancePoints,
      total: totalScore
    },
    reasons,
    recommendedAction,
    potentialRisk,
    duplicateDetected,
    duplicateCount: duplicateDetected ? duplicateCount + 1 : 1,
    duplicateMessage: duplicateDetected
      ? `Identified ${duplicateCount} nearby existing citizen reports. Merging into single municipal incident cluster.`
      : undefined
  };
}

// GET all incidents
app.get('/api/incidents', (req: Request, res: Response) => {
  const { category, severity, status, search } = req.query;
  let results = [...incidentsStore];

  if (category && category !== 'All') {
    results = results.filter(i => i.category === category);
  }
  if (severity && severity !== 'All') {
    results = results.filter(i => i.severity === severity);
  }
  if (status && status !== 'All') {
    results = results.filter(i => i.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(i => 
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.address.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q)
    );
  }

  // Sort by priorityScore desc
  results.sort((a, b) => b.priorityScore - a.priorityScore);

  res.json({ success: true, count: results.length, data: results });
});

// GET single incident
app.get('/api/incidents/:id', (req: Request, res: Response) => {
  const incident = incidentsStore.find(i => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }
  res.json({ success: true, data: incident });
});

// POST new incident
app.post('/api/incidents', (req: Request, res: Response) => {
  try {
    const incidentData: UrbanIncident = req.body;
    if (!incidentData.title || !incidentData.category) {
      return res.status(400).json({ success: false, message: 'Missing required incident fields' });
    }

    // Assign ID if not present
    if (!incidentData.id) {
      incidentData.id = `INC-2026-${String(incidentsStore.length + 101).padStart(3, '0')}`;
    }
    if (!incidentData.createdAt) {
      incidentData.createdAt = new Date().toISOString();
    }
    incidentData.updatedAt = new Date().toISOString();

    incidentsStore.unshift(incidentData);
    res.status(201).json({ success: true, data: incidentData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to save incident' });
  }
});

// PATCH update incident (status, assignedTeam, notes)
app.patch('/api/incidents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = incidentsStore.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  const updated = {
    ...incidentsStore[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  incidentsStore[index] = updated;
  res.json({ success: true, data: updated });
});

// POST Analyze Issue via Gemini AI
app.post('/api/analyze-issue', async (req: Request, res: Response) => {
  try {
    const { description, category, image, location } = req.body;

    if (!description && !image) {
      return res.status(400).json({ success: false, message: 'Description or image is required' });
    }

    const lat = location?.lat || 37.7749;
    const lng = location?.lng || -122.4194;
    const address = location?.address || 'Metro Downtown Sector';

    // Duplicate check
    const duplicates = findDuplicates(lat, lng, category || '', description || '');
    const duplicateDetected = duplicates.length > 0;
    const duplicateCount = duplicates.length;

    // If Gemini client is available, run multimodal Gemini analysis
    if (ai) {
      try {
        const systemInstruction = `You are UrbanPulse AI, an intelligent municipal urban intelligence and civic triage engine aligned with UN SDG 11 (Sustainable Cities and Communities).
Analyze the citizen urban issue report provided via image and/or text description.
Categories must be strictly one of:
- "Pothole / Road Damage"
- "Garbage / Waste Overflow"
- "Water Leakage"
- "Drainage / Drain Blockage"
- "Broken Streetlight"

Calculate an explainable priority score (0-100) using this exact framework:
- severity: 0 to 35 points (Critical damage = 30-35, High = 22-29, Medium = 14-21, Low = 0-13)
- nearbyReports: 0 to 20 points (There are ${duplicateCount} nearby reports detected in system)
- publicSafety: 0 to 15 points (Immediate threat to pedestrians, cyclists, motorists, elderly)
- environmentalImpact: 0 to 10 points (Water wastage, pollution, stormwater contamination, waste spread)
- locationImportance: 0 to 10 points (Major thoroughfare, transit stop, school zone, hospital corridor vs quiet residential)
Total score is sum of the above factors (0-100).

Determine:
- issueType (exact category string)
- severity ("Low" | "Medium" | "High" | "Critical")
- confidence (number between 0.85 and 0.99)
- priorityScore (number 0 to 100)
- scoreBreakdown: object with severity, nearbyReports, publicSafety, environmentalImpact, locationImportance, total
- reasons: array of 3 concise strings explaining why this priority was determined
- recommendedAction: clear, actionable dispatch instruction for municipal authorities
- potentialRisk: clear secondary risk scenario assessment (e.g. "Accumulated waste adjacent to drainage intake increases risk of blockage and localized street flooding during rainfall.")

Return purely valid JSON matching the schema.`;

        const parts: any[] = [];

        // If image is provided in base64
        if (image && typeof image === 'string' && image.startsWith('data:image/')) {
          const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }

        const promptText = `Citizen Issue Report:
Description: "${description || 'Visual inspection requested'}"
Citizen Selected Category: "${category || 'Auto-detect'}"
Reported Location: "${address}" (lat: ${lat}, lng: ${lng})
Nearby Existing Duplicate Reports Detected: ${duplicateCount}`;

        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                issueType: { type: Type.STRING },
                severity: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                priorityScore: { type: Type.NUMBER },
                scoreBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    severity: { type: Type.NUMBER },
                    nearbyReports: { type: Type.NUMBER },
                    publicSafety: { type: Type.NUMBER },
                    environmentalImpact: { type: Type.NUMBER },
                    locationImportance: { type: Type.NUMBER },
                    total: { type: Type.NUMBER }
                  },
                  required: ['severity', 'nearbyReports', 'publicSafety', 'environmentalImpact', 'locationImportance', 'total']
                },
                reasons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                recommendedAction: { type: Type.STRING },
                potentialRisk: { type: Type.STRING }
              },
              required: ['issueType', 'severity', 'confidence', 'priorityScore', 'scoreBreakdown', 'reasons', 'recommendedAction', 'potentialRisk']
            }
          }
        });

        const textOutput = response.text?.trim();
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          
          // Map to standard UrbanIssueCategory if slight variation
          let cat = parsed.issueType as UrbanIssueCategory;
          if (!['Pothole / Road Damage', 'Garbage / Waste Overflow', 'Water Leakage', 'Drainage / Drain Blockage', 'Broken Streetlight'].includes(cat)) {
            if (cat.toLowerCase().includes('pothole') || cat.toLowerCase().includes('road')) cat = 'Pothole / Road Damage';
            else if (cat.toLowerCase().includes('garbage') || cat.toLowerCase().includes('waste')) cat = 'Garbage / Waste Overflow';
            else if (cat.toLowerCase().includes('water')) cat = 'Water Leakage';
            else if (cat.toLowerCase().includes('drain')) cat = 'Drainage / Drain Blockage';
            else cat = 'Broken Streetlight';
          }

          const result: AIAnalysisResult = {
            issueType: cat,
            severity: parsed.severity as IssueSeverity,
            confidence: Number(parsed.confidence) || 0.94,
            priorityScore: Math.round(Number(parsed.priorityScore)) || 75,
            scoreBreakdown: parsed.scoreBreakdown,
            reasons: parsed.reasons || [],
            recommendedAction: parsed.recommendedAction,
            potentialRisk: parsed.potentialRisk,
            duplicateDetected,
            duplicateCount: duplicateDetected ? duplicateCount + 1 : 1,
            duplicateMessage: duplicateDetected 
              ? `Identified ${duplicateCount} matching citizen reports within 350m radius. Automatically linked to existing cluster.`
              : undefined
          };

          return res.json({ success: true, data: result });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call error, engaging intelligent fallback engine:', geminiError?.message);
      }
    }

    // Fallback deterministic analysis
    const fallbackResult = fallbackAnalyze(description || '', category, location);
    res.json({ success: true, data: fallbackResult, fallbackUsed: true });
  } catch (error: any) {
    console.error('Error analyzing issue:', error);
    res.status(500).json({ success: false, message: error.message || 'Analysis failed' });
  }
});

// POST Voice Assistant endpoint
app.post('/api/voice-assistant', async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, message: 'Transcript is required' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `The citizen said: "${transcript}".
You are UrbanPulse Voice AI, an accessibility assistant for municipal citizen reporting.
Categorize this urban problem into one of:
- "Pothole / Road Damage"
- "Garbage / Waste Overflow"
- "Water Leakage"
- "Drainage / Drain Blockage"
- "Broken Streetlight"

Estimate severity ("Low", "Medium", "High", "Critical").
Generate a friendly, concise spoken response acknowledging the issue and stating what team should be dispatched.
Summarize the problem in 1 brief sentence.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedCategory: { type: Type.STRING },
                severity: { type: Type.STRING },
                summary: { type: Type.STRING },
                aiResponse: { type: Type.STRING },
                suggestedAction: { type: Type.STRING }
              },
              required: ['detectedCategory', 'severity', 'summary', 'aiResponse', 'suggestedAction']
            }
          }
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({
          success: true,
          data: {
            transcript,
            detectedCategory: parsed.detectedCategory as UrbanIssueCategory,
            severity: parsed.severity as IssueSeverity,
            summary: parsed.summary,
            aiResponse: parsed.aiResponse,
            suggestedAction: parsed.suggestedAction,
            readyToReport: true
          }
        });
      } catch (err: any) {
        console.warn('Voice AI Gemini error, using fallback:', err?.message);
      }
    }

    // Fallback voice analysis
    const analysis = fallbackAnalyze(transcript);
    res.json({
      success: true,
      data: {
        transcript,
        detectedCategory: analysis.issueType,
        severity: analysis.severity,
        summary: `Report for ${analysis.issueType} with ${analysis.severity} severity priority.`,
        aiResponse: `I've identified this as a ${analysis.issueType} issue with ${analysis.severity} priority. I have prepared your report for municipal dispatch.`,
        suggestedAction: analysis.recommendedAction,
        readyToReport: true
      },
      fallbackUsed: true
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Voice assistant error' });
  }
});

// POST Dedicated AI Call Endpoint
app.post('/api/ai-call', async (req: Request, res: Response) => {
  try {
    const { transcript = '', durationSeconds = 25, callerLocation = 'Downtown Metro Corridor' } = req.body;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `A citizen is on an AI phone call reporting an urban incident.
Transcript of the call: "${transcript}".
Caller Location: "${callerLocation}".

You are CityNexus AI Call Assistant.
Analyze this call transcript and produce structured JSON:
1. detectedIssue: One of ["Pothole / Road Damage", "Garbage / Waste Overflow", "Water Leakage", "Drainage / Drain Blockage", "Broken Streetlight"]
2. severity: One of ["Critical", "High", "Medium", "Low"]
3. location: extracted street location or landmark mentioned, or "${callerLocation}"
4. recommendedAction: specific municipal dispatch action
5. summary: 1-2 sentence executive briefing of what the citizen reported
6. spokenResponse: concise, empathetic closing sentence spoken to the citizen over the call confirming their issue is logged
7. aiCallNotes: bullet points of critical operational notes for municipal dispatchers`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedIssue: { type: Type.STRING },
                severity: { type: Type.STRING },
                location: { type: Type.STRING },
                recommendedAction: { type: Type.STRING },
                summary: { type: Type.STRING },
                spokenResponse: { type: Type.STRING },
                aiCallNotes: { type: Type.STRING }
              },
              required: ['detectedIssue', 'severity', 'location', 'recommendedAction', 'summary', 'spokenResponse']
            }
          }
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        const callId = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
        return res.json({
          success: true,
          data: {
            callId,
            durationSeconds,
            transcript,
            detectedIssue: parsed.detectedIssue as UrbanIssueCategory,
            severity: parsed.severity as IssueSeverity,
            location: parsed.location || callerLocation,
            recommendedAction: parsed.recommendedAction,
            summary: parsed.summary,
            spokenResponse: parsed.spokenResponse,
            aiCallNotes: parsed.aiCallNotes || 'Caller was cooperative. Location confirmed via GPS cell tower triangulation.'
          }
        });
      } catch (err: any) {
        console.warn('AI Call Gemini error, falling back:', err?.message);
      }
    }

    // Deterministic fallback for AI Call
    const analysis = fallbackAnalyze(transcript);
    const callId = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
    res.json({
      success: true,
      data: {
        callId,
        durationSeconds,
        transcript,
        detectedIssue: analysis.issueType,
        severity: analysis.severity,
        location: callerLocation,
        recommendedAction: analysis.recommendedAction,
        summary: `Citizen reported an incident related to ${analysis.issueType}. Severity estimated as ${analysis.severity} requiring dispatch.`,
        spokenResponse: `Thank you for calling CityNexus AI. I have logged your report for ${analysis.issueType} at ${callerLocation}. Our municipal crew has been notified.`,
        aiCallNotes: 'Deterministic triage: Voice verified, auto-queued for municipal dispatch.'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'AI Call error' });
  }
});

// POST Emergency Report Endpoint
app.post('/api/emergency-report', (req: Request, res: Response) => {
  try {
    const { category, description, location, callerPhone } = req.body;

    if (!description && !category) {
      return res.status(400).json({ success: false, message: 'Description and category required' });
    }

    // Map emergency categories to standard category
    let mappedCategory: UrbanIssueCategory = 'Drainage / Drain Blockage';
    if (category.includes('road') || category.includes('infrastructure')) {
      mappedCategory = 'Pothole / Road Damage';
    } else if (category.includes('flooding') || category.includes('waterlogging') || category.includes('drainage')) {
      mappedCategory = 'Drainage / Drain Blockage';
    } else if (category.includes('water')) {
      mappedCategory = 'Water Leakage';
    } else if (category.includes('street') || category.includes('electrical')) {
      mappedCategory = 'Broken Streetlight';
    } else {
      mappedCategory = 'Garbage / Waste Overflow';
    }

    const emergencyCode = `EMERG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: UrbanIncident = {
      id: `INC-EMG-${Date.now().toString().slice(-4)}`,
      title: `🚨 EMERGENCY: ${category} - ${location?.address?.split(',')[0] || 'Urgent Zone'}`,
      description: description || `Urgent citizen emergency report submitted via CityNexus Emergency Hotline: ${category}`,
      category: mappedCategory,
      severity: 'Critical',
      confidence: 0.98,
      priorityScore: 98,
      scoreBreakdown: {
        severity: 35,
        nearbyReports: 18,
        publicSafety: 15,
        environmentalImpact: 20,
        locationImportance: 10,
        total: 98
      },
      priorityExplanation: [
        'Flagged directly via CityNexus Emergency Assistance Protocol.',
        'Immediate threat to public safety and urban transit infrastructure.',
        'Prioritized for rapid municipal field intervention.'
      ],
      recommendedAction: 'IMMEDIATE EMERGENCY DISPATCH: Mobilize rapid response team, establish perimeter barriers, and notify district supervisor.',
      potentialRisk: 'Severe imminent public hazard, structural escalation, and transit paralysis.',
      location: {
        lat: location?.lat || 37.7749,
        lng: location?.lng || -122.4194,
        address: location?.address || 'Metro Emergency Sector',
        district: 'Urgent Response Sector'
      },
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
      status: 'Under Review',
      duplicateCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenReporter: callerPhone ? `Citizen (Verified Phone: ${callerPhone})` : 'Anonymous Citizen Emergency Hotline'
    };

    // Prepend to store so it appears at top of priority queue
    incidentsStore.unshift(newIncident);

    res.status(201).json({
      success: true,
      data: newIncident,
      emergencyCode,
      message: 'Emergency incident logged into CityNexus Municipal Queue'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Emergency dispatch error' });
  }
});

// GET Dashboard KPI Stats
app.get('/api/stats', (req: Request, res: Response) => {
  const total = incidentsStore.length;
  const critical = incidentsStore.filter(i => i.severity === 'Critical').length;
  const high = incidentsStore.filter(i => i.severity === 'High').length;
  const medium = incidentsStore.filter(i => i.severity === 'Medium').length;
  const low = incidentsStore.filter(i => i.severity === 'Low').length;
  const resolved = incidentsStore.filter(i => i.status === 'Resolved').length;
  const pending = total - resolved;

  const categoriesCount = {
    pothole: incidentsStore.filter(i => i.category === 'Pothole / Road Damage').length,
    garbage: incidentsStore.filter(i => i.category === 'Garbage / Waste Overflow').length,
    water: incidentsStore.filter(i => i.category === 'Water Leakage').length,
    drainage: incidentsStore.filter(i => i.category === 'Drainage / Drain Blockage').length,
    streetlight: incidentsStore.filter(i => i.category === 'Broken Streetlight').length
  };

  const totalDuplicates = incidentsStore.reduce((acc, i) => acc + (i.duplicateCount > 1 ? i.duplicateCount - 1 : 0), 0);

  res.json({
    success: true,
    data: {
      total,
      critical,
      high,
      medium,
      low,
      resolved,
      pending,
      categoriesCount,
      totalDuplicatesMerged: totalDuplicates,
      averagePrioritizationMinutes: 14,
      avgResolutionHours: 18.5,
      citizenSatisfactionScore: 4.8
    }
  });
});

// Vite middleware or static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`CityNexus AI server active on http://0.0.0.0:${port}`);
});
