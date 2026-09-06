'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Compass, 
  Mountain, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { TREKS } from '@/data/treks';
import { Destination } from '@/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations' | 'treks' | 'monetization'>('overview');
  const [destinationsList, setDestinationsList] = useState<Destination[]>(DESTINATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Destination Form
  const [newName, setNewName] = useState('');
  const [newRegion, setNewRegion] = useState('Western Ghats');
  const [newPrice, setNewPrice] = useState(4500);

  const handleDeleteDestination = (id: string) => {
    if (confirm('Are you sure you want to remove this destination?')) {
      setDestinationsList((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newDest: Destination = {
      id: `dest-custom-${Date.now()}`,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      region: newRegion as any,
      country: 'India',
      isInternational: false,
      tagline: 'Custom Explorer Destination',
      description: 'Newly added destination managed via WanderX Admin Command Center.',
      heroImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      startingPrice: Number(newPrice),
      idealDurationDays: 3,
      difficulty: 'Moderate',
      rating: 4.8,
      reviewCount: 1,
      bestSeason: 'October to March',
      idealMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      coordinates: { lat: 18.5204, lng: 73.8567 },
      categories: ['TREKS', 'CAMPING', 'WEEKEND GETAWAYS'],
      popularActivities: ['Trek', 'Camping', 'Photography'],
      travelStyles: ['Trekking', 'Camping', 'Nature'],
      transportOptions: ['Car', 'Bike'],
      accommodationTypes: ['Homestay', 'Camping'],
      safetyIndex: 'High Safety',
      emergencyFacilities: {
        nearestHospital: 'Local Primary Health Centre',
        hospitalContact: '108',
        nearestPoliceStation: 'Regional Police Station',
        policeContact: '112',
        touristHelpline: '112'
      },
      weatherSummary: {
        currentTempC: 22,
        condition: 'Clear Skies',
        rainProbability: 5,
        windSpeedKmh: 12,
        humidity: 50,
        suitability: 'Ideal'
      },
      highlights: ['Scenic Ridge', 'Heritage Bastion'],
      budgetTier: 'Budget'
    };

    setDestinationsList([newDest, ...destinationsList]);
    setShowAddModal(false);
    setNewName('');
  };

  const filteredDestinations = destinationsList.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Title Header */}
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            WanderX Core Operations
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Platform Admin Command Center</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Destination</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl flex items-center gap-2">
        {[
          { id: 'overview', label: 'Telemetry & Analytics', icon: BarChart3 },
          { id: 'destinations', label: `Destinations (${destinationsList.length})`, icon: Compass },
          { id: 'treks', label: `Treks & Routes (${TREKS.length})`, icon: Mountain },
          { id: 'monetization', label: 'Partners & Revenue', icon: Wallet }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Platform Explorers</span>
              <div className="text-3xl font-black text-slate-900">14,820</div>
              <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +18.4% this month
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Trips Generated</span>
              <div className="text-3xl font-black text-emerald-700">38,950</div>
              <span className="text-slate-500 text-xs font-semibold">2,410 active this week</span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Avg Trip Budget</span>
              <div className="text-3xl font-black text-blue-700">₹14,200</div>
              <span className="text-slate-500 text-xs font-semibold">₹4,700 / person average</span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Affiliate Booking Leads</span>
              <div className="text-3xl font-black text-amber-700">642 Leads</div>
              <span className="text-emerald-700 text-xs font-bold">₹1,24,000 Est. Revenue</span>
            </div>
          </div>

          {/* Analytics Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900">Most Searched Adventure Categories</h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Sahyadri & Western Ghats Weekend Treks', count: '12,450 searches', pct: 85 },
                  { name: 'Trans-Himalayan Motorcycle Loops (Leh/Spiti)', count: '9,810 searches', pct: 72 },
                  { name: 'Budget Coastal Escapes (Gokarna / Goa)', count: '8,420 searches', pct: 64 },
                  { name: 'Tiger Reserves & Wildlife Safaris', count: '5,120 searches', pct: 42 }
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>{item.name}</span>
                      <span className="text-slate-500 font-normal">{item.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900">Top Origin Hubs</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { city: 'Pune', share: '34% of all searches' },
                  { city: 'Mumbai', share: '28% of all searches' },
                  { city: 'Bangalore', share: '18% of all searches' },
                  { city: 'Delhi NCR', share: '14% of all searches' }
                ].map((hub) => (
                  <div key={hub.city} className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
                    <div className="font-black text-slate-900 text-sm">{hub.city}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{hub.share}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DESTINATIONS CRUD TABLE */}
      {activeTab === 'destinations' && (
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search destination to edit..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs font-semibold"
              />
            </div>
            <span className="text-xs font-bold text-slate-400">
              {filteredDestinations.length} Destinations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-400 font-bold border-y border-slate-200">
                <tr>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Starting Cost</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDestinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={dest.heroImage} alt="" className="h-7 w-7 rounded-md object-cover" />
                      <span>{dest.name}</span>
                    </td>
                    <td className="p-3">{dest.region}</td>
                    <td className="p-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                        {dest.difficulty}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700">
                      ₹{dest.startingPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold">⭐ {dest.rating}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteDestination(dest.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: MONETIZATION & AFFILIATE */}
      {activeTab === 'monetization' && (
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Monetization & Lead Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">
              Affiliate links for stays, certified trekking guides, motorcycle rentals, and adventure gear.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Homestay & Hotel Bookings</span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹68,400</div>
              <p className="text-[11px] text-slate-500 mt-1">312 completed referral bookings</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Trek Guides & Gear Rentals</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">₹42,100</div>
              <p className="text-[11px] text-slate-500 mt-1">198 guided Sahyadri & Himalayan passes</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Motorcycle Rental Partners</span>
              <div className="text-2xl font-black text-blue-700 mt-1">₹13,500</div>
              <p className="text-[11px] text-slate-500 mt-1">Himalayan 450 fleet referrals in Leh/Manali</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Destination */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">Add New Destination</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kaas Plateau of Flowers"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Region</label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                >
                  <option value="Western Ghats">Western Ghats</option>
                  <option value="Himalayas">Himalayas</option>
                  <option value="Coastal India">Coastal India</option>
                  <option value="North India">North India</option>
                  <option value="South India">South India</option>
                  <option value="Northeast India">Northeast India</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Starting Price (INR ₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  step={500}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700"
                >
                  Create Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
