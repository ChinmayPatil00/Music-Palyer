import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Mountain, 
  Car, 
  Bike, 
  ShieldCheck, 
  Wallet, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Star, 
  Clock, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import HeroSearchCard from '@/components/hero-search-card';
import DestinationCard from '@/components/destination-card';
import { DESTINATIONS } from '@/data/destinations';
import { TREKS } from '@/data/treks';
import { ROAD_TRIPS } from '@/data/roadtrips';
import { BIKE_TRIPS } from '@/data/biketrips';
import { SAFARIS } from '@/data/safaris';

export default function HomePage() {
  const featuredDestinations = DESTINATIONS.slice(0, 6);
  const featuredTreks = TREKS.slice(0, 4);
  const featuredRoadTrips = ROAD_TRIPS.slice(0, 3);
  const featuredBikeTrips = BIKE_TRIPS.slice(0, 3);
  const featuredSafaris = SAFARIS.slice(0, 3);

  const categories = [
    { label: 'TREKS', icon: '🏔', href: '/treks' },
    { label: 'BIKE RIDES', icon: '🏍', href: '/bike-trips' },
    { label: 'ROAD TRIPS', icon: '🚗', href: '/road-trips' },
    { label: 'JUNGLE SAFARIS', icon: '🦁', href: '/safaris' },
    { label: 'CAMPING', icon: '🏕', href: '/explore?cat=CAMPING' },
    { label: 'BEACH ESCAPES', icon: '🌊', href: '/explore?cat=BEACH%20ESCAPES' },
    { label: 'MOUNTAIN ESCAPES', icon: '⛰', href: '/explore?cat=MOUNTAIN%20ESCAPES' },
    { label: 'WATER SPORTS', icon: '🏄', href: '/explore?cat=WATER%20SPORTS' },
    { label: 'WILDLIFE', icon: '🐅', href: '/safaris' },
    { label: 'DESERT ADVENTURES', icon: '🏜', href: '/explore?cat=DESERT%20ADVENTURES' },
    { label: 'SNOW ADVENTURES', icon: '❄️', href: '/explore?cat=SNOW%20ADVENTURES' },
    { label: 'BACKPACKING', icon: '🎒', href: '/explore?cat=BACKPACKING' },
    { label: 'WEEKEND GETAWAYS', icon: '⚡', href: '/explore?cat=WEEKEND%20GETAWAYS' },
    { label: 'INTERNATIONAL', icon: '✈️', href: '/destinations/international' },
    { label: 'BUDGET DESTINATIONS', icon: '💰', href: '/budget-finder' },
    { label: 'HIDDEN GEMS', icon: '💎', href: '/explore?cat=HIDDEN%20GEMS' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image with dramatic gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2000&q=85"
            alt="Himalayan Adventure Landscape"
            className="h-full w-full object-cover opacity-35 filter brightness-75 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI-Driven Precision Adventure Discovery & Trip Planning</span>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Your Next Adventure <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              Discover treks, road trips, bike rides, safaris, hidden destinations and unforgettable experiences — planned around your budget, time and travel style.
            </p>
          </div>

          {/* Hero Search & Planning Card */}
          <HeroSearchCard />

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Strict Budget Compliance
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Topographical Elevation Profiles
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Overland Route Waypoints & Fuel Estimator
            </span>
          </div>
        </div>
      </section>

      {/* 16 ADVENTURE CATEGORIES CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Browse by Interest</span>
            <h2 className="text-2xl font-black text-slate-900">Explore by Adventure Style</h2>
          </div>
          <Link href="/explore" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-700 hover:shadow-md transition shrink-0 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* "PLAN WITH MY BUDGET" FEATURE HIGHLIGHT BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
              alt="Mountain Canyon"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <Wallet className="h-3.5 w-3.5" />
              Budget Intelligence Finder
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              &quot;Where Can I Travel With ₹10,000?&quot;
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Enter your budget, starting location, and traveler count. TRAVELX instantly segments results into 5 distinct categories: <strong>Best Match, Cheapest Option, Most Adventurous, Most Scenic, and Hidden Gem</strong> with an itemized breakdown.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/budget-finder"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition"
              >
                <span>Find Trips Within My Budget</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/budget-finder?budget=5000&from=Pune"
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Try: Under ₹5,000 from Pune
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Curated Wonders</span>
            <h2 className="text-3xl font-black text-slate-900">Trending Adventures in India & Global</h2>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            <span>Explore All 30+ Destinations</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* TREKKING SPOTLIGHT WITH ELEVATION PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Trailhead Discovery</span>
            <h2 className="text-3xl font-black text-slate-900">Iconic Treks & High-Altitude Summits</h2>
            <p className="text-xs text-slate-500">
              Each trek features an elevation profile, distance metrics, AMS risks, and packing essentials.
            </p>
          </div>
          <Link href="/treks" className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
            <span>View All 16+ Treks</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTreks.map((trek) => (
            <Link
              key={trek.id}
              href={`/treks/${trek.slug}`}
              className="group rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={trek.heroImage}
                    alt={trek.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
                    {trek.difficulty}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-emerald-300 font-bold">{trek.location}</span>
                    <h4 className="text-base font-black truncate">{trek.title}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-50 p-2 text-center text-[10px]">
                    <div>
                      <span className="text-slate-400 block font-bold">Altitude</span>
                      <span className="font-mono font-bold text-slate-800">{trek.maxAltitudeM}m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Distance</span>
                      <span className="font-mono font-bold text-slate-800">{trek.distanceKm}km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Duration</span>
                      <span className="font-mono font-bold text-slate-800">{trek.durationDays}D</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="font-black text-emerald-700">₹{trek.costPerPerson.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{trek.bestSeason}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="w-full rounded-xl bg-slate-900 py-2 text-center text-xs font-bold text-white group-hover:bg-emerald-600 transition">
                  View Elevation & Trail
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ROAD TRIPS & MOTORCYCLE EXPEDITIONS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Overland Expeditions</span>
            <h2 className="text-3xl font-black text-slate-900">Road Trips & Motorcycle Circuits</h2>
            <p className="text-xs text-slate-500">
              Turn-by-turn waypoint maps, fuel requirements, tolls, mechanic points, and packing lists.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/road-trips" className="text-xs font-bold text-emerald-700 hover:underline">
              Road Trips →
            </Link>
            <Link href="/bike-trips" className="text-xs font-bold text-emerald-700 hover:underline">
              Bike Expeditions →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRoadTrips.map((rt) => (
            <div
              key={rt.id}
              className="rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 p-5 space-y-4 hover:shadow-xl transition"
            >
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                <img src={rt.heroImage} alt={rt.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {rt.difficulty}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-base font-black">{rt.title}</h4>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Distance & Drive:</span>
                  <span className="font-mono font-bold text-slate-900">{rt.totalDistanceKm} km (~{rt.drivingHours} hrs)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Fuel Estimate:</span>
                  <span className="font-mono font-bold text-emerald-700">₹{rt.estimatedFuelCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Recommended Rig:</span>
                  <span className="font-bold text-slate-800">{rt.recommendedVehicle}</span>
                </div>
              </div>

              <Link
                href="/road-trips"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Plan Overland Route
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* JUNGLE SAFARIS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Wildlife & Sanctuaries</span>
            <h2 className="text-3xl font-black text-slate-900">Tiger Reserves & National Parks</h2>
          </div>
          <Link href="/safaris" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <span>Explore All Parks</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSafaris.map((saf) => (
            <div
              key={saf.id}
              className="rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 p-5 space-y-4 hover:shadow-xl transition"
            >
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                <img src={saf.heroImage} alt={saf.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                  {saf.parkType}
                </span>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] text-emerald-300 font-bold">{saf.state}</span>
                  <h4 className="text-base font-black">{saf.name}</h4>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Expected Wildlife:</span>
                <div className="flex flex-wrap gap-1">
                  {saf.wildlifeExpected.slice(0, 3).map((w) => (
                    <span key={w} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/safaris"
                className="block w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-600 transition"
              >
                View Safari Booking Guide
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA: START PLANNING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="mx-auto max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Ready For The Trail?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Tell us your starting point and budget. <br />
              We will find the adventure.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Join thousands of trekkers, motorcyclists, road-trippers, and solo explorers discovering unforgettable budget-friendly adventures.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/plan"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-4 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition"
            >
              <span>Launch 10-Step Trip Planner</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/budget-finder"
              className="rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-4 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
            >
              Plan With My Budget
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
