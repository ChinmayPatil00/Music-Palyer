import { SafariExperience } from '@/types';

export const SAFARIS: SafariExperience[] = [
  {
    id: 'safari-ranthambore',
    slug: 'ranthambore-tiger-reserve',
    name: 'Ranthambore Tiger Reserve',
    state: 'Rajasthan',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    parkType: 'Tiger Reserve',
    safariTypes: ['Jeep (4x4 Gypsys)', 'Canter (20-seater)'],
    bestSeason: 'October to June (Zones 1-5 peak tiger sightings March-May)',
    safariDurationHours: 3.5,
    costEstimate: 2200,
    permitRequirement: 'Mandatory advance booking via Rajasthan Forest Portal (Zones 1-10 allotted by lottery system)',
    wildlifeExpected: ['Royal Bengal Tiger', 'Indian Leopard', 'Sloth Bear', 'Marsh Crocodile', 'Sambar Deer', 'Chital'],
    accommodationOptions: ['Heritage Palace Hotels', 'Luxury Jungle Lodges', 'Eco Cottages', 'Budget Dhabas'],
    nearestTransit: 'Sawai Madhopur Railway Station (12 km) / Jaipur Airport (160 km)',
    safetyRules: [
      'Strictly prohibited to dismount from the Gypsy or Canter inside park boundaries',
      'Maintain pin-drop silence when tracking pugmarks and alarm calls',
      'No flash photography or drone operation allowed under penalty of law'
    ],
    coordinates: { lat: 26.0173, lng: 76.5026 }
  },
  {
    id: 'safari-jim-corbett',
    slug: 'jim-corbett-national-park',
    name: 'Jim Corbett National Park (Dhikala & Bijrani)',
    state: 'Uttarakhand',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=80',
    parkType: 'Tiger Reserve',
    safariTypes: ['Jeep (4x4 Gypsys)', 'Canter (20-seater)'],
    bestSeason: 'November to June (Dhikala opens Nov 15)',
    safariDurationHours: 4,
    costEstimate: 2800,
    permitRequirement: 'Forest Department Uttarakhand Portal with passport/Aadhaar details',
    wildlifeExpected: ['Wild Asian Elephant Herds', 'Royal Bengal Tiger', 'Gharial Crocodile', 'Otters', 'Over 600 Bird Species'],
    accommodationOptions: ['Historic Dhikala Forest Rest House (Inside Core Zone)', 'Ramnagar Riverside Resorts', 'Budget Homestays'],
    nearestTransit: 'Ramnagar Railway Station (1 km) / Pantnagar Airport (80 km)',
    safetyRules: [
      'Night safaris are prohibited inside the core park',
      'Give elephant herds wide clearance (min 50 meters); never block their migration trails',
      'Smoking or playing music is strictly criminalized'
    ],
    coordinates: { lat: 29.5300, lng: 78.7747 }
  },
  {
    id: 'safari-kaziranga',
    slug: 'kaziranga-national-park',
    name: 'Kaziranga National Park',
    state: 'Assam',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80',
    parkType: 'National Park',
    safariTypes: ['Jeep (4x4 Gypsys)', 'Elephant Safari'],
    bestSeason: 'November to April',
    safariDurationHours: 3,
    costEstimate: 2400,
    permitRequirement: 'Registration at Kohora, Bagori or Agaratoli range forest counters',
    wildlifeExpected: ['Greater One-Horned Rhinoceros', 'Wild Water Buffalo', 'Eastern Swamp Deer', 'Royal Bengal Tiger', 'Gangetic River Dolphin'],
    accommodationOptions: ['Assam Tourism IORA The Retreat', 'Diphlu River Lodge', 'Kohora Jungle Resorts'],
    nearestTransit: 'Guwahati Airport (217 km) / Furkating Railway Station (75 km)',
    safetyRules: [
      'Early morning elephant safari operates from 5:30 AM for closest rhino encounters',
      'Keep arms and cameras inside the vehicle during rhino charges',
      'Do not throw plastic or food scraps'
    ],
    coordinates: { lat: 26.5775, lng: 93.1711 }
  },
  {
    id: 'safari-tadoba',
    slug: 'tadoba-andhari-tiger-reserve',
    name: 'Tadoba Andhari Tiger Reserve (The Real Land of Tigers)',
    state: 'Maharashtra',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    parkType: 'Tiger Reserve',
    safariTypes: ['Jeep (4x4 Gypsys)'],
    bestSeason: 'October to June (Highest sighting rate in April-May around waterholes)',
    safariDurationHours: 4,
    costEstimate: 3200,
    permitRequirement: 'Online booking via Maharashtra Ecotourism 120 days in advance (Moharli, Kolara, Navegaon gates)',
    wildlifeExpected: ['Royal Bengal Tiger (Over 115 tigers)', 'Indian Leopard', 'Dhole (Asiatic Wild Dog Pack)', 'Gaur (Indian Bison)', 'Sloth Bear'],
    accommodationOptions: ['Moharli Lake Safari Resorts', 'Kolara Luxury Safari Tents', 'MTDC Jungle Resort'],
    nearestTransit: 'Nagpur International Airport (140 km) / Chandrapur Railway Station (45 km)',
    safetyRules: [
      'Drivers and registered naturalists must stay on authorized forest paths',
      'Tigers regularly walk on road tracks; turn engine off and remain silent'
    ],
    coordinates: { lat: 20.2444, lng: 79.3023 }
  },
  {
    id: 'safari-gir',
    slug: 'gir-national-park',
    name: 'Gir National Park (Home of the Asiatic Lion)',
    state: 'Gujarat',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=80',
    parkType: 'National Park',
    safariTypes: ['Jeep (4x4 Gypsys)'],
    bestSeason: 'December to April',
    safariDurationHours: 3,
    costEstimate: 2600,
    permitRequirement: 'Gir Online E-Permit system via Gujarat Forest Department',
    wildlifeExpected: ['Asiatic Lion (Only wild habitat on Earth)', 'Indian Leopard', 'Striped Hyena', 'Chousingha (Four-Horned Antelope)', 'Mugger Crocodile'],
    accommodationOptions: ['Sasan Gir Eco Resorts', 'Lion Safari Camp', 'Forest Bungalows'],
    nearestTransit: 'Rajkot Airport (160 km) / Junagadh Railway Station (60 km)',
    safetyRules: [
      'Strictly avoid bright clothing; wear forest khaki/green',
      'No cell phone ringing allowed during trail drive'
    ],
    coordinates: { lat: 21.1243, lng: 70.8242 }
  },
  {
    id: 'safari-kabini',
    slug: 'kabini-nagarhole-tiger-reserve',
    name: 'Kabini & Nagarhole National Park',
    state: 'Karnataka',
    country: 'India',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    parkType: 'Tiger Reserve',
    safariTypes: ['Jeep (4x4 Gypsys)', 'Boat Safari'],
    bestSeason: 'October to May',
    safariDurationHours: 3.5,
    costEstimate: 3500,
    permitRequirement: 'Karnataka Jungle Lodges & Resorts (JLR) or Forest Department counter',
    wildlifeExpected: ['Black Panther (Melanistic Leopard)', 'Wild Asian Elephants', 'Tigers', 'Marsh Crocodiles', 'Smooth-Coated Otters'],
    accommodationOptions: ['Kabini River Luxury Lodges', 'Jungle Lodges & Resorts Kabini', 'Waterwoods Lodge'],
    nearestTransit: 'Mysore Railway Station (80 km) / Bangalore Airport (220 km)',
    safetyRules: [
      'Boat safari on Kabini backwaters requires lifejackets at all times',
      'Keep quiet near riverbanks where elephants come to bathe at dusk'
    ],
    coordinates: { lat: 11.9167, lng: 76.2833 }
  }
];
