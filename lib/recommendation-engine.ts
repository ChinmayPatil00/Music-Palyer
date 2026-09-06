import { DESTINATIONS } from '@/data/destinations';
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

  const scored: RecommendationResult[] = DESTINATIONS.map((dest) => {
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
    let textMatchBonus = 0;
    if (
      req.destination &&
      !req.destination.toLowerCase().includes('anywhere') &&
      !req.destination.toLowerCase().includes('surprise')
    ) {
      const q = req.destination.toLowerCase().trim();
      const match =
        dest.name.toLowerCase().includes(q) ||
        (dest.state && dest.state.toLowerCase().includes(q)) ||
        dest.country.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q);
      if (match) textMatchBonus = 20;
    }

    // Overall Weighted Score
    const overall = Math.min(
      99,
      Math.round(
        budgetScore * 0.35 +
          adventureScore * 0.25 +
          seasonScore * 0.15 +
          difficultyScore * 0.15 +
          travelTimeScore * 0.10 +
          textMatchBonus
      )
    );

    // Construct human-readable reasoning
    let reason = `High match for ${dest.difficulty.toLowerCase()} pace and fits within your planned budget of ₹${budgetPerPerson.toLocaleString('en-IN')}/person.`;
    if (isGoodSeason) {
      reason += ` Current season is prime for ${dest.name}.`;
    }
    if (matchedStyles > 0) {
      reason += ` Aligns with your interests in ${req.travelStyles.slice(0, 2).join(' and ')}.`;
    }

    return {
      destination: dest,
      matchScore: overall,
      breakdown: {
        budgetMatch: budgetScore,
        adventureMatch: adventureScore,
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

  // Sort descending by matchScore
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
