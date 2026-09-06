export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: 'North India' | 'South India' | 'West India' | 'East India' | 'Northeast India' | 'Central India' | 'Himalayas' | 'Western Ghats' | 'Coastal India' | 'Desert India' | 'Asia' | 'Europe' | 'Middle East' | 'Africa' | 'North America' | 'South America' | 'Oceania';
  country: string;
  state?: string;
  isInternational: boolean;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  startingPrice: number; // in INR
  idealDurationDays: number;
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Extreme';
  rating: number;
  reviewCount: number;
  bestSeason: string;
  idealMonths: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  categories: string[];
  popularActivities: string[];
  travelStyles: string[];
  transportOptions: ('Flight' | 'Train' | 'Bus' | 'Car' | 'Bike' | 'Self-drive' | 'Taxi')[];
  accommodationTypes: ('Hostel' | 'Hotel' | 'Homestay' | 'Resort' | 'Camping' | 'Luxury' | 'Budget')[];
  safetyIndex: 'High Safety' | 'Moderate Risk' | 'Adventure Risk' | 'Extreme Caution';
  emergencyFacilities: {
    nearestHospital: string;
    hospitalContact: string;
    nearestPoliceStation: string;
    policeContact: string;
    touristHelpline: string;
  };
  weatherSummary: {
    currentTempC: number;
    condition: string;
    rainProbability: number;
    windSpeedKmh: number;
    humidity: number;
    suitability: 'Ideal' | 'Good' | 'Fair' | 'Caution' | 'Unfavorable';
  };
  highlights: string[];
  budgetTier: 'Budget' | 'Moderate' | 'Premium' | 'Luxury';
  isLesserKnown?: boolean;
}

export interface TrekExperience {
  id: string;
  slug: string;
  title: string;
  location: string;
  state: string;
  country: string;
  heroImage: string;
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Extreme';
  distanceKm: number;
  elevationGainM: number;
  maxAltitudeM: number;
  durationDays: number;
  costPerPerson: number; // in INR
  bestSeason: string;
  idealMonths: string[];
  fitnessRequirement: 'Beginner' | 'Moderate Cardio' | 'High Stamina' | 'Endurance Athlete';
  campingAvailable: boolean;
  guideRequired: boolean;
  familyFriendly: boolean;
  beginnerFriendly: boolean;
  amsRisk: 'None' | 'Low' | 'Moderate' | 'High';
  waterAvailability: 'Abundant Natural Springs' | 'Campsite Only' | 'Carry Own 3L+' | 'Filtered Streams';
  mobileNetwork: 'Airtel & Jio (4G)' | 'Airtel Only (Patchy)' | 'Emergency SOS Only' | 'No Mobile Signal';
  permitRequired: string;
  startingPoint: string;
  howToReach: string;
  packingList: string[];
  safetyPrecautions: string[];
  nearbyAttractions: string[];
  coordinates: { lat: number; lng: number };
  elevationProfile: {
    distanceKm: number;
    elevationM: number;
    stageName: string;
  }[];
}

export interface RoadTrip {
  id: string;
  slug: string;
  title: string;
  fromCity: string;
  toCity: string;
  viaStops: string[];
  totalDistanceKm: number;
  drivingHours: number;
  idealDays: number;
  estimatedFuelCost: number; // for standard petrol car
  estimatedTolls: number;
  heroImage: string;
  rating: number;
  difficulty: 'Easy Cruiser' | 'Moderate Twisties' | 'Challenging Passes' | 'Extreme High-Altitude';
  bestSeason: string;
  recommendedVehicle: 'Hatchback / Sedan' | 'SUV / High-Clearance' | '4x4 Required' | 'EV-Friendly';
  scenicHighlights: string[];
  recommendedFoodStops: string[];
  fuelStationFrequency: 'Abundant (<25km)' | 'Moderate (50-70km)' | 'Sparse (>150km - Tank Up)';
  routeCoordinates: { lat: number; lng: number; name: string }[];
}

export interface BikeTrip {
  id: string;
  slug: string;
  title: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  idealDays: number;
  heroImage: string;
  difficulty: 'Beginner Rider' | 'Intermediate Tourer' | 'Hardcore Explorer' | 'Extreme Iron Butt';
  bestSeason: string;
  recommendedBikes: string[];
  estimatedFuelLitres: number;
  estimatedCost: number;
  permitsRequired: string;
  mechanicsFrequency: string;
  safetyChecklist: string[];
  recommendedGear: string[];
  routeCoordinates: { lat: number; lng: number; name: string }[];
}

export interface SafariExperience {
  id: string;
  slug: string;
  name: string;
  state: string;
  country: string;
  heroImage: string;
  parkType: 'Tiger Reserve' | 'National Park' | 'Wildlife Sanctuary' | 'Bird Sanctuary';
  safariTypes: ('Jeep (4x4 Gypsys)' | 'Canter (20-seater)' | 'Boat Safari' | 'Elephant Safari')[];
  bestSeason: string;
  safariDurationHours: number;
  costEstimate: number;
  permitRequirement: string;
  wildlifeExpected: string[];
  accommodationOptions: string[];
  nearestTransit: string;
  safetyRules: string[];
  coordinates: { lat: number; lng: number };
}

export interface TripPlanRequest {
  fromLocation: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  flexibleDates: boolean;
  totalDays: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
    partyType: 'Solo' | 'Couple' | 'Group' | 'Family';
  };
  budget: {
    amount: number;
    isPerPerson: boolean;
    currency: CurrencyCode;
  };
  travelStyles: string[];
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Extreme';
  transportModes: string[];
  accommodationTypes: string[];
  preferences: string[];
}

export interface RecommendationResult {
  destination: Destination;
  matchScore: number;
  breakdown: {
    budgetMatch: number;
    adventureMatch: number;
    seasonMatch: number;
    difficultyMatch: number;
    travelTimeMatch: number;
  };
  estimatedTotalCost: number;
  estimatedCostPerPerson: number;
  reason: string;
  suggestedDuration: string;
}

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'Travel' | 'Activity' | 'Meal' | 'Stay' | 'Leisure' | 'Sightseeing';
  estimatedCost: number;
  locationName: string;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr?: string;
  title: string;
  summary: string;
  activities: ItineraryActivity[];
}

export interface FullTrip {
  id: string;
  title: string;
  destinationName: string;
  heroImage: string;
  startingLocation: string;
  daysCount: number;
  travelersCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  costs: {
    transport: number;
    stay: number;
    food: number;
    activities: number;
    permits: number;
    emergencyBuffer: number;
  };
  days: ItineraryDay[];
  createdAt: string;
}

export interface UserReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  destinationId: string;
  ratingOverall: number;
  ratings: {
    safety: number;
    valueForMoney: number;
    scenery: number;
    adventure: number;
    accommodation: number;
    accessibility: number;
  };
  comment: string;
  date: string;
  helpfulCount: number;
  travelerType: 'Solo' | 'Couple' | 'Group' | 'Family';
  photos?: string[];
}
