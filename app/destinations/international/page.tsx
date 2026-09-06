'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Globe, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import DestinationCard from '@/components/destination-card';

const CONTINENTS = ['ALL', 'Asia', 'Europe', 'Budget Friendly (<₹40,000)'];

export default function InternationalDestinationsPage() {
  const [selectedContinent, setSelectedContinent] = useState('ALL');

  const intlDestinations = DESTINATIONS.filter((d) => d.isInternational);

  const filtered = intlDestinations.filter((d) => {
    if (selectedContinent === 'ALL') return true;
    if (selectedContinent === 'Budget Friendly (<₹40,000)') return d.startingPrice <= 40000;
    return d.region === selectedContinent;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Globe className="h-3.5 w-3.5 text-emerald-600" />
          <span>Global Expeditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          International Adventure Discovery
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          From the Ha Giang motorbike loop in Vietnam and active calderas in Bali to the snowbound Caucasus in Georgia and Swiss alpine peaks.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CONTINENTS.map((cont) => (
          <button
            key={cont}
            type="button"
            onClick={() => setSelectedContinent(cont)}
            className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition ${
              selectedContinent === cont
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cont}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filtered.length}</strong> international destinations
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
