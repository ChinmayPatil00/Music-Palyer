'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Compass
} from 'lucide-react';
import { SAFARIS } from '@/data/safaris';
import FallbackImage from '@/components/fallback-image';

export default function SafarisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParkType, setSelectedParkType] = useState('ALL');

  const filteredSafaris = SAFARIS.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.wildlifeExpected.some((w) => w.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedParkType !== 'ALL' && s.parkType !== selectedParkType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Sanctuaries & Tiger Reserves</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Jungle Safaris & Wildlife Sanctuaries
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Track Royal Bengal Tigers, Asiatic Lions, Greater One-Horned Rhinos, and wild elephant herds across India&apos;s premier bio-reserves.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-5 shadow-md border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by park, animal, state..."
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Tiger Reserve', 'National Park'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedParkType(type)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                selectedParkType === type
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Safaris Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSafaris.map((safari) => (
          <div
            key={safari.id}
            className="group rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <FallbackImage
                  src={safari.heroImage}
                  alt={safari.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-black text-white">
                  {safari.parkType}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-emerald-300 font-bold">{safari.state}, {safari.country}</span>
                  <h3 className="text-xl font-black">{safari.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Safari Modes & Best Season */}
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Best Sighting Season</span>
                    <span className="font-bold text-emerald-700">{safari.bestSeason}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Safari Cost</span>
                    <span className="font-black text-slate-900">₹{safari.costEstimate} / seat</span>
                  </div>
                </div>

                {/* Wildlife checklist */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Key Wildlife:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {safari.wildlifeExpected.map((animal) => (
                      <span
                        key={animal}
                        className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nearest transit */}
                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Nearest Airport / Train</span>
                  <p className="text-slate-700 font-medium leading-snug">{safari.nearestTransit}</p>
                </div>

                {/* Safety Rules */}
                <div className="space-y-1 text-xs text-slate-500">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Core Safety Rules:</span>
                  {safari.safetyRules.slice(0, 2).map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={`/plan?to=${encodeURIComponent(safari.name)}`}
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
              >
                <span>Plan Safari Trip</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
