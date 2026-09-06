'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Printer, 
  Share2, 
  Bookmark, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { FullTrip, ItineraryActivity, ItineraryDay } from '@/types';
import { setToStorage, getFromStorage, STORAGE_KEYS } from '@/lib/utils';

interface ItineraryEditorProps {
  initialTrip: FullTrip;
}

export default function ItineraryEditor({ initialTrip }: ItineraryEditorProps) {
  const [trip, setTrip] = useState<FullTrip>(initialTrip);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reorder activity up
  const moveActivityUp = (dayIdx: number, actIdx: number) => {
    if (actIdx === 0) return;
    setTrip((prev) => {
      const newDays = [...prev.days];
      const activities = [...newDays[dayIdx].activities];
      const temp = activities[actIdx];
      activities[actIdx] = activities[actIdx - 1];
      activities[actIdx - 1] = temp;
      newDays[dayIdx].activities = activities;
      return { ...prev, days: newDays };
    });
  };

  // Reorder activity down
  const moveActivityDown = (dayIdx: number, actIdx: number) => {
    const activitiesCount = trip.days[dayIdx].activities.length;
    if (actIdx >= activitiesCount - 1) return;
    setTrip((prev) => {
      const newDays = [...prev.days];
      const activities = [...newDays[dayIdx].activities];
      const temp = activities[actIdx];
      activities[actIdx] = activities[actIdx + 1];
      activities[actIdx + 1] = temp;
      newDays[dayIdx].activities = activities;
      return { ...prev, days: newDays };
    });
  };

  // Delete activity
  const deleteActivity = (dayIdx: number, actId: string) => {
    setTrip((prev) => {
      const newDays = [...prev.days];
      newDays[dayIdx].activities = newDays[dayIdx].activities.filter((a) => a.id !== actId);
      return { ...prev, days: newDays };
    });
  };

  // Add new activity
  const addActivity = (dayIdx: number) => {
    const newAct: ItineraryActivity = {
      id: `custom-act-${Date.now()}`,
      time: '03:00 PM',
      title: 'Custom Exploration / Scenic Rest',
      description: 'Explore local markets, visit a hidden viewpoint, or relax by the campsite.',
      category: 'Sightseeing',
      estimatedCost: 300,
      locationName: trip.destinationName
    };
    setTrip((prev) => {
      const newDays = [...prev.days];
      newDays[dayIdx].activities.push(newAct);
      return { ...prev, days: newDays };
    });
  };

  // Save trip to user dashboard
  const handleSaveTrip = () => {
    const existing: FullTrip[] = getFromStorage(STORAGE_KEYS.SAVED_TRIPS, []);
    const updated = [trip, ...existing.filter((t) => t.id !== trip.id)];
    setToStorage(STORAGE_KEYS.SAVED_TRIPS, updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Share link
  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const activeDay = trip.days[activeDayIndex] || trip.days[0];

  return (
    <div className="space-y-6">
      {/* Header Controls Banner */}
      <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Interactive Day-By-Day Planner
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">{trip.title}</h2>
          <p className="text-xs text-slate-500">
            {trip.daysCount} Days • {trip.travelersCount} Travelers • Total Budget: ₹{trip.totalBudget.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            {copySuccess ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4 text-slate-500" />}
            <span>{copySuccess ? 'Link Copied!' : 'Share Trip'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTrip}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition shadow-md ${
              isSaved
                ? 'bg-emerald-700'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>{isSaved ? 'Saved to My Trips!' : 'Save Trip'}</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (Hidden in Print) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
        {trip.days.map((day, idx) => (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => setActiveDayIndex(idx)}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold whitespace-nowrap transition ${
              activeDayIndex === idx
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Day {day.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Active Day Card & Timeline */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6 print-page">
        {/* Day Header Info */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Day {activeDay.dayNumber} Schedule
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeDay.title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeDay.summary}</p>
        </div>

        {/* Timeline Activities List */}
        <div className="space-y-4">
          {activeDay.activities.map((act, actIdx) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 transition bg-slate-50/50"
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold">
                  {act.time.split(' ')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {act.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{act.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 font-medium">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{act.locationName}</span>
                    {act.estimatedCost > 0 && (
                      <span className="text-emerald-700 font-bold ml-2">
                        ₹{act.estimatedCost.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reorder & Action Buttons (Hidden in Print) */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center no-print">
                <button
                  type="button"
                  onClick={() => moveActivityUp(activeDayIndex, actIdx)}
                  disabled={actIdx === 0}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveActivityDown(activeDayIndex, actIdx)}
                  disabled={actIdx === activeDay.activities.length - 1}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteActivity(activeDayIndex, actIdx.toString())}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-red-500 hover:bg-red-50"
                  title="Remove Activity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Activity Button (Hidden in Print) */}
        <div className="pt-2 no-print">
          <button
            type="button"
            onClick={() => addActivity(activeDayIndex)}
            className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 px-4 text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Activity or Stop to Day {activeDay.dayNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
