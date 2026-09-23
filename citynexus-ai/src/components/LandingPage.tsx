import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  LayoutDashboard, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Layers,
  Leaf,
  Globe2,
  Users,
  Bot,
  FileText,
  Compass,
  Check,
  TrendingDown,
  Timer,
  Target
} from 'lucide-react';
import { UrbanIncident } from '../types';
import heroCityImage from '../assets/images/urban_city_hero_1790153196569.jpg';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  stats: {
    total: number;
    critical: number;
    high: number;
    resolved: number;
    totalDuplicatesMerged: number;
  };
  sampleIncidents: UrbanIncident[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  setCurrentView, 
  stats,
  sampleIncidents
}) => {
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<L.Map | null>(null);

  // Initialize mini Leaflet map to match the reference layout
  useEffect(() => {
    if (!miniMapContainerRef.current) return;
    if (miniMapInstanceRef.current) return;

    const map = L.map(miniMapContainerRef.current, {
      center: [37.7760, -122.4200],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Add sample pins matching screenshot with customized svg divIcons
    const samplePins = [
      { lat: 37.7850, lng: -122.4080, color: '#f43f5e', label: 'Critical' },
      { lat: 37.7720, lng: -122.4310, color: '#f97316', label: 'High' },
      { lat: 37.7885, lng: -122.4220, color: '#f43f5e', label: 'Critical' },
      { lat: 37.7680, lng: -122.4100, color: '#10b981', label: 'Low' },
      { lat: 37.7790, lng: -122.4180, color: '#eab308', label: 'Medium' },
      { lat: 37.7640, lng: -122.4350, color: '#10b981', label: 'Low' },
      { lat: 37.7820, lng: -122.4450, color: '#f43f5e', label: 'Critical' },
      { lat: 37.7750, lng: -122.3980, color: '#f97316', label: 'High' },
      { lat: 37.7610, lng: -122.4160, color: '#f43f5e', label: 'Critical' },
      { lat: 37.7890, lng: -122.4010, color: '#f43f5e', label: 'Critical' },
    ];

    samplePins.forEach(p => {
      const icon = L.divIcon({
        className: 'landing-mini-pin',
        html: `
          <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${p.color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker([p.lat, p.lng], { icon }).addTo(map);
    });

    miniMapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      miniMapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        
        {/* 1. HERO TITLE SECTION WITH URBAN CITY IMAGE BACKGROUND */}
        <section 
          className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[270px] sm:min-h-[300px] flex items-center bg-slate-950"
          style={{
            backgroundImage: `url(${heroCityImage}), url('/city-hero.jpg'), url('https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dedicated visible background image layer with local asset */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroCityImage}), url('/city-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Dark semi-transparent overlay allowing the urban skyline to shine through while keeping text crisp */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none" 
            style={{
              background: 'linear-gradient(90deg, rgba(2, 6, 23, 0.88) 0%, rgba(2, 6, 23, 0.65) 50%, rgba(2, 6, 23, 0.40) 100%), linear-gradient(180deg, rgba(2, 6, 23, 0.20) 0%, rgba(2, 6, 23, 0.60) 100%)'
            }}
          />

          {/* Content inside Hero */}
          <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Column: Title & Subtitle */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI-Powered Urban Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                CityNexus AI
              </h1>

              <div className="text-lg sm:text-xl font-bold text-slate-100">
                Smarter Cities. Happier Communities.
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
                Empowering citizens and municipalities to identify, prioritize and resolve urban problems faster through AI, GIS mapping and data-driven insights.
              </p>
            </div>

            {/* Right Column: SDG 11 Card as seen in sample image */}
            <div className="lg:w-80 shrink-0 p-4 rounded-2xl bg-slate-950/70 border border-slate-700/60 backdrop-blur-md shadow-xl flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#FD9D24] text-slate-950 flex flex-col items-center justify-center font-black shrink-0 shadow-md">
                <span className="text-[10px] leading-none uppercase">SDG</span>
                <span className="text-lg leading-tight">11</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  SDG 11
                </h3>
                <div className="text-xs font-semibold text-amber-300">
                  Sustainable Cities & Communities
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Building safer, greener and more inclusive cities for everyone.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 2. FOUR QUICK ACTION CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Report an Issue */}
          <div 
            onClick={() => setCurrentView('report')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all duration-200 group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Report an Issue
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Upload a photo, add details and let AI analyze it.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

          {/* Card 2: Explore City Map */}
          <div 
            onClick={() => setCurrentView('map')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all duration-200 group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Explore City Map
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  View and track urban issues across the city.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

          {/* Card 3: AI Assistance (Combined Voice Call & Chatbot) */}
          <div 
            onClick={() => setCurrentView('assistance')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all duration-200 group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  AI Assistance
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Call or chat with our AI agent to report issues.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

          {/* Card 4: Municipal Dashboard */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/60 cursor-pointer transition-all duration-200 group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  Municipal Dashboard
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Manage, prioritize and resolve urban issues.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>

        </section>

        {/* 3. TWO-COLUMN MIDDLE SECTION: CITY ISSUE MAP (LEFT) & LIVE OVERVIEW (RIGHT) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: City Issue Map */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">City Issue Map</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live view of reported urban issues across the city.
              </p>
            </div>

            {/* Embedded Mini Leaflet Map Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700/60 h-[280px] bg-slate-950">
              <div ref={miniMapContainerRef} className="w-full h-full z-10" />

              {/* Floating Severity Legend as shown in sample image */}
              <div className="absolute top-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-2.5 rounded-xl border border-slate-800 shadow-md text-xs space-y-1.5 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm"></span>
                  <span className="text-slate-300 text-[11px]">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                  <span className="text-slate-300 text-[11px]">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block shadow-sm"></span>
                  <span className="text-slate-300 text-[11px]">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                  <span className="text-slate-300 text-[11px]">Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Overview & Latest Activity */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col justify-between space-y-4">
            
            {/* Header with View All -> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Live Overview</span>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-white font-mono leading-none">
                    {stats.total}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Total Issues</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-rose-400 font-mono leading-none">
                    {stats.critical}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Critical</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-amber-400 font-mono leading-none">
                    {stats.high}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High Priority</div>
                </div>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-emerald-400 font-mono leading-none">
                    {stats.resolved}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Resolved</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-indigo-300 font-mono leading-none">
                    {stats.total - stats.resolved}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pending</div>
                </div>
              </div>
            </div>

            {/* Latest Activity Stream */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Latest Activity</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <span className="truncate">Pothole reported near Central Park</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">2h ago</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="truncate">Garbage overflow in West End</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">3h ago</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">Streetlight issue resolved</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">4h ago</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* 4. BOTTOM BAR: SDG 11 & PROTOTYPE IMPACT (SIMULATED DATA) */}
        <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: SDG 11 Summary */}
          <div className="lg:col-span-7 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FD9D24] text-slate-950 flex flex-col items-center justify-center font-black shrink-0 shadow-md">
              <span className="text-[10px] leading-none uppercase">SDG</span>
              <span className="text-lg leading-tight">11</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-white">
                SDG 11 — Sustainable Cities & Communities
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                CityNexus supports <strong className="text-slate-200">SDG 11</strong> by improving urban infrastructure management, encouraging citizen participation, enabling faster issue prioritization, and helping municipalities make data-driven decisions for sustainable and resilient cities.
              </p>
            </div>
          </div>

          {/* Right: Prototype Impact (Simulated Data) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
              Prototype Impact (Simulated Data)
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>31% → 12%</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Duplicate reports prevented
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-teal-400 font-mono">
                  <Timer className="w-3.5 h-3.5" />
                  <span>48m → 15m</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  Avg. prioritization time
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-cyan-400 font-mono">
                  <Target className="w-3.5 h-3.5" />
                  <span>72% → 91%</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  High-priority issues identified
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
