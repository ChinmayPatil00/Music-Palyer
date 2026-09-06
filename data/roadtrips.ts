import { RoadTrip } from '@/types';

export const ROAD_TRIPS: RoadTrip[] = [
  {
    id: 'rt-pune-goa-circuit',
    slug: 'pune-mumbai-goa-gokarna-hampi-circuit',
    title: 'The Great Western Coastal & Heritage Loop',
    fromCity: 'Pune',
    toCity: 'Pune (Loop)',
    viaStops: ['Mumbai', 'Goa', 'Gokarna', 'Hampi'],
    totalDistanceKm: 1420,
    drivingHours: 28,
    idealDays: 7,
    estimatedFuelCost: 11400,
    estimatedTolls: 1850,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    rating: 4.9,
    difficulty: 'Moderate Twisties',
    bestSeason: 'October to March',
    recommendedVehicle: 'SUV / High-Clearance',
    scenicHighlights: [
      'Mumbai-Pune Expressway Western Ghats Vista',
      'NH66 Coastal Highway bridges over Mandovi & Zuari',
      'Om Beach cliff sunset view in Gokarna',
      'Granite boulder sunrises across Tungabhadra in Hampi'
    ],
    recommendedFoodStops: [
      'Kinara Village Dhaba, Lonavala',
      'Fishermans Wharf, Panaji (Fresh Goan Fish Curry)',
      'Namaste Cafe, Om Beach Gokarna',
      'Mango Tree Restaurant, Hampi Bazaar'
    ],
    fuelStationFrequency: 'Abundant (<25km)',
    routeCoordinates: [
      { lat: 18.5204, lng: 73.8567, name: 'Pune (Start Point)' },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai via Expressway' },
      { lat: 15.2993, lng: 74.1240, name: 'Goa (Panaji / Palolem)' },
      { lat: 14.5479, lng: 74.3188, name: 'Gokarna Coastal Stop' },
      { lat: 15.3350, lng: 76.4600, name: 'Hampi Ancient Ruins' },
      { lat: 18.5204, lng: 73.8567, name: 'Pune (Finish Loop)' }
    ]
  },
  {
    id: 'rt-manali-leh',
    slug: 'manali-leh-highway',
    title: 'Manali to Leh Trans-Himalayan Odyssey',
    fromCity: 'Manali',
    toCity: 'Leh',
    viaStops: ['Atal Tunnel', 'Keylong', 'Jispa', 'Baralacha La', 'Sarchu', 'Tanglang La'],
    totalDistanceKm: 472,
    drivingHours: 16,
    idealDays: 3,
    estimatedFuelCost: 5200,
    estimatedTolls: 350,
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
    rating: 4.95,
    difficulty: 'Challenging Passes',
    bestSeason: 'June to September',
    recommendedVehicle: 'SUV / High-Clearance',
    scenicHighlights: [
      'Baralacha La Snow Wall (16,040 ft)',
      'Gata Loops 21 hairpin bends',
      'More Plains 40km straight plateau at 15,000 ft',
      'Tanglang La Pass (17,480 ft)'
    ],
    recommendedFoodStops: [
      'Ibex Hotel Restaurant, Jispa',
      'Sarchu Camp Highway Dhabas (Maggi, Thukpa & Ginger Lemon Tea)',
      'Upshi Riverside Dhaba'
    ],
    fuelStationFrequency: 'Sparse (>150km - Tank Up)',
    routeCoordinates: [
      { lat: 32.2432, lng: 77.1892, name: 'Manali' },
      { lat: 32.5833, lng: 77.1667, name: 'Jispa' },
      { lat: 32.7565, lng: 77.4206, name: 'Baralacha La Pass' },
      { lat: 32.9066, lng: 77.5855, name: 'Sarchu Campsite' },
      { lat: 33.5078, lng: 77.7719, name: 'Tanglang La Pass' },
      { lat: 34.1526, lng: 77.5771, name: 'Leh Ladakh' }
    ]
  },
  {
    id: 'rt-spiti-circuit',
    slug: 'shimla-spiti-manali-circuit',
    title: 'The Legendary Spiti Valley Circular Loop',
    fromCity: 'Shimla',
    toCity: 'Manali',
    viaStops: ['Narkanda', 'Kalpa', 'Nako', 'Tabo', 'Kaza', 'Kunzum Pass', 'Atal Tunnel'],
    totalDistanceKm: 850,
    drivingHours: 24,
    idealDays: 7,
    estimatedFuelCost: 7800,
    estimatedTolls: 400,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    rating: 4.88,
    difficulty: 'Extreme High-Altitude',
    bestSeason: 'June to October',
    recommendedVehicle: '4x4 Required',
    scenicHighlights: [
      'Kinnaur Cliff-Hanger Roads carved into sheer granite',
      'Nako Lake high altitude oasis',
      '1,000-year-old Tabo Monastery murals',
      'Kunzum La (14,931 ft) with Chandratal detachment'
    ],
    recommendedFoodStops: [
      'The Himalayan Cafe, Kaza',
      'Little Tibet Restaurant, Kalpa',
      'Chacha Chachi Dhaba, Batal'
    ],
    fuelStationFrequency: 'Sparse (>150km - Tank Up)',
    routeCoordinates: [
      { lat: 31.1048, lng: 77.1734, name: 'Shimla' },
      { lat: 31.5376, lng: 78.2588, name: 'Kalpa / Kinnaur' },
      { lat: 31.8808, lng: 78.6272, name: 'Nako Village' },
      { lat: 32.0953, lng: 78.3817, name: 'Tabo Monastery' },
      { lat: 32.2461, lng: 78.0349, name: 'Kaza Headquarters' },
      { lat: 32.4042, lng: 77.6358, name: 'Kunzum Pass' },
      { lat: 32.2432, lng: 77.1892, name: 'Manali Finish' }
    ]
  },
  {
    id: 'rt-bangalore-ooty-wayanad',
    slug: 'bangalore-mysore-ooty-wayanad',
    title: 'Nilgiris & Western Ghats Rain Shadow Drive',
    fromCity: 'Bangalore',
    toCity: 'Bangalore',
    viaStops: ['Mysore', 'Bandipur Tiger Reserve', 'Ooty (36 Hairpin Bends)', 'Wayanad', 'Nagarhole'],
    totalDistanceKm: 720,
    drivingHours: 15,
    idealDays: 4,
    estimatedFuelCost: 5900,
    estimatedTolls: 650,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    rating: 4.82,
    difficulty: 'Moderate Twisties',
    bestSeason: 'September to May',
    recommendedVehicle: 'Hatchback / Sedan',
    scenicHighlights: [
      'Wild deer & elephant crossings through Bandipur Forest corridor',
      'The thrilling 36 hairpin bends of Kallatti Ghat to Ooty',
      'Emerald tea carpet plantations in Nilgiris & Wayanad',
      'Banasura Sagar Dam scenic reservoir'
    ],
    recommendedFoodStops: [
      'Mylari Hotel, Mysore (Authentic Butter Dosa)',
      'Nahar Sidewalk Cafe, Ooty',
      'Wilton Restaurant, Sultan Bathery'
    ],
    fuelStationFrequency: 'Abundant (<25km)',
    routeCoordinates: [
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
      { lat: 12.2958, lng: 76.6394, name: 'Mysore Palace City' },
      { lat: 11.6664, lng: 76.6291, name: 'Bandipur Forest Corridor' },
      { lat: 11.4102, lng: 76.6950, name: 'Ooty (Nilgiris Summit)' },
      { lat: 11.6854, lng: 76.1320, name: 'Wayanad Rainforests' },
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore Return' }
    ]
  },
  {
    id: 'rt-rajasthan-royal-desert',
    slug: 'jaipur-jodhpur-jaisalmer-thar-drive',
    title: 'The Golden Sands & Forts Highway (Jaipur to Jaisalmer)',
    fromCity: 'Jaipur',
    toCity: 'Jaisalmer',
    viaStops: ['Ajmer & Pushkar', 'Jodhpur (Blue City)', 'Osian Desert Temples', 'Pokhran', 'Sam Dunes'],
    totalDistanceKm: 610,
    drivingHours: 11,
    idealDays: 4,
    estimatedFuelCost: 5400,
    estimatedTolls: 780,
    heroImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=80',
    rating: 4.85,
    difficulty: 'Easy Cruiser',
    bestSeason: 'October to March',
    recommendedVehicle: 'Hatchback / Sedan',
    scenicHighlights: [
      'Ultra smooth 4-lane desert highway stretches through NH11',
      'Mehrangarh Fort towering over the indigo rooftops of Jodhpur',
      'Golden sunset rolling across Sam Sand Dunes',
      'Peacock sightings along acacia tree roadside buffers'
    ],
    recommendedFoodStops: [
      'Rawat Mishthan Bhandar, Jaipur (Pyaaz Kachori)',
      'Janta Sweet Home, Jodhpur (Mawa Kachori & Mirchi Vada)',
      'Trio Restaurant, Jaisalmer'
    ],
    fuelStationFrequency: 'Abundant (<25km)',
    routeCoordinates: [
      { lat: 26.9124, lng: 75.7873, name: 'Jaipur (Pink City)' },
      { lat: 26.4499, lng: 74.6399, name: 'Pushkar Sacred Lake' },
      { lat: 26.2389, lng: 73.0243, name: 'Jodhpur (Blue City)' },
      { lat: 26.9200, lng: 71.9100, name: 'Pokhran' },
      { lat: 26.9157, lng: 70.9083, name: 'Jaisalmer (Golden Fort & Dunes)' }
    ]
  }
];
