import React, { useState, useRef } from 'react';
import { 
  Upload, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  HelpCircle, 
  RefreshCw, 
  Camera, 
  X, 
  ArrowRight,
  Send,
  Zap,
  Mic,
  MicOff
} from 'lucide-react';
import { UrbanIssueCategory, AIAnalysisResult, UrbanIncident } from '../types';
import { apiService } from '../services/apiService';

interface ReportIssueProps {
  onIncidentCreated: (incident: UrbanIncident) => void;
  setCurrentView: (view: string) => void;
  initialDraft?: {
    category?: UrbanIssueCategory;
    description?: string;
  };
}

// Preset demonstration scenarios for instant 1-click testing during hackathon judging
const DEMO_PRESETS = [
  {
    label: '🚗 Arterial Pothole',
    category: 'Pothole / Road Damage' as UrbanIssueCategory,
    description: 'Large asphalt pothole (approx. 50cm diameter, 10cm deep) on 4th St transit lane. Cars and buses swerving into adjacent bike corridor.',
    address: '420 4th St & Folsom, Downtown Transit Corridor',
    lat: 37.7835,
    lng: -122.4010,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '🗑️ Garbage Dumpster Overflow',
    category: 'Garbage / Waste Overflow' as UrbanIssueCategory,
    description: 'Commercial waste bins completely overflowing onto sidewalk near farmers market. Rotten organic debris attracting pests and blocking pedestrian curb ramp.',
    address: '1090 Market St & 7th, Civic Plaza',
    lat: 37.7798,
    lng: -122.4135,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '💧 High Pressure Water Main Leak',
    category: 'Water Leakage' as UrbanIssueCategory,
    description: 'Pressurized drinking water geyser erupting through sidewalk seam at approx 20 gallons/minute. Water flooding downhill roadway and eroding pavement sub-base.',
    address: '920 Pine St & Mason, Nob Hill',
    lat: 37.7918,
    lng: -122.4110,
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '🌊 Storm Drain Clogged by Debris',
    category: 'Drainage / Drain Blockage' as UrbanIssueCategory,
    description: 'Primary stormwater catchment grate completely choked with plastic wrappers, mud, and compacted branches outside elementary school crossing.',
    address: '350 Valencia St & 15th, Mission District',
    lat: 37.7720,
    lng: -122.4175,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '💡 Darkened Streetlight Cluster',
    category: 'Broken Streetlight' as UrbanIssueCategory,
    description: 'Three consecutive streetlights dark at busy pedestrian intersection. High risk for night crosswalk collisions and personal safety.',
    address: '1800 Geary Blvd & Webster',
    lat: 37.7865,
    lng: -122.4280,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
  }
];

