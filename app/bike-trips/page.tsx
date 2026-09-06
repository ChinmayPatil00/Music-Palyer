'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bike, 
  Fuel, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  AlertTriangle 
} from 'lucide-react';
import { BIKE_TRIPS } from '@/data/biketrips';
import InteractiveMap from '@/components/interactive-map';

export default function BikeTripPlannerPage() {
  const [selectedTrip, setSelectedTrip] = useState(BIKE_TRIPS[0]);
  const [selectedBike, setSelectedBike] = useState('Royal Enfield Himalayan 450');
  const [riders, setRiders] = useState(2);
  const [ridingExperience, setRidingExperience] = useState<'Beginner' | 'Intermediate' | 'Hardcore Explorer' | 'Iron Butt'>('Intermediate');

  const mapMarkers = selectedTrip.routeCoordinates.map((c, idx) => ({
    lat: c.lat,
    lng: c.lng,
    title: c.name,
    type: (idx === 0 ? 'start' : idx === selectedTrip.routeCoordinates.length - 1 ? 'end' : 'stop') as any,
    details: `Checkpoint #${idx + 1} on ${selectedTrip.title}`
  }));

  const polylineCoords: [number, number][] = selectedTrip.routeCoordinates.map((c) => [c.lat, c.lng]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title Header */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Bike className="h-3.5 w-3.5 text-emerald-600" />
          <span>Motorcycle Expedition Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Motorcycle Expedition Planner
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          From the hairpins of Kolli Hills to the high cold desert passes of Khardung La and Zanskar — plan fuel stops, mechanics, spares, and CE armor gear.
        </p>
      </div>

      {/* Expedition Selection Chips */}
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Select Motorcycle Expedition
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BIKE_TRIPS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTrip(t)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedTrip.id === t.id
                  ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
              }`}
            >
              <div className="font-bold text-slate-900 text-sm truncate">{t.title}</div>
              <div className="text-xs text-slate-500 mt-1">
                {t.distanceKm} km • {t.idealDays} Days • {t.difficulty}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Machine & Rider Specs */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Bike className="h-4 w-4 text-emerald-600" />
              Machine & Rider Profile
            </h3>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Recommended Motorcycle Class</label>
              <select
                value={selectedBike}
                onChange={(e) => setSelectedBike(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
              >
                {selectedTrip.recommendedBikes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Number of Riders</label>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-slate-200 p-2">
                  <span className="text-xs font-bold text-slate-900 ml-1">{riders} Riders</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setRiders(Math.max(1, riders - 1))}
                      className="h-6 w-6 rounded border bg-slate-50 text-xs font-bold"
                    >-</button>
                    <button
                      type="button"
                      onClick={() => setRiders(riders + 1)}
                      className="h-6 w-6 rounded border bg-slate-50 text-xs font-bold"
                    >+</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Riding Experience</label>
                <select
                  value={ridingExperience}
                  onChange={(e) => setRidingExperience(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate Tourer</option>
                  <option value="Hardcore Explorer">Hardcore Explorer</option>
                  <option value="Iron Butt">Iron Butt</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-950 space-y-1">
              <span className="font-bold text-emerald-900 block">Permits & Paperwork:</span>
              <p className="text-[11px] leading-relaxed">{selectedTrip.permitsRequired}</p>
            </div>
          </div>

          {/* Riding Gear Checklist */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Mandatory Armor & Riding Gear
            </span>
            <div className="space-y-2 text-xs">
              {selectedTrip.recommendedGear.map((gear, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{gear}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mechanical Spares & Roadside Assistance */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Wrench className="h-4 w-4" />
              Mechanics & Spares Protocol
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedTrip.mechanicsFrequency}
            </p>
            <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-white block">Pre-Departure Safety Checklist:</span>
              {selectedTrip.safetyChecklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Route Map & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <InteractiveMap
            center={[selectedTrip.routeCoordinates[0].lat, selectedTrip.routeCoordinates[0].lng]}
            zoom={6}
            markers={mapMarkers}
            polylineCoords={polylineCoords}
            height="440px"
          />

          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Expedition Cost</div>
              <div className="text-2xl font-black text-slate-900">
                ₹{selectedTrip.estimatedCost.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500">
                Fuel Burn: ~{selectedTrip.estimatedFuelLitres}L • {selectedTrip.idealDays} Days Expedition
              </div>
            </div>

            <Link
              href={`/itinerary/generate?dest=${
                selectedTrip.toCity.toLowerCase().includes('leh')
                  ? 'dest-ladakh'
                  : selectedTrip.toCity.toLowerCase().includes('goa')
                  ? 'dest-goa'
                  : selectedTrip.toCity.toLowerCase().includes('kutch') || selectedTrip.toCity.toLowerCase().includes('desert')
                  ? 'dest-jaisalmer'
                  : selectedTrip.toCity.toLowerCase().includes('kolli')
                  ? 'dest-coorg'
                  : 'dest-ladakh'
              }&from=${encodeURIComponent(selectedTrip.fromCity.split('/')[0].trim())}&transport=Bike&days=${selectedTrip.idealDays}&travelers=${riders}&style=Bike+Ride`}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-black text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
            >
              <span>Build Day-by-Day Ride Plan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
