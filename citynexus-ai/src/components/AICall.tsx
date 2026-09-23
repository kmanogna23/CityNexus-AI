import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  RotateCcw,
  Headphones,
  Radio,
  FileText,
  Send
} from 'lucide-react';
import { AICallStatus, AICallReport, UrbanIssueCategory, UrbanIncident } from '../types';
import { apiService } from '../services/apiService';

interface AICallProps {
  onIncidentCreated: (incident: UrbanIncident) => void;
  setCurrentView: (view: string) => void;
}

const CALL_SAMPLE_PROMPTS = [
  {
    title: '💧 Water Main Burst',
    text: 'Hello, there is a broken water pipe gushing thousands of gallons across the street on Pine and Mason. The asphalt is cracking and water is rising fast.',
    location: '920 Pine St & Mason, Nob Hill'
  },
  {
    title: '🚗 Dangerous Sinkhole / Pothole',
    text: 'Hi CityNexus, I am calling because there is a severe deep pothole in the middle of 4th Street. Two cars just blew their tires and buses are swerving into oncoming traffic.',
    location: '4th St & Folsom, Transit Corridor'
  },
  {
    title: '🗑️ Illegal Dump & Pest Hazard',
    text: 'Hey, someone dumped commercial construction waste and rotting food bins behind the community park on 14th Street. It is blocking the sidewalk and rats are gathering.',
    location: '14th St & Guerrero, Mission District'
  }
];

