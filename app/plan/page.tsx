import React, { Suspense } from 'react';
import TripPlannerWizard from '@/components/trip-planner-wizard';
import { Sparkles, Compass } from 'lucide-react';

interface PlanPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    travelers?: string;
    budget?: string;
    currency?: string;
  }>;
}

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title Banner */}
      <div className="mx-auto max-w-5xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Intelligent Multi-Factor Route & Budget Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Design Your Precision Adventure
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Follow our 10-step wizard. We analyze distance, elevation, weather suitability, vehicle logistics, and live budget utilization to generate ranked recommendations.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Loading trip planner...</div>}>
        <TripPlannerWizard initialParams={params} />
      </Suspense>
    </div>
  );
}
