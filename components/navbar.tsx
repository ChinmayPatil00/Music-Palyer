'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  Search, 
  Luggage, 
  Mountain, 
  Car, 
  Bike, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  Wallet, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { CurrencyCode } from '@/types';
import { CURRENCY_RATES } from '@/lib/currency';
import { DESTINATIONS } from '@/data/destinations';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    // Listen to local storage changes for saved trips count
    const updateSavedCount = () => {
      try {
        const trips = JSON.parse(localStorage.getItem('travelx_saved_trips') || '[]');
        setSavedCount(trips.length);
      } catch {
        setSavedCount(1);
      }
    };
    updateSavedCount();
    window.addEventListener('storage', updateSavedCount);
    return () => window.removeEventListener('storage', updateSavedCount);
  }, []);

  const searchResults = searchQuery.trim()
    ? DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.state && d.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Plan Trip', href: '/plan', icon: Sparkles, highlight: true },
    { name: 'Budget Finder', href: '/budget-finder', icon: Wallet },
    { name: 'Treks', href: '/treks', icon: Mountain },
    { name: 'Road Trips', href: '/road-trips', icon: Car },
    { name: 'Bike Expeditions', href: '/bike-trips', icon: Bike },
    { name: 'Safaris', href: '/safaris', icon: ShieldCheck },
    { name: 'India', href: '/destinations/india', icon: MapPin },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Wander<span className="text-emerald-600">X</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-1">
                Adventure Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : link.highlight
                      ? 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-emerald-300 hover:bg-white transition shadow-sm"
              title="Quick Search (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline">Search destinations...</span>
              <kbd className="hidden md:inline rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">⌘K</kbd>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((curr) => (
                  <option key={curr} value={curr}>
                    {CURRENCY_RATES[curr].symbol} {curr}
                  </option>
                ))}
              </select>
            </div>

            {/* My Trips Dashboard Link */}
            <Link
              href="/dashboard"
              className="relative hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Luggage className="h-4 w-4 text-emerald-600" />
              <span>My Trips</span>
              {savedCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Admin Portal Switch */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 border-l border-slate-200 pl-3"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Admin</span>
            </Link>

            {/* Plan Adventure CTA button */}
            <Link
              href="/plan"
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition"
            >
              Plan Trip
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex xl:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Overlay & Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-Down Content */}
            <div className="relative z-10 border-b border-slate-200 bg-white px-5 pt-4 pb-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                  Navigation Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links grid with min-h-[48px] */}
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 rounded-2xl p-3 text-xs font-bold transition min-h-[48px] ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-black'
                          : link.highlight
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : link.highlight ? 'text-white' : 'text-slate-500'}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Quick Row: Currency, My Trips, Admin */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Currency:</span>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((curr) => (
                      <option key={curr} value={curr}>
                        {CURRENCY_RATES[curr].symbol} {curr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800"
                  >
                    <Luggage className="h-4 w-4 text-emerald-600" />
                    <span>My Trips ({savedCount})</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </div>

                {/* Big full-width mobile CTA */}
                <Link
                  href="/plan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Start Planning Adventure</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center border-b border-slate-200 px-4 py-3">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, trek, state, activity or style..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Destinations Found ({searchResults.length})
                  </span>
                  {searchResults.map((dest) => (
                    <Link
                      key={dest.id}
                      href={`/destinations/${dest.slug}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.heroImage}
                          alt={dest.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{dest.name}</div>
                          <div className="text-xs text-slate-500">
                            {dest.state ? `${dest.state}, ` : ''}{dest.country} • {dest.region}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700">
                          ₹{dest.startingPrice.toLocaleString('en-IN')}+
                        </span>
                        <div className="text-[10px] text-slate-400">{dest.difficulty}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No destinations match &quot;{searchQuery}&quot;. Try &quot;Ladakh&quot;, &quot;Goa&quot;, &quot;Trek&quot;, or &quot;Spiti&quot;.
                </div>
              ) : (
                <div className="py-4 text-xs text-slate-400">
                  <div className="font-semibold text-slate-500 mb-2">Quick Suggested Searches:</div>
                  <div className="flex flex-wrap gap-2">
                    {['Leh Ladakh', 'Rajmachi Trek', 'Gokarna', 'Spiti Valley', 'Rishikesh Rafting', 'Jim Corbett Safari', 'Bali'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 text-xs transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