export const ReportIssue: React.FC<ReportIssueProps> = ({ 
  onIncidentCreated, 
  setCurrentView,
  initialDraft 
}) => {
  const [description, setDescription] = useState(initialDraft?.description || '');
  const [category, setCategory] = useState<string>(initialDraft?.category || '');
  const [address, setAddress] = useState('742 Market St, Downtown');
  const [lat, setLat] = useState<number>(37.7858);
  const [lng, setLng] = useState<number>(-122.4065);
  const [imagePreview, setImagePreview] = useState<string>(DEMO_PRESETS[0].imageUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<UrbanIncident | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset loader
  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setDescription(preset.description);
    setCategory(preset.category);
    setAddress(preset.address);
    setLat(preset.lat);
    setLng(preset.lng);
    setImagePreview(preset.imageUrl);
    setAiAnalysis(null);
    setSubmittedIncident(null);
  };

  // Image file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setAiAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Browser speech recognition for hands-free description
  const toggleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Run AI analysis
  const handleAnalyzeAndReport = async () => {
    if (!description.trim() && !imagePreview) {
      alert('Please provide an image or description of the urban issue.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Staggered visual feedback for hackathon demo
    const timer1 = setTimeout(() => setAnalysisStep(2), 500);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1100);

    try {
      const result = await apiService.analyzeIssue({
        description,
        category: category || undefined,
        image: imagePreview,
        location: { lat, lng, address }
      });

      setAiAnalysis(result);
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert('Failed to analyze issue: ' + (error.message || 'Unknown error'));
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Confirm and submit incident to city platform
  const handleConfirmSubmit = async () => {
    if (!aiAnalysis) return;

    setIsSubmitting(true);
    try {
      const newIncident: Partial<UrbanIncident> = {
        title: `${aiAnalysis.issueType} on ${address.split(',')[0]}`,
        description,
        category: aiAnalysis.issueType,
        severity: aiAnalysis.severity,
        confidence: aiAnalysis.confidence,
        priorityScore: aiAnalysis.priorityScore,
        scoreBreakdown: aiAnalysis.scoreBreakdown,
        priorityExplanation: aiAnalysis.reasons,
        recommendedAction: aiAnalysis.recommendedAction,
        potentialRisk: aiAnalysis.potentialRisk,
        location: {
          lat,
          lng,
          address,
          district: address.includes('District') || address.includes('Downtown') ? address.split(',')[1]?.trim() || 'Central Sector' : 'Metro Sector'
        },
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        status: 'Reported',
        duplicateCount: aiAnalysis.duplicateCount || 1,
        duplicateNotes: aiAnalysis.duplicateDetected 
          ? `Merged with ${aiAnalysis.duplicateCount - 1} nearby reports within 350m proximity` 
          : undefined,
        citizenReporter: 'Citizen Reporter (CityNexus Web)'
      };

      const created = await apiService.createIncident(newIncident);
      setSubmittedIncident(created);
      onIncidentCreated(created);
    } catch (error: any) {
      alert('Failed to submit incident: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Severity color helpers
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">🔴 Critical</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">🟠 High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-bold font-mono">🟡 Medium</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">🟢 Low</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CITIZEN INTELLIGENCE PORTAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Report an Urban Issue
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload a photo or enter a description. CityNexus AI analyzes the hazard, predicts secondary risks, and queues municipal dispatch.
        </p>
      </div>

      {/* Quick Demo Presets Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Hackathon 1-Click Demo Scenarios:
          </span>
          <span className="text-[11px] text-slate-500">Click any preset to autofill</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 hover:border-emerald-500/50 transition-all active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form (Left) & AI Analysis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Issue Photo (Visual Evidence)
              </label>
              
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                  <img 
                    src={imagePreview} 
                    alt="Issue evidence" 
                    className="w-full h-52 object-cover" 
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-medium border border-slate-600 hover:bg-slate-800"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group"
                >
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                  <p className="text-sm font-medium text-slate-300">Click to upload photo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP supported</p>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Issue Description
                </label>
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Speak your description using browser speech recognition"
                >
                  {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>
              
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Large pothole near the main road and bus stop. Cars swerving dangerously into bike lane..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                3. Incident Location
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street address or landmark"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex justify-between">
                    <span>LAT:</span>
                    <span className="text-slate-200">{lat.toFixed(4)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex justify-between">
                    <span>LNG:</span>
                    <span className="text-slate-200">{lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                4. Category (Optional - AI will auto-detect)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="">🤖 Auto-detect with Gemini AI</option>
                <option value="Pothole / Road Damage">Pothole / Road Damage</option>
                <option value="Garbage / Waste Overflow">Garbage / Waste Overflow</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Drainage / Drain Blockage">Drainage / Drain Blockage</option>
                <option value="Broken Streetlight">Broken Streetlight</option>
              </select>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeAndReport}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>
                      {analysisStep === 1 && 'Analyzing visual & text context...'}
                      {analysisStep === 2 && 'Executing Gemini multimodal triage...'}
                      {analysisStep === 3 && 'Evaluating secondary urban risk & score...'}
                      {analysisStep === 0 && 'Processing AI Analysis...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                    <span>Analyze & Report Issue</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* AI Analysis Column (Right) */}
        <div className="lg:col-span-6 space-y-6">
          
          {aiAnalysis ? (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-6">
              
              {/* Header card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Analysis Card</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Gemini 3.8 Flash • Multimodal Engine</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-500">Confidence</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {Math.round(aiAnalysis.confidence * 100)}%
                  </div>
                </div>
              </div>

              {/* Detected Issue & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Detected Issue</div>
                  <div className="text-sm font-bold text-white">{aiAnalysis.issueType}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">Severity Level</div>
                  <div>{getSeverityBadge(aiAnalysis.severity)}</div>
                </div>
              </div>

              {/* Priority Score Gauge */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-slate-400">Urban Priority Score</span>
                  <span className={`text-xl font-extrabold font-mono ${
                    aiAnalysis.priorityScore >= 80 ? 'text-rose-400' :
                    aiAnalysis.priorityScore >= 60 ? 'text-amber-400' :
                    aiAnalysis.priorityScore >= 30 ? 'text-yellow-300' : 'text-emerald-400'
                  }`}>
                    {aiAnalysis.priorityScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      aiAnalysis.priorityScore >= 80 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                      aiAnalysis.priorityScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${aiAnalysis.priorityScore}%` }}
                  />
                </div>

                {/* Explainable Factor Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                    Explainable Scoring Factors:
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>• Severity:</span>
                      <span className="text-slate-200 font-mono font-medium">{aiAnalysis.scoreBreakdown?.severity || 30} pts (max 35)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>• Nearby Reports:</span>
                      <span className="text-slate-200 font-mono font-medium">{aiAnalysis.scoreBreakdown?.nearbyReports || 15} pts (max 20)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>• Public Safety:</span>
                      <span className="text-slate-200 font-mono font-medium">{aiAnalysis.scoreBreakdown?.publicSafety || 14} pts (max 15)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>• Environmental:</span>
                      <span className="text-slate-200 font-mono font-medium">{aiAnalysis.scoreBreakdown?.environmentalImpact || 12} pts (max 10)</span>
                    </div>
                    <div className="flex justify-between text-slate-400 col-span-2">
                      <span>• Location Criticality:</span>
                      <span className="text-slate-200 font-mono font-medium">{aiAnalysis.scoreBreakdown?.locationImportance || 9} pts (max 10)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why this priority? */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Why this priority?
                </h4>
                <ul className="space-y-1.5">
                  {aiAnalysis.reasons.map((r, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duplicate Detection Alert */}
              {aiAnalysis.duplicateDetected && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Possible Duplicate Incident Detected ({aiAnalysis.duplicateCount} Citizen Reports)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 pl-5">
                    Proximity match found within 350m. Automatically linked into one municipal incident to eliminate redundant dispatch.
                  </p>
                </div>
              )}

              {/* Potential Urban Risk */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>⚠️ Potential Urban Risk (Secondary Impact Assessment)</span>
                </div>
                <p className="text-[11px] text-rose-200/90 pl-5 leading-relaxed">
                  "{aiAnalysis.potentialRisk}"
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Municipal Action</span>
                </div>
                <p className="text-[11px] text-emerald-200 pl-5">
                  {aiAnalysis.recommendedAction}
                </p>
              </div>

              {/* Confirmation or Success state */}
              {submittedIncident ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-slate-950 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Incident Queued Successfully!</h4>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">Tracking ID: {submittedIncident.id}</p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentView('map')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                    >
                      View on City Map
                    </button>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium text-xs hover:bg-slate-800"
                    >
                      Open Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Queue to Municipal Dashboard</span>
                    </>
                  )}
                </button>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-600 border border-slate-800">
                <Sparkles className="w-7 h-7 text-emerald-500/50" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="text-base font-semibold text-slate-300">AI Intelligence Triage Ready</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in the report or click any 1-Click Demo Scenario above, then click <strong>"Analyze & Report Issue"</strong> to view real-time multimodal categorization, priority score breakdown, and risk projections.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
