import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/data/destinations';
import { ItineraryDay, FullTrip } from '@/types';
import { calculateTripCosts } from '@/lib/cost-engine';

export async function POST(request: Request) {
  try {
    const {
      destinationId,
      destinationName,
      fromLocation = 'Pune',
      days = 3,
      travelers = 2,
      travelStyle = 'Adventure'
    } = await request.json();

    const dest =
      DESTINATIONS.find((d) => d.id === destinationId || d.slug === destinationId) ||
      DESTINATIONS.find((d) => d.name.toLowerCase().includes((destinationName || '').toLowerCase())) ||
      DESTINATIONS[0];

    const costs = calculateTripCosts(dest, days, travelers, 'Hotel', 'Car');

    const generatedDays: ItineraryDay[] = [];
    const activitiesPool = dest.popularActivities || ['Local Exploration', 'Sunset Viewpoint', 'Cafe Trail', 'Nature Walk'];

    for (let day = 1; day <= days; day++) {
      if (day === 1) {
        generatedDays.push({
          dayNumber: 1,
          dateStr: `Day 1: Arrival & ${dest.name} Exploration`,
          title: `Journey from ${fromLocation} to ${dest.name}`,
          summary: `Depart early, reach ${dest.name}, check into your accommodation, enjoy local regional cuisine and catch a scenic sunset point.`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '07:00 AM',
              title: `Departure from ${fromLocation}`,
              description: `Begin early drive or transit to avoid rush-hour highway traffic.`,
              category: 'Travel',
              estimatedCost: Math.round(costs.transport / days),
              locationName: `${fromLocation} Transit Point`
            },
            {
              id: `act-${day}-2`,
              time: '10:30 AM',
              title: 'Highway Breakfast & Coffee Stop',
              description: 'Authentic local breakfast and stretching break along the route.',
              category: 'Meal',
              estimatedCost: 250 * travelers,
              locationName: 'Highway Refreshment Point'
            },
            {
              id: `act-${day}-3`,
              time: '01:30 PM',
              title: `Check-in & Welcome to ${dest.name}`,
              description: `Check into your stay, freshen up and enjoy local hospitality.`,
              category: 'Stay',
              estimatedCost: Math.round(costs.stay / days),
              locationName: `${dest.name} Eco Stay`
            },
            {
              id: `act-${day}-4`,
              time: '04:30 PM',
              title: activitiesPool[0] || 'Sunset Viewpoint Trail',
              description: `Head out to experience ${activitiesPool[0] || 'the legendary sunset'}. Bring cameras for golden hour.`,
              category: 'Activity',
              estimatedCost: Math.round(costs.activities / (days * 2)),
              locationName: `${dest.name} Scenic Point`
            },
            {
              id: `act-${day}-5`,
              time: '08:00 PM',
              title: 'Traditional Dinner & Night Vibe',
              description: 'Savor regional specialties and unwind under clear night skies.',
              category: 'Meal',
              estimatedCost: 350 * travelers,
              locationName: 'Local Heritage Restaurant'
            }
          ]
        });
      } else if (day === days) {
        generatedDays.push({
          dayNumber: day,
          dateStr: `Day ${day}: Sunrise & Return Journey`,
          title: `Final Morning & Return to ${fromLocation}`,
          summary: `Capture early morning views, shop for local artisanal souvenirs, check out and journey back safely.`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '06:00 AM',
              title: 'Dawn Sunrise & Photography Walk',
              description: 'Witness morning mist lifting over valleys or ocean horizon.',
              category: 'Sightseeing',
              estimatedCost: 0,
              locationName: `${dest.name} Sunrise Ridge`
            },
            {
              id: `act-${day}-2`,
              time: '08:30 AM',
              title: 'Hearty Farewell Breakfast',
              description: 'Fresh regional morning breakfast and tea.',
              category: 'Meal',
              estimatedCost: 250 * travelers,
              locationName: 'Stay Dining Hall'
            },
            {
              id: `act-${day}-3`,
              time: '11:00 AM',
              title: 'Local Craft & Souvenir Markets',
              description: 'Pick up authentic local spices, handicrafts, or organic teas.',
              category: 'Leisure',
              estimatedCost: 500,
              locationName: `${dest.name} Main Bazaar`
            },
            {
              id: `act-${day}-4`,
              time: '01:30 PM',
              title: `Departure back towards ${fromLocation}`,
              description: `Scenic return drive with memorable photo stops along the way.`,
              category: 'Travel',
              estimatedCost: Math.round(costs.transport / days),
              locationName: 'Highway Return Corridor'
            }
          ]
        });
      } else {
        const actIndex = ((day - 2) % (activitiesPool.length - 1)) + 1;
        const mainActivity = activitiesPool[actIndex] || activitiesPool[0];

        generatedDays.push({
          dayNumber: day,
          dateStr: `Day ${day}: Deep Adventure & Exploration`,
          title: `Active Immersion: ${mainActivity}`,
          summary: `Full day dedicated to core adventure activities: ${mainActivity}, wilderness trails and local culture.`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '07:30 AM',
              title: 'Energizing Morning Breakfast',
              description: 'Fuel up for high adventure with fresh fruit, eggs/poha, and coffee.',
              category: 'Meal',
              estimatedCost: 200 * travelers,
              locationName: 'Base Camp Cafe'
            },
            {
              id: `act-${day}-2`,
              time: '09:00 AM',
              title: mainActivity,
              description: `Guided excursion into ${mainActivity}. Follow safety instructions and equipment guidelines.`,
              category: 'Activity',
              estimatedCost: Math.round(costs.activities / days),
              locationName: `${dest.name} Activity Arena`
            },
            {
              id: `act-${day}-3`,
              time: '01:30 PM',
              title: 'Rustic Village Trail Lunch',
              description: 'Locally-sourced hot thali or picnic meal by the waterfall/stream.',
              category: 'Meal',
              estimatedCost: 300 * travelers,
              locationName: 'Village Trailhead Dhaba'
            },
            {
              id: `act-${day}-4`,
              time: '04:00 PM',
              title: 'Cave Exploration / Lakeside Kayaking',
              description: 'Secondary adventure session exploring hidden water bodies or geological formations.',
              category: 'Sightseeing',
              estimatedCost: 200 * travelers,
              locationName: 'Natural Reserve'
            },
            {
              id: `act-${day}-5`,
              time: '07:30 PM',
              title: 'Campfire, Barbecue & Stargazing',
              description: 'Gather around the bonfire, exchange travel stories, and gaze at the Milky Way.',
              category: 'Stay',
              estimatedCost: 300 * travelers,
              locationName: 'Campsite Lounge'
            }
          ]
        });
      }
    }

    const trip: FullTrip = {
      id: `trip-${Date.now()}`,
      title: `${dest.name} ${days}-Day Adventure Itinerary`,
      destinationName: dest.name,
      heroImage: dest.heroImage,
      startingLocation: fromLocation,
      daysCount: days,
      travelersCount: travelers,
      totalBudget: costs.total,
      currency: 'INR',
      costs: {
        transport: costs.transport,
        stay: costs.stay,
        food: costs.food,
        activities: costs.activities,
        permits: costs.permits,
        emergencyBuffer: costs.emergencyBuffer
      },
      days: generatedDays,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      trip
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate itinerary' },
      { status: 400 }
    );
  }
}
