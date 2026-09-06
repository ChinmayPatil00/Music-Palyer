'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Train, 
  Bike, 
  Bus, 
  Plane, 
  Car, 
  MapPin, 
  Clock, 
  Navigation, 
  Sparkles, 
  ArrowRight, 
  Fuel, 
  Ticket, 
  ShieldCheck, 
  CheckCircle2,
  TrendingDown,
  Info
} from 'lucide-react';
import { Destination } from '@/types';
import { 
  getTransitOptions, 
  calculateItineraryCostWithTransit, 
  TransportMedium, 
  TransitOption 
} from '@/lib/transit-engine';

interface TransitPlannerProps {
  destination: Destination | (Partial<Destination> & { coordinates: { lat: number; lng: number }; name: string; slug?: string });
  baseStartingPrice?: number;
  initialOrigin?: string;
  initialDays?: number;
  initialTravelers?: number;
  isTrek?: boolean;
}

const ORIGIN_CITIES = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata'];

export default function TransitPlanner({
  destination,
  baseStartingPrice,
  initialOrigin = 'Mumbai',
  initialDays = 3,
  initialTravelers = 2,
  isTrek = false
}: TransitPlannerProps) {
  const [originCity, setOriginCity] = useState(initialOrigin);
  const [selectedMedium, setSelectedMedium] = useState<TransportMedium>('Train');
  const [days, setDays] = useState(Math.max(1, initialDays));
  const [travelers, setTravelers] = useState(Math.max(1, initialTravelers));

  // Compute available transit options for the destination & origin
  const transitOptions = useMemo(() => {
    return getTransitOptions(destination, originCity, travelers);
  }, [destination, originCity, travelers]);

  // Currently active transit option
  const activeOption = useMemo(() => {
    return transitOptions.find((t) => t.medium === selectedMedium) || transitOptions[0];
  }, [transitOptions, selectedMedium]);

  // Live dynamic itinerary cost calculation
  const basePrice = baseStartingPrice || destination.startingPrice || 3500;
  const costReport = useMemo(() => {
    return calculateItineraryCostWithTransit(basePrice, days, travelers, activeOption, transitOptions);
  }, [basePrice, days, travelers, activeOption, transitOptions]);

  const getMediumIcon = (medium: TransportMedium) => {
    switch (medium) {
      case 'Train':
        return <Train className="h-4 w-4" />;
      case 'Bike':
        return <Bike className="h-4 w-4" />;
      case 'Bus':
        return <Bus className="h-4 w-4" />;
      case 'Plane':
        return <Plane className="h-4 w-4" />;
      case 'Car':
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-7">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <Navigation className="h-4 w-4" />
            Transit & How To Reach Engine
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            How Will I Go to {destination.name}?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare route steps, travel time, and see your live trip itinerary cost dynamically adjust.
          </p>
        </div>

        {/* Origin City Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 self-start md:self-auto">
          <MapPin className="h-4 w-4 text-emerald-600 ml-2 shrink-0" />
          <span className="text-xs font-bold text-slate-500">From:</span>
          <select
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
            className="bg-transparent text-xs font-black text-slate-800 focus:outline-none pr-3 py-1 cursor-pointer"
          >
            {ORIGIN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 Medium Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {transitOptions.map((opt) => {
          const isSelected = opt.medium === selectedMedium;
          return (
            <button
              key={opt.medium}
              type="button"
              onClick={() => setSelectedMedium(opt.medium)}
              className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-950 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl mb-1.5 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 group-hover:scale-105 border border-slate-200'
                }`}
              >
                {getMediumIcon(opt.medium)}
              </div>
              <span className="text-xs font-black">{opt.medium}</span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                ₹{opt.costPerPerson.toLocaleString('en-IN')}/head
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mode Details & Stepped Route Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Steps & Logistics (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  {getMediumIcon(activeOption.medium)}
                </span>
                <span className="text-sm font-black text-slate-900">{activeOption.title}</span>
              </div>
              <span className="shrink-0 text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {activeOption.estimatedDuration}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{activeOption.summary}</p>

            {/* Stepped Route Guide */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Step-by-Step Journey Route
              </span>
              <div className="space-y-2">
                {activeOption.routeHighlights.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearest Hub & Road Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              <div className="rounded-xl bg-white p-2.5 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Nearest {activeOption.nearestHub.type}
                </span>
                <span className="font-bold text-slate-800 leading-tight block">
                  {activeOption.nearestHub.name}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block">
                  {activeOption.nearestHub.distanceKm} km to base
                </span>
              </div>

              <div className="rounded-xl bg-white p-2.5 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Road / Track Condition
                </span>
                <span className="text-[11px] text-slate-700 leading-tight block">
                  {activeOption.roadOrTerrainCondition}
                </span>
              </div>
            </div>

            {/* Pro Tips */}
            {activeOption.proTips.length > 0 && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3 text-xs text-amber-900 space-y-1">
                <span className="font-bold text-[11px] flex items-center gap-1 text-amber-800">
                  <Info className="h-3.5 w-3.5" />
                  Transit Pro Tips:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
                  {activeOption.proTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Itinerary Cost Impact Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Live Itinerary Cost
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Via {activeOption.medium}
              </span>
            </div>

            {/* Cost Breakdown with Selected Transit */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Stays & Daily Meals ({days} days):</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{costReport.baseStayAndFood.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Activities, Permits & Guides:</span>
                <span className="font-mono font-bold text-slate-800">
                  ₹{costReport.activitiesAndPermits.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-100/50 p-2 rounded-xl border border-emerald-200/50">
                <span className="flex items-center gap-1.5">
                  {getMediumIcon(activeOption.medium)}
                  <span>Transit via {activeOption.medium} ({travelers} travelers):</span>
                </span>
                <span className="font-mono text-sm">
                  + ₹{costReport.transitCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>10% Safety Buffer (Medical/Fuel):</span>
                <span className="font-mono">
                  ₹{costReport.emergencyBuffer.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Total Grand Cost */}
            <div className="rounded-2xl bg-slate-900 p-4 text-white space-y-2 shadow-md">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Total Estimated Trip Cost
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ₹{costReport.totalTripCost.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Per Traveler</span>
                  <div className="text-base font-black font-mono text-white">
                    ₹{costReport.perPersonCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Savings callout if applicable */}
              {costReport.savingsVsFlight && costReport.savingsVsFlight > 0 ? (
                <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold pt-1 border-t border-white/10">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>
                    Saves ₹{costReport.savingsVsFlight.toLocaleString('en-IN')} vs Flight booking!
                  </span>
                </div>
              ) : null}
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/itinerary/generate?dest=${destination.slug || destination.id}&from=${originCity}&transport=${activeOption.medium}&days=${days}&travelers=${travelers}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
              >
                <span>Generate Itinerary via {activeOption.medium}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/plan?to=${destination.name}`}
                className="w-full block rounded-2xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Customize Group Dates in Wizard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
