import React from 'react';
import Link from 'next/link';
import { Compass, Shield, Mountain, MapPin, Heart, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      {/* Top Advisory Banner */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Adventure Safety Advisory:</strong> High-altitude treks, mountain passes, and remote trails require official local permits, weather checks, and proper gear. Always verify trail alerts with state forest authorities.
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px] shrink-0">
            Emergency: Dial 112
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                TRAVEL<span className="text-emerald-500">X</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              TRAVELX is a precision adventure intelligence and trip-planning platform. We engineer budget-conscious itineraries, high-altitude trail dossiers, overland road trips, and wildlife safari expeditions across India and the globe.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-emerald-400" /> Verified Routes</span>
              <span className="flex items-center gap-1"><Mountain className="h-3.5 w-3.5 text-emerald-400" /> Elevation Analysis</span>
            </div>
          </div>

          {/* Col 1: Adventures */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Adventures</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/treks" className="hover:text-emerald-400 transition">Himalayan & Sahyadri Treks</Link></li>
              <li><Link href="/road-trips" className="hover:text-emerald-400 transition">Overland Road Trips</Link></li>
              <li><Link href="/bike-trips" className="hover:text-emerald-400 transition">Motorcycle Expeditions</Link></li>
              <li><Link href="/safaris" className="hover:text-emerald-400 transition">Tiger Reserves & Safaris</Link></li>
              <li><Link href="/explore" className="hover:text-emerald-400 transition">Hidden Gems & Camping</Link></li>
            </ul>
          </div>

          {/* Col 2: India Regional */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Destinations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/destinations/india" className="hover:text-emerald-400 transition">North India & Himalayas</Link></li>
              <li><Link href="/destinations/india" className="hover:text-emerald-400 transition">Western Ghats Trails</Link></li>
              <li><Link href="/destinations/india" className="hover:text-emerald-400 transition">Coastal Shorelines</Link></li>
              <li><Link href="/destinations/india" className="hover:text-emerald-400 transition">Northeast Valleys</Link></li>
              <li><Link href="/destinations/international" className="hover:text-emerald-400 transition">Budget International Hubs</Link></li>
            </ul>
          </div>

          {/* Col 3: Planners & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Planning Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/plan" className="hover:text-emerald-400 transition">10-Step AI Trip Planner</Link></li>
              <li><Link href="/budget-finder" className="hover:text-emerald-400 transition">Plan With My Budget</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition">My Saved Itineraries</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition">Admin Intelligence Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TRAVELX Technologies. Built for explorers, bikers, trekkers, and budget travelers.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Terms of Adventure</span>
            <span>Privacy Protocol</span>
            <span>Permit Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
