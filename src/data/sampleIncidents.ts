import { UrbanIncident } from '../types';

export const SAMPLE_INCIDENTS: UrbanIncident[] = [
  // 1. Pothole - Critical
  {
    id: 'INC-2026-081',
    title: 'Severe Cavity on 4th & Market Arterial',
    description: 'Deep road cavity (approx. 45cm diameter, 12cm depth) located in the center transit lane. Vehicles swerving sharply into adjacent bike lane to avoid tire puncture.',
    category: 'Pothole / Road Damage',
    severity: 'Critical',
    confidence: 0.96,
    priorityScore: 92,
    scoreBreakdown: {
      severity: 35,
      nearbyReports: 18,
      publicSafety: 15,
      environmentalImpact: 14,
      locationImportance: 10,
      total: 92,
    },
    priorityExplanation: [
      'Located in high-density arterial transit corridor with heavy bus traffic',
      'Sudden vehicular swerving directly jeopardizes adjacent dedicated cyclist corridor',
      '4 distinct citizen reports logged within 120m in the past 6 hours'
    ],
    recommendedAction: 'Dispatch Rapid Road Repair Crew (Unit R-4) with asphalt cold-patch & emergency traffic cones.',
    potentialRisk: 'High risk of vehicular collision with cyclists, tire blowouts at 35mph, and accelerated structural sub-base erosion during rainfall.',
    location: {
      lat: 37.7858,
      lng: -122.4065,
      address: '742 Market St, Downtown Corridor',
      district: 'Downtown Core'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 4,
    duplicateNotes: 'Merged 4 citizen reports: #CR-102, #CR-104, #CR-109, #CR-114',
    createdAt: '2026-09-22T08:14:00Z',
    updatedAt: '2026-09-22T10:30:00Z',
    assignedTeam: 'Road Infrastructure Dept (Crew R-4)',
    citizenReporter: 'Elena Rostova (via UrbanPulse Web)'
  },

  // 2. Drainage - Critical
  {
    id: 'INC-2026-082',
    title: 'Obstructed Storm Drain Grate & Silt Buildup',
    description: 'Heavy leaf litter, plastic debris, and compacted gravel completely suffocating the stormwater intake grate outside City View Elementary.',
    category: 'Drainage / Drain Blockage',
    severity: 'Critical',
    confidence: 0.94,
    priorityScore: 89,
    scoreBreakdown: {
      severity: 33,
      nearbyReports: 16,
      publicSafety: 14,
      environmentalImpact: 17,
      locationImportance: 9,
      total: 89,
    },
    priorityExplanation: [
      'Grate obstruction adjacent to primary pedestrian school crossing',
      'Forecasted coastal precipitation within 18 hours threatens immediate road pooling',
      '3 duplicate citizen notifications filed this morning'
    ],
    recommendedAction: 'Dispatch Stormwater Hydro-Vacuum Truck (Unit V-2) to clear intake and flush culvert.',
    potentialRisk: 'Localized flash flooding extending onto school pedestrian crossing, backwash into sanitary mains, and standing stagnant water vector.',
    location: {
      lat: 37.7725,
      lng: -122.4170,
      address: '380 Valencia St & 15th St',
      district: 'Mission District'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 3,
    duplicateNotes: 'Merged 3 citizen reports within 80m radius',
    createdAt: '2026-09-22T09:20:00Z',
    updatedAt: '2026-09-22T11:05:00Z',
    assignedTeam: 'Stormwater & Environmental Hydraulics',
    citizenReporter: 'Marcus Chen'
  },

  // 3. Garbage - High
  {
    id: 'INC-2026-083',
    title: 'Commercial Waste Overflow at Transit Plaza',
    description: 'Multiple industrial dumpster bins overflowed onto sidewalk; loose cardboard, organic food waste, and plastic wrapping spilling into gutter channel.',
    category: 'Garbage / Waste Overflow',
    severity: 'High',
    confidence: 0.95,
    priorityScore: 78,
    scoreBreakdown: {
      severity: 28,
      nearbyReports: 15,
      publicSafety: 11,
      environmentalImpact: 15,
      locationImportance: 9,
      total: 78,
    },
    priorityExplanation: [
      'High foot-traffic corridor adjacent to metro plaza entrance',
      'Food waste accumulation attracts rodents and creates biological hazard',
      'Debris migrating toward storm drains within 25 meters'
    ],
    recommendedAction: 'Deploy Municipal Sanitation Compactor and issue notice of code violation to adjacent restaurant cluster.',
    potentialRisk: 'Debris migration into stormwater system, pest infestation hazard, pedestrian walkway constriction.',
    location: {
      lat: 37.7812,
      lng: -122.4111,
      address: '1098 Mission St, Metro Plaza',
      district: 'Midtown'
    },
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 2,
    duplicateNotes: '2 matching reports from daily commuters',
    createdAt: '2026-09-22T13:45:00Z',
    updatedAt: '2026-09-22T13:45:00Z',
    citizenReporter: 'Aisha Al-Mansoor'
  },

  // 4. Water Leakage - High
  {
    id: 'INC-2026-084',
    title: 'Pressurized Potable Sub-Surface Pipe Leak',
    description: 'Clean drinking water bubbling aggressively through sidewalk fissure at 8-10 liters per minute; sub-base erosion visible beneath pavement slab.',
    category: 'Water Leakage',
    severity: 'High',
    confidence: 0.92,
    priorityScore: 76,
    scoreBreakdown: {
      severity: 27,
      nearbyReports: 14,
      publicSafety: 12,
      environmentalImpact: 14,
      locationImportance: 9,
      total: 76,
    },
    priorityExplanation: [
      'Substantial loss of treated municipal potable water (approx. 600L/hr)',
      'Underground void formation could induce sidewalk slab collapse',
      '2 resident reports filed within past 4 hours'
    ],
    recommendedAction: 'Dispatch Water Services Emergency Excavation Team (Unit W-1) for valve isolation and joint clamp installation.',
    potentialRisk: 'Sidewalk sinkhole formation, pressure loss to neighboring residential buildings, structural pavement destabilization.',
    location: {
      lat: 37.7694,
      lng: -122.4468,
      address: '1420 Haight St, Historic District',
      district: 'Buena Vista'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    duplicateCount: 2,
    duplicateNotes: 'Cross-verified with Municipal Water Pressure Sensor Node #P-88',
    createdAt: '2026-09-22T11:10:00Z',
    updatedAt: '2026-09-22T12:00:00Z',
    assignedTeam: 'Bureau of Water & Municipal Utilities',
    citizenReporter: 'Liam O’Connor'
  },

  // 5. Broken Streetlight - High
  {
    id: 'INC-2026-085',
    title: 'Cluster of 3 Consecutive Darkened Luminaire Poles',
    description: 'Complete blackout of 3 LED streetlights across busy crosswalk leading to community park and senior living community.',
    category: 'Broken Streetlight',
    severity: 'High',
    confidence: 0.97,
    priorityScore: 74,
    scoreBreakdown: {
      severity: 26,
      nearbyReports: 13,
      publicSafety: 15,
      environmentalImpact: 11,
      locationImportance: 9,
      total: 74,
    },
    priorityExplanation: [
      'Substantial pedestrian zone adjacent to senior living facility plunged into total darkness',
      'Crosswalk visibility reduced by 85% for oncoming vehicles turning left',
      'Multiple safety concerns reported by community watch'
    ],
    recommendedAction: 'Dispatch Electrical Utility Bucket Truck (Unit E-3) to replace photocell control switches and test driver circuit.',
    potentialRisk: 'Nighttime vehicular-pedestrian collision risk, elevated street crime opportunity zone.',
    location: {
      lat: 37.7881,
      lng: -122.4219,
      address: '1600 Geary Blvd & Webster',
      district: 'Western Addition'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 3,
    duplicateNotes: '3 citizen reports logged between 8 PM and 10 PM yesterday',
    createdAt: '2026-09-21T21:30:00Z',
    updatedAt: '2026-09-22T07:15:00Z',
    citizenReporter: 'Dorothy Wright'
  },

  // 6. Pothole - Medium
  {
    id: 'INC-2026-086',
    title: 'Asphalt Raveling and Pavement Trench on 2nd Ave',
    description: 'Trench degradation following utility installation settling; approx 25cm across, causing jarring vibrations for passing cars.',
    category: 'Pothole / Road Damage',
    severity: 'Medium',
    confidence: 0.88,
    priorityScore: 54,
    scoreBreakdown: {
      severity: 19,
      nearbyReports: 10,
      publicSafety: 9,
      environmentalImpact: 9,
      locationImportance: 7,
      total: 54,
    },
    priorityExplanation: [
      'Moderate vehicle transit lane with secondary residential traffic',
      'Raveling will accelerate under freeze-thaw or heavy axle loads',
      'Single citizen report verified with photo'
    ],
    recommendedAction: 'Schedule routine road patching during upcoming district maintenance sweep.',
    potentialRisk: 'Gradual expansion into major tire-hazard pothole during next seasonal rain cycle.',
    location: {
      lat: 37.7818,
      lng: -122.4580,
      address: '240 2nd Avenue, Richmond District',
      district: 'Richmond'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    duplicateCount: 1,
    createdAt: '2026-09-22T07:45:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
    citizenReporter: 'Julian Morales'
  },

  // 7. Garbage - Critical
  {
    id: 'INC-2026-087',
    title: 'Illegal Dumping of Construction Drywall & Chemicals',
    description: 'Approx 3 cubic meters of mixed gypsum drywall, chemical paint solvents, and discarded roofing material dumped in alleyway blocking fire egress.',
    category: 'Garbage / Waste Overflow',
    severity: 'Critical',
    confidence: 0.98,
    priorityScore: 86,
    scoreBreakdown: {
      severity: 34,
      nearbyReports: 14,
      publicSafety: 14,
      environmentalImpact: 15,
      locationImportance: 9,
      total: 86,
    },
    priorityExplanation: [
      'Hazardous material (chemical solvent residue) exposed to open stormwater pathway',
      'Alleyway obstruction compromises residential building secondary fire egress',
      'Rapid action needed before airborne dust dispersion'
    ],
    recommendedAction: 'Deploy Special Hazardous Waste Unit with sealed container transport and notify environmental enforcement officer.',
    potentialRisk: 'Chemical solvent leaching into storm aquifer, hazardous building egress block during emergency.',
    location: {
      lat: 37.7601,
      lng: -122.4188,
      address: '2800 Folsom St & 24th',
      district: 'Calle 24 Corridor'
    },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 2,
    createdAt: '2026-09-22T06:50:00Z',
    updatedAt: '2026-09-22T09:12:00Z',
    assignedTeam: 'Hazardous Materials & City Clean Division',
    citizenReporter: 'Sofia Reyes'
  },

  // 8. Water Leakage - Low
  {
    id: 'INC-2026-088',
    title: 'Minor Sprinkler Head Runoff in Civic Green',
    description: 'Municipal park sprinkler head misaligned, spraying onto paved walking pathway during off-peak morning hours.',
    category: 'Water Leakage',
    severity: 'Low',
    confidence: 0.91,
    priorityScore: 28,
    scoreBreakdown: {
      severity: 9,
      nearbyReports: 5,
      publicSafety: 4,
      environmentalImpact: 6,
      locationImportance: 4,
      total: 28,
    },
    priorityExplanation: [
      'Low volume irrigation runoff, non-pressurized',
      'No structural damage to infrastructure or building foundations',
      'Minor slippery sidewalk condition for early joggers'
    ],
    recommendedAction: 'Re-align sprinkler nozzle during weekly Parks & Recreation groundskeeping visit.',
    potentialRisk: 'Mild water waste (~30L/day), minor moss accumulation on sidewalk tiles.',
    location: {
      lat: 37.7785,
      lng: -122.4201,
      address: 'Civic Center Plaza East Lawn',
      district: 'Civic Center'
    },
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 1,
    createdAt: '2026-09-22T06:30:00Z',
    updatedAt: '2026-09-22T06:30:00Z',
    citizenReporter: 'Kevin Patel'
  },

  // 9. Drainage - High
  {
    id: 'INC-2026-089',
    title: 'Culvert Silt Inundation near Creek Outfall',
    description: 'Heavy sediment deposition blocking 60% of concrete culvert diameter, upstream of recreational pathway.',
    category: 'Drainage / Drain Blockage',
    severity: 'High',
    confidence: 0.93,
    priorityScore: 72,
    scoreBreakdown: {
      severity: 26,
      nearbyReports: 13,
      publicSafety: 11,
      environmentalImpact: 14,
      locationImportance: 8,
      total: 72,
    },
    priorityExplanation: [
      'Key conveyance channel for neighborhood watershed run-off',
      'Overtopping threatens adjacent multi-use recreational trail',
      'Sediment transport contains urban particulate matter'
    ],
    recommendedAction: 'Dispatch mechanical excavator & silt fence crew to dredge culvert throat.',
    potentialRisk: 'Pathway scouring, ecological siltation in downstream urban creek, pedestrian trail closure.',
    location: {
      lat: 37.7680,
      lng: -122.4530,
      address: 'Cole Valley Creek Culvert, Stanyan St',
      district: 'Cole Valley'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    duplicateCount: 2,
    createdAt: '2026-09-21T16:15:00Z',
    updatedAt: '2026-09-22T08:20:00Z',
    citizenReporter: 'Hannah Brooks'
  },

  // 10. Broken Streetlight - Medium
  {
    id: 'INC-2026-090',
    title: 'Flickering High-Pressure Sodium Lamp',
    description: 'Streetlight pole #SL-402 rapidly strobing on and off every 3 seconds, creating severe glare and disorientation for motorists.',
    category: 'Broken Streetlight',
    severity: 'Medium',
    confidence: 0.89,
    priorityScore: 48,
    scoreBreakdown: {
      severity: 16,
      nearbyReports: 8,
      publicSafety: 10,
      environmentalImpact: 7,
      locationImportance: 7,
      total: 48,
    },
    priorityExplanation: [
      'Strobe effect causes visual distraction at intersection',
      'Ballast capacitor failure imminent within 48 hours',
      'Single citizen complaint with video clip'
    ],
    recommendedAction: 'Schedule LED retrofit replacement during next night maintenance shift.',
    potentialRisk: 'Complete ballast burnout leaving corner dark; driver glare hazard.',
    location: {
      lat: 37.7540,
      lng: -122.4172,
      address: 'Cesar Chavez & South Van Ness',
      district: 'Bernal Heights North'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 1,
    createdAt: '2026-09-22T01:10:00Z',
    updatedAt: '2026-09-22T07:50:00Z',
    assignedTeam: 'Public Utilities Commission - Lighting',
    citizenReporter: 'Devon Lee'
  },

  // 11. Pothole - High
  {
    id: 'INC-2026-091',
    title: 'Eroded Trench on Waterfront Embarcadero Lane',
    description: 'Sunken trench across southbound lane adjacent to trolley tracks; sudden 8cm drop damaging vehicle alignment.',
    category: 'Pothole / Road Damage',
    severity: 'High',
    confidence: 0.94,
    priorityScore: 79,
    scoreBreakdown: {
      severity: 28,
      nearbyReports: 16,
      publicSafety: 13,
      environmentalImpact: 13,
      locationImportance: 9,
      total: 79,
    },
    priorityExplanation: [
      'Proximity to historic surface streetcar tracks creates vibration concerns',
      'High tourist and commuter traffic volume along the Embarcadero',
      '3 duplicate citizen reports submitted within 24 hours'
    ],
    recommendedAction: 'Mill and re-lay hot-mix asphalt across joint section with compaction test.',
    potentialRisk: 'Pavement failure undermining rail ballast alignment; tourist vehicle undercarriage damage.',
    location: {
      lat: 37.7988,
      lng: -122.3965,
      address: 'The Embarcadero & Washington St',
      district: 'Waterfront'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 3,
    createdAt: '2026-09-21T18:00:00Z',
    updatedAt: '2026-09-22T10:15:00Z',
    assignedTeam: 'Road Infrastructure Dept (Crew R-2)',
    citizenReporter: 'Thomas Vance'
  },

  // 12. Garbage - Medium
  {
    id: 'INC-2026-092',
    title: 'Recycling Overflow at Community Center',
    description: 'Cardboard boxes and aluminum cans stacked outside full public recycling bins, partially blown across park turf.',
    category: 'Garbage / Waste Overflow',
    severity: 'Medium',
    confidence: 0.90,
    priorityScore: 46,
    scoreBreakdown: {
      severity: 15,
      nearbyReports: 9,
      publicSafety: 7,
      environmentalImpact: 9,
      locationImportance: 6,
      total: 46,
    },
    priorityExplanation: [
      'Non-hazardous recyclable materials',
      'Wind scattering debris across manicured public lawn',
      'Community sports event scheduled for weekend'
    ],
    recommendedAction: 'Dispatch extra weekend recycling collection truck and provide additional bin capacity.',
    potentialRisk: 'Litter spread into neighborhood stormwater inlets, aesthetic park degradation.',
    location: {
      lat: 37.7635,
      lng: -122.4345,
      address: 'Eureka Valley Recreation Center, Collingwood St',
      district: 'Castro'
    },
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 1,
    createdAt: '2026-09-22T08:50:00Z',
    updatedAt: '2026-09-22T08:50:00Z',
    citizenReporter: 'Rachel Zimmerman'
  },

  // 13. Water Leakage - Critical
  {
    id: 'INC-2026-093',
    title: 'Burst Fire Hydrant Base Flange on Pine St',
    description: 'High pressure hydrant shear pin broken following delivery truck glance; water geyser pouring 120 gallons/min across 2 lanes.',
    category: 'Water Leakage',
    severity: 'Critical',
    confidence: 0.99,
    priorityScore: 95,
    scoreBreakdown: {
      severity: 35,
      nearbyReports: 18,
      publicSafety: 15,
      environmentalImpact: 17,
      locationImportance: 10,
      total: 95,
    },
    priorityExplanation: [
      'Active water gush impeding two vehicular lanes on a steep incline',
      'Loss of fire suppression pressure for surrounding commercial district',
      '5 emergency citizen calls merged within 20 minutes'
    ],
    recommendedAction: 'IMMEDIATE DISPATCH: Water Main Emergency Crew to shut curb valve and rebuild hydrant flange.',
    potentialRisk: 'Flooding of downhill commercial basements, erosion of roadway asphalt base, impaired neighborhood fire protection.',
    location: {
      lat: 37.7915,
      lng: -122.4140,
      address: '850 Pine St & Stockton',
      district: 'Nob Hill'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 5,
    duplicateNotes: '5 calls to city hotline merged into single high-priority incident',
    createdAt: '2026-09-22T12:05:00Z',
    updatedAt: '2026-09-22T12:20:00Z',
    assignedTeam: 'Emergency Water Rapid Response',
    citizenReporter: 'Captain Miller (SFFD Station 2)'
  },

  // 14. Drainage - Medium
  {
    id: 'INC-2026-094',
    title: 'Standing Rain Pool & Slow Drain at Transit Stop',
    description: 'Rain runoff pooling 10cm deep in front of shelter curb; passengers must step into muddy puddle to board transit buses.',
    category: 'Drainage / Drain Blockage',
    severity: 'Medium',
    confidence: 0.87,
    priorityScore: 52,
    scoreBreakdown: {
      severity: 18,
      nearbyReports: 11,
      publicSafety: 9,
      environmentalImpact: 8,
      locationImportance: 6,
      total: 52,
    },
    priorityExplanation: [
      'Inconveniences public transit riders including elderly and wheelchair users',
      'Curb gutter inlet partially choked with street mud and cigarette butts',
      '2 citizen reports filed'
    ],
    recommendedAction: 'Clear catch basin baffle and re-grade asphalt lip at transit bay.',
    potentialRisk: 'Pedestrian slips and falls; standing water splash onto waiting passengers.',
    location: {
      lat: 37.7830,
      lng: -122.4350,
      address: 'Divisadero & Sutter Bus Island',
      district: 'Lower Pacific Heights'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    duplicateCount: 2,
    createdAt: '2026-09-20T14:10:00Z',
    updatedAt: '2026-09-22T09:00:00Z',
    assignedTeam: 'Stormwater & Environmental Hydraulics',
    citizenReporter: 'George Washington'
  },

  // 15. Broken Streetlight - Critical
  {
    id: 'INC-2026-095',
    title: 'Exposed High-Voltage Wiring on Damaged Light Post',
    description: 'Automobile collision cracked base inspection plate on streetlight mast; bare 240V insulated wiring hanging reachable by children.',
    category: 'Broken Streetlight',
    severity: 'Critical',
    confidence: 0.99,
    priorityScore: 96,
    scoreBreakdown: {
      severity: 35,
      nearbyReports: 19,
      publicSafety: 15,
      environmentalImpact: 17,
      locationImportance: 10,
      total: 96,
    },
    priorityExplanation: [
      'Direct life-safety electrocution hazard on elementary school walking route',
      'Live bare conductors exposed to open elements and rain',
      '4 urgent community alerts logged within 45 minutes'
    ],
    recommendedAction: 'EMERGENCY: De-energize circuit loop immediately and dispatch emergency electrical line crew to install safety enclosure.',
    potentialRisk: 'Fatal electrocution hazard, electrical arc fire risk if touching metal guardrail.',
    location: {
      lat: 37.7512,
      lng: -122.4245,
      address: '3200 Mission St & Cortland Ave',
      district: 'Bernal Heights'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 4,
    duplicateNotes: 'Emergency priority escalation triggered by AI safety keyword recognition',
    createdAt: '2026-09-22T13:10:00Z',
    updatedAt: '2026-09-22T13:22:00Z',
    assignedTeam: 'Emergency Electrical Hazard Crew',
    citizenReporter: 'Amara Okafor'
  },

  // 16. Pothole - Low
  {
    id: 'INC-2026-096',
    title: 'Shallow Surface Pavement Flaking on Residential Cul-de-sac',
    description: 'Minor surface topcoat wear (approx 3cm deep, 15cm wide) on low-speed residential street.',
    category: 'Pothole / Road Damage',
    severity: 'Low',
    confidence: 0.85,
    priorityScore: 24,
    scoreBreakdown: {
      severity: 8,
      nearbyReports: 4,
      publicSafety: 4,
      environmentalImpact: 5,
      locationImportance: 3,
      total: 24,
    },
    priorityExplanation: [
      'Low vehicular speed zone (15mph)',
      'No immediate hazard to bicycles or pedestrian traffic',
      'Single resident notice'
    ],
    recommendedAction: 'Log in secondary resurfacing queue for upcoming neighborhood seal-coating program.',
    potentialRisk: 'Cosmetic road aging with slow winter frost progression.',
    location: {
      lat: 37.7420,
      lng: -122.4410,
      address: '45 Glenbrook Ave, Twin Peaks',
      district: 'Twin Peaks'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    status: 'Reported',
    duplicateCount: 1,
    createdAt: '2026-09-22T05:15:00Z',
    updatedAt: '2026-09-22T05:15:00Z',
    citizenReporter: 'Nathalie Dupont'
  },

  // 17. Garbage - Low
  {
    id: 'INC-2026-097',
    title: 'Discarded Furniture on Sidewalk Buffer',
    description: 'Worn upholstered sofa and coffee table left on curb with "Free" sign; partially blocking stroller passage on sidewalk.',
    category: 'Garbage / Waste Overflow',
    severity: 'Low',
    confidence: 0.91,
    priorityScore: 29,
    scoreBreakdown: {
      severity: 9,
      nearbyReports: 5,
      publicSafety: 5,
      environmentalImpact: 6,
      locationImportance: 4,
      total: 29,
    },
    priorityExplanation: [
      'Non-hazardous dry bulky goods',
      'Slight sidewalk accessibility restriction',
      'No immediate biological or fire risk'
    ],
    recommendedAction: 'Schedule bulky item curbside collection truck pickup within 48 hours.',
    potentialRisk: 'Moisture rot if left during rain; minor sidewalk clutter.',
    location: {
      lat: 37.7710,
      lng: -122.4385,
      address: '610 Page St & Pierce',
      district: 'Hayes Valley'
    },
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    duplicateCount: 1,
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-21T15:30:00Z',
    assignedTeam: 'Bulky Waste Logistics Team',
    citizenReporter: 'Samir Ghosh'
  },

  // 18. Water Leakage - Medium
  {
    id: 'INC-2026-098',
    title: 'Seepage from Underground Water Meter Box',
    description: 'Sub-surface water bubbling inside utility meter vault and overflowing into adjacent flower bed at 1-2 gallons/minute.',
    category: 'Water Leakage',
    severity: 'Medium',
    confidence: 0.89,
    priorityScore: 50,
    scoreBreakdown: {
      severity: 17,
      nearbyReports: 9,
      publicSafety: 8,
      environmentalImpact: 9,
      locationImportance: 7,
      total: 50,
    },
    priorityExplanation: [
      'Non-potable irrigation or service line leak inside municipal easement',
      'Water soaking into soil, not affecting roadway stability',
      'Meter dial indicates slow constant rotation'
    ],
    recommendedAction: 'Send meter technician to tighten union coupling or replace faulty regulator washer.',
    potentialRisk: 'Continuous water wastage and soil oversaturation near tree roots.',
    location: {
      lat: 37.7845,
      lng: -122.4490,
      address: '2150 California St, Pacific Heights',
      district: 'Pacific Heights'
    },
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
    status: 'Assigned',
    duplicateCount: 1,
    createdAt: '2026-09-22T04:20:00Z',
    updatedAt: '2026-09-22T08:10:00Z',
    assignedTeam: 'Bureau of Water & Municipal Utilities',
    citizenReporter: 'Victoria Sterling'
  },

  // 19. Drainage - High
  {
    id: 'INC-2026-099',
    title: 'Catch Basin Grate Clogged by Plastic Bags & Wrappers',
    description: 'Major stormwater catch basin inlet 90% obstructed by plastic litter accumulation directly downhill from food trucks.',
    category: 'Drainage / Drain Blockage',
    severity: 'High',
    confidence: 0.93,
    priorityScore: 77,
    scoreBreakdown: {
      severity: 28,
      nearbyReports: 14,
      publicSafety: 12,
      environmentalImpact: 14,
      locationImportance: 9,
      total: 77,
    },
    priorityExplanation: [
      'Immediate obstruction to main street runoff inlet',
      'Plastic wrappers create impermeable barrier on drain slats',
      '2 merchant reports submitted'
    ],
    recommendedAction: 'Dispatch maintenance van with manual rake and jetting equipment to unblock grate and catch basin pit.',
    potentialRisk: 'Water backup across bicycle transit lane, macro-plastic ingress into Bay marine estuary.',
    location: {
      lat: 37.7705,
      lng: -122.4035,
      address: '4th & King St, Mission Bay North',
      district: 'Mission Bay'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    duplicateCount: 2,
    createdAt: '2026-09-21T19:30:00Z',
    updatedAt: '2026-09-22T11:40:00Z',
    assignedTeam: 'Stormwater & Environmental Hydraulics',
    citizenReporter: 'Tariq Johnson'
  },

  // 20. Pothole - High
  {
    id: 'INC-2026-100',
    title: 'Jagged Pothole in Bus Rapid Transit (BRT) Lane',
    description: '35cm wide asphalt crater right in the acceleration zone of Van Ness Bus Station; causes heavy articulated buses to jar violently.',
    category: 'Pothole / Road Damage',
    severity: 'High',
    confidence: 0.95,
    priorityScore: 82,
    scoreBreakdown: {
      severity: 29,
      nearbyReports: 16,
      publicSafety: 14,
      environmentalImpact: 14,
      locationImportance: 9,
      total: 82,
    },
    priorityExplanation: [
      'Located directly in dedicated high-frequency transit lane carrying 40,000 riders/day',
      'Repeated heavy bus axle impact accelerates road bed decay',
      '3 passenger and operator incident reports'
    ],
    recommendedAction: 'Apply high-durability polymer asphalt repair during 2-hour night maintenance window.',
    potentialRisk: 'Transit bus suspension shock, passenger balance hazard during braking, rapid hole expansion.',
    location: {
      lat: 37.7870,
      lng: -122.4215,
      address: 'Van Ness Ave & O’Farrell BRT Stop',
      district: 'Civic Center'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    duplicateCount: 3,
    createdAt: '2026-09-19T11:00:00Z',
    updatedAt: '2026-09-21T16:45:00Z',
    assignedTeam: 'Road Infrastructure Dept (Crew R-1)',
    citizenReporter: 'Carlos Santana (Muni Operator)'
  }
];
