'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Luggage, 
  Heart, 
  Calendar, 
  Settings, 
  Trash2, 
  ArrowRight, 
  Compass, 
  Clock, 
  Star,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { FullTrip, Destination } from '@/types';
import { INITIAL_SAVED_TRIPS } from '@/data/initial-trips';
import { DESTINATIONS } from '@/data/destinations';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/utils';
import DestinationCard from '@/components/destination-card';

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<'trips' | 'wishlist' | 'preferences' | 'profile'>('trips');
  const [savedTrips, setSavedTrips] = useState<FullTrip[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const loadedTrips = getFromStorage(STORAGE_KEYS.SAVED_TRIPS, INITIAL_SAVED_TRIPS);
    setSavedTrips(loadedTrips);

    const loadedWishlist = getFromStorage(STORAGE_KEYS.WISHLIST, ['dest-ladakh', 'dest-spiti', 'dest-gokarna']);
    setWishlistIds(loadedWishlist);
  }, []);

  const deleteTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    setToStorage(STORAGE_KEYS.SAVED_TRIPS, updated);
  };

  const wishlistedDestinations = DESTINATIONS.filter((d) => wishlistIds.includes(d.id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* User Banner Header */}
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl shadow-lg shadow-emerald-500/20">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Chinmay Patil</h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                Verified Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500">
              chinmay@travelx.app • Home Base: Pune, India • 8 Expeditions Completed
            </p>
          </div>
        </div>

        <Link
          href="/plan"
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
        >
          <span>Plan New Adventure</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-6xl flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
            activeTab === 'trips'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          <Luggage className="h-4 w-4" />
          <span>My Saved Trips ({savedTrips.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
            activeTab === 'wishlist'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Saved Wishlist ({wishlistedDestinations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
            activeTab === 'preferences'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Travel Preferences</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="mx-auto max-w-6xl">
        {/* TAB 1: MY TRIPS */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            {savedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedTrips.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-900">
                        <img src={t.heroImage} alt={t.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-[10px] text-emerald-300 font-bold">{t.destinationName}</span>
                          <h3 className="text-base font-black">{t.title}</h3>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 text-xs">
                        <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
                          <span>Origin: <strong>{t.startingLocation}</strong></span>
                          <span>Duration: <strong>{t.daysCount} Days</strong></span>
                          <span>Party: <strong>{t.travelersCount} Travelers</strong></span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Budget</span>
                            <span className="text-base font-black text-emerald-700">
                              ₹{t.totalBudget.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Created: {t.createdAt?.split('T')[0] || 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2">
                      <Link
                        href={`/itinerary/generate?dest=${t.destinationName}&from=${t.startingLocation}&days=${t.daysCount}&travelers=${t.travelersCount}`}
                        className="w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-600 transition"
                      >
                        Open Itinerary
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteTrip(t.id)}
                        className="rounded-xl border border-slate-200 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Delete Trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
                <Luggage className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="text-base font-bold text-slate-800">No saved trips yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Launch the trip planner to generate and customize your first personalized adventure itinerary.
                </p>
                <Link
                  href="/plan"
                  className="inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Plan Trip
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedDestinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
                <Heart className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any destination or trek card to save it for your next adventure.
                </p>
                <Link
                  href="/explore"
                  className="inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white"
                >
                  Explore Destinations
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6 max-w-3xl">
            <h3 className="text-xl font-black text-slate-900">Adventure & Diet Preferences</h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Default Departure City</label>
                <input
                  type="text"
                  defaultValue="Pune, Maharashtra"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Preferred Dietary Option</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <input type="radio" name="diet" defaultChecked className="text-emerald-600" />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <input type="radio" name="diet" className="text-emerald-600" />
                    <span>Non-Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <input type="radio" name="diet" className="text-emerald-600" />
                    <span>Vegan</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Primary Travel Mode</label>
                <div className="flex flex-wrap gap-2">
                  {['Motorcycle / Bike', 'Self-Drive SUV', 'Train', 'Flight'].map((mode, i) => (
                    <span
                      key={mode}
                      className={`rounded-xl border px-3 py-1.5 font-bold cursor-pointer ${
                        i === 0
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Save Travel Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
