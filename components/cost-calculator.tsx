'use client';

import React, { useState } from 'react';
import { Wallet, PieChart, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { CurrencyCode } from '@/types';
import { formatPrice } from '@/lib/currency';

interface CostCalculatorProps {
  initialBudget?: number;
  initialCosts?: {
    transport: number;
    stay: number;
    food: number;
    activities: number;
    permits: number;
    emergencyBuffer: number;
  };
  travelersCount?: number;
  currency?: CurrencyCode;
}

export default function CostCalculator({
  initialBudget = 30000,
  initialCosts = {
    transport: 8000,
    stay: 7000,
    food: 5000,
    activities: 6000,
    permits: 2000,
    emergencyBuffer: 2000
  },
  travelersCount = 2,
  currency = 'INR'
}: CostCalculatorProps) {
  const [budgetLimit, setBudgetLimit] = useState(initialBudget);
  const [people, setPeople] = useState(travelersCount);
  const [costs, setCosts] = useState(initialCosts);
  const [viewMode, setViewMode] = useState<'total' | 'perPerson'>('total');

  const updateCost = (key: keyof typeof costs, value: number) => {
    setCosts((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  const totalSpent =
    costs.transport +
    costs.stay +
    costs.food +
    costs.activities +
    costs.permits +
    costs.emergencyBuffer;

  const perPersonCost = Math.round(totalSpent / Math.max(1, people));
  const utilizationPct = Math.round((totalSpent / Math.max(1, budgetLimit)) * 100);

  let utilizationColor = 'bg-emerald-500';
  let statusBadge = 'Within Budget';
  let badgeColor = 'bg-emerald-100 text-emerald-800';

  if (utilizationPct > 100) {
    utilizationColor = 'bg-red-500';
    statusBadge = `Over Budget by ${utilizationPct - 100}%`;
    badgeColor = 'bg-red-100 text-red-800';
  } else if (utilizationPct >= 85) {
    utilizationColor = 'bg-amber-500';
    statusBadge = 'Near Budget Limit';
    badgeColor = 'bg-amber-100 text-amber-800';
  }

  const items = [
    { key: 'transport' as const, label: 'Transportation & Fuel', desc: 'Car fuel, tolls, train/bus/flights' },
    { key: 'stay' as const, label: 'Accommodation', desc: 'Homestays, campsites, hotels' },
    { key: 'food' as const, label: 'Food & Dining', desc: 'Daily meals, dhaba thalis, cafe snacks' },
    { key: 'activities' as const, label: 'Adventure Activities & Gear', desc: 'Rafting, guides, rental equipment' },
    { key: 'permits' as const, label: 'Permits & Entry Tickets', desc: 'Forest department fees, sanctuary tolls' },
    { key: 'emergencyBuffer' as const, label: 'Emergency Reserve', desc: 'Medical buffer, tyre puncture or delays' }
  ];

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <PieChart className="h-4 w-4" />
            Precision Trip Cost Engine
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Itemized Expense Calculator</h3>
          <p className="text-xs text-slate-500">
            Real-time calculation of all expense channels and budget utilization.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('total')}
            className={`rounded-xl px-3 py-1.5 transition ${
              viewMode === 'total' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
          >
            Total Trip
          </button>
          <button
            type="button"
            onClick={() => setViewMode('perPerson')}
            className={`rounded-xl px-3 py-1.5 transition ${
              viewMode === 'perPerson' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
          >
            Per Person ({people} {people === 1 ? 'person' : 'people'})
          </button>
        </div>
      </div>

      {/* Budget Utilization Gauge Banner */}
      <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Budget Target</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                step={1000}
                className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-base font-black text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase">Estimated Total</span>
            <div className="text-2xl font-black text-slate-900">
              {viewMode === 'total'
                ? formatPrice(totalSpent, currency)
                : formatPrice(perPersonCost, currency)}
            </div>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeColor} mt-1`}>
              {statusBadge} ({utilizationPct}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full ${utilizationColor} transition-all duration-300`}
            style={{ width: `${Math.min(100, utilizationPct)}%` }}
          />
        </div>
      </div>

      {/* Itemized Categories Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const val = costs[item.key];
          const displayVal = viewMode === 'total' ? val : Math.round(val / Math.max(1, people));
          const pct = Math.round((val / Math.max(1, totalSpent)) * 100);

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 transition bg-white"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                  {pct}%
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Amount:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={displayVal}
                    onChange={(e) => {
                      const input = Number(e.target.value);
                      const totalToSet = viewMode === 'total' ? input : input * people;
                      updateCost(item.key, totalToSet);
                    }}
                    step={100}
                    className="w-28 rounded-xl border border-slate-200 px-2.5 py-1 text-sm font-bold text-slate-900 text-right focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
