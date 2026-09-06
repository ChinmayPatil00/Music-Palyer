'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Fuel, 
  Coins, 
  Clock, 
  MapPin, 
  Utensils, 
  Hotel, 
  Camera, 
  ShieldAlert, 
  Navigation,
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';
import { ROAD_TRIPS } from '@/data/roadtrips';
import InteractiveMap from '@/components/interactive-map';
import { calculateFuel } from '@/lib/cost-engine';

export default function RoadTripPlannerPage() {
  const [selectedPreset, setSelectedPreset] = useState(ROAD_TRIPS[0]);

  // Route Customizer Inputs
  const [fromCity, setFromCity] = useState(selectedPreset.fromCity);
  const [toCity, setToCity] = useState(selectedPreset.toCity);
  const [stops, setStops] = useState<string[]>(selectedPreset.viaStops);
  const [vehicleType, setVehicleType] = useState<string>('SUV / High-Clearance');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'EV' | 'CNG'>('Petrol');
  const [mileage, setMileage] = useState(14); // km/L
  const [fuelPrice, setFuelPrice] = useState(104); // ₹/L
  const [travelers, setTravelers] = useState(3);

  // Dynamic Fuel & Toll Calculations
  const distance = selectedPreset.totalDistanceKm;
  const { litresNeeded, totalCost: fuelCost } = calculateFuel(distance, mileage, fuelPrice);
  const tollEstimate = selectedPreset.estimatedTolls;
  const totalCommuteCost = fuelCost + tollEstimate;

  const handleSelectPreset = (trip: typeof ROAD_TRIPS[0]) => {
    setSelectedPreset(trip);
    setFromCity(trip.fromCity);
    setToCity(trip.toCity);
    setStops(trip.viaStops);
  };

  const addStop = () => {
    setStops([...stops, 'Scenic Waypoint Stop']);
  };

  const removeStop = (idx: number) => {
    setStops(stops.filter((_, i) => i !== idx));
  };

  // Convert route coordinates to Map format
  const mapMarkers = selectedPreset.routeCoordinates.map((c, idx) => ({
    lat: c.lat,
    lng: c.lng,
    title: c.name,
    type: (idx === 0 ? 'start' : idx === selectedPreset.routeCoordinates.length - 1 ? 'end' : 'stop') as any,
    details: `Stop #${idx + 1} on ${selectedPreset.title}`
  }));

  const polylineCoords: [number, number][] = selectedPreset.routeCoordinates.map((c) => [c.lat, c.lng]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="mx-auto max-w-6xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
          <Car className="h-3.5 w-3.5 text-emerald-600" />
          <span>Overland Driving Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Overland Road Trip Planner
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-600">
          Compute vehicle fuel burn, toll charges, scenic canyon stops, and highway food dhabas with interactive multi-stop maps.
        </p>
      </div>

      {/* Preset Route Selectors */}
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Featured Overland Circuits
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ROAD_TRIPS.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => handleSelectPreset(trip)}
              className={`rounded-2xl border p-3 text-left transition ${
                selectedPreset.id === trip.id
                  ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
              }`}
            >
              <div className="font-bold text-slate-900 text-xs truncate">{trip.title}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                {trip.totalDistanceKm}km • {trip.idealDays} Days
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Calculations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Route Config Card */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Navigation className="h-4 w-4 text-emerald-600" />
              Route & Vehicle Configuration
            </h3>

            {/* From & To */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Starting Point</label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Waypoint Stops */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Intermediate Stops ({stops.length})</span>
                  <button
                    type="button"
                    onClick={addStop}
                    className="text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Stop</span>
                  </button>
                </div>
                {stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => {
                        const newStops = [...stops];
                        newStops[idx] = e.target.value;
                        setStops(newStops);
                      }}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeStop(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Destination</label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Vehicle & Fuel Specs */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="EV">EV Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Class</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="SUV / High-Clearance">SUV / High-Clearance</option>
                    <option value="Hatchback / Sedan">Hatchback / Sedan</option>
                    <option value="4x4 Required">4x4 Trail Rig</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Mileage (km/L)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    step={0.5}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Price (₹/L)</label>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Drive & Fuel Cost Breakdown Card */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Computed Travel Telemetry
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-white/10 p-3">
                <span className="text-slate-400 text-[10px] block">Distance</span>
                <span className="text-lg font-black font-mono">{distance} km</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <span className="text-slate-400 text-[10px] block">Driving Hours</span>
                <span className="text-lg font-black font-mono">~{selectedPreset.drivingHours} hrs</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <span className="text-slate-400 text-[10px] block">Fuel Burned</span>
                <span className="text-lg font-black font-mono">{litresNeeded} L</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <span className="text-slate-400 text-[10px] block">Estimated Tolls</span>
                <span className="text-lg font-black font-mono">₹{tollEstimate}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Driving Transit Cost:</span>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{totalCommuteCost.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Per Person ({travelers}p):</span>
                <div className="text-sm font-bold text-white">
                  ₹{Math.round(totalCommuteCost / travelers).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map & Along-The-Way Stops (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Map */}
          <InteractiveMap
            center={[selectedPreset.routeCoordinates[0].lat, selectedPreset.routeCoordinates[0].lng]}
            zoom={6}
            markers={mapMarkers}
            polylineCoords={polylineCoords}
            height="420px"
          />

          {/* Along-the-Way Highlights & Food Dhabas */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Along The Highway Corridor
              </span>
              <h3 className="text-xl font-black text-slate-900">Scenic Viewpoints & Highway Dhabas</h3>
            </div>

            {/* Scenic stops */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Camera className="h-3.5 w-3.5 text-emerald-600" />
                Scenic Highlights
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPreset.scenicHighlights.map((s, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-2.5 text-xs font-medium text-slate-700 border border-slate-200">
                    ★ {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Food dhabas */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Utensils className="h-3.5 w-3.5 text-amber-600" />
                Recommended Food Stops & Dhabas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPreset.recommendedFoodStops.map((f, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-50 p-2.5 text-xs font-medium text-slate-700 border border-slate-200">
                    🍜 {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Fuel Station Frequency: <strong className="text-slate-800">{selectedPreset.fuelStationFrequency}</strong></span>
              <Link
                href={`/itinerary/generate?dest=dest-goa&from=${fromCity}&days=${selectedPreset.idealDays}&travelers=${travelers}`}
                className="flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <span>Convert into full day-by-day itinerary</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
