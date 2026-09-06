import { FullTrip, UserReview } from '@/types';

export const INITIAL_SAVED_TRIPS: FullTrip[] = [
  {
    id: 'trip-rajmachi-weekend',
    title: 'Rajgad + Torna Twin Fortress Weekend Expedition',
    destinationName: 'Rajgad Fort & Torna, Pune',
    heroImage: 'https://images.unsplash.com/photo-1596761223940-69230559e867?auto=format&fit=crop&w=1600&q=80',
    startingLocation: 'Pune',
    daysCount: 2,
    travelersCount: 3,
    totalBudget: 9600,
    currency: 'INR',
    costs: {
      transport: 2200,
      stay: 2400,
      food: 2800,
      activities: 1200,
      permits: 200,
      emergencyBuffer: 800
    },
    days: [
      {
        dayNumber: 1,
        dateStr: 'Day 1: Base Village Ascent & Fortress Camping',
        title: 'Pune to Gunjavane -> Ridge Ascent to Padmavati Citadel',
        summary: 'Early morning departure from Pune, breakfast at Nasrapur, ascent via Chor Darwaja, explore Balekilla and pitch tents near Padmavati temple.',
        activities: [
          {
            id: 'act-101',
            time: '06:30 AM',
            title: 'Departure from Pune (Swargate / Kothrud)',
            description: 'Pack daypacks with 3L water each. Take NH48 towards Bhor.',
            category: 'Travel',
            estimatedCost: 800,
            locationName: 'Pune to Gunjavane Village'
          },
          {
            id: 'act-102',
            time: '08:00 AM',
            title: 'Traditional Maharashtrian Breakfast',
            description: 'Hot Poha, Misal Pav and Chai at base dhaba.',
            category: 'Meal',
            estimatedCost: 350,
            locationName: 'Gunjavane Base Village'
          },
          {
            id: 'act-103',
            time: '09:00 AM',
            title: 'Start Trek via Chor Darwaza Trail',
            description: 'Steady ascent along rocky plateau and forest ridge. Stunning Sahyadri valleys below.',
            category: 'Activity',
            estimatedCost: 100,
            locationName: 'Chor Darwaza Trail'
          },
          {
            id: 'act-104',
            time: '01:30 PM',
            title: 'Camp Arrival & Rural Lunch at Padmavati Temple',
            description: 'Reach summit plateau. Hot Pithla Bhakri and Thecha arranged with local village cooks.',
            category: 'Meal',
            estimatedCost: 600,
            locationName: 'Padmavati Temple Complex'
          },
          {
            id: 'act-105',
            time: '04:30 PM',
            title: 'Suvela Machi & Nedhe (Rock Needle Eye) Exploration',
            description: 'Hike along the dramatic eastern fortification to the iconic natural wind hole.',
            category: 'Sightseeing',
            estimatedCost: 0,
            locationName: 'Suvela Machi'
          },
          {
            id: 'act-106',
            time: '08:00 PM',
            title: 'Bonfire, Stargazing & Camp Dinner',
            description: 'Warm campfire, stargazing under clear skies, hot dinner and tent rest.',
            category: 'Stay',
            estimatedCost: 1200,
            locationName: 'Rajgad High Plateau Campsite'
          }
        ]
      },
      {
        dayNumber: 2,
        dateStr: 'Day 2: Balekilla Sunrise & Safe Descent',
        title: 'Balekilla Summit -> Down to Base & Return Drive',
        summary: 'Scale the highest citadel before dawn, enjoy panoramic sunrise, descend to base village and drive back to Pune.',
        activities: [
          {
            id: 'act-201',
            time: '05:30 AM',
            title: 'Climb Balekilla for Sahyadri Sunrise',
            description: 'Ascend the sheer rock steps with iron railings. Catch the golden dawn over Torna and Bhatghar backwaters.',
            category: 'Activity',
            estimatedCost: 0,
            locationName: 'Balekilla Citadel'
          },
          {
            id: 'act-202',
            time: '08:30 AM',
            title: 'Camp Packup & Breakfast',
            description: 'Leave no trace cleanup. Warm Upma and Black Coffee.',
            category: 'Meal',
            estimatedCost: 300,
            locationName: 'Padmavati Complex'
          },
          {
            id: 'act-203',
            time: '10:00 AM',
            title: 'Controlled Descent to Gunjavane',
            description: 'Mindful footwork down the stone trail back to vehicle parking.',
            category: 'Travel',
            estimatedCost: 0,
            locationName: 'Gunjavane Trail'
          },
          {
            id: 'act-204',
            time: '02:00 PM',
            title: 'Celebratory Post-Trek Thali Lunch',
            description: 'Hearty lunch at Bhor ghatside dhaba before rolling into Pune.',
            category: 'Meal',
            estimatedCost: 900,
            locationName: 'Bhor Highway Rest'
          },
          {
            id: 'act-205',
            time: '04:30 PM',
            title: 'Arrival in Pune',
            description: 'Trip concluded with unforgettable Sahyadri memories.',
            category: 'Travel',
            estimatedCost: 400,
            locationName: 'Pune City'
          }
        ]
      }
    ],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    authorName: 'Rohan Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    destinationId: 'dest-ladakh',
    ratingOverall: 5,
    ratings: {
      safety: 4.5,
      valueForMoney: 4.8,
      scenery: 5.0,
      adventure: 5.0,
      accommodation: 4.2,
      accessibility: 3.8
    },
    comment: 'The Khardung La ride was life-changing! Make sure you take Diamox for AMS on day 1 in Leh. TRAVELX itinerary gave us exact fuel stop calculations which saved us in Nubra!',
    date: 'August 2026',
    helpfulCount: 42,
    travelerType: 'Group'
  },
  {
    id: 'rev-2',
    authorName: 'Pooja Iyer',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    destinationId: 'dest-gokarna',
    ratingOverall: 4.9,
    ratings: {
      safety: 4.9,
      valueForMoney: 5.0,
      scenery: 4.9,
      adventure: 4.6,
      accommodation: 4.5,
      accessibility: 4.7
    },
    comment: 'Did the 5-beach cliff trek with my partner. Paradise beach camping under the stars cost us barely ₹4,200 per person including food! Much cleaner and more peaceful than North Goa.',
    date: 'July 2026',
    helpfulCount: 38,
    travelerType: 'Couple'
  },
  {
    id: 'rev-3',
    authorName: 'Aditya Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    destinationId: 'dest-spiti',
    ratingOverall: 5,
    ratings: {
      safety: 4.2,
      valueForMoney: 4.9,
      scenery: 5.0,
      adventure: 5.0,
      accommodation: 4.0,
      accessibility: 3.5
    },
    comment: 'Spiti Valley is like landing on Mars. Chandratal Lake camping in subzero night winds was pure magic. The elevation profile and packing list on TRAVELX were spot-on.',
    date: 'August 2026',
    helpfulCount: 56,
    travelerType: 'Solo'
  }
];
