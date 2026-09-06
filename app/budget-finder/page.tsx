'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Wallet, 
  MapPin, 
  Users, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  PieChart, 
  Star, 
  Award, 
  DollarSign, 
  Flame, 
  Mountain, 
  Gem,
  CheckCircle2
} from 'lucide-react';
import { getBudgetTravelBuckets, BudgetFinderCategories } from '@/lib/recommendation-engine';
import { calculateTripCosts } from '@/lib/cost-engine';

function BudgetFinderContent() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get('from') || 'Pune';
  const initialBudget = Number(searchParams.get('budget')) || 10000;
  const initialPeople = Number(searchParams.get('travelers')) || 2;
  const initialDays = Number(searchParams.get('days')) || 3;

  const [fromCity, setFromCity] = useState(initialFrom);
  const [budget, setBudget] = useState(initialBudget);
  const [people, setPeople] = useState(initialPeople);
  const [days, setDays] = useState(initialDays);
  const [buckets, setBuckets] = useState<BudgetFinderCategories | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = (b = budget, f = fromCity, p = people, d = days) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = getBudgetTravelBuckets(b, f, p, d);
      setBuckets(results);
      setIsSearching(false);
    }, 400);
  };

  useEffect(() => {
    executeSearch(initialBudget, initialFrom, initialPeople, initialDays);
  }, [initialBudget, initialFrom, initialPeople, initialDays]);

  const bucketCards = buckets
    ? [
        {
          key: 'bestMatch',
          title: '1. Best Overall Match',
          desc: 'Highest algorithm score matching your budget, season, and comfort ratio.',
          icon: Award,
          color: 'from-emerald-600 to-teal-600',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          data: buckets.bestMatch
        },
        {
          key: 'cheapestOption',
          title: '2. Cheapest Option',
          desc: 'Maximum savings with rock-bottom transit and local stay costs.',
          icon: DollarSign,
          color: 'from-green-600 to-emerald-700',
          badgeColor: 'bg-green-100 text-green-800',
          data: buckets.cheapestOption
        },
        {
          key: 'mostAdventurous',
          title: '3. Most Adventurous',
          desc: 'Packed with high-adrenaline treks, water sports, and thrilling terrains.',
          icon: Flame,
          color: 'from-amber-600 to-orange-600',
          badgeColor: 'bg-amber-100 text-amber-800',
          data: buckets.mostAdventurous
        },
        {
          key: 'mostScenic',
          title: '4. Most Scenic',
          desc: 'Dramatic valleys, waterfalls, sunset cliffs, and lush green panoramas.',
          icon: Mountain,
          color: 'from-blue-600 to-cyan-600',
          badgeColor: 'bg-blue-100 text-blue-800',
          data: buckets.mostScenic
        },
        {
          key: 'hiddenGem',
          title: '5. Hidden Gem',
          desc: 'Less crowded, off-the-beaten-path trails and authentic rural secrets.',
          icon: Gem,
          color: 'from-purple-600 to-indigo-600',
          badgeColor: 'bg-purple-100 text-purple-800',
          data: buckets.hiddenGem
        }
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="mx-auto max-w-5xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Wallet className="h-3.5 w-3.5 text-emerald-600" />
          <span>Precision Budget Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          &quot;Where Can I Travel With ₹{budget.toLocaleString('en-IN')}?&quot;
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Never let budget hold you back. Enter your starting point and funds — we compute 5 tailored adventure categories with itemized cost splits.
        </p>
      </div>

      {/* Input Search Controls Card */}
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Starting City */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              Starting Location
            </label>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder="e.g. Pune, Mumbai, Bangalore"
              className="mt-1 w-full rounded-2xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5 text-emerald-600" />
              Total Budget (INR ₹)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              step={1000}
              min={2000}
              className="mt-1 w-full rounded-2xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* People */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-indigo-600" />
              Number of People
            </label>
            <div className="mt-1 flex items-center justify-between rounded-2xl border border-slate-300 p-2.5">
              <span className="text-sm font-bold text-slate-900 ml-2">
                {people} {people === 1 ? 'Person' : 'People'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setPeople(people + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              Duration (Days)
            </label>
            <div className="mt-1 flex items-center justify-between rounded-2xl border border-slate-300 p-2.5">
              <span className="text-sm font-bold text-slate-900 ml-2">{days} Days</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setDays(days + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Budget Filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Quick Filters:</span>
            {[3000, 5000, 10000, 15000, 25000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setBudget(amt)}
                className={`rounded-xl border px-3 py-1 text-xs font-bold transition ${
                  budget === amt
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => executeSearch()}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition"
          >
            <span>Recalculate Adventures</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 5 CATEGORY RESULTS */}
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">
            5 Ways to Spend ₹{budget.toLocaleString('en-IN')} from {fromCity} ({days} Days, {people} {people === 1 ? 'person' : 'people'})
          </h2>
        </div>

        {bucketCards.map((b) => {
          const dest = b.data.destination;
          const costs = calculateTripCosts(dest, days, people);
          const Icon = b.icon;

          return (
            <div
              key={b.key}
              className="rounded-3xl bg-white overflow-hidden shadow-xl border border-slate-200 transition hover:border-emerald-300"
            >
              {/* Category Header Strip */}
              <div className={`bg-gradient-to-r ${b.color} px-6 py-3 text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-black text-sm tracking-wide">{b.title}</span>
                </div>
                <span className="text-[11px] font-bold bg-black/20 backdrop-blur-md px-3 py-0.5 rounded-full">
                  Match Score: {b.data.matchScore}%
                </span>
              </div>

              {/* Card Content Grid */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Destination Preview */}
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                    <img src={dest.heroImage} alt={dest.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-[10px] text-emerald-300 font-bold">{dest.region}</span>
                      <h3 className="text-xl font-black">{dest.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{dest.rating}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-semibold">{dest.bestSeason}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">{dest.difficulty}</span>
                  </div>
                </div>

                {/* Middle: Itemized Cost Breakdown */}
                <div className="space-y-3 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0 lg:px-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <PieChart className="h-3.5 w-3.5 text-emerald-600" />
                    Itemized Budget Breakdown
                  </span>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Transportation ({fromCity}):</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.transport.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Accommodation ({days - 1} nights):</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.stay.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Food & Local Dining:</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.food.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Activities & Adventures:</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.activities.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Entry Fees & Permits:</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.permits.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Emergency Buffer (10%):</span>
                      <span className="font-mono font-bold text-slate-900">₹{costs.emergencyBuffer.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Progress Bar of Budget Utilization */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-500">Utilization of ₹{budget.toLocaleString('en-IN')}:</span>
                      <span className="text-emerald-700">
                        {Math.round((costs.total / Math.max(1, budget)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.min(100, Math.round((costs.total / Math.max(1, budget)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Summary & CTA */}
                <div className="flex flex-col justify-between space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Total Cost</div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{costs.total.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      ~₹{costs.perPerson.toLocaleString('en-IN')} / person
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                      <strong>Why Selected:</strong> {b.data.reason}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="w-full rounded-xl border border-slate-300 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Destination Guide
                    </Link>
                    <Link
                      href={`/itinerary/generate?dest=${dest.id}&from=${fromCity}&days=${days}&travelers=${people}`}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
                    >
                      <span>Generate Full Itinerary</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BudgetFinderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 py-20 text-center text-sm font-semibold text-slate-500">Loading Budget Travel Engine...</div>}>
      <BudgetFinderContent />
    </Suspense>
  );
}
