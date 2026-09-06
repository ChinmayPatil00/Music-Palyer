'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Calendar, ArrowLeft } from 'lucide-react';
import { FullTrip } from '@/types';
import { DESTINATIONS } from '@/data/destinations';
import { TREKS } from '@/data/treks';
import { calculateTripCosts } from '@/lib/cost-engine';
import ItineraryEditor from '@/components/itinerary-editor';
import CostCalculator from '@/components/cost-calculator';

function ItineraryGeneratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destQuery = searchParams.get('dest') || 'dest-ladakh';
  const fromLocation = searchParams.get('from') || 'Pune';
  const daysCount = Number(searchParams.get('days')) || 4;
  const travelersCount = Number(searchParams.get('travelers')) || 2;

  const [trip, setTrip] = useState<FullTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find destination or trek
    const dest =
      DESTINATIONS.find((d) => d.id === destQuery || d.slug === destQuery) ||
      DESTINATIONS.find((d) => d.name.toLowerCase().includes(destQuery.toLowerCase())) ||
      DESTINATIONS[0];

    const costs = calculateTripCosts(dest, daysCount, travelersCount);

    // Build default days
    const activitiesPool = dest.popularActivities;
    const generatedDays = [];

    for (let day = 1; day <= daysCount; day++) {
      if (day === 1) {
        generatedDays.push({
          dayNumber: 1,
          dateStr: `Day 1: Departure & Journey to ${dest.name}`,
          title: `Transit from ${fromLocation} to ${dest.name}`,
          summary: `Early departure, scenic rest stop, arrival and check-in at accommodation, followed by an evening sunset point.`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '07:00 AM',
              title: `Departure from ${fromLocation}`,
              description: 'Begin journey early to beat morning traffic.',
              category: 'Travel' as const,
              estimatedCost: Math.round(costs.transport / daysCount),
              locationName: fromLocation
            },
            {
              id: `act-${day}-2`,
              time: '10:30 AM',
              title: 'Highway Breakfast & Coffee',
              description: 'Local traditional snack break.',
              category: 'Meal' as const,
              estimatedCost: 200 * travelersCount,
              locationName: 'Highway Refreshment Point'
            },
            {
              id: `act-${day}-3`,
              time: '02:00 PM',
              title: `Check-in at ${dest.name}`,
              description: 'Check into hotel / campsite, freshen up and relax.',
              category: 'Stay' as const,
              estimatedCost: Math.round(costs.stay / daysCount),
              locationName: `${dest.name} Stay`
            },
            {
              id: `act-${day}-4`,
              time: '05:00 PM',
              title: activitiesPool[0] || 'Sunset Viewpoint Trail',
              description: 'Explore scenic sunset viewpoint with great panoramas.',
              category: 'Sightseeing' as const,
              estimatedCost: 100,
              locationName: `${dest.name} Sunset Point`
            },
            {
              id: `act-${day}-5`,
              time: '08:00 PM',
              title: 'Welcome Dinner & Stargazing',
              description: 'Authentic local cuisine dinner.',
              category: 'Meal' as const,
              estimatedCost: 300 * travelersCount,
              locationName: 'Local Dining'
            }
          ]
        });
      } else if (day === daysCount) {
        generatedDays.push({
          dayNumber: day,
          dateStr: `Day ${day}: Sunrise & Return Journey`,
          title: `Farewell ${dest.name} & Return to ${fromLocation}`,
          summary: 'Morning photo walk, local souvenir shopping, check-out, and return drive.',
          activities: [
            {
              id: `act-${day}-1`,
              time: '06:30 AM',
              title: 'Golden Dawn Photography Walk',
              description: 'Catch sunrise over mountain ridges or ocean horizon.',
              category: 'Sightseeing' as const,
              estimatedCost: 0,
              locationName: `${dest.name} Sunrise Ridge`
            },
            {
              id: `act-${day}-2`,
              time: '09:00 AM',
              title: 'Morning Breakfast & Packing',
              description: 'Checkout from stay.',
              category: 'Meal' as const,
              estimatedCost: 200 * travelersCount,
              locationName: 'Stay Dining'
            },
            {
              id: `act-${day}-3`,
              time: '11:00 AM',
              title: 'Local Spices & Handicrafts Market',
              description: 'Support local artisans and buy regional souvenirs.',
              category: 'Leisure' as const,
              estimatedCost: 500,
              locationName: `${dest.name} Main Market`
            },
            {
              id: `act-${day}-4`,
              time: '01:30 PM',
              title: `Return Transit to ${fromLocation}`,
              description: 'Safe drive or transit home.',
              category: 'Travel' as const,
              estimatedCost: Math.round(costs.transport / daysCount),
              locationName: 'Highway Return Corridor'
            }
          ]
        });
      } else {
        const actIndex = ((day - 2) % (activitiesPool.length - 1)) + 1;
        const mainAct = activitiesPool[actIndex] || activitiesPool[0];

        generatedDays.push({
          dayNumber: day,
          dateStr: `Day ${day}: Adventure & Exploration`,
          title: `Full Adventure Day: ${mainAct}`,
          summary: `Dedicated to core adventure activities: ${mainAct}, outdoor excursions, and local meals.`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '07:30 AM',
              title: 'Energizing Morning Breakfast',
              description: 'Fuel up for full outdoor day.',
              category: 'Meal' as const,
              estimatedCost: 200 * travelersCount,
              locationName: 'Base Camp'
            },
            {
              id: `act-${day}-2`,
              time: '09:00 AM',
              title: mainAct,
              description: `Guided excursion into ${mainAct}. Full safety gear provided.`,
              category: 'Activity' as const,
              estimatedCost: Math.round(costs.activities / daysCount),
              locationName: `${dest.name} Arena`
            },
            {
              id: `act-${day}-3`,
              time: '01:30 PM',
              title: 'Village Trail Lunch',
              description: 'Fresh local food by scenic stream or waterfall.',
              category: 'Meal' as const,
              estimatedCost: 250 * travelersCount,
              locationName: 'Local Dhaba'
            },
            {
              id: `act-${day}-4`,
              time: '04:30 PM',
              title: 'Exploration & Photography',
              description: 'Relaxed hike or boat ride.',
              category: 'Sightseeing' as const,
              estimatedCost: 200,
              locationName: `${dest.name} Reserve`
            },
            {
              id: `act-${day}-5`,
              time: '08:00 PM',
              title: 'Campfire & Dinner',
              description: 'Campfire stories and hot dinner.',
              category: 'Stay' as const,
              estimatedCost: 300 * travelersCount,
              locationName: 'Campsite'
            }
          ]
        });
      }
    }

    const newTrip: FullTrip = {
      id: `trip-${Date.now()}`,
      title: `${dest.name} ${daysCount}-Day Adventure Plan`,
      destinationName: dest.name,
      heroImage: dest.heroImage,
      startingLocation: fromLocation,
      daysCount,
      travelersCount,
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

    setTrip(newTrip);
    setLoading(false);
  }, [destQuery, fromLocation, daysCount, travelersCount]);

  if (loading || !trip) {
    return (
      <div className="py-24 text-center space-y-3">
        <Sparkles className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">Synthesizing personalized adventure itinerary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Editor Component with drag/reorder/print/share */}
      <ItineraryEditor initialTrip={trip} />

      {/* Cost Calculator Section */}
      <CostCalculator
        initialBudget={trip.totalBudget}
        initialCosts={trip.costs}
        travelersCount={trip.travelersCount}
        currency={trip.currency}
      />
    </div>
  );
}

export default function ItineraryGeneratePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/plan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Planner</span>
        </Link>

        <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Loading itinerary...</div>}>
          <ItineraryGeneratorContent />
        </Suspense>
      </div>
    </div>
  );
}
