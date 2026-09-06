import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Thermometer, 
  Wind, 
  Droplets, 
  ArrowRight, 
  Compass, 
  Hotel, 
  Car, 
  Sparkles 
} from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import InteractiveMap from '@/components/interactive-map';
import SafetyDossier from '@/components/safety-dossier';
import TransitPlanner from '@/components/transit-planner';
import FallbackImage from '@/components/fallback-image';

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = DESTINATIONS.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  const mapMarkers = [
    {
      lat: destination.coordinates.lat,
      lng: destination.coordinates.lng,
      title: destination.name,
      type: 'start' as any,
      details: `${destination.name} Central Landmark`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 pb-24 lg:pb-10">
      {/* Hero Banner */}
      <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative bg-slate-900 min-h-[400px] flex items-end">
        <FallbackImage
          src={destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 text-white space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-black uppercase tracking-wider">
              {destination.difficulty}
            </span>
            <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-0.5 text-xs font-bold text-slate-200 border border-white/10">
              {destination.state ? `${destination.state}, ` : ''}{destination.country} • {destination.region}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black">{destination.name}</h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {destination.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 font-medium">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Star className="h-4 w-4 fill-amber-300" />
              {destination.rating} ({destination.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              {destination.idealDurationDays} Days Ideal
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-400" />
              Best: {destination.bestSeason}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold font-mono">
              From ₹{destination.startingPrice.toLocaleString('en-IN')} / person
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols): Overview, Activities, Map, Weather */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Destination Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{destination.description}</p>

            {/* Highlights */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Top Highlights & Landmarks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {destination.highlights.map((h, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-800 border border-slate-200">
                    ★ {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Activities */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Adventures & Things To Do</h3>
            <div className="flex flex-wrap gap-2">
              {destination.popularActivities.map((act) => (
                <span
                  key={act}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-slate-900">Interactive Location Map</h3>
            <InteractiveMap
              center={[destination.coordinates.lat, destination.coordinates.lng]}
              zoom={10}
              markers={mapMarkers}
              height="360px"
            />
          </div>

          {/* Live Weather & Climate Widget */}
          <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-black">Meteorological & Adventure Suitability</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                {destination.weatherSummary.suitability} Suitability
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <span className="text-slate-400 text-[10px] block font-bold">Temperature</span>
                <span className="text-xl font-black font-mono">{destination.weatherSummary.currentTempC}°C</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <span className="text-slate-400 text-[10px] block font-bold">Rain Probability</span>
                <span className="text-xl font-black font-mono">{destination.weatherSummary.rainProbability}%</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <span className="text-slate-400 text-[10px] block font-bold">Wind Speed</span>
                <span className="text-xl font-black font-mono">{destination.weatherSummary.windSpeedKmh} km/h</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <span className="text-slate-400 text-[10px] block font-bold">Humidity</span>
                <span className="text-xl font-black font-mono">{destination.weatherSummary.humidity}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Condition: <strong>{destination.weatherSummary.condition}</strong>
            </p>
          </div>

          {/* Interactive Transit Medium & Dynamic Itinerary Cost Explorer */}
          <TransitPlanner
            destination={destination}
            baseStartingPrice={destination.startingPrice}
            initialDays={destination.idealDurationDays}
            initialTravelers={2}
          />
        </div>

        {/* Right Column (4 Cols): Plan CTAs, Stays, and Safety Dossier */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Action Plan Card */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Budget</span>
              <div className="text-3xl font-black text-emerald-700">
                ₹{destination.startingPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Per Person for {destination.idealDurationDays} Days</span>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/itinerary/generate?dest=${destination.id}&from=Pune&days=${destination.idealDurationDays}&travelers=2`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
              >
                <span>Generate Full Itinerary</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/plan?to=${encodeURIComponent(destination.name)}`}
                className="w-full block rounded-2xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Customize in Trip Wizard
              </Link>
            </div>
          </div>

          {/* Accommodation & Commute summary */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Transit & Stay Options</span>
            <div className="flex items-center gap-2 text-slate-700">
              <Hotel className="h-4 w-4 text-emerald-600" />
              <span>Stays: {destination.accommodationTypes.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Car className="h-4 w-4 text-blue-600" />
              <span>Transit: {destination.transportOptions.join(', ')}</span>
            </div>
          </div>

          {/* Active Safety Dossier */}
          <SafetyDossier
            riskLevel={destination.safetyIndex}
            emergencyFacilities={destination.emergencyFacilities}
            layout="sidebar"
          />
        </div>
      </div>

      {/* Sticky Mobile Floating Action Bar (< lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-700">
              ₹{destination.startingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/ person</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/plan?to=${encodeURIComponent(destination.name)}`}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition min-h-[44px] flex items-center justify-center"
          >
            Customize
          </Link>
          <Link
            href={`/itinerary/generate?dest=${destination.id}&from=Pune&days=${destination.idealDurationDays}&travelers=2`}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 min-h-[44px]"
          >
            <span>Plan Trip</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
