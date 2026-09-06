'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import DestinationCard from '@/components/destination-card';

const REGIONS = [
  'ALL',
  'Himalayas',
  'Western Ghats',
  'Coastal India',
  'Desert India',
  'Northeast India',
  'North India',
  'South India',
  'Lesser-Known Gems'
];

export default function IndiaDestinationsPage() {
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const indiaDestinations = DESTINATIONS.filter((d) => !d.isInternational);

  const filtered = indiaDestinations.filter((d) => {
    if (selectedRegion === 'ALL') return true;
    if (selectedRegion === 'Lesser-Known Gems') return d.isLesserKnown;
    return d.region === selectedRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>India Adventure Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          India: From Himalayan Passes to Coastal Shores
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Explore trans-Himalayan valleys, monsoon Western Ghats forts, golden Thar sand dunes, and pristine bioluminescent Andaman waters.
        </p>
      </div>

      {/* Regional Selector Pills */}
      <div className="mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {REGIONS.map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setSelectedRegion(reg)}
            className={`rounded-full min-h-[44px] px-5 py-2.5 text-xs font-bold whitespace-nowrap transition ${
              selectedRegion === reg
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filtered.length}</strong> verified adventures in India
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </div>
    </div>
  );
}
