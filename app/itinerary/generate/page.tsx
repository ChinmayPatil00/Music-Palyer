'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Calendar, ArrowLeft, Train, Bike, Bus, Plane, Car, Navigation, Clock, MapPin } from 'lucide-react';
import { FullTrip, Destination } from '@/types';
import { DESTINATIONS } from '@/data/destinations';
import { TREKS } from '@/data/treks';
import { calculateTripCosts } from '@/lib/cost-engine';
import { getTransitOptions, TransportMedium, TransitOption } from '@/lib/transit-engine';
import ItineraryEditor from '@/components/itinerary-editor';
import CostCalculator from '@/components/cost-calculator';

function ItineraryGeneratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destQuery = searchParams.get('dest') || 'dest-ladakh';
  const fromLocation = searchParams.get('from') || 'Pune';
  const daysCount = Number(searchParams.get('days')) || 4;
  const travelersCount = Number(searchParams.get('travelers')) || 2;

  const transportParam = (searchParams.get('transport') as TransportMedium) || 'Train';
  const [selectedTransport, setSelectedTransport] = useState<TransportMedium>(transportParam);
  const [availableTransits, setAvailableTransits] = useState<TransitOption[]>([]);
  const [trip, setTrip] = useState<FullTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find destination or trek
    let dest =
      DESTINATIONS.find((d) => d.id === destQuery || d.slug === destQuery) ||
      DESTINATIONS.find((d) => d.name.toLowerCase().includes(destQuery.toLowerCase()));

    if (!dest) {
      const trekMatch =
        TREKS.find((t) => t.id === destQuery || t.slug === destQuery) ||
        TREKS.find((t) => t.title.toLowerCase().includes(destQuery.toLowerCase()));

      if (trekMatch) {
        dest = {
          id: trekMatch.id,
          slug: trekMatch.slug,
          name: trekMatch.title,
          region: (trekMatch.state?.includes('Maharashtra') ? 'Western Ghats' : 'Himalayas') as Destination['region'],
          country: trekMatch.country || 'India',
          state: trekMatch.state,
          isInternational: false,
          tagline: `${trekMatch.difficulty} Trek (${trekMatch.distanceKm}km, ${trekMatch.maxAltitudeM}m Altitude)`,
          description: `High-adrenaline trek in ${trekMatch.location}. Best season: ${trekMatch.bestSeason}. Water: ${trekMatch.waterAvailability}. Network: ${trekMatch.mobileNetwork}. Starting point: ${trekMatch.startingPoint}.`,
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
      }
    }

    if (!dest) {
      dest = DESTINATIONS[0];
    }

    // Transit options & chosen mode
    const transitOpts = getTransitOptions(dest, fromLocation, travelersCount);
    setAvailableTransits(transitOpts);
    const activeTransit = transitOpts.find((t) => t.medium === selectedTransport) || transitOpts[0];
    const transportTotal = activeTransit.groupTransitCost;

    const baseCosts = calculateTripCosts(dest, daysCount, travelersCount);

    // Build default days
    const activitiesPool = dest.popularActivities;
    const generatedDays = [];

    for (let day = 1; day <= daysCount; day++) {
      if (day === 1) {
        generatedDays.push({
          dayNumber: 1,
          dateStr: `Day 1: Departure via ${activeTransit.medium} to ${dest.name}`,
          title: `Transit from ${fromLocation} to ${dest.name} (${activeTransit.medium})`,
          summary: `${activeTransit.summary} Estimated journey duration: ${activeTransit.estimatedDuration} (${activeTransit.distanceKm} km).`,
          activities: [
            {
              id: `act-${day}-1`,
              time: '07:00 AM',
              title: `Departure from ${fromLocation} (${activeTransit.title})`,
              description: activeTransit.routeHighlights[0] || 'Begin travel according to schedule.',
              category: 'Travel' as const,
              estimatedCost: Math.round(transportTotal * 0.5),
              locationName: fromLocation
            },
            {
              id: `act-${day}-2`,
              time: '11:00 AM',
              title: `${activeTransit.nearestHub.name} Transit & Connecting Hub`,
              description: activeTransit.routeHighlights[1] || `Arrival at ${activeTransit.nearestHub.name}. Connecting transfer to accommodation.`,
              category: 'Travel' as const,
              estimatedCost: Math.round(transportTotal * 0.5),
              locationName: activeTransit.nearestHub.name
            },
            {
              id: `act-${day}-3`,
              time: '02:00 PM',
              title: `Check-in at ${dest.name}`,
              description: 'Check into hotel / campsite, freshen up and relax.',
              category: 'Stay' as const,
              estimatedCost: Math.round(baseCosts.stay / daysCount),
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
              title: 'Welcome Dinner & Local Dining',
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
              title: `Return Journey via ${activeTransit.medium} to ${fromLocation}`,
              description: `Departure from ${dest.name} via ${activeTransit.nearestHub.name} back to ${fromLocation}.`,
              category: 'Travel' as const,
              estimatedCost: Math.round(transportTotal * 0.5),
              locationName: `${dest.name} Departure Hub`
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
              estimatedCost: Math.round(baseCosts.activities / daysCount),
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

    const subtotal = baseCosts.stay + transportTotal + baseCosts.food + baseCosts.activities + baseCosts.permits;
    const emergencyBuffer = Math.round(subtotal * 0.10);
    const grandTotal = subtotal + emergencyBuffer;

    const newTrip: FullTrip = {
      id: `trip-${Date.now()}`,
      title: `${dest.name} ${daysCount}-Day Adventure (${selectedTransport})`,
      destinationName: dest.name,
      heroImage: dest.heroImage,
      startingLocation: fromLocation,
      daysCount,
      travelersCount,
      totalBudget: grandTotal,
      currency: 'INR',
      costs: {
        transport: transportTotal,
        stay: baseCosts.stay,
        food: baseCosts.food,
        activities: baseCosts.activities,
        permits: baseCosts.permits,
        emergencyBuffer: emergencyBuffer
      },
      days: generatedDays,
      createdAt: new Date().toISOString()
    };

    setTrip(newTrip);
    setLoading(false);
  }, [destQuery, fromLocation, daysCount, travelersCount, selectedTransport]);

  if (loading || !trip) {
    return (
      <div className="py-24 text-center space-y-3">
        <Sparkles className="mx-auto h-8 w-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">Synthesizing personalized adventure itinerary...</p>
      </div>
    );
  }

  const currentTransit = availableTransits.find((t) => t.medium === selectedTransport) || availableTransits[0];

  return (
    <div className="space-y-8">
      {/* Selected Transport Mode Interactive Selector */}
      {availableTransits.length > 0 && (
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Navigation className="h-4 w-4" />
                Transit Mode & Itinerary Route
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                How Will I Go: {selectedTransport} Route
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                From {fromLocation}
              </span>
              {currentTransit && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {currentTransit.estimatedDuration} ({currentTransit.distanceKm} km)
                </span>
              )}
            </div>
          </div>

          <div role="tablist" aria-label="Itinerary Transit Mode Selection" className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {availableTransits.map((opt) => {
              const isSelected = opt.medium === selectedTransport;
              return (
                <button
                  key={opt.medium}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Select ${opt.medium} transit: ₹${opt.costPerPerson} per person`}
                  onClick={() => setSelectedTransport(opt.medium)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-black shadow-sm'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-sm">
                    {opt.medium === 'Train' && <Train className="h-4 w-4" />}
                    {opt.medium === 'Bike' && <Bike className="h-4 w-4" />}
                    {opt.medium === 'Bus' && <Bus className="h-4 w-4" />}
                    {opt.medium === 'Plane' && <Plane className="h-4 w-4" />}
                    {opt.medium === 'Car' && <Car className="h-4 w-4" />}
                    <span>{opt.medium}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    ₹{opt.costPerPerson.toLocaleString('en-IN')}/person
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active transit note */}
          {currentTransit && (
            <div className="text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700">
              <span className="leading-snug">
                <strong>Route Summary:</strong> {currentTransit.summary}
              </span>
              <span className="shrink-0 font-mono text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-1 rounded-xl">
                Transit Total: ₹{currentTransit.groupTransitCost.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      )}

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
