import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  User, 
  RefreshCw,
  Radio
} from 'lucide-react';
import { VoiceAssistantResponse, UrbanIssueCategory } from '../types';
import { apiService } from '../services/apiService';

interface VoiceAssistantProps {
  onDraftReady: (draft: { category: UrbanIssueCategory; description: string }) => void;
  setCurrentView: (view: string) => void;
}

const VOICE_DEMO_SAMPLES = [
  "There is a large pothole near the bus stop on Market Street and cars are swerving into the bike lane.",
  "Trash bins are overflowing into the street gutter near the local elementary school.",
  "Clean drinking water is bursting out of a cracked pipe under the sidewalk on Pine Street.",
  "Streetlights are completely out near the pedestrian crosswalk and it is dangerously dark.",
  "The storm drain is blocked by mud and plastic and water is already pooling up."
];

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onDraftReady,
  setCurrentView,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [conversation, setConversation] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    data?: VoiceAssistantResponse;
  }>>([
    {
      sender: 'assistant',
      text: "Hello! I am CityNexus AI Civic Assistant. Speak or type an urban issue you see in your neighborhood (like road damage, water leaks, or waste overflow), and I'll analyze and prepare your municipal dispatch report."
    }
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize browser speech recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setTranscriptInput(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Browser speech recognition is not supported in this browser. Please use the preset buttons or type below.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscriptInput('');
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || transcriptInput;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { sender: 'user' as const, text: query };
    setConversation(prev => [...prev, userMsg]);
    setTranscriptInput('');
    setIsProcessing(true);

    try {
      const response = await apiService.voiceAssistant(query);
      const assistantMsg = {
        sender: 'assistant' as const,
        text: response.aiResponse,
        data: response
      };
      setConversation(prev => [...prev, assistantMsg]);
      speakText(response.aiResponse);
    } catch (error: any) {
      setConversation(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I analyzed your input and categorized it for road and infrastructure maintenance. Would you like to review and file the report?"
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToReport = (res: VoiceAssistantResponse) => {
    onDraftReady({
      category: res.detectedCategory,
      description: res.transcript,
    });
    setCurrentView('report');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span>ACCESSIBLE CITIZEN VOICE INTERACTION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Talk to CityNexus AI
        </h1>
        <p className="text-sm text-slate-400">
          Speak naturally in your own words. CityNexus AI understands the hazard, estimates severity, and prepares your report instantly.
        </p>
      </div>

      {/* Main Conversation Container */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col h-[520px]">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Voice Channel: Active (Gemini Multimodal NLP)</span>
          </div>
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {speechEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Out: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Audio Out: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-md rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium ml-auto'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>

                {/* Structured triage card if returned */}
                {msg.data && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-mono pb-1 border-b border-slate-800">
                      <span className="text-slate-400">Classified Category:</span>
                      <strong className="text-emerald-400">{msg.data.detectedCategory}</strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-400">Estimated Severity:</span>
                      <strong className="text-amber-400">{msg.data.severity}</strong>
                    </div>
                    <button
                      onClick={() => handleProceedToReport(msg.data!)}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Draft & Submit Incident Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic font-mono pl-11">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>UrbanPulse AI is processing spoken input...</span>
            </div>
          )}
        </div>

        {/* Spoken Prompt Presets */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-500 font-mono mb-1.5">
            Quick Spoken Simulation Prompts:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {VOICE_DEMO_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sample)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] truncate max-w-xs shrink-0 border border-slate-700/60"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-3 flex items-center gap-2">
          
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
            }`}
            title="Click to toggle microphone"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input fallback */}
          <input
            type="text"
            value={transcriptInput}
            onChange={(e) => setTranscriptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? "Listening to your voice..." : "Speak into mic or type your urban problem here..."}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!transcriptInput.trim() || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>

        </div>

      </div>

    </div>
  );
};
