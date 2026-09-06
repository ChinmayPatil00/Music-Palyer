import { Destination, TrekExperience } from '@/types';

export type TransportMedium = 'Train' | 'Bike' | 'Bus' | 'Plane' | 'Car';

export interface TransitOption {
  medium: TransportMedium;
  title: string;
  label: string;
  iconName: 'Train' | 'Bike' | 'Bus' | 'Plane' | 'Car';
  summary: string;
  estimatedDuration: string;
  distanceKm: number;
  routeHighlights: string[];
  costPerPerson: number;
  groupTransitCost: number;
  itemizedCosts: { label: string; amount: number }[];
  nearestHub: {
    name: string;
    type: 'Railway Station' | 'Airport' | 'Bus Terminal' | 'Highway Exit';
    distanceKm: number;
  };
  roadOrTerrainCondition: string;
  proTips: string[];
}

export interface DynamicItineraryCost {
  baseStayAndFood: number;
  activitiesAndPermits: number;
  transitCost: number;
  emergencyBuffer: number;
  totalTripCost: number;
  perPersonCost: number;
  selectedMedium: TransportMedium;
  savingsVsFlight?: number;
}

// Distance approximation between coordinates (Haversine in km)
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Coordinate anchors for standard origins in India
const ORIGIN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 18.922, lng: 72.8347 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 }
};

