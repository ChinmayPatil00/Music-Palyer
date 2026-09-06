import { DESTINATIONS } from '@/data/destinations';
import { TREKS } from '@/data/treks';
import { SAFARIS } from '@/data/safaris';
import { Destination, RecommendationResult, TripPlanRequest } from '@/types';
import { calculateTripCosts } from './cost-engine';
import { convertToINR } from './currency';

export function getRankedRecommendations(req: TripPlanRequest): RecommendationResult[] {
  const travelersTotal = Math.max(1, req.travelers.adults + req.travelers.children);
  const budgetInINR = req.budget.isPerPerson
    ? convertToINR(req.budget.amount * travelersTotal, req.budget.currency)
    : convertToINR(req.budget.amount, req.budget.currency);

  const budgetPerPerson = Math.round(budgetInINR / travelersTotal);
  const tripDays = Math.max(1, req.totalDays || 3);

  let pool: Destination[] = [...DESTINATIONS];

  // If a specific destination was searched, check if it exists in DESTINATIONS.
  // If not, check TREKS and SAFARIS to dynamically create a matching destination entry!
  const targetQuery = (req.destination || '').toLowerCase().trim();
  const isGeneric =
    !targetQuery ||
    targetQuery.includes('anywhere') ||
    targetQuery.includes('surprise') ||
    targetQuery.includes('budget');

  if (!isGeneric) {
    const existsInDest = pool.some(
      (d) =>
        d.name.toLowerCase().includes(targetQuery) ||
        targetQuery.includes(d.name.toLowerCase()) ||
        d.slug.toLowerCase().includes(targetQuery)
    );

    if (!existsInDest) {
      // Check in TREKS
      const trekMatch = TREKS.find(
        (t) =>
          t.title.toLowerCase().includes(targetQuery) ||
          targetQuery.includes(t.title.toLowerCase()) ||
          t.slug.toLowerCase().includes(targetQuery) ||
          t.location.toLowerCase().includes(targetQuery)
      );

      if (trekMatch) {
        const synthesizedTrekDest: Destination = {
          id: trekMatch.id,
          slug: trekMatch.slug,
          name: trekMatch.title,
          region: (trekMatch.state?.includes('Maharashtra') ? 'Western Ghats' : 'Himalayas') as Destination['region'],
          country: trekMatch.country || 'India',
          state: trekMatch.state,
          isInternational: false,
          tagline: `${trekMatch.difficulty} Trek (${trekMatch.distanceKm}km, ${trekMatch.maxAltitudeM}m Altitude)`,
          description: `High-adrenaline trek in ${trekMatch.location}. Best season: ${trekMatch.bestSeason}. Water availability: ${trekMatch.waterAvailability}. Network: ${trekMatch.mobileNetwork}. Starting point: ${trekMatch.startingPoint}.`,
          heroImage: trekMatch.heroImage,
          gallery: [trekMatch.heroImage],
          startingPrice: trekMatch.costPerPerson,
          idealDurationDays: trekMatch.durationDays,
          difficulty: trekMatch.difficulty,
          rating: 4.9,
          reviewCount: 210,
          bestSeason: trekMatch.bestSeason,
          idealMonths: trekMatch.idealMonths || ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          coordinates: trekMatch.coordinates,
          categories: ['TREKKING', 'CAMPING', 'ADVENTURE'],
          popularActivities: ['Summit Sunrise', 'Ridge Trekking', 'Temple Camp', 'Stargazing'],
          travelStyles: ['Trekking', 'Camping', 'Mountains', 'Adventure Sports', 'Nature'],
          transportOptions: ['Car', 'Bike', 'Bus'],
          accommodationTypes: ['Camping', 'Homestay'],
          safetyIndex: (trekMatch.amsRisk !== 'None' ? 'Extreme Caution' : 'Adventure Risk') as Destination['safetyIndex'],
          emergencyFacilities: {
            nearestHospital: `${trekMatch.startingPoint} Medical Center`,
            hospitalContact: '108 / 112',
            nearestPoliceStation: `${trekMatch.state} Police`,
            policeContact: '100 / 112',
            touristHelpline: '1363'
          },
          weatherSummary: {
            currentTempC: 19,
            condition: 'Crisp Mountain Breeze',
            rainProbability: 10,
            windSpeedKmh: 12,
            humidity: 45,
            suitability: 'Ideal'
          },
          highlights: trekMatch.packingList.slice(0, 4),
          budgetTier: 'Budget'
        };
        pool = [synthesizedTrekDest, ...pool];
      } else {
        // Check in SAFARIS
        const safariMatch = SAFARIS.find(
          (s) =>
            s.name.toLowerCase().includes(targetQuery) ||
            targetQuery.includes(s.name.toLowerCase()) ||
            s.slug.toLowerCase().includes(targetQuery) ||
            s.state.toLowerCase().includes(targetQuery)
        );

        if (safariMatch) {
          const synthesizedSafariDest: Destination = {
            id: safariMatch.id,
            slug: safariMatch.slug,
            name: safariMatch.name,
            region: (safariMatch.state?.includes('Rajasthan') ? 'Desert India' : safariMatch.state?.includes('Assam') ? 'Northeast India' : 'Central India') as Destination['region'],
            country: safariMatch.country || 'India',
            state: safariMatch.state,
            isInternational: false,
            tagline: `${safariMatch.parkType} — Habitat of ${safariMatch.wildlifeExpected.slice(0, 3).join(', ')}`,
            description: `Premier wilderness safari in ${safariMatch.state}. Safari modes: ${safariMatch.safariTypes.join(', ')}. Permit info: ${safariMatch.permitRequirement}.`,
            heroImage: safariMatch.heroImage,
            gallery: [safariMatch.heroImage],
            startingPrice: safariMatch.costEstimate * 2,
            idealDurationDays: 3,
            difficulty: 'Easy',
            rating: 4.8,
            reviewCount: 350,
            bestSeason: safariMatch.bestSeason,
            idealMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
            coordinates: safariMatch.coordinates,
            categories: ['JUNGLE SAFARI', 'WILDLIFE', 'PHOTOGRAPHY'],
            popularActivities: ['Morning Gypsy Safari', 'Tiger Tracking', 'Bird Watching', 'Jungle Lodge Stay'],
            travelStyles: ['Jungle Safari', 'Photography', 'Nature', 'Family'],
            transportOptions: ['Flight', 'Car', 'Train'],
            accommodationTypes: ['Resort', 'Hotel', 'Homestay'],
            safetyIndex: 'Moderate Risk' as Destination['safetyIndex'],
            emergencyFacilities: {
              nearestHospital: `${safariMatch.name} Regional Hospital`,
              hospitalContact: '108',
              nearestPoliceStation: `${safariMatch.state} Forest Department`,
              policeContact: '112',
              touristHelpline: '1363'
            },
            weatherSummary: {
              currentTempC: 24,
              condition: 'Dry & Clear Jungle Track',
              rainProbability: 5,
              windSpeedKmh: 8,
              humidity: 35,
              suitability: 'Ideal'
            },
            highlights: safariMatch.wildlifeExpected.slice(0, 4),
            budgetTier: 'Moderate'
          };
          pool = [synthesizedSafariDest, ...pool];
        }
      }
    }
  }

  const scored: RecommendationResult[] = pool.map((dest) => {
    // 1. Budget Match Score
    const costs = calculateTripCosts(
      dest,
      tripDays,
      travelersTotal,
      req.accommodationTypes[0] || 'Hotel',
      req.transportModes[0] || 'Car'
    );

    let budgetScore = 100;
    if (costs.perPerson > budgetPerPerson) {
      const overRatio = costs.perPerson / Math.max(1, budgetPerPerson);
      budgetScore = Math.max(25, Math.round(100 - (overRatio - 1) * 75));
    } else {
      const underRatio = costs.perPerson / Math.max(1, budgetPerPerson);
      if (underRatio < 0.4) budgetScore = 85; // slightly penalize if way too cheap
      else budgetScore = 95 + Math.round((underRatio - 0.4) * 5);
    }

    // 2. Adventure & Travel Style Match
    let matchedStyles = 0;
    if (req.travelStyles && req.travelStyles.length > 0) {
      req.travelStyles.forEach((style) => {
        if (dest.travelStyles.some((s) => s.toLowerCase().includes(style.toLowerCase()))) {
          matchedStyles++;
        }
      });
      matchedStyles = Math.min(req.travelStyles.length, matchedStyles);
    }
    const adventureScore = req.travelStyles.length > 0
      ? Math.min(100, Math.round((matchedStyles / req.travelStyles.length) * 100))
      : 80;

    // 3. Difficulty Match
    let difficultyScore = 85;
    if (req.difficulty === dest.difficulty) {
      difficultyScore = 100;
    } else if (
      (req.difficulty === 'Easy' && dest.difficulty === 'Extreme') ||
      (req.difficulty === 'Extreme' && dest.difficulty === 'Easy')
    ) {
      difficultyScore = 50;
    } else {
      difficultyScore = 80;
    }

    // 4. Season Match (Current or future months)
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const isGoodSeason = dest.idealMonths.includes(currentMonth) || dest.idealMonths.length >= 6;
    const seasonScore = isGoodSeason ? 95 : 75;

    // 5. Travel Time / Duration Match
    const durationDiff = Math.abs(dest.idealDurationDays - tripDays);
    const travelTimeScore = Math.max(50, 100 - durationDiff * 10);

    // Filter by destination search query if specified and not 'anywhere' or 'surprise'
    let isDirectTarget = false;
    let isRegionalMatch = false;

    if (
      req.destination &&
      !req.destination.toLowerCase().includes('anywhere') &&
      !req.destination.toLowerCase().includes('surprise')
    ) {
      const q = req.destination.toLowerCase().trim();
      const destName = dest.name.toLowerCase();
      const words = q.split(/[\s,–—()/-]+/).filter((w) => w.length > 2);
      const destWords = destName.split(/[\s,–—()/-]+/).filter((w) => w.length > 2);
      const matchedToken = words.some((w) => destWords.includes(w) || destName.includes(w) || dest.slug.toLowerCase().includes(w));

      if (
        destName.includes(q) ||
        q.includes(destName) ||
        dest.slug.toLowerCase().includes(q) ||
        (dest.state && dest.state.toLowerCase().includes(q)) ||
        matchedToken
      ) {
        isDirectTarget = true;
      } else if (dest.region.toLowerCase().includes(q) || dest.country.toLowerCase().includes(q)) {
        isRegionalMatch = true;
      }
    }

    // Overall Weighted Score
    let overall = Math.min(
      96,
      Math.round(
        budgetScore * 0.35 +
          adventureScore * 0.25 +
          seasonScore * 0.15 +
          difficultyScore * 0.15 +
          travelTimeScore * 0.10
      )
    );

    if (isDirectTarget) {
      overall = 98; // Guarantees user-selected destination is ranked #1
    } else if (isRegionalMatch) {
      overall = Math.min(94, overall + 15);
    }

    // Construct human-readable reasoning
    let reason = isDirectTarget
      ? `Primary match for your chosen destination ${dest.name}. Itinerary, stay rates, and route customized to your specifications.`
      : `High match for ${dest.difficulty.toLowerCase()} pace and fits within your planned budget of ₹${budgetPerPerson.toLocaleString('en-IN')}/person.`;

    if (isGoodSeason && !isDirectTarget) {
      reason += ` Current season is prime for ${dest.name}.`;
    }
    if (matchedStyles > 0 && !isDirectTarget) {
      reason += ` Aligns with your interests in ${req.travelStyles.slice(0, 2).join(' and ')}.`;
    }

    return {
      destination: dest,
      matchScore: overall,
      breakdown: {
        budgetMatch: isDirectTarget ? 98 : budgetScore,
        adventureMatch: isDirectTarget ? 96 : adventureScore,
        seasonMatch: seasonScore,
        difficultyMatch: difficultyScore,
        travelTimeMatch: travelTimeScore
      },
      estimatedTotalCost: costs.total,
      estimatedCostPerPerson: costs.perPerson,
      reason,
      suggestedDuration: `${dest.idealDurationDays} Days / ${Math.max(1, dest.idealDurationDays - 1)} Nights`
    };
  });

  // Sort descending by matchScore (direct target matches will always be at the top)
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export interface BudgetFinderCategories {
  bestMatch: RecommendationResult;
  cheapestOption: RecommendationResult;
  mostAdventurous: RecommendationResult;
  mostScenic: RecommendationResult;
  hiddenGem: RecommendationResult;
}

export function getBudgetTravelBuckets(
  budgetINR: number,
  fromLocation: string = 'Pune',
  people: number = 2,
  days: number = 3
): BudgetFinderCategories {
  const req: TripPlanRequest = {
    fromLocation,
    destination: 'Anywhere within my budget',
    departureDate: '',
    returnDate: '',
    flexibleDates: true,
    totalDays: days,
    travelers: { adults: people, children: 0, infants: 0, partyType: people === 1 ? 'Solo' : 'Group' },
    budget: { amount: budgetINR, isPerPerson: false, currency: 'INR' },
    travelStyles: ['Trekking', 'Camping', 'Road Trip', 'Nature'],
    difficulty: 'Moderate',
    transportModes: ['Car', 'Bike'],
    accommodationTypes: ['Homestay', 'Camping', 'Hotel'],
    preferences: ['Cheapest possible', 'Scenic route', 'Local experiences']
  };

  const allRecommendations = getRankedRecommendations(req);

  // Filter those strictly within or very near budget
  const affordable = allRecommendations.filter(
    (r) => r.estimatedTotalCost <= budgetINR * 1.15
  );

  const pool = affordable.length >= 5 ? affordable : allRecommendations;

  // 1. Best Match: Highest overall score
  const bestMatch = pool[0];

  // 2. Cheapest: lowest total cost
  const cheapestOption = [...pool].sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost)[0];

  // 3. Most Adventurous: highest adventureMatch & difficulty
  const mostAdventurous = [...pool]
    .filter((r) => r.destination.id !== bestMatch.destination.id)
    .sort((a, b) => b.breakdown.adventureMatch - a.breakdown.adventureMatch)[0] || pool[1];

  // 4. Most Scenic: Western Ghats / Himalayas / Nature focus
  const mostScenic = [...pool]
    .filter(
      (r) =>
        r.destination.id !== bestMatch.destination.id &&
        r.destination.id !== cheapestOption.destination.id &&
        (r.destination.region === 'Western Ghats' ||
          r.destination.region === 'Himalayas' ||
          r.destination.categories.includes('CAMPING'))
    )[0] || pool[2];

  // 5. Hidden Gem: isLesserKnown flagged or rating >= 4.8
  const hiddenGem = [...pool]
    .filter(
      (r) =>
        r.destination.isLesserKnown ||
        r.destination.id === 'dest-gandikota' ||
        r.destination.id === 'dest-bhandardara' ||
        r.destination.id === 'dest-chopta' ||
        r.destination.id === 'dest-ziro'
    )[0] || pool[3];

  return {
    bestMatch,
    cheapestOption,
    mostAdventurous,
    mostScenic,
    hiddenGem
  };
}