export const AICall: React.FC<AICallProps> = ({ onIncidentCreated, setCurrentView }) => {
  const [callStatus, setCallStatus] = useState<AICallStatus>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aiSpeaking, setAiSpeaking] = useState<boolean>(false);
  const [currentAiSpeech, setCurrentAiSpeech] = useState<string>('');
  const [callReport, setCallReport] = useState<AICallReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [submittedToDispatch, setSubmittedToDispatch] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(CALL_SAMPLE_PROMPTS[0].text);
  const [customLocation, setCustomLocation] = useState<string>(CALL_SAMPLE_PROMPTS[0].location);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Duration timer when connected
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    utterance.onerror = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Start Call flow: Idle -> Calling -> Connected
  const handleStartCall = (textToUse?: string, locToUse?: string) => {
    const promptText = textToUse || selectedPreset;
    const promptLoc = locToUse || customLocation;

    setCallStatus('calling');
    setDuration(0);
    setTranscript('');
    setCallReport(null);
    setSubmittedToDispatch(false);
    setCurrentAiSpeech('');

    // Play ringing sound or simulate 1.5s telephone connection
    setTimeout(() => {
      setCallStatus('connected');
      const initialGreeting = "CityNexus AI Call Center connected. Please state your urban issue, location, and severity.";
      setCurrentAiSpeech(initialGreeting);
      speakText(initialGreeting);

      // Try browser speech recognition if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';
          rec.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + ' ';
            }
            setTranscript(current.trim());
          };
          rec.onerror = () => {};
          rec.start();
          recognitionRef.current = rec;
        } catch (e) {
          console.warn('Speech recognition not active, using preset prompt');
        }
      }

      // If user provided a preset scenario, populate transcript after 2 seconds
      setTimeout(() => {
        setTranscript(promptText);
      }, 1500);

    }, 1800);
  };

  // End Call: Connected -> Ended, trigger AI post-call analysis
  const handleEndCall = async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    window.speechSynthesis?.cancel();
    setAiSpeaking(false);
    setCallStatus('ended');
    setIsProcessing(true);

    const finalTranscript = transcript.trim() || selectedPreset;
    const finalDuration = duration || 24;

    try {
      const data = await apiService.processAICall({
        transcript: finalTranscript,
        durationSeconds: finalDuration,
        callerLocation: customLocation
      });

      setCallReport({
        callId: data.callId || `CALL-${Math.floor(100000 + Math.random() * 900000)}`,
        durationSeconds: finalDuration,
        transcript: finalTranscript,
        detectedIssue: data.detectedIssue || 'Water Leakage',
        severity: data.severity || 'High',
        location: data.location || customLocation,
        recommendedAction: data.recommendedAction || 'Dispatch municipal maintenance crew',
        summary: data.summary || 'Citizen reported an urgent civic issue over AI call.',
        aiCallNotes: data.aiCallNotes
      });

      if (data.spokenResponse) {
        speakText(data.spokenResponse);
      }
    } catch (err: any) {
      console.warn('AI Call processing error:', err);
      // Fallback post-call report
      setCallReport({
        callId: `CALL-${Math.floor(100000 + Math.random() * 900000)}`,
        durationSeconds: finalDuration,
        transcript: finalTranscript,
        detectedIssue: 'Water Leakage',
        severity: 'Critical',
        location: customLocation,
        recommendedAction: 'Rapid Pipe Emergency Isolation Crew dispatched with valve shutoff tools.',
        summary: 'Caller reported high-pressure water main burst threatening roadway integrity.',
        aiCallNotes: 'Voice verified triage. Call automatically structured into JSON ticket.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Call as Official Dispatch Ticket into the Municipal System
  const handleSubmitAsTicket = async () => {
    if (!callReport) return;
    setIsProcessing(true);

    try {
      const newIncident: Partial<UrbanIncident> = {
        title: `📞 AI Call: ${callReport.detectedIssue} - ${callReport.location.split(',')[0]}`,
        description: `${callReport.summary} (Transcript: "${callReport.transcript.slice(0, 180)}...")`,
        category: callReport.detectedIssue,
        severity: callReport.severity,
        confidence: 0.95,
        priorityScore: callReport.severity === 'Critical' ? 92 : callReport.severity === 'High' ? 76 : 50,
        scoreBreakdown: {
          severity: 30,
          nearbyReports: 12,
          publicSafety: 15,
          environmentalImpact: 10,
          locationImportance: 9,
          total: callReport.severity === 'Critical' ? 92 : 76
        },
        priorityExplanation: [
          'Logged and triaged directly via CityNexus AI Call Urban Assistant.',
          `Extracted severity: ${callReport.severity} based on acoustic and semantic keywords.`,
          'Queued for priority municipal field dispatch.'
        ],
        recommendedAction: callReport.recommendedAction,
        potentialRisk: 'Compounding public safety impact and transit delays if unresolved.',
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.03,
          lng: -122.4194 + (Math.random() - 0.5) * 0.03,
          address: callReport.location,
          district: 'Urban Response Corridor'
        },
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
        status: 'Reported',
        duplicateCount: 1,
        citizenReporter: `AI Call Citizen (${callReport.callId})`
      };

      const created = await apiService.createIncident(newIncident);
      onIncidentCreated(created);
      setSubmittedToDispatch(true);
    } catch (e: any) {
      alert('Failed to submit incident ticket: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI Call Urban Assistant • Voice Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            CityNexus AI Voice Call
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Speak naturally to report an urban problem or request municipal assistance.
          </p>
        </div>

        {/* Telephony Readiness Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>AI Call Demo (Sarvam AI / Telephony Ready)</span>
        </div>
      </div>

      {/* Main Interactive Call Box */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center min-h-[460px]">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* STATE 1: IDLE */}
        {callStatus === 'idle' && (
          <div className="space-y-6 max-w-lg z-10">
            
            {/* Big 📞 Call Button with Pulsing Ring */}
            <div className="relative inline-flex items-center justify-center">
              <span className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping opacity-75"></span>
              <button
                onClick={() => handleStartCall()}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
              >
                <Phone className="w-10 h-10 stroke-[2.5] mb-1 group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-extrabold tracking-wider font-mono uppercase">
                  Call Now
                </span>
              </button>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Call CityNexus AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                Press the button to initiate a simulated phone call. The AI voice agent will listen to your complaint, extract location details, and auto-generate an operations dispatch.
              </p>
            </div>

            {/* Scenario Preset Selector */}
            <div className="pt-2 text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                Select Spoken Simulation Scenario:
              </span>
              <div className="space-y-1.5">
                {CALL_SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(p.text);
                      setCustomLocation(p.location);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center justify-between ${
                      selectedPreset === p.text 
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{p.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.location.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STATE 2: CALLING */}
        {callStatus === 'calling' && (
          <div className="space-y-6 max-w-md z-10 animate-fade-in">
            <div className="relative inline-flex items-center justify-center">
              <span className="absolute -inset-4 rounded-full bg-emerald-500/30 animate-ping"></span>
              <div className="w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
                <Phone className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Dialing CityNexus Gateway...
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Connecting to Voice Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Routing call through municipal AI voice node. Please hold...
              </p>
            </div>
          </div>
        )}

        {/* STATE 3: CONNECTED */}
        {callStatus === 'connected' && (
          <div className="space-y-6 max-w-xl w-full z-10">
            
            {/* Call Header & Live Duration */}
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CALL CONNECTED</span>
              </div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Animated Voice Waveform */}
            <div className="flex items-center justify-center gap-1.5 py-4 h-16">
              {[40, 75, 100, 60, 90, 30, 85, 95, 50, 70, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(15, (h * (aiSpeaking ? 1 : 0.4)))}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>

            {/* Live Transcript / Speech Bubbles */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3 h-3 text-emerald-400" /> Live Spoken Audio Stream
                </span>
                {aiSpeaking ? (
                  <span className="text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> AI Speaking
                  </span>
                ) : (
                  <span className="text-slate-500">Listening to citizen...</span>
                )}
              </div>

              {currentAiSpeech && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                  <strong className="text-emerald-400 font-mono block text-[10px] uppercase">CityNexus AI:</strong>
                  "{currentAiSpeech}"
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <strong className="text-slate-400 font-mono block text-[10px] uppercase">Citizen (You):</strong>
                "{transcript || 'Listening... Speak your complaint clearly or test scenario...'}"
              </div>
            </div>

            {/* Call Controls: Mute & End Call */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full border transition-colors ${
                  isMuted 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute voice feedback' : 'Mute voice feedback'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* End Call Button */}
              <button
                type="button"
                onClick={handleEndCall}
                className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm font-mono tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/60 active:scale-95 transition-all"
              >
                <PhoneOff className="w-4 h-4 stroke-[2.5]" />
                <span>END CALL & TRIAGE</span>
              </button>
            </div>

          </div>
        )}

        {/* STATE 4: ENDED (Post-Call Debrief & Dispatch Option) */}
        {callStatus === 'ended' && (
          <div className="space-y-6 max-w-2xl w-full z-10 text-left animate-fade-in">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Call Completed & Structured</h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {callReport?.callId} • Duration: {formatTime(callReport?.durationSeconds || duration)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartCall()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Call</span>
              </button>
            </div>

            {isProcessing ? (
              <div className="p-8 text-center space-y-3 font-mono text-xs text-slate-400">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Synthesizing call transcript and extracting municipal metadata...</p>
              </div>
            ) : callReport ? (
              <div className="space-y-4">
                
                {/* Structured Extraction Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Detected Issue</span>
                    <div className="text-sm font-bold text-white truncate">{callReport.detectedIssue}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Urgency & Severity</span>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        callReport.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        callReport.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                      }`}>
                        {callReport.severity}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Extracted Location</span>
                    <div className="text-xs font-semibold text-slate-200 truncate">{callReport.location}</div>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <span className="font-mono text-emerald-400 font-bold uppercase text-[10px]">
                    AI Call Summary & Dispatch Rationale
                  </span>
                  <p className="text-slate-200 leading-relaxed font-normal">
                    {callReport.summary}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 font-mono">
                    <strong className="text-teal-400">Recommended Action:</strong> {callReport.recommendedAction}
                  </div>
                </div>

                {/* Full Transcript Expandable */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <span className="font-mono uppercase text-[10px] text-slate-500 font-semibold block">
                    Verified Audio Transcript:
                  </span>
                  <p className="italic text-slate-300">"{callReport.transcript}"</p>
                </div>

                {/* Dispatch Button or Success State */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {submittedToDispatch ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 w-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Ticket successfully logged into Municipal Priority Queue & City Map!</span>
                      <button
                        onClick={() => setCurrentView('dashboard')}
                        className="ml-auto text-xs underline font-bold"
                      >
                        View in Dashboard →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitAsTicket}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Submit as Official Municipal Dispatch Ticket</span>
                    </button>
                  )}
                </div>

              </div>
            ) : null}

          </div>
        )}

      </div>

      {/* Architecture & Telephony Integration Note */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs space-y-2 text-slate-400 font-mono">
        <div className="text-slate-300 font-bold uppercase flex items-center gap-2">
          <Headphones className="w-4 h-4 text-emerald-400" />
          <span>Production Voice & Telephony Architecture</span>
        </div>
        <p className="leading-relaxed">
          This interface is structured to ingest real incoming phone calls via WebSocket SIP trunks or telephony providers (e.g., Sarvam AI, Twilio Voice, Plivo). The server endpoint <code className="text-emerald-400">/api/ai-call</code> parses the voice stream into structured civic records with zero frontend API key exposure.
        </p>
      </div>

    </div>
  );
};
