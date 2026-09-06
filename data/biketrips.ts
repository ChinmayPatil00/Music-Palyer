import { BikeTrip } from '@/types';

export const BIKE_TRIPS: BikeTrip[] = [
  {
    id: 'bike-leh-ladakh',
    slug: 'leh-ladakh-zanskar-motorcycle-expedition',
    title: 'The Holy Grail: Leh, Nubra, Pangong & Zanskar Ride',
    fromCity: 'Manali / Srinagar',
    toCity: 'Leh Ladakh',
    distanceKm: 1850,
    idealDays: 10,
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
    difficulty: 'Extreme Iron Butt',
    bestSeason: 'June to September',
    recommendedBikes: ['Royal Enfield Himalayan 450', 'KTM 390 Adventure', 'BMW G 310 GS', 'Hero XPulse 200 4V'],
    estimatedFuelLitres: 65,
    estimatedCost: 26000,
    permitsRequired: 'Inner Line Permit (ILP) for Nubra Valley, Pangong Tso, Hanle, and Umling La (19,024 ft)',
    mechanicsFrequency: 'High in Manali & Leh; virtually ZERO in Sarchu, Nubra interiors and Hanle. Self-repair tool roll mandatory.',
    safetyChecklist: [
      'Carry portable 12V tyre inflator & puncture repair kit (tubeless preferred)',
      'Spare clutch cable, brake pads, chain master link & engine oil (1L top-up)',
      'Acclimatize in Leh for min 48 hrs before ascending Khardung La (17,582 ft)',
      'Diamox tablet course & portable medical oxygen can',
      'Waterproof saddlebags or dry sacks for high-altitude river water crossings (nallhas)'
    ],
    recommendedGear: [
      'Level 2 CE armored 4-season all-weather adventure jacket & riding pants',
      'Full-gauntlet waterproof winter riding gloves + spare rain over-gloves',
      'High-ankle adventure touring boots with shin & torsion protection',
      'Pinlock anti-fog helmet visor',
      'Thermal base layers (merino wool) + windproof neck gaiter'
    ],
    routeCoordinates: [
      { lat: 32.2432, lng: 77.1892, name: 'Manali Base' },
      { lat: 32.7565, lng: 77.4206, name: 'Baralacha La' },
      { lat: 34.1526, lng: 77.5771, name: 'Leh Town' },
      { lat: 34.2787, lng: 77.6047, name: 'Khardung La Pass' },
      { lat: 34.6040, lng: 77.5687, name: 'Nubra Valley Dunes' },
      { lat: 33.7595, lng: 78.6674, name: 'Pangong Tso' }
    ]
  },
  {
    id: 'bike-western-ghats-monsoon',
    slug: 'mumbai-pune-mahabaleshwar-goa-ghats-ride',
    title: 'Western Ghats Monsoon & Coastal Curve Cruise',
    fromCity: 'Pune',
    toCity: 'Goa (via Amboli Ghat)',
    distanceKm: 520,
    idealDays: 3,
    heroImage: 'https://images.unsplash.com/photo-1596761223940-69230559e867?auto=format&fit=crop&w=1600&q=80',
    difficulty: 'Intermediate Tourer',
    bestSeason: 'July to November',
    recommendedBikes: ['Royal Enfield Hunter 350 / Meteor', 'Bajaj Dominar 400', 'Honda CB350RS', 'KTM Duke 250'],
    estimatedFuelLitres: 18,
    estimatedCost: 6800,
    permitsRequired: 'None (State border toll exempt for 2-wheelers)',
    mechanicsFrequency: 'Towns every 15-30 km along NH48 and SH121.',
    safetyChecklist: [
      'Inspect tyre tread depth before hitting wet mossy ghat curves',
      'Rain gear accessible in tank bag without untying luggage',
      'Clean visor with anti-rain hydrophobic spray'
    ],
    recommendedGear: [
      'Breathable rainsuit over mesh armored jacket',
      'Waterproof boots or silicone shoe covers',
      'Reflective fluorescent vest for heavy monsoon fog'
    ],
    routeCoordinates: [
      { lat: 18.5204, lng: 73.8567, name: 'Pune' },
      { lat: 17.6805, lng: 74.0183, name: 'Satara' },
      { lat: 15.9556, lng: 73.9989, name: 'Amboli Ghat Waterfall Section' },
      { lat: 15.6033, lng: 73.7431, name: 'North Goa (Vagator)' }
    ]
  },
  {
    id: 'bike-kolli-hills',
    slug: 'kolli-hills-70-hairpin-challenge',
    title: 'Kolli Hills 70 Continuous Hairpin Bend Challenge',
    fromCity: 'Bangalore',
    toCity: 'Kolli Hills (Namakkal)',
    distanceKm: 280,
    idealDays: 2,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    difficulty: 'Intermediate Tourer',
    bestSeason: 'August to February',
    recommendedBikes: ['KTM RC 390 / Duke 390', 'Yamaha R15 V4', 'TVS Apache RR 310', 'Kawasaki Ninja 300'],
    estimatedFuelLitres: 11,
    estimatedCost: 3800,
    permitsRequired: 'None',
    mechanicsFrequency: 'At Namakkal base; limited to puncture fixers at top of the hills.',
    safetyChecklist: [
      'Honk on blind curves (narrow 2-lane ghat section)',
      'Watch for oncoming local buses cutting corners',
      'Brake cooling: avoid riding continuous rear brake on steep downhill switchbacks'
    ],
    recommendedGear: [
      'Leather or Cordura track/street jacket with elbow & shoulder armor',
      'Sticky sport compound tyres',
      'Hydration backpack'
    ],
    routeCoordinates: [
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
      { lat: 11.6643, lng: 78.1460, name: 'Salem NH44' },
      { lat: 11.2483, lng: 78.3389, name: 'Kolli Hills Hairpin 1 to 70 Ascent' },
      { lat: 11.2858, lng: 78.3414, name: 'Semmedu & Agaya Gangai Falls' }
    ]
  },
  {
    id: 'bike-spiti-extreme',
    slug: 'spiti-trans-himalayan-bike-expedition',
    title: 'Spiti Valley Motorcycle Safari: Crossing Kunzum & Chicham',
    fromCity: 'Shimla',
    toCity: 'Manali',
    distanceKm: 980,
    idealDays: 8,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    difficulty: 'Hardcore Explorer',
    bestSeason: 'June to September',
    recommendedBikes: ['Royal Enfield Himalayan 450', 'Hero XPulse 200 Pro', 'KTM 390 Adventure Rally', 'Triumph Scrambler 400X'],
    estimatedFuelLitres: 38,
    estimatedCost: 18500,
    permitsRequired: 'Inner Line Permit for non-Indian passport holders beyond Reckong Peo',
    mechanicsFrequency: 'Mechanics available in Rampur, Reckong Peo and Kaza only. Malling Nallah & Batal have zero assistance.',
    safetyChecklist: [
      'High ground clearance bike is essential for water crossings at Batal & Chhatru',
      'Spare tube, levers, and chain lube (spray every 250km of dusty gravel)',
      'Keep extra 5L Jerry can of petrol from Kaza (longest stretch without petrol pumps)'
    ],
    recommendedGear: [
      'Gore-Tex waterproof touring jacket & pants',
      'Dual-sport offroad helmet with goggle strap',
      'Heavy-duty engine bash plate and knuckle guards'
    ],
    routeCoordinates: [
      { lat: 31.1048, lng: 77.1734, name: 'Shimla Departure' },
      { lat: 31.5376, lng: 78.2588, name: 'Kalpa Kinner Kailash view' },
      { lat: 31.8808, lng: 78.6272, name: 'Nako Lake' },
      { lat: 32.2461, lng: 78.0349, name: 'Kaza Town Base' },
      { lat: 32.4042, lng: 77.6358, name: 'Kunzum Pass (14,931 ft)' },
      { lat: 32.2432, lng: 77.1892, name: 'Manali via Atal Tunnel' }
    ]
  }
];
