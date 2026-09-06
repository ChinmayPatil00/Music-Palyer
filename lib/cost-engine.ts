import { Destination } from '@/types';

export interface CostBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  permits: number;
  emergencyBuffer: number;
  total: number;
  perPerson: number;
}

export function calculateTripCosts(
  destination: Destination,
  days: number,
  people: number,
  accommodationTier: string = 'Hotel',
  transportMode: string = 'Car'
): CostBreakdown {
  const safeDays = Math.max(1, days);
  const safePeople = Math.max(1, people);
  const baseDayCost = destination.startingPrice / Math.max(2, destination.idealDurationDays);

  // Transportation estimate based on mode & distance
  let transportMultiplier = 0.25;
  if (transportMode.toLowerCase().includes('flight')) transportMultiplier = 0.45;
  else if (transportMode.toLowerCase().includes('bike')) transportMultiplier = 0.18;
  else if (transportMode.toLowerCase().includes('bus') || transportMode.toLowerCase().includes('train')) transportMultiplier = 0.15;
  else if (transportMode.toLowerCase().includes('self-drive') || transportMode.toLowerCase().includes('car')) transportMultiplier = 0.28;

  // Accommodation multiplier
  let stayMultiplier = 0.30;
  if (accommodationTier.toLowerCase().includes('hostel') || accommodationTier.toLowerCase().includes('camping') || accommodationTier.toLowerCase().includes('budget')) {
    stayMultiplier = 0.20;
  } else if (accommodationTier.toLowerCase().includes('luxury') || accommodationTier.toLowerCase().includes('resort')) {
    stayMultiplier = 0.50;
  }

  const dailyFoodPerPerson = 600; // INR
  const totalFood = dailyFoodPerPerson * safeDays * safePeople;
  
  const estimatedStay = Math.round(baseDayCost * stayMultiplier * safeDays * Math.ceil(safePeople / 2));
  const estimatedTransport = Math.round(baseDayCost * transportMultiplier * safeDays * safePeople + 1500);
  const estimatedActivities = Math.round(baseDayCost * 0.20 * safeDays * safePeople);
  const estimatedPermits = destination.isInternational ? 2500 * safePeople : 300 * safePeople;
  
  const subtotal = estimatedStay + estimatedTransport + totalFood + estimatedActivities + estimatedPermits;
  const emergencyBuffer = Math.round(subtotal * 0.10); // 10% emergency buffer
  const total = subtotal + emergencyBuffer;
  const perPerson = Math.round(total / safePeople);

  return {
    transport: estimatedTransport,
    stay: estimatedStay,
    food: totalFood,
    activities: estimatedActivities,
    permits: estimatedPermits,
    emergencyBuffer,
    total,
    perPerson
  };
}

export function calculateFuel(
  distanceKm: number,
  mileageKmL: number = 15,
  fuelPricePerL: number = 104
): { litresNeeded: number; totalCost: number } {
  const safeMileage = Math.max(3, mileageKmL);
  const litresNeeded = Math.round((distanceKm / safeMileage) * 10) / 10;
  const totalCost = Math.round(litresNeeded * fuelPricePerL);
  return { litresNeeded, totalCost };
}
