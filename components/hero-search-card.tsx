'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, Calendar, Users, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { CurrencyCode } from '@/types';
import { CURRENCY_RATES } from '@/lib/currency';

export default function HeroSearchCard() {
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState('Pune');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(15000);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Defaulting to user's city or GPS detection
          setFromLocation('Current Location (Pune / Mumbai)');
          setIsLocating(false);
        },
        () => {
          setFromLocation('Pune');
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      from: fromLocation || 'Pune',
      to: destination || 'Anywhere',
      travelers: travelers.toString(),
      budget: budget.toString(),
      currency,
      dep: departureDate,
      ret: returnDate
    });
    router.push(`/plan?${queryParams.toString()}`);
  };

  const handleQuickDestinationPlan = (destName: string) => {
    setDestination(destName);
    const queryParams = new URLSearchParams({
      from: fromLocation || 'Pune',
      to: destName,
      travelers: travelers.toString(),
      budget: budget.toString(),
      currency,
      dep: departureDate,
      ret: returnDate
    });
    router.push(`/plan?${queryParams.toString()}`);
  };

  const handleFindForMe = () => {
    const queryParams = new URLSearchParams({
      from: fromLocation || 'Pune',
      budget: budget.toString(),
      travelers: travelers.toString(),
      surprise: 'true'
    });
    router.push(`/budget-finder?${queryParams.toString()}`);
  };

  const QUICK_DESTINATIONS = [
    { label: '🏔 Leh Ladakh', val: 'Leh Ladakh' },
    { label: '🧗 Kalavantin Durg', val: 'Kalavantin Durg' },
    { label: '🌌 Spiti Valley', val: 'Spiti Valley' },
    { label: '🌊 Goa', val: 'Goa' },
    { label: '🏖 Gokarna', val: 'Gokarna' },
    { label: '❄️ Manali', val: 'Manali & Solang' },
    { label: '🧗 Rishikesh', val: 'Rishikesh' },
    { label: '🎒 Kasol', val: 'Kasol & Parvati' },
    { label: '⛺ Sandhan Valley', val: 'Sandhan Valley' },
    { label: '⛺ Rajmachi', val: 'Rajmachi & Lonavala' },
    { label: '✈️ Bali', val: 'Bali' }
  ];

  return (
    <div className="w-full max-w-5xl rounded-3xl bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl border border-white/60">
      <form onSubmit={handlePlanSubmit} className="space-y-4">
        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. FROM */}
          <div className="relative flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white transition">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-600" />
                FROM
              </span>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 text-[10px]"
                title="Use GPS"
              >
                <Navigation className="h-2.5 w-2.5" />
                <span>{isLocating ? 'GPS...' : 'GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="e.g. Pune, Mumbai, Delhi"
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              required
            />
          </div>

          {/* 2. TO */}
          <div className="relative flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white transition">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3 text-terracotta-500" />
              TO
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Anywhere / Ladakh, Goa..."
              className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* 3. DATES */}
          <div className="relative flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white transition">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <Calendar className="h-3 w-3 text-blue-500" />
              DEPARTURE
            </span>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>

          {/* 4. TRAVELERS */}
          <div className="relative flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white transition">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <Users className="h-3 w-3 text-indigo-500" />
              TRAVELERS
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                {travelers} {travelers === 1 ? 'Solo' : 'People'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setTravelers(Math.min(15, travelers + 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 5. BUDGET */}
          <div className="relative flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 focus-within:border-emerald-500 focus-within:bg-white transition">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <Wallet className="h-3 w-3 text-emerald-600" />
                BUDGET
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-[10px] text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="AED">AED</option>
              </select>
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-sm font-semibold text-slate-700 mr-1">
                {CURRENCY_RATES[currency].symbol}
              </span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                step={500}
                min={1000}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Destination Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs no-scrollbar">
          <span className="font-bold text-slate-400 text-[11px] whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Instant Plan:
          </span>
          {QUICK_DESTINATIONS.map((q) => (
            <button
              key={q.val}
              type="button"
              onClick={() => handleQuickDestinationPlan(q.val)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                destination === q.val
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'border-slate-200 bg-white/90 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Action Buttons & "Not sure where to go?" banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          {/* "Not sure where to go?" shortcut */}
          <button
            type="button"
            onClick={handleFindForMe}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Not sure where to go? <strong>Find destinations for me →</strong></span>
          </button>

          {/* CTAs */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/explore')}
              className="w-1/2 sm:w-auto rounded-2xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              Explore Destinations
            </button>
            <button
              type="submit"
              className="w-1/2 sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transition"
            >
              <span>Plan My Adventure</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
