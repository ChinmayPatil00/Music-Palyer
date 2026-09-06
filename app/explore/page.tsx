'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Compass, 
  Search, 
  SlidersHorizontal, 
  Filter, 
  X, 
  ArrowUpDown 
} from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import DestinationCard from '@/components/destination-card';

const CATEGORIES = [
  'ALL',
  'TREKS',
  'BIKE RIDES',
  'ROAD TRIPS',
  'JUNGLE SAFARIS',
  'CAMPING',
  'BEACH ESCAPES',
  'MOUNTAIN ESCAPES',
  'WATER SPORTS',
  'WILDLIFE',
  'DESERT ADVENTURES',
  'SNOW ADVENTURES',
  'BACKPACKING',
  'WEEKEND GETAWAYS',
  'INTERNATIONAL ADVENTURES',
  'BUDGET DESTINATIONS',
  'HIDDEN GEMS'
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'ALL';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState(100000);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'duration'>('rating');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: DESTINATIONS.length };
    CATEGORIES.forEach((cat) => {
      if (cat === 'ALL') return;
      const sel = cat.toUpperCase();
      const count = DESTINATIONS.filter((d) => {
        if (sel === 'HIDDEN GEMS') return !!d.isLesserKnown;
        if (sel === 'INTERNATIONAL ADVENTURES') return !!d.isInternational;
        return d.categories.some((c) => {
          const cUpper = c.toUpperCase();
          return (
            cUpper === sel ||
            cUpper.includes(sel) ||
            sel.includes(cUpper) ||
            (sel === 'JUNGLE SAFARIS' && (cUpper.includes('SAFARI') || cUpper.includes('WILDLIFE'))) ||
            (sel === 'WILDLIFE' && (cUpper.includes('WILDLIFE') || cUpper.includes('SAFARI'))) ||
            (sel === 'WATER SPORTS' && (cUpper.includes('WATER') || cUpper.includes('SCUBA') || cUpper.includes('RAFTING'))) ||
            (sel === 'DESERT ADVENTURES' && cUpper.includes('DESERT')) ||
            (sel === 'BEACH ESCAPES' && cUpper.includes('BEACH')) ||
            (sel === 'MOUNTAIN ESCAPES' && cUpper.includes('MOUNTAIN')) ||
            (sel === 'ROAD TRIPS' && cUpper.includes('ROAD')) ||
            (sel === 'BIKE RIDES' && (cUpper.includes('BIKE') || cUpper.includes('RIDE')))
          );
        });
      }).length;
      counts[cat] = count;
    });
    return counts;
  }, []);

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          (d.state && d.state.toLowerCase().includes(q)) ||
          d.country.toLowerCase().includes(q) ||
          d.popularActivities.some((a) => a.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Category
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'HIDDEN GEMS' && !d.isLesserKnown) return false;
        else if (selectedCategory === 'INTERNATIONAL ADVENTURES' && !d.isInternational) return false;
        else {
          const sel = selectedCategory.toUpperCase();
          const matches = d.categories.some((c) => {
            const cat = c.toUpperCase();
            return (
              cat === sel ||
              cat.includes(sel) ||
              sel.includes(cat) ||
              (sel === 'JUNGLE SAFARIS' && (cat.includes('SAFARI') || cat.includes('WILDLIFE'))) ||
              (sel === 'WILDLIFE' && (cat.includes('WILDLIFE') || cat.includes('SAFARI'))) ||
              (sel === 'WATER SPORTS' && (cat.includes('WATER') || cat.includes('SCUBA') || cat.includes('RAFTING'))) ||
              (sel === 'DESERT ADVENTURES' && cat.includes('DESERT')) ||
              (sel === 'BEACH ESCAPES' && cat.includes('BEACH')) ||
              (sel === 'MOUNTAIN ESCAPES' && cat.includes('MOUNTAIN')) ||
              (sel === 'ROAD TRIPS' && cat.includes('ROAD')) ||
              (sel === 'BIKE RIDES' && (cat.includes('BIKE') || cat.includes('RIDE')))
            );
          });
          if (!matches) return false;
        }
      }

      // Region
      if (selectedRegion !== 'ALL' && d.region !== selectedRegion) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'ALL' && d.difficulty !== selectedDifficulty) {
        return false;
      }

      // Budget
      if (d.startingPrice > maxBudget) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'priceDesc') return b.startingPrice - a.startingPrice;
      if (sortBy === 'duration') return b.idealDurationDays - a.idealDurationDays;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedRegion, selectedDifficulty, maxBudget, sortBy]);

  return (
    <div className="space-y-8">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition shadow-sm ${
              selectedCategory.toUpperCase() === cat.toUpperCase()
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                selectedCategory.toUpperCase() === cat.toUpperCase()
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {categoryCounts[cat] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl bg-white p-5 shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by city, state, activity, peak..."
              className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Controls: Region, Difficulty, Sort */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Region */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              <option value="Himalayas">Himalayas</option>
              <option value="Western Ghats">Western Ghats</option>
              <option value="Coastal India">Coastal India</option>
              <option value="Desert India">Desert India</option>
              <option value="Northeast India">Northeast India</option>
              <option value="Asia">International (Asia)</option>
              <option value="Europe">International (Europe)</option>
            </select>

            {/* Difficulty */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase">Max Starting Budget:</span>
            <span className="font-black text-emerald-700 text-sm">
              ₹{maxBudget.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={2500}
            max={100000}
            step={2500}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full sm:w-64 accent-emerald-600"
          />
        </div>
      </div>

      {/* Destinations Grid Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900">{filteredDestinations.length}</strong> destinations
        </span>
      </div>

      {/* Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <Compass className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No matching destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your budget slider, clearing search keywords, or selecting &quot;ALL&quot; categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedRegion('ALL');
              setSelectedDifficulty('ALL');
              setMaxBudget(100000);
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Global Directory</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Explore Adventure Destinations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse treks, motorcycle circuits, road trips, safaris and coastal getaways.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Loading destinations...</div>}>
          <ExploreContent />
        </Suspense>
      </div>
    </div>
  );
}