export function getTransitOptions(
  destination: Destination | (Partial<Destination> & { coordinates: { lat: number; lng: number }; name: string }),
  originCity: string = 'Mumbai',
  travelersCount: number = 2
): TransitOption[] {
  const safePeople = Math.max(1, travelersCount);
  const originCoord = ORIGIN_COORDINATES[originCity] || ORIGIN_COORDINATES['Mumbai'];
  const airDist = calculateHaversineDistance(
    originCoord.lat,
    originCoord.lng,
    destination.coordinates?.lat || 18.922,
    destination.coordinates?.lng || 72.8347
  );

  // Road distance is typically 1.25x - 1.4x of straight line air distance
  const roadDist = Math.max(25, Math.round(airDist * 1.3));
  const slug = (destination.slug || destination.id || '').toLowerCase();
  const name = (destination.name || '').toLowerCase();

  // 1. SPECIFIC CUSTOM CURATED ROUTES FOR ICONIC LOCATIONS
  if (slug.includes('kalavantin') || name.includes('kalavantin')) {
    const isPune = originCity.toLowerCase() === 'pune';
    const bikeDist = isPune ? 110 : 50;
    const carDist = isPune ? 115 : 55;

    return [
      {
        medium: 'Train',
        title: 'Mumbai Suburban / Express Rail + Local Village Auto',
        label: 'Train 🚆',
        iconName: 'Train',
        summary: 'Most cost-effective route: Train to Panvel Junction, followed by a 20-min shared auto or ST bus to Thakurwadi base village.',
        estimatedDuration: isPune ? '2 hrs 45 min' : '1 hr 15 min',
        distanceKm: isPune ? 120 : 52,
        routeHighlights: [
          isPune ? 'Deccan Queen or Pragati Express from Pune to Panvel Station' : 'Harbour Line suburban local or Central Line to Panvel Station (PF 1-4)',
          'Exit Panvel West to the State Transport Bus Depot or auto stand',
          'Catch Thakurwadi direct ST bus (departs 07:30, 09:15, 11:30 AM) or private 6-seater auto'
        ],
        costPerPerson: isPune ? 220 : 65,
        groupTransitCost: (isPune ? 220 : 65) * safePeople + 150,
        itemizedCosts: [
          { label: 'Train Fare (per ticket)', amount: isPune ? 140 : 20 },
          { label: 'Connecting Local Auto/Bus to Thakurwadi Base', amount: 150 }
        ],
        nearestHub: {
          name: 'Panvel Junction Railway Station (PNVL)',
          type: 'Railway Station',
          distanceKm: 15
        },
        roadOrTerrainCondition: 'Smooth rail journey; asphalt village road from Panvel to Thakurwadi.',
        proTips: [
          'Board morning trains before 07:00 AM to reach Thakurwadi base before sunrise heat.',
          'Note down the driver contact number for the return auto from Thakurwadi village.'
        ]
      },
      {
        medium: 'Bike',
        title: 'Old Mumbai-Pune Highway (NH48) Sahyadri Ride',
        label: 'Bike 🏍️',
        iconName: 'Bike',
        summary: 'Thrilling two-wheeler ride through Shedung Toll bypass directly into Thakurwadi village parking.',
        estimatedDuration: isPune ? '2 hrs 30 min' : '1 hr 20 min',
        distanceKm: bikeDist,
        routeHighlights: [
          isPune ? 'Ride down Bhor Ghat / Khandala twisties via Old Highway NH48' : 'Ride via Sion-Panvel Expressway, pass Kalamboli circle onto Old NH48',
          'Take sharp left turn after Shedung Phata towards Thakurwadi village',
          'Follow the scenic village road past Prabalmachi valley view'
        ],
        costPerPerson: Math.round(((bikeDist / 35) * 105) / Math.min(2, safePeople)),
        groupTransitCost: Math.round((bikeDist / 35) * 105 * Math.ceil(safePeople / 2)),
        itemizedCosts: [
          { label: 'Petrol (estimated 35 km/L @ ₹105/L)', amount: Math.round((bikeDist / 35) * 105 * Math.ceil(safePeople / 2)) },
          { label: 'Thakurwadi Base Bike Parking Fee', amount: 30 * Math.ceil(safePeople / 2) }
        ],
        nearestHub: {
          name: 'Shedung Toll Exit (NH48)',
          type: 'Highway Exit',
          distanceKm: 7
        },
        roadOrTerrainCondition: 'Expressway is 4-lane; last 6 km is a winding single-lane paved rural road with minor potholes.',
        proTips: [
          'Two-wheelers are NOT permitted on Mumbai-Pune Expressway — always stick to the parallel Old NH48.',
          'Secure parking is available at Thakurwadi base village managed by local villagers (₹30).'
        ]
      },
      {
        medium: 'Bus',
        title: 'State Transport (MSRTC) Express + Local Feeder',
        label: 'Bus 🚌',
        iconName: 'Bus',
        summary: 'Direct MSRTC bus to Panvel Central Bus Depot, followed by connecting rural bus to Thakurwadi.',
        estimatedDuration: isPune ? '3 hrs 15 min' : '1 hr 45 min',
        distanceKm: isPune ? 118 : 55,
        routeHighlights: [
          'Board any Shivneri or Asiad bus from Pune/Mumbai to Panvel ST Stand',
          'Switch to the local Thakurwadi Village MSRTC red bus at Bay #4',
          'De-board at the end of the line directly at the trek starting gate'
        ],
        costPerPerson: isPune ? 280 : 90,
        groupTransitCost: (isPune ? 280 : 90) * safePeople,
        itemizedCosts: [
          { label: 'Intercity Bus Ticket', amount: isPune ? 220 : 60 },
          { label: 'Local Village Feeder Bus', amount: 30 }
        ],
        nearestHub: {
          name: 'Panvel ST Bus Stand',
          type: 'Bus Terminal',
          distanceKm: 14
        },
        roadOrTerrainCondition: 'State Highway + asphalt rural connection.',
        proTips: [
          'Morning buses to Thakurwadi run at 07:30 AM and 09:15 AM from Panvel depot.',
          'If you miss the ST bus, shared Tum-Tum autos are readily available outside the depot.'
        ]
      },
      {
        medium: 'Car',
        title: 'Personal Car / Self-Drive via Expressway Shedung Exit',
        label: 'Car 🚗',
        iconName: 'Car',
        summary: 'Comfortable air-conditioned drive directly to the trailhead parking lot at Thakurwadi.',
        estimatedDuration: isPune ? '2 hrs' : '1 hr',
        distanceKm: carDist,
        routeHighlights: [
          'Mumbai-Pune Expressway to Shedung Toll Plaza',
          'Exit onto Panvel-Matheran Link Road towards Thakurwadi',
          'Park at the demarcated village ground right at the base of the trail'
        ],
        costPerPerson: Math.round(((carDist / 14) * 105 + 135) / safePeople),
        groupTransitCost: Math.round((carDist / 14) * 105 * Math.ceil(safePeople / 4)) + 135,
        itemizedCosts: [
          { label: 'Fuel (estimated 14 km/L @ ₹105/L)', amount: Math.round((carDist / 14) * 105 * Math.ceil(safePeople / 4)) },
          { label: 'Fastag Highway Tolls', amount: 85 },
          { label: 'Village Car Parking Fee', amount: 50 }
        ],
        nearestHub: {
          name: 'Shedung Toll Plaza (Mumbai-Pune Expy)',
          type: 'Highway Exit',
          distanceKm: 6
        },
        roadOrTerrainCondition: 'Expressway tarmac until exit; last stretch is clean rural concrete.',
        proTips: [
          'Leave before 06:30 AM on weekends to avoid morning traffic at Kalamboli junction.',
          'Designated parking lot in Thakurwadi has shade and a security attendant.'
        ]
      },
      {
        medium: 'Plane',
        title: 'Flight into Mumbai (BOM) + Fast Suburban Transfer',
        label: 'Plane ✈️',
        iconName: 'Plane',
        summary: 'For outstation travelers: Fly into Chhatrapati Shivaji Maharaj International Airport (BOM), then take a pre-booked cab to Panvel/Thakurwadi.',
        estimatedDuration: '1 hr 15 min flight + 1 hr 15 min cab',
        distanceKm: 52,
        routeHighlights: [
          'Flight arrival at Mumbai Airport (Terminal 1 or 2)',
          'Pre-booked app cab or prepaid airport taxi via Eastern Freeway & Sion-Panvel Expy',
          'Direct drop-off at Thakurwadi trailhead homestay'
        ],
        costPerPerson: 4200,
        groupTransitCost: 3500 * safePeople + 1400,
        itemizedCosts: [
          { label: 'Domestic Airfare (avg one-way)', amount: 3500 },
          { label: 'Airport Cab Transfer to Base (Shared)', amount: 1400 }
        ],
        nearestHub: {
          name: 'Mumbai International Airport (BOM) / Navi Mumbai Airport (NMIA)',
          type: 'Airport',
          distanceKm: 48
        },
        roadOrTerrainCondition: 'Highway and metropolitan expressway.',
        proTips: [
          'Book early morning flights landing before 08:00 AM to start the climb on the same day.',
          'Consider staying the night at Prabalmachi plateau campsite.'
        ]
      }
    ];
  }

  // 2. SPECIFIC CUSTOM ROUTE FOR LEH LADAKH
  if (slug.includes('ladakh') || name.includes('ladakh')) {
    return [
      {
        medium: 'Plane',
        title: 'Direct Himalayan Flight into Kushok Bakula Rimpochee Airport',
        label: 'Plane ✈️',
        iconName: 'Plane',
        summary: 'The fastest and most dramatic journey: spectacular aerial views of snowbound Himalayan ranges landing at 10,682 ft.',
        estimatedDuration: '1 hr 25 min (from Delhi)',
        distanceKm: 1020,
        routeHighlights: [
          'Early morning flight departure from Delhi (DEL), Mumbai (BOM), or Chandigarh',
          'Scenic flyover across Pir Panjal & Zanskar peaks',
          'Landing at Leh IXL airport followed by mandatory 48-hr acclimatization rest'
        ],
        costPerPerson: 7800,
        groupTransitCost: 7800 * safePeople + 600,
        itemizedCosts: [
          { label: 'Flight Ticket (Air India, IndiGo, SpiceJet)', amount: 7500 },
          { label: 'Airport Taxi to Leh Main Bazaar / Hotel', amount: 600 }
        ],
        nearestHub: {
          name: 'Kushok Bakula Rimpochee Airport (IXL)',
          type: 'Airport',
          distanceKm: 4
        },
        roadOrTerrainCondition: 'Airport runway; smooth city roads in Leh.',
        proTips: [
          'Crucial: Book window seat on the left side when flying from Delhi to Leh for views of K2 and Nun Kun.',
          'Do NOT do strenuous activity on Day 1. Drink 4L water to prevent AMS.'
        ]
      },
      {
        medium: 'Bike',
        title: 'Legendary Manali-Leh or Srinagar-Leh Motorcycle Expedition',
        label: 'Bike 🏍️',
        iconName: 'Bike',
        summary: 'Bucket-list trans-Himalayan motorcycle odyssey crossing Khardung La, Baralacha La, and Tanglang La passes.',
        estimatedDuration: '2 to 3 days (Overland ride)',
        distanceKm: 490,
        routeHighlights: [
          'Start from Manali via Atal Tunnel to Jispa / Keylong',
          'Conquer Baralacha La (16,040 ft) and high-altitude Gata Loops (21 hairpin bends)',
          'Traverse More Plains and cross Tanglang La (17,480 ft) into Leh valley'
        ],
        costPerPerson: Math.round(5500 / Math.min(2, safePeople)),
        groupTransitCost: 5500 * Math.ceil(safePeople / 2),
        itemizedCosts: [
          { label: 'Fuel for Himalayan / Royal Enfield (490 km)', amount: 3200 },
          { label: 'High Altitude Transit Homestay (Jispa/Sarchu)', amount: 1500 },
          { label: 'Green Tax & Rohtang Permit', amount: 300 }
        ],
        nearestHub: {
          name: 'Manali Highway Starting Gate',
          type: 'Highway Exit',
          distanceKm: 480
        },
        roadOrTerrainCondition: 'Paved highway, gravel, water crossings (nalas), and high-altitude mountain passes.',
        proTips: [
          'Carry spare clutch cables, tube repair kit, and 5L emergency jerry can fuel.',
          'Never attempt passes after 03:00 PM when glacial water crossings swell.'
        ]
      },
      {
        medium: 'Car',
        title: '4x4 Expedition Overland Drive via Atal Tunnel & Jispa',
        label: 'Car 🚗',
        iconName: 'Car',
        summary: 'Rugged 4x4 or high-ground clearance SUV expedition with panoramic valley views.',
        estimatedDuration: '2 Days (with overnight stop in Jispa)',
        distanceKm: 510,
        routeHighlights: [
          'Manali ➔ Atal Tunnel ➔ Sissu waterfall ➔ Keylong',
          'Overnight halt at Jispa or Darcha riverbank',
          'Cross Baralacha La and Tanglang La into Upshi and Leh'
        ],
        costPerPerson: Math.round(14500 / safePeople),
        groupTransitCost: 14500,
        itemizedCosts: [
          { label: 'Diesel / Fuel (510 km mountain burn)', amount: 8500 },
          { label: 'Overnight Transit Lodge at Jispa', amount: 3000 },
          { label: 'Permits & Mountain Checkpost Fees', amount: 1000 },
          { label: 'Emergency Spares & Fluid Buffer', amount: 2000 }
        ],
        nearestHub: {
          name: 'Upshi Checkpost Junction',
          type: 'Highway Exit',
          distanceKm: 48
        },
        roadOrTerrainCondition: 'High alpine terrain; four-wheel drive recommended.',
        proTips: [
          'Check tire pressure before cold pass crossings.',
          'Fill up completely at Tandi petrol pump — there is no fuel for the next 365 km.'
        ]
      },
      {
        medium: 'Bus',
        title: 'HRTC Mountain Express Bus (Delhi/Manali to Leh)',
        label: 'Bus 🚌',
        iconName: 'Bus',
        summary: 'The world’s highest public bus service operated by Himachal Road Transport Corporation.',
        estimatedDuration: '32 hrs (with overnight acclimatization in Keylong)',
        distanceKm: 1020,
        routeHighlights: [
          'Board overnight HRTC Volvo bus from ISBT Kashmiri Gate Delhi to Manali',
          'Switch to the specialized HRTC Leh bus with overnight dormitory halt in Keylong',
          'Arrive at Leh New Bus Stand'
        ],
        costPerPerson: 2900,
        groupTransitCost: 2900 * safePeople,
        itemizedCosts: [
          { label: 'Delhi to Manali Volvo Fare', amount: 1400 },
          { label: 'Manali to Leh HRTC Bus Fare', amount: 1100 },
          { label: 'Overnight Keylong Halt Dormitory', amount: 400 }
        ],
        nearestHub: {
          name: 'Leh New Bus Stand (Choglamsar)',
          type: 'Bus Terminal',
          distanceKm: 3
        },
        roadOrTerrainCondition: 'Mountain roads with sharp turns and sheer drops.',
        proTips: [
          'Book tickets on the official HRTC portal well in advance (routes open July to September only).'
        ]
      },
      {
        medium: 'Train',
        title: 'Railway to Jammu Tawi / Udhampur + Scenic Shared Mountain Taxi',
        label: 'Train 🚆',
        iconName: 'Train',
        summary: 'Scenic rail journey to the foothills of Jammu/Srinagar, followed by the overland Srinagar-Kargil-Leh highway.',
        estimatedDuration: '14 hrs train + 16 hrs road transit',
        distanceKm: 720,
        routeHighlights: [
          'Superfast or Vande Bharat Express to Jammu Tawi (JAT) or Udhampur (UHP)',
          'Connecting tempo traveler or shared cab via Banihal Tunnel to Srinagar',
          'Scenic Srinagar to Leh drive via Sonamarg, Zoji La Pass, Dras, and Kargil'
        ],
        costPerPerson: 3600,
        groupTransitCost: 3600 * safePeople,
        itemizedCosts: [
          { label: 'Train 3AC Fare to Jammu Tawi', amount: 1600 },
          { label: 'Shared Mountain Taxi (Jammu-Srinagar-Leh)', amount: 2000 }
        ],
        nearestHub: {
          name: 'Jammu Tawi Railway Station (JAT)',
          type: 'Railway Station',
          distanceKm: 700
        },
        roadOrTerrainCondition: 'Paved national highway until Zoji La; mountain passes onwards.',
        proTips: [
          'Srinagar route is much gentler on acclimatization compared to the steep Manali route.'
        ]
      }
    ];
  }

  // 3. GENERAL DYNAMIC ENGINE FOR ALL OTHER DESTINATIONS & TREKS
  const trainDist = Math.max(40, roadDist);
  const trainHours = Math.max(1, Math.round(trainDist / 55));
  const bikeHours = Math.max(1, Math.round(roadDist / 45));
  const carHours = Math.max(1, Math.round(roadDist / 60));
  const busHours = Math.max(1, Math.round(roadDist / 40));

  // Costs calculation
  const train3AcFare = Math.max(450, Math.round(trainDist * 1.4));
  const bikeFuelCost = Math.max(250, Math.round((roadDist / 35) * 105));
  const carFuelCost = Math.max(600, Math.round((roadDist / 14) * 105));
  const carTolls = Math.max(100, Math.round((roadDist / 100) * 120));
  const busTicketFare = Math.max(220, Math.round(roadDist * 1.1));
  const flightFare = Math.max(3200, Math.round(1800 + airDist * 2.8));
  const flightCab = 800;

  return [
    {
      medium: 'Train',
      title: `Indian Railways Express to nearest Railhead + Local Transfer`,
      label: 'Train 🚆',
      iconName: 'Train',
      summary: `Relaxed and budget-conscious rail connectivity from ${originCity} to the nearest junction, followed by local bus/taxi to ${destination.name}.`,
      estimatedDuration: `${trainHours} hrs ${trainHours > 4 ? '' : '30 min'}`,
      distanceKm: trainDist,
      routeHighlights: [
        `Board Express / Superfast or Vande Bharat Train from ${originCity}`,
        `Arrive at the nearest rail junction`,
        `Direct connecting taxi, state transport bus, or shared auto to your destination`
      ],
      costPerPerson: train3AcFare,
      groupTransitCost: train3AcFare * safePeople + 300,
      itemizedCosts: [
        { label: 'Train 3AC / Chair Car Ticket (per person)', amount: train3AcFare },
        { label: 'Connecting Station Transfer (Shared)', amount: 300 }
      ],
      nearestHub: {
        name: `Nearest Junction Railway Station`,
        type: 'Railway Station',
        distanceKm: 25
      },
      roadOrTerrainCondition: 'Comfortable broad-gauge rail transit with confirmed berth booking.',
      proTips: [
        'Book 30–60 days in advance on IRCTC or use Tatkal quota for last-minute trips.',
        'Carry a light shawl and earplugs for comfortable AC coaches.'
      ]
    },
    {
      medium: 'Bike',
      title: `Two-Wheeler Road Expedition from ${originCity}`,
      label: 'Bike 🏍️',
      iconName: 'Bike',
      summary: `Pure freedom on two wheels: scenic ghat roads, open expressways, and photo stops along the highway to ${destination.name}.`,
      estimatedDuration: `${bikeHours} hrs`,
      distanceKm: roadDist,
      routeHighlights: [
        `Departure from ${originCity} early morning (05:30 AM) to beat city traffic`,
        `Scenic highway cruise with dhaba chai stops every 80 km`,
        `Arrival and dedicated bike parking at ${destination.name}`
      ],
      costPerPerson: Math.round(bikeFuelCost / Math.min(2, safePeople)),
      groupTransitCost: bikeFuelCost * Math.ceil(safePeople / 2),
      itemizedCosts: [
        { label: `Petrol (estimated 35 km/L @ ₹105/L for ${roadDist}km)`, amount: bikeFuelCost * Math.ceil(safePeople / 2) },
        { label: 'Maintenance & Chain Lube Buffer', amount: 150 }
      ],
      nearestHub: {
        name: 'State / National Highway Exit',
        type: 'Highway Exit',
        distanceKm: 8
      },
      roadOrTerrainCondition: 'National & State Highways with scenic twisties in mountain/coastal sections.',
      proTips: [
        'Wear full CE-certified riding jacket, gloves, and knee guards.',
        'Top up tire air pressure and clean chain before departing.'
      ]
    },
    {
      medium: 'Bus',
      title: `Intercity AC Sleeper or State Transport Express`,
      label: 'Bus 🚌',
      iconName: 'Bus',
      summary: `Overnight or day-time bus travel from ${originCity} directly to the local central bus terminus.`,
      estimatedDuration: `${busHours} hrs`,
      distanceKm: roadDist,
      routeHighlights: [
        `Board intercity AC Sleeper or KSRTC/MSRTC/HRTC bus from ${originCity}`,
        `Comfortable reclining sleeper berth with scheduled dinner halts`,
        `Early morning arrival at the main town bus terminal`
      ],
      costPerPerson: busTicketFare,
      groupTransitCost: busTicketFare * safePeople,
      itemizedCosts: [
        { label: 'Bus Ticket Fare (per person)', amount: busTicketFare },
        { label: 'Local Auto/Taxi from Bus Stand', amount: 150 }
      ],
      nearestHub: {
        name: 'Central Bus Stand / ST Depot',
        type: 'Bus Terminal',
        distanceKm: 10
      },
      roadOrTerrainCondition: 'Smooth highway cruise with state road link.',
      proTips: [
        'Choose upper berths for less noise, or lower berths for extra stability on ghat curves.',
        'Keep warm jacket accessible inside your cabin bag.'
      ]
    },
    {
      medium: 'Car',
      title: `Personal Car / Self-Drive via Highway & Tollways`,
      label: 'Car 🚗',
      iconName: 'Car',
      summary: `Maximum flexibility: pack your gear, travel at your own pace, and stop at viewpoints en route to ${destination.name}.`,
      estimatedDuration: `${carHours} hrs`,
      distanceKm: roadDist,
      routeHighlights: [
        `Scenic highway drive via National Highway from ${originCity}`,
        `Fastag toll crossings with clean highway food plazas`,
        `Door-to-door arrival with direct resort / campsite parking`
      ],
      costPerPerson: Math.round((carFuelCost + carTolls) / safePeople),
      groupTransitCost: carFuelCost * Math.ceil(safePeople / 4) + carTolls,
      itemizedCosts: [
        { label: `Fuel (estimated 14 km/L @ ₹105/L for ${roadDist}km)`, amount: carFuelCost * Math.ceil(safePeople / 4) },
        { label: 'Fastag Highway Tolls', amount: carTolls },
        { label: 'Secure Parking Buffer', amount: 100 }
      ],
      nearestHub: {
        name: 'Expressway Bypass Toll Exit',
        type: 'Highway Exit',
        distanceKm: 5
      },
      roadOrTerrainCondition: 'High-speed 4-to-6 lane highways leading to scenic regional roads.',
      proTips: [
        'Keep Fastag recharged with minimum ₹1,000 balance.',
        'Download offline maps on Google Maps or MapMyIndia for low network pockets.'
      ]
    },
    {
      medium: 'Plane',
      title: `Domestic / Regional Flight + Airport Cab Transfer`,
      label: 'Plane ✈️',
      iconName: 'Plane',
      summary: `Fastest travel option for long distances: fly into the nearest commercial airport, followed by an app cab or pre-booked taxi.`,
      estimatedDuration: `${Math.round(airDist / 450) + 1} hr flight + 1 hr cab`,
      distanceKm: airDist,
      routeHighlights: [
        `Direct or 1-stop flight from ${originCity} to the nearest airport`,
        `Baggage collection and pre-paid airport taxi counter`,
        `Scenic final drive directly to your hotel or trailhead`
      ],
      costPerPerson: flightFare,
      groupTransitCost: flightFare * safePeople + flightCab,
      itemizedCosts: [
        { label: 'Flight Ticket (per passenger)', amount: flightFare },
        { label: 'Airport Taxi Transfer (Shared)', amount: flightCab }
      ],
      nearestHub: {
        name: 'Nearest Domestic / Regional Airport',
        type: 'Airport',
        distanceKm: 45
      },
      roadOrTerrainCondition: 'Airport tarmac and metropolitan connecting highways.',
      proTips: [
        'Check-in online 24 hrs in advance to pick window seats.',
        'Keep liquids under 100ml in cabin baggage and carry government photo ID.'
      ]
    }
  ];
}

