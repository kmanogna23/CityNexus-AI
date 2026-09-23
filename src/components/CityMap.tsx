import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Filter, 
  MapPin, 
  Search, 
  RotateCcw, 
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { UrbanIncident, UrbanIssueCategory, IssueSeverity, IssueStatus } from '../types';

// Curated CityNexus sample incidents across key Hyderabad localities
const HYDERABAD_SAMPLE_INCIDENTS: UrbanIncident[] = [
  // 1. Pothole - Critical
  {
    id: 'HYD-2026-001',
    title: 'Severe Cavity & Asphalt Cracking on Road 36',
    description: 'Deep road cavity (approx. 50cm diameter, 15cm depth) in central traffic lane causing severe traffic bottleneck and vehicle tire/rim damage near Jubilee Checkpost.',
    category: 'Pothole / Road Damage',
    severity: 'Critical',
    confidence: 0.96,
    priorityScore: 94,
    scoreBreakdown: { severity: 35, nearbyReports: 19, publicSafety: 15, environmentalImpact: 14, locationImportance: 11, total: 94 },
    priorityExplanation: [
      'Located on high-density Jubilee Hills arterial corridor with heavy rush-hour transit',
      'Sudden braking causing near-miss rear collisions during evening peak hours',
      '6 citizen reports merged within 200m radius'
    ],
    recommendedAction: 'Dispatch GHMC Rapid Road Patching Crew (Unit R-4) with cold-mix asphalt.',
    potentialRisk: 'Two-wheeler skidding risk, wheel rim punctures, severe traffic disruption.',
    location: {
      lat: 17.4319,
      lng: 78.4073,
      address: 'Road No. 36, Near Jubilee Hills Checkpost, Hyderabad',
      district: 'Jubilee Hills / Khairatabad Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 6,
    createdAt: '2026-09-22T08:14:00Z',
    updatedAt: '2026-09-22T10:30:00Z',
    assignedTeam: 'GHMC Road Maintenance Wing (Unit R-4)'
  },

  // 2. Drainage - Critical
  {
    id: 'HYD-2026-002',
    title: 'Cyber Towers Underpass Silt Blockage & Flash Stagnation',
    description: 'Stormwater drain inlet choked with plastic debris and construction runoff, resulting in 8-inch water accumulation across two lanes.',
    category: 'Drainage / Drain Blockage',
    severity: 'Critical',
    confidence: 0.98,
    priorityScore: 96,
    scoreBreakdown: { severity: 35, nearbyReports: 20, publicSafety: 16, environmentalImpact: 14, locationImportance: 11, total: 96 },
    priorityExplanation: [
      'Critical IT corridor junction with 45,000 daily commuters',
      'Underpass water stagnation creates risk of vehicle stalling and electrical failure',
      'Rainfall forecasted within next 12 hours'
    ],
    recommendedAction: 'Deploy GHMC Super-Sucker jetting machine and emergency de-watering pump crew immediately.',
    potentialRisk: 'Complete gridlock across Madhapur and Hitec City IT zone.',
    location: {
      lat: 17.4504,
      lng: 78.3808,
      address: 'Cyber Towers Junction Underpass, Hitec City, Hyderabad',
      district: 'Serilingampally Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 9,
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-22T09:45:00Z',
    assignedTeam: 'GHMC Disaster Response Force (DRF Team 2)'
  },

  // 3. Water Leakage - Critical
  {
    id: 'HYD-2026-003',
    title: 'High-Pressure Potable Water Transmission Rupture',
    description: 'Underground potable water transmission pipe rupture discharging approximately 400 liters/minute onto roadway and flooding pedestrian walkways.',
    category: 'Water Leakage',
    severity: 'Critical',
    confidence: 0.95,
    priorityScore: 91,
    scoreBreakdown: { severity: 34, nearbyReports: 17, publicSafety: 15, environmentalImpact: 15, locationImportance: 10, total: 91 },
    priorityExplanation: [
      'Massive loss of treated drinking water supply for adjacent residential wards',
      'Soil erosion under roadway causing pavement destabilization',
      'Direct safety hazard for pedestrians and cyclists'
    ],
    recommendedAction: 'Isolate Sector-4 feeder valve and dispatch HMWSSB Emergency Pipeline Repair Unit.',
    potentialRisk: 'Pavement collapse, drinking water contamination, road closure.',
    location: {
      lat: 17.4168,
      lng: 78.4382,
      address: 'Road No. 12, Banjara Hills (Near MLA Colony), Hyderabad',
      district: 'Khairatabad Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 5,
    createdAt: '2026-09-22T07:20:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
    assignedTeam: 'HMWSSB Water Supply Division 6'
  },

  // 4. Garbage Overflow - High
  {
    id: 'HYD-2026-004',
    title: 'Commercial Dump Bin Overflow & Stray Animal Gathering',
    description: 'Secondary community dump bin overflowing onto road verge for over 48 hours. Waste scattering across pedestrian walkway.',
    category: 'Garbage / Waste Overflow',
    severity: 'High',
    confidence: 0.93,
    priorityScore: 82,
    scoreBreakdown: { severity: 28, nearbyReports: 18, publicSafety: 13, environmentalImpact: 14, locationImportance: 9, total: 82 },
    priorityExplanation: [
      'Located 60m from residential apartment complex and grocery market',
      'Severe foul odor and biohazard accumulation',
      '4 citizen complaints filed via CityNexus app'
    ],
    recommendedAction: 'Dispatch GHMC Compactor Truck and sanitize transfer point with bleaching powder.',
    potentialRisk: 'Vector-borne disease spread, stray dog pack aggression, pedestrian hindrance.',
    location: {
      lat: 17.4938,
      lng: 78.3995,
      address: 'Near Rythu Bazar, KPHB Colony Phase 3, Kukatpally, Hyderabad',
      district: 'Kukatpally Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 4,
    createdAt: '2026-09-22T10:15:00Z',
    updatedAt: '2026-09-22T11:00:00Z',
    assignedTeam: 'GHMC Solid Waste Management (Kukatpally Circle)'
  },

  // 5. Streetlight - High
  {
    id: 'HYD-2026-005',
    title: 'Multiple Blown Streetlights on ORR Service Road',
    description: 'Continuous 400-meter stretch with 7 dead sodium-vapor lamp poles creating total darkness on pedestrian and two-wheeler access road.',
    category: 'Broken Streetlight',
    severity: 'High',
    confidence: 0.91,
    priorityScore: 78,
    scoreBreakdown: { severity: 26, nearbyReports: 17, publicSafety: 17, environmentalImpact: 8, locationImportance: 10, total: 78 },
    priorityExplanation: [
      'Dense commuter corridor connecting Financial District with Gachibowli junction',
      'High incidence of pedestrian crossings at night with zero visibility',
      '3 citizen reports received in past 24 hours'
    ],
    recommendedAction: 'Deploy GHMC Electrical Wing hydraulic lift van to replace blown ballast/LED fixtures.',
    potentialRisk: 'Nighttime vehicular collisions with pedestrians and enhanced crime risk.',
    location: {
      lat: 17.4401,
      lng: 78.3489,
      address: 'ORR Service Road, Near Financial District Entrance, Gachibowli, Hyderabad',
      district: 'Serilingampally Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 3,
    createdAt: '2026-09-22T12:00:00Z',
    updatedAt: '2026-09-22T12:30:00Z',
    assignedTeam: 'GHMC Electrical Engineering Circle 11'
  },

  // 6. Drainage - High
  {
    id: 'HYD-2026-006',
    title: 'Paradise Circle Stormwater Overflow',
    description: 'Heavy silt deposits and plastic bags choking open stormwater channel causing foul-smelling overflow onto sidewalk.',
    category: 'Drainage / Drain Blockage',
    severity: 'High',
    confidence: 0.89,
    priorityScore: 74,
    scoreBreakdown: { severity: 25, nearbyReports: 16, publicSafety: 12, environmentalImpact: 13, locationImportance: 8, total: 74 },
    priorityExplanation: [
      'High pedestrian footfall zone near Paradise commercial hub',
      'Mosquito breeding risk in stagnant blackwater pool'
    ],
    recommendedAction: 'Desilt 150m drainage stretch using mini excavator.',
    potentialRisk: 'Vector spread, sidewalk obstruction, business disruption.',
    location: {
      lat: 17.4411,
      lng: 78.4983,
      address: 'Near Paradise Circle, MG Road, Secunderabad, Hyderabad',
      district: 'Secunderabad Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 2,
    createdAt: '2026-09-22T13:40:00Z',
    updatedAt: '2026-09-22T13:40:00Z',
    assignedTeam: 'GHMC Drainage Maintenance Wing'
  },

  // 7. Pothole - Medium
  {
    id: 'HYD-2026-007',
    title: 'Uneven Road Surface & Sunken Manhole Ring',
    description: 'Manhole rim elevated 8cm above worn asphalt layer on commuter lane causing sudden vehicle jarring.',
    category: 'Pothole / Road Damage',
    severity: 'Medium',
    confidence: 0.88,
    priorityScore: 56,
    scoreBreakdown: { severity: 18, nearbyReports: 12, publicSafety: 11, environmentalImpact: 7, locationImportance: 8, total: 56 },
    priorityExplanation: [
      'Moderate vehicle speed zone on Begumpet main road',
      'Suspension shock hazard for two-wheelers'
    ],
    recommendedAction: 'Level manhole collar flush with pavement and apply micro-surfacing asphalt.',
    potentialRisk: 'Two-wheeler loss of balance, vehicle undercarriage scrapes.',
    location: {
      lat: 17.4448,
      lng: 78.4687,
      address: 'Begumpet Main Road, Near Prakash Nagar Metro, Hyderabad',
      district: 'Begumpet Circle'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    duplicateCount: 1,
    createdAt: '2026-09-22T14:10:00Z',
    updatedAt: '2026-09-22T14:10:00Z',
    assignedTeam: 'GHMC Road Maintenance Wing'
  },

  // 8. Garbage - Medium
  {
    id: 'HYD-2026-008',
    title: 'Market Debris & Secondary Waste Accumulation',
    description: 'Rotting vegetable waste and discarded packaging uncollected around historic bazaar perimeter.',
    category: 'Garbage / Waste Overflow',
    severity: 'Medium',
    confidence: 0.87,
    priorityScore: 52,
    scoreBreakdown: { severity: 17, nearbyReports: 11, publicSafety: 9, environmentalImpact: 10, locationImportance: 5, total: 52 },
    priorityExplanation: [
      'Commercial market area with active daytime pedestrian density',
      'Requires regular evening sanitation clearance'
    ],
    recommendedAction: 'Schedule extra evening clearing shift with tipper auto and sanitation squad.',
    potentialRisk: 'Slipping hazard for shoppers, foul odor.',
    location: {
      lat: 17.3616,
      lng: 78.4747,
      address: 'Laad Bazaar, Near Charminar Heritage Area, Hyderabad',
      district: 'Charminar Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 2,
    createdAt: '2026-09-22T15:00:00Z',
    updatedAt: '2026-09-22T15:00:00Z',
    assignedTeam: 'GHMC Sanitation Circle 4'
  },

  // 9. Streetlight - Low
  {
    id: 'HYD-2026-009',
    title: 'Flickering Streetlight Fixture Near Metro Station',
    description: 'LED street luminaire intermittently blinking causing low illumination at pedestrian transit boarding point.',
    category: 'Broken Streetlight',
    severity: 'Low',
    confidence: 0.85,
    priorityScore: 28,
    scoreBreakdown: { severity: 8, nearbyReports: 6, publicSafety: 6, environmentalImpact: 3, locationImportance: 5, total: 28 },
    priorityExplanation: [
      'Bus shelter has secondary ambient lighting',
      'Low immediate safety hazard but causes eye fatigue'
    ],
    recommendedAction: 'Replace driver module during routine maintenance circuit run.',
    potentialRisk: 'Minor inconvenience for commuters boarding buses at night.',
    location: {
      lat: 17.4375,
      lng: 78.4483,
      address: 'Ameerpet Metro Station Transit Hub, Hyderabad',
      district: 'Ameerpet Circle'
    },
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 1,
    createdAt: '2026-09-22T16:00:00Z',
    updatedAt: '2026-09-22T16:00:00Z',
    assignedTeam: 'GHMC Streetlight Operations'
  },

  // 10. Water Leakage - Low / Resolved
  {
    id: 'HYD-2026-010',
    title: 'Minor Potable Distribution Pipe Joint Weep',
    description: 'Minor flange joint trickle pooling along roadside curb without impeding traffic flow or road stability.',
    category: 'Water Leakage',
    severity: 'Low',
    confidence: 0.84,
    priorityScore: 24,
    scoreBreakdown: { severity: 7, nearbyReports: 5, publicSafety: 4, environmentalImpact: 4, locationImportance: 4, total: 24 },
    priorityExplanation: [
      'Non-critical distribution branch line',
      'Low volume loss with no road subsidence'
    ],
    recommendedAction: 'Gasket replacement completed by HMWSSB rapid response division.',
    potentialRisk: 'Gradual potable water loss if unaddressed.',
    location: {
      lat: 17.4283,
      lng: 78.5385,
      address: 'Tarnaka Main Road, Near Osmania University Gate, Hyderabad',
      district: 'Secunderabad Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    duplicateCount: 1,
    createdAt: '2026-09-21T11:00:00Z',
    updatedAt: '2026-09-22T14:30:00Z',
    assignedTeam: 'HMWSSB Operations Circle 9'
  }
];

interface CityMapProps {
  incidents: UrbanIncident[];
  onSelectIncident: (incident: UrbanIncident) => void;
}

export const CityMap: React.FC<CityMapProps> = ({ incidents, onSelectIncident }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tileError, setTileError] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Combine curated Hyderabad sample incidents with any user-created incidents
  const allHyderabadIncidents = React.useMemo(() => {
    // Collect user reported incidents that are not already in HYDERABAD_SAMPLE_INCIDENTS
    const extraIncidents: UrbanIncident[] = [];
    if (incidents && incidents.length > 0) {
      incidents.forEach((inc, idx) => {
        // Check if this incident already exists in HYDERABAD_SAMPLE_INCIDENTS
        const exists = HYDERABAD_SAMPLE_INCIDENTS.some(s => s.id === inc.id);
        if (!exists) {
          // If incident has lat outside Hyderabad bounding box (~17.2 to 17.6), map it into Hyderabad metro area
          let lat = inc.location.lat;
          let lng = inc.location.lng;
          if (lat < 17.0 || lat > 18.0 || lng < 78.0 || lng > 79.0) {
            // Distribute user incidents nicely around Hyderabad center
            const offsets = [
              { lat: 17.4435, lng: 78.3772, addr: 'Hitec City Main Rd, Hyderabad' },
              { lat: 17.4239, lng: 78.4482, addr: 'Panjagutta X Roads, Hyderabad' },
              { lat: 17.4062, lng: 78.4691, addr: 'Tank Bund Rd, Hussain Sagar, Hyderabad' },
              { lat: 17.3833, lng: 78.4867, addr: 'Koti Commercial Center, Hyderabad' },
              { lat: 17.4520, lng: 78.4980, addr: 'Secunderabad Clock Tower, Hyderabad' }
            ];
            const chosen = offsets[idx % offsets.length];
            lat = chosen.lat;
            lng = chosen.lng;
          }
          extraIncidents.push({
            ...inc,
            location: {
              ...inc.location,
              lat,
              lng
            }
          });
        }
      });
    }
    return [...HYDERABAD_SAMPLE_INCIDENTS, ...extraIncidents];
  }, [incidents]);

  // Filtered incidents
  const filteredIncidents = allHyderabadIncidents.filter(inc => {
    if (selectedCategory !== 'All' && inc.category !== selectedCategory) return false;
    if (selectedSeverity !== 'All' && inc.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'All' && inc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = inc.title.toLowerCase().includes(q) ||
                    inc.description.toLowerCase().includes(q) ||
                    inc.location.address.toLowerCase().includes(q) ||
                    (inc.location.district && inc.location.district.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Category Icon helper
  const getCategoryGlyph = (category: UrbanIssueCategory) => {
    switch (category) {
      case 'Pothole / Road Damage':
        return '🕳️';
      case 'Garbage / Waste Overflow':
        return '🗑️';
      case 'Water Leakage':
        return '💧';
      case 'Drainage / Drain Blockage':
        return '🌊';
      case 'Broken Streetlight':
        return '💡';
      default:
        return '📍';
    }
  };

  // Severity indicator color styling
  const getSeverityStyle = (severity: IssueSeverity, priorityScore: number) => {
    if (severity === 'Critical' || priorityScore >= 80) {
      return {
        bg: '#e11d48',
        border: '#fda4af',
        glow: 'rgba(225, 29, 72, 0.4)',
        label: 'Critical',
        badgeBg: '#ffe4e6',
        badgeText: '#9f1239'
      };
    }
    if (severity === 'High' || priorityScore >= 60) {
      return {
        bg: '#ea580c',
        border: '#fed7aa',
        glow: 'rgba(234, 88, 12, 0.35)',
        label: 'High',
        badgeBg: '#ffedd5',
        badgeText: '#9a3412'
      };
    }
    if (severity === 'Medium' || priorityScore >= 30) {
      return {
        bg: '#d97706',
        border: '#fef08a',
        glow: 'rgba(217, 119, 6, 0.3)',
        label: 'Medium',
        badgeBg: '#fef9c3',
        badgeText: '#854d0e'
      };
    }
    return {
      bg: '#059669',
      border: '#a7f3d0',
      glow: 'rgba(5, 150, 105, 0.3)',
      label: 'Low',
      badgeBg: '#d1fae5',
      badgeText: '#065f46'
    };
  };

  // Status color helper for popup
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
        return { text: '#059669', bg: '#ecfdf5' };
      case 'In Progress':
        return { text: '#0284c7', bg: '#f0f9ff' };
      case 'Assigned':
        return { text: '#7c3aed', bg: '#f5f3ff' };
      case 'Under Review':
        return { text: '#d97706', bg: '#fffbeb' };
      default:
        return { text: '#e11d48', bg: '#fff1f2' };
    }
  };

  // Initialize Leaflet Map once container mounts
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center around Hyderabad, Telangana, India (coordinates: 17.4125, 78.4480)
    // Zoom 12 shows Hitec City, Jubilee Hills, Secunderabad, and Old City Charminar
    const map = L.map(mapContainerRef.current, {
      center: [17.4150, 78.4450],
      zoom: 12,
      zoomControl: true,
      minZoom: 10,
      maxZoom: 18,
    });

    // Primary OpenStreetMap tile layer
    const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    });

    osmTileLayer.on('tileerror', () => {
      console.warn('OpenStreetMap tile error detected, activating fallback notice.');
      setTileError(true);
    });

    osmTileLayer.on('load', () => {
      setTileError(false);
    });

    osmTileLayer.addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;
    setIsMapReady(true);

    // Multiple invalidateSize calls to ensure 0 grey rect artifacts
    requestAnimationFrame(() => {
      map.invalidateSize();
    });
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Update Leaflet markers when incidents or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !isMapReady) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    filteredIncidents.forEach((inc) => {
      const style = getSeverityStyle(inc.severity, inc.priorityScore);
      const glyph = getCategoryGlyph(inc.category);
      const isCritical = inc.severity === 'Critical' || inc.priorityScore >= 80;
      const statusStyle = getStatusColor(inc.status);

      // Custom divIcon matching CityNexus theme
      const customIcon = L.divIcon({
        className: 'citynexus-marker-node',
        html: `
          <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px;">
            ${isCritical ? `
              <span style="
                position: absolute; 
                width: 38px; 
                height: 38px; 
                border-radius: 9999px; 
                background-color: ${style.bg}; 
                opacity: 0.45; 
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></span>
            ` : ''}
            <div style="
              position: relative;
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background-color: ${style.bg};
              border: 2.5px solid ${style.border};
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              line-height: 1;
              color: #ffffff;
              transition: transform 0.18s ease;
            ">
              ${glyph}
            </div>
            <div style="
              position: absolute;
              bottom: -4px;
              right: -2px;
              background: #0f172a;
              color: ${style.border};
              border: 1.5px solid ${style.bg};
              border-radius: 9999px;
              font-family: monospace;
              font-size: 9px;
              font-weight: 800;
              padding: 1px 4px;
              line-height: 1;
              box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">
              ${inc.priorityScore}
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

      // Popup Content showing Issue Type, Severity, Location, Status, and Action
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f172a; width: 270px; padding: 2px;">
          
          <!-- Category & Priority Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; background: #f1f5f9; padding: 2px 7px; border-radius: 5px; color: #334155; display: inline-flex; align-items: center; gap: 4px;">
              <span>${glyph}</span>
              <span>${inc.category.split('/')[0].trim()}</span>
            </span>
            <span style="font-size: 11px; font-weight: 800; font-family: monospace; color: ${style.bg}; background: ${style.badgeBg}; padding: 2px 6px; border-radius: 4px;">
              Priority: ${inc.priorityScore}/100
            </span>
          </div>

          <!-- Title -->
          <h4 style="margin: 0 0 5px 0; font-size: 13px; font-weight: 800; line-height: 1.3; color: #0f172a;">
            ${inc.title}
          </h4>

          <!-- Location -->
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.35; display: flex; align-items: flex-start; gap: 4px;">
            <span style="font-size: 12px; line-height: 1;">📍</span>
            <span><strong>${inc.location.address}</strong></span>
          </div>

          <!-- Details Grid (Severity, Status, Merged Reports) -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; font-size: 11px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Severity:</span>
              <span style="font-weight: 800; color: ${style.badgeText}; background: ${style.badgeBg}; padding: 1px 6px; border-radius: 4px;">
                ${inc.severity}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Status:</span>
              <span style="font-weight: 700; color: ${statusStyle.text}; background: ${statusStyle.bg}; padding: 1px 6px; border-radius: 4px;">
                ${inc.status}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Citizen Reports:</span>
              <strong style="color: #1e293b;">${inc.duplicateCount} merged</strong>
            </div>
          </div>

          <!-- Action -->
          <div style="font-size: 11px; color: #334155; margin-bottom: 8px; line-height: 1.35; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 5px 7px;">
            <strong style="color: #047857;">Action:</strong> ${inc.recommendedAction}
          </div>

          <!-- Action Button -->
          <button 
            id="view-incident-btn-${inc.id}" 
            style="width: 100%; padding: 7px 10px; background: #0f172a; color: #f8fafc; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s ease;"
          >
            Inspect Incident Dossier →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 290 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-incident-btn-${inc.id}`);
        if (btn) {
          btn.onclick = () => onSelectIncident(inc);
        }
      });

      markersGroup.addLayer(marker);
    });

  }, [filteredIncidents, onSelectIncident, isMapReady]);

  // Center map on Hyderabad reset
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([17.4150, 78.4450], 12);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-4 font-sans">
      
      {/* Map Header & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                GIS GEO-SPATIAL INTELLIGENCE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                OpenStreetMap • Hyderabad, India
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              CityNexus Interactive City Map
            </h1>
            <p className="text-xs text-slate-400">
              Live geographic visualization of potholes, water leaks, drainage blockages, garbage overflows, and streetlights across Hyderabad.
            </p>
          </div>

          {/* Quick Counter & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Showing <strong className="text-emerald-400 font-bold">{filteredIncidents.length}</strong> of {allHyderabadIncidents.length} hazards
            </span>
            <button
              onClick={handleResetView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              title="Reset center to Hyderabad"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Center Hyderabad</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              HAZARD CATEGORY
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
            >
              <option value="All">All Categories (5 Types)</option>
              <option value="Pothole / Road Damage">🕳️ Potholes & Road Damage</option>
              <option value="Garbage / Waste Overflow">🗑️ Garbage & Waste Overflow</option>
              <option value="Water Leakage">💧 Water Leakage & Mains</option>
              <option value="Drainage / Drain Blockage">🌊 Drainage & Drain Blockage</option>
              <option value="Broken Streetlight">💡 Broken Streetlights</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              SEVERITY LEVEL
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">🔴 Critical (Score 80–100)</option>
              <option value="High">🟠 High (Score 60–79)</option>
              <option value="Medium">🟡 Medium (Score 30–59)</option>
              <option value="Low">🟢 Low (Score 0–29)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              WORKFLOW STATUS
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Search box */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              SEARCH LOCALITY / LANDMARK
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Jubilee Hills, Hitec City, etc..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans placeholder:text-slate-500"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Tile Error / Offline Fallback Notice */}
      {tileError && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              External OpenStreetMap tile servers are responding slowly. Interactive incident markers and coordinates remain active and functional.
            </span>
          </div>
          <button 
            onClick={() => { 
              setTileError(false); 
              mapInstanceRef.current?.invalidateSize(); 
            }}
            className="px-3 py-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 text-xs font-bold border border-amber-500/30 transition-colors"
          >
            Reload Tiles
          </button>
        </div>
      )}

      {/* Map Viewport Container with Fixed Height (At least 500px, configured as 580px) */}
      <div 
        className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 w-full"
        style={{ height: '580px', minHeight: '500px', width: '100%' }}
      >
        
        {/* Leaflet Map DOM Element */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10" 
          style={{ height: '100%', width: '100%', minHeight: '500px' }}
        />

        {/* Floating Severity & Category Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl text-xs space-y-2.5 max-w-xs pointer-events-auto">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-300 tracking-wider">
              Severity Indicator Legend
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              Hyderabad, IN
            </span>
          </div>

          {/* Severity Color Indicators */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300 inline-block shadow-sm"></span>
              <span className="text-slate-200">Critical (80–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-300 inline-block shadow-sm"></span>
              <span className="text-slate-200">High (60–79)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300 inline-block shadow-sm"></span>
              <span className="text-slate-200">Medium (30–59)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 inline-block shadow-sm"></span>
              <span className="text-slate-200">Low (0–29)</span>
            </div>
          </div>

          {/* Category Icons Key */}
          <div className="border-t border-slate-800/80 pt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <span>🕳️</span> Potholes
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <span>🗑️</span> Garbage
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <span>💧</span> Water
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <span>🌊</span> Drainage
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <span>💡</span> Lights
            </span>
          </div>

          <div className="text-[10px] text-slate-500 font-sans leading-tight">
            Click any marker node to view issue details, location, and dispatch status.
          </div>

        </div>

      </div>

    </div>
  );
};
