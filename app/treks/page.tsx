'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mountain, Compass, Search, Filter, ArrowRight, Footprints } from 'lucide-react';
import { TREKS } from '@/data/treks';

export default function TreksDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [filterBeginnerOnly, setFilterBeginnerOnly] = useState(false);

  const filteredTreks = TREKS.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedDifficulty !== 'ALL' && t.difficulty !== selectedDifficulty) return false;
    if (filterBeginnerOnly && !t.beginnerFriendly) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Mountain className="h-3.5 w-3.5 text-emerald-600" />
          <span>Himalayan & Sahyadri Trailhead Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Trek Finder & Elevation Profiles
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Discover verified trails with full topographical elevation gradients, AMS altitude advisories, water points, and required forest permits.
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
            placeholder="Search trek by peak, state, fort..."
            className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-700"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
          </select>

          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterBeginnerOnly}
              onChange={(e) => setFilterBeginnerOnly(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600"
            />
            <span>Beginner Friendly Only</span>
          </label>
        </div>
      </div>

      {/* Treks Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreks.map((trek) => (
          <div
            key={trek.id}
            className="group rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
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
                  <span className="text-[10px] text-emerald-300 font-bold">{trek.location}, {trek.state}</span>
                  <h3 className="text-lg font-black truncate">{trek.title}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">Max Altitude</span>
                    <span className="font-mono font-black text-slate-900">{trek.maxAltitudeM}m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">Total Dist</span>
                    <span className="font-mono font-black text-slate-900">{trek.distanceKm}km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">Duration</span>
                    <span className="font-mono font-black text-slate-900">{trek.durationDays}D</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Fitness Level:</span>
                    <span className="font-semibold text-slate-900">{trek.fitnessRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Months:</span>
                    <span className="font-semibold text-emerald-700">{trek.bestSeason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Estimate:</span>
                    <span className="font-black text-slate-900">₹{trek.costPerPerson.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={`/treks/${trek.slug}`}
                className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white group-hover:bg-emerald-600 transition"
              >
                <span>View Elevation Profile & Trail</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