export function calculateItineraryCostWithTransit(
  basePricePerPerson: number,
  days: number,
  travelers: number,
  selectedTransit: TransitOption,
  allTransitOptions: TransitOption[]
): DynamicItineraryCost {
  const safeDays = Math.max(1, days);
  const safePeople = Math.max(1, travelers);

  // Base stay & food estimates
  const dailyStayPerPerson = Math.round((basePricePerPerson * 0.4) / safeDays);
  const dailyFoodPerPerson = 600;
  const baseStayAndFood = (dailyStayPerPerson + dailyFoodPerPerson) * safeDays * safePeople;

  // Activities, entry tickets, permits
  const activitiesAndPermits = Math.round(basePricePerPerson * 0.35 * safePeople);

  // Transit total
  const transitCost = selectedTransit.groupTransitCost;

  // Subtotal and emergency buffer
  const subtotal = baseStayAndFood + activitiesAndPermits + transitCost;
  const emergencyBuffer = Math.round(subtotal * 0.10);
  const totalTripCost = subtotal + emergencyBuffer;
  const perPersonCost = Math.round(totalTripCost / safePeople);

  // Calculate savings compared to flight
  const flightOption = allTransitOptions.find((t) => t.medium === 'Plane');
  let savingsVsFlight: number | undefined;
  if (flightOption && selectedTransit.medium !== 'Plane') {
    const flightTotal = baseStayAndFood + activitiesAndPermits + flightOption.groupTransitCost;
    const flightGrandTotal = flightTotal + Math.round(flightTotal * 0.10);
    savingsVsFlight = Math.max(0, flightGrandTotal - totalTripCost);
  }

  return {
    baseStayAndFood,
    activitiesAndPermits,
    transitCost,
    emergencyBuffer,
    totalTripCost,
    perPersonCost,
    selectedMedium: selectedTransit.medium,
    savingsVsFlight
  };
}
