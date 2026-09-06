'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Users, 
  Wallet, 
  Compass, 
  Activity, 
  Car, 
  Home, 
  CheckSquare, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Percent, 
  Clock, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { CurrencyCode, TripPlanRequest, RecommendationResult } from '@/types';
import { getRankedRecommendations } from '@/lib/recommendation-engine';
import { CURRENCY_RATES, formatPrice } from '@/lib/currency';

interface WizardProps {
  initialParams?: {
    from?: string;
    to?: string;
    travelers?: string;
    budget?: string;
    currency?: string;
    dep?: string;
    ret?: string;
  };
}

export default function TripPlannerWizard({ initialParams }: WizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Form State
  const [fromLocation, setFromLocation] = useState(initialParams?.from || 'Pune');
  const [destinationMode, setDestinationMode] = useState<'specific' | 'surprise' | 'budget'>('specific');
  const [destinationText, setDestinationText] = useState(initialParams?.to || '');
  const [departureDate, setDepartureDate] = useState(initialParams?.dep || '');
  const [returnDate, setReturnDate] = useState(initialParams?.ret || '');
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [totalDays, setTotalDays] = useState(4);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDepartureChange = (val: string) => {
    setDepartureDate(val);
    if (returnDate && val > returnDate) {
      setReturnDate(val);
    }
    if (val && returnDate) {
      const diffTime = new Date(returnDate).getTime() - new Date(val).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) setTotalDays(Math.min(14, Math.max(1, diffDays)));
    }
  };

  const handleReturnChange = (val: string) => {
    setReturnDate(val);
    if (departureDate && val) {
      const diffTime = new Date(val).getTime() - new Date(departureDate).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) setTotalDays(Math.min(14, Math.max(1, diffDays)));
    }
  };

  useEffect(() => {
    if (initialParams?.dep && initialParams?.ret) {
      const diffTime = new Date(initialParams.ret).getTime() - new Date(initialParams.dep).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) setTotalDays(Math.min(14, Math.max(1, diffDays)));
    }
  }, [initialParams?.dep, initialParams?.ret]);

  // Travelers Headcount
  const [adults, setAdults] = useState(Number(initialParams?.travelers) || 2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [partyType, setPartyType] = useState<'Solo' | 'Couple' | 'Group' | 'Family'>('Group');

  // Budget
  const [budgetAmount, setBudgetAmount] = useState(Number(initialParams?.budget) || 15000);
  const [isPerPerson, setIsPerPerson] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>((initialParams?.currency as CurrencyCode) || 'INR');

  // Travel Styles (22 selectable cards)
  const TRAVEL_STYLE_OPTIONS = [
    { id: 'Trekking', icon: '🏔', label: 'Trekking' },
    { id: 'Bike Ride', icon: '🏍', label: 'Bike Ride' },
    { id: 'Road Trip', icon: '🚗', label: 'Road Trip' },
    { id: 'Jungle Safari', icon: '🦁', label: 'Jungle Safari' },
    { id: 'Camping', icon: '🏕', label: 'Camping' },
    { id: 'Beaches', icon: '🌊', label: 'Beaches' },
    { id: 'Mountains', icon: '⛰', label: 'Mountains' },
    { id: 'Forest', icon: '🌲', label: 'Forest' },
    { id: 'Desert', icon: '🏜', label: 'Desert' },
    { id: 'Adventure Sports', icon: '🧗', label: 'Adventure Sports' },
    { id: 'Scuba Diving', icon: '🤿', label: 'Scuba Diving' },
    { id: 'Water Sports', icon: '🏄', label: 'Water Sports' },
    { id: 'Paragliding', icon: '🪂', label: 'Paragliding' },
    { id: 'Stargazing', icon: '🌌', label: 'Stargazing' },
    { id: 'Photography', icon: '📸', label: 'Photography' },
    { id: 'Spiritual', icon: '🛕', label: 'Spiritual' },
    { id: 'Food & Culture', icon: '🍜', label: 'Food & Culture' },
    { id: 'Heritage', icon: '🏛', label: 'Heritage' },
    { id: 'Nature', icon: '🌿', label: 'Nature' },
    { id: 'Backpacking', icon: '🎒', label: 'Backpacking' },
    { id: 'Romantic', icon: '❤️', label: 'Romantic' },
    { id: 'Family', icon: '👨‍👩‍👧', label: 'Family' },
  ];
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Trekking', 'Camping', 'Road Trip']);

  // Difficulty
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Difficult' | 'Extreme'>('Moderate');

  // Transportation (multi-choice)
  const TRANSPORT_MODES = ['Bike', 'Car', 'Bus', 'Train', 'Flight', 'Rental vehicle', 'Public transport', 'Taxi', 'Self-drive'];
  const [selectedTransports, setSelectedTransports] = useState<string[]>(['Car', 'Bike']);

  // Accommodation
  const ACCOMMODATION_OPTIONS = ['Hostel', 'Hotel', 'Homestay', 'Resort', 'Camping', 'Luxury', 'Budget', 'No accommodation required'];
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(['Homestay', 'Camping']);

  // Preferences (14 checkboxes)
  const PREFERENCE_OPTIONS = [
    'Cheapest possible',
    'Fastest route',
    'Scenic route',
    'Hidden gems',
    'Less crowded',
    'Instagram-worthy',
    'Local experiences',
    'Adventure-heavy',
    'Relaxed trip',
    'Night travel',
    'Vegetarian food',
    'Non-vegetarian food',
    'Pet friendly',
    'Family friendly'
  ];
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Scenic route',
    'Hidden gems',
    'Local experiences'
  ]);

  // Results State
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleTransport = (mode: string) => {
    setSelectedTransports((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const toggleAccommodation = (acc: string) => {
    setSelectedAccommodations((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const POPULAR_DESTINATIONS = [
    { name: 'Kalavantin Durg', region: 'Western Ghats', icon: '🧗', price: '₹1,400+' },
    { name: 'Leh Ladakh', region: 'Himalayas', icon: '🏔', price: '₹18,500+' },
    { name: 'Harihar Fort', region: 'Western Ghats', icon: '⛰', price: '₹1,300+' },
    { name: 'Spiti Valley', region: 'Himalayas', icon: '🌌', price: '₹14,500+' },
    { name: 'Goa', region: 'Coastal India', icon: '🌊', price: '₹6,500+' },
    { name: 'Gokarna', region: 'Coastal India', icon: '🏖', price: '₹4,200+' },
    { name: 'Manali & Solang', region: 'North India', icon: '❄️', price: '₹6,500+' },
    { name: 'Kasol & Parvati', region: 'North India', icon: '🎒', price: '₹4,800+' },
    { name: 'Rishikesh', region: 'North India', icon: '🧗', price: '₹4,200+' },
    { name: 'Sandhan Valley', region: 'Western Ghats', icon: '🏕', price: '₹2,800+' },
    { name: 'Kudremukh', region: 'Western Ghats', icon: '🌿', price: '₹3,200+' },
    { name: 'Rajmachi & Lonavala', region: 'Western Ghats', icon: '⚡', price: '₹2,400+' },
    { name: 'Coorg', region: 'Western Ghats', icon: '☕', price: '₹6,200+' },
    { name: 'Wayanad & Chembra', region: 'Western Ghats', icon: '🌿', price: '₹5,800+' },
    { name: 'Hampi', region: 'South India', icon: '🏛', price: '₹3,800+' },
    { name: 'Jaisalmer & Thar', region: 'Desert India', icon: '🏜', price: '₹5,500+' },
    { name: 'Bali (Indonesia)', region: 'International', icon: '✈️', price: '₹32,000+' },
    { name: 'Vietnam (Ha Giang)', region: 'International', icon: '🏍', price: '₹28,000+' },
  ];

  const handleDirectDestinationPlan = (destName: string) => {
    setDestinationText(destName);
    setDestinationMode('specific');
    setIsGenerating(true);

    const req: TripPlanRequest = {
      fromLocation,
      destination: destName,
      departureDate,
      returnDate,
      flexibleDates,
      totalDays,
      travelers: { adults, children, infants, partyType },
      budget: { amount: budgetAmount, isPerPerson, currency },
      travelStyles: selectedStyles,
      difficulty,
      transportModes: selectedTransports,
      accommodationTypes: selectedAccommodations,
      preferences: selectedPreferences
    };

    setTimeout(() => {
      const recommendations = getRankedRecommendations(req);
      setResults(recommendations);
      setIsGenerating(false);
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 400);
  };

  useEffect(() => {
    if (initialParams?.to && initialParams.to !== 'Anywhere' && initialParams.to.trim() !== '') {
      handleDirectDestinationPlan(initialParams.to);
    }
  }, [initialParams?.to]);

  const handleGenerate = () => {
    setIsGenerating(true);
    const destination =
      destinationMode === 'surprise'
        ? 'Surprise me'
        : destinationMode === 'budget'
        ? 'Anywhere within my budget'
        : destinationText || 'Anywhere';

    const req: TripPlanRequest = {
      fromLocation,
      destination,
      departureDate,
      returnDate,
      flexibleDates,
      totalDays,
      travelers: { adults, children, infants, partyType },
      budget: { amount: budgetAmount, isPerPerson, currency },
      travelStyles: selectedStyles,
      difficulty,
      transportModes: selectedTransports,
      accommodationTypes: selectedAccommodations,
      preferences: selectedPreferences
    };

    setTimeout(() => {
      const recommendations = getRankedRecommendations(req);
      setResults(recommendations);
      setIsGenerating(false);
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 600);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Wizard Progress Bar Header */}
      <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Step {currentStep} of {totalSteps}
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {currentStep === 1 && 'Where are you starting from?'}
              {currentStep === 2 && 'Where do you want to explore?'}
              {currentStep === 3 && 'When are you travelling?'}
              {currentStep === 4 && 'Who is travelling with you?'}
              {currentStep === 5 && 'What is your travel budget?'}
              {currentStep === 6 && 'Choose your travel styles & activities'}
              {currentStep === 7 && 'Select desired trail & trip difficulty'}
              {currentStep === 8 && 'How will you commute & navigate?'}
              {currentStep === 9 && 'What stay accommodation do you prefer?'}
              {currentStep === 10 && 'Fine-tune your personal trip preferences'}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-slate-700">
              {Math.round((currentStep / totalSteps) * 100)}% Completed
            </span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="hidden md:flex justify-between items-center mt-4 text-[11px] font-semibold text-slate-400">
          {['Origin', 'Destination', 'Dates', 'Travelers', 'Budget', 'Styles', 'Difficulty', 'Transport', 'Stay', 'Preferences'].map(
            (label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setCurrentStep(idx + 1)}
                className={`transition-colors ${
                  currentStep === idx + 1
                    ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5'
                    : currentStep > idx + 1
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {idx + 1}. {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Wizard Active Step Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-6">
          {/* STEP 1: STARTING POINT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Enter your departure city, use your current GPS location, or select a major travel hub.
              </p>
              <div className="relative max-w-lg">
                <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-emerald-600" />
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Bangalore, Delhi, Hyderabad"
                  className="w-full rounded-2xl border border-slate-300 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFromLocation('Current Location (Pune)')}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Use Current GPS Location</span>
                </button>
                {['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Kolkata'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setFromLocation(city)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      fromLocation === city
                        ? 'border-emerald-500 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DESTINATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Specify where you want to go, or let our adventure engine recommend ideal hidden spots.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationMode('specific')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    destinationMode === 'specific'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">Specific Destination</div>
                  <div className="text-xs text-slate-500 mt-1">I have a spot in mind (e.g. Spiti, Rajgad, Goa)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationMode('budget')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    destinationMode === 'budget'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">Anywhere in My Budget</div>
                  <div className="text-xs text-slate-500 mt-1">Recommend the top adventures fitting my funds</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationMode('surprise')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    destinationMode === 'surprise'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Surprise Me!
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Show thrilling adventures I might not know about</div>
                </button>
              </div>

              {destinationMode === 'specific' && (
                <div className="space-y-4 pt-2">
                  <div className="max-w-xl">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                      <span>Destination Name, Region, or Trek</span>
                      {destinationText && (
                        <button
                          type="button"
                          onClick={() => setDestinationText('')}
                          className="text-[11px] font-semibold text-rose-600 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600" />
                      <input
                        type="text"
                        value={destinationText}
                        onChange={(e) => setDestinationText(e.target.value)}
                        placeholder="e.g. Leh Ladakh, Spiti, Goa, Gokarna, Rajgad, Kasol, Bali"
                        className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Immediate Action Bar if destination is set */}
                  {destinationText.trim() && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-sm animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm">
                          ⚡
                        </span>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                            Ready for Instant Planning
                          </div>
                          <div className="text-sm font-black text-slate-900">
                            Adventure Plan for <span className="text-emerald-700">{destinationText}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDirectDestinationPlan(destinationText)}
                          disabled={isGenerating}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition active:scale-95"
                        >
                          {isGenerating ? (
                            <Sparkles className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span>Plan {destinationText} Now 🚀</span>
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                          title="Fine tune dates, budget and group"
                        >
                          <span>Next (Dates)</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Select Popular Adventures */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        ⚡ Quick Pick Popular Adventures (Click to select or plan instantly)
                      </span>
                      <span className="text-[11px] text-slate-400">1-Click Auto-Fill</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {POPULAR_DESTINATIONS.map((dest) => {
                        const isSelected =
                          destinationText.toLowerCase().includes(dest.name.toLowerCase()) ||
                          dest.name.toLowerCase().includes(destinationText.toLowerCase());

                        return (
                          <div
                            key={dest.name}
                            onClick={() => setDestinationText(dest.name)}
                            className={`group relative rounded-2xl border p-2.5 text-left cursor-pointer transition flex flex-col justify-between ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                                : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-2xl">{dest.icon}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectDestinationPlan(dest.name);
                                }}
                                className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-600 hover:text-white px-2 py-0.5 rounded-lg transition"
                                title="Direct Plan"
                              >
                                Plan ⚡
                              </button>
                            </div>
                            <div className="mt-2">
                              <div className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-700">
                                {dest.name}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                                <span>{dest.region}</span>
                                <span className="font-semibold text-slate-700">{dest.price}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {destinationMode === 'budget' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-emerald-900 uppercase">Budget Optimization Active</div>
                    <p className="text-xs text-slate-600">We will evaluate travel from {fromLocation} and rank all adventures fitting your funds.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition shrink-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Best Budget Trips</span>
                  </button>
                </div>
              )}

              {destinationMode === 'surprise' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase">Mystery Adventure Mode</div>
                    <p className="text-xs text-slate-600">Surprise me with thrilling off-grid trails, camping ridges, and coastal circuits.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-700 transition shrink-0"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Surprise Me With Hidden Gems</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DATES */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Choose dates or specify trip length for flexible adventure recommendations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Departure Date</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={departureDate}
                    onChange={(e) => handleDepartureChange(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 p-3 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Return Date</label>
                  <input
                    type="date"
                    min={departureDate || todayStr}
                    value={returnDate}
                    onChange={(e) => handleReturnChange(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-300 p-3 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="flexDates"
                  checked={flexibleDates}
                  onChange={(e) => setFlexibleDates(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="flexDates" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  My travel dates are flexible (+/- 3 days)
                </label>
              </div>

              <div className="max-w-md pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Duration of Trip:</span>
                  <span className="text-sm font-bold text-emerald-700">{totalDays} Days ({totalDays - 1} Nights)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1 Day (Weekend Hike)</span>
                  <span>7 Days (Week Expedition)</span>
                  <span>14 Days (Grand Tour)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TRAVELERS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Specify your travel party to tailor safety, accommodation, and group rates.
              </p>
              {/* Party Type Selectable Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Solo', 'Couple', 'Group', 'Family'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPartyType(type);
                      if (type === 'Solo') setAdults(1);
                      else if (type === 'Couple') setAdults(2);
                      else if (adults < 3) setAdults(3);
                    }}
                    className={`rounded-2xl border p-3.5 text-center font-bold text-sm transition ${
                      partyType === type
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Headcounts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl pt-2">
                <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Adults</div>
                    <div className="text-[11px] text-slate-400">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Children</div>
                    <div className="text-[11px] text-slate-400">Age 2–12</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Infants</div>
                    <div className="text-[11px] text-slate-400">Under 2</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(infants + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TRAVEL BUDGET */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Set your budget constraints. We optimize routes, stays, and activities to fit strictly within this limit.
              </p>

              {/* Currency & Per-Person Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((c) => (
                      <option key={c} value={c}>
                        {c} ({CURRENCY_RATES[c].symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsPerPerson(false)}
                    className={`rounded-lg px-3 py-1 transition ${
                      !isPerPerson ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Total Trip Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPerPerson(true)}
                    className={`rounded-lg px-3 py-1 transition ${
                      isPerPerson ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Per Person
                  </button>
                </div>
              </div>

              {/* Preset Budget Ranges */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Quick Presets (INR)</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl">
                  {[
                    { label: '₹2,000–₹5,000', val: 5000 },
                    { label: '₹5,000–₹10,000', val: 10000 },
                    { label: '₹10,000–₹25,000', val: 20000 },
                    { label: '₹25,000–₹50,000', val: 40000 },
                    { label: '₹50,000+', val: 75000 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBudgetAmount(preset.val)}
                      className={`rounded-xl border py-2.5 px-2 text-xs font-bold transition ${
                        budgetAmount === preset.val
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Budget Input */}
              <div className="max-w-md pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-base font-bold text-slate-500">
                    {CURRENCY_RATES[currency].symbol}
                  </span>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    step={1000}
                    className="w-full rounded-2xl border border-slate-300 py-3 pl-9 pr-4 text-lg font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TRAVEL STYLE (22 Selectable Cards) */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Select all activities and vibes that excite you ({selectedStyles.length} selected).
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedStyles(TRAVEL_STYLE_OPTIONS.map((s) => s.label))}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {TRAVEL_STYLE_OPTIONS.map((style) => {
                  const isSelected = selectedStyles.includes(style.label);
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => toggleStyle(style.label)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition text-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <span className="text-2xl mb-1">{style.icon}</span>
                      <span className="text-xs">{style.label}</span>
                      {isSelected && (
                        <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: DIFFICULTY */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Choose the physical fitness and adventure intensity you are comfortable with.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    level: 'Easy',
                    desc: 'Scenic walks, beach strolls, safari drives, minimal physical exertion. Ideal for all ages.',
                    color: 'text-green-600',
                    border: 'border-green-300'
                  },
                  {
                    level: 'Moderate',
                    desc: 'Sahyadri fort trails, day hikes (8-14km), gradual altitude gain, dirt tracks.',
                    color: 'text-blue-600',
                    border: 'border-blue-300'
                  },
                  {
                    level: 'Difficult',
                    desc: 'High Himalayan passes (>14,000 ft), multi-day unsupported backpacking, rocky scrambles.',
                    color: 'text-amber-600',
                    border: 'border-amber-300'
                  },
                  {
                    level: 'Extreme',
                    desc: 'Sub-zero snow summits, technical ropes, white-water rapids grade 4+, high AMS endurance.',
                    color: 'text-red-600',
                    border: 'border-red-300'
                  }
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setDifficulty(item.level as any)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      difficulty === item.level
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`text-base font-black ${item.color}`}>{item.level}</div>
                    <div className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: TRANSPORTATION */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Select your preferred transit options (multiple allowed).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TRANSPORT_MODES.map((mode) => {
                  const isSelected = selectedTransports.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleTransport(mode)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-sm font-bold transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span>{mode}</span>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: ACCOMMODATION */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                What type of stay suits your vibe and budget?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACCOMMODATION_OPTIONS.map((acc) => {
                  const isSelected = selectedAccommodations.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccommodation(acc)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-xs font-bold transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <span>{acc}</span>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 10: PREFERENCES (14 Checkboxes) */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Customize subtle travel preferences to dial in the perfect itinerary.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto">
                {PREFERENCE_OPTIONS.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <label
                      key={pref}
                      onClick={() => togglePreference(pref)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-xs font-semibold cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{pref}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Computing AI Match Scores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate My Adventure</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* GENERATED RECOMMENDATION RESULTS */}
      {results && (
        <div id="results-section" className="space-y-6 pt-6 scroll-mt-24">
          {/* Active direct destination indicator banner */}
          {destinationMode === 'specific' && destinationText && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-lg shadow-sm">
                  🎯
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Precision Destination Plan Active
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    Tailored Adventure & Budget Itinerary for <span className="text-emerald-700 underline underline-offset-4">{destinationText}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Customize Dates, Group & Budget</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                AI Intelligence Output
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Ranked Adventure Recommendations for You
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by overall match score based on your budget, travel style, season, and difficulty.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {results.length} Matches Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.slice(0, 6).map((item, idx) => {
              const dest = item.destination;
              return (
                <div
                  key={dest.id}
                  className="group rounded-3xl bg-white overflow-hidden shadow-lg border border-slate-200 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Hero Image Container */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/10">
                          #{idx + 1} Best Match
                        </span>
                        <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-black text-white">
                          {item.matchScore}% MATCH
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-semibold text-emerald-300">
                          {dest.state ? `${dest.state}, ` : ''}{dest.country} • {dest.region}
                        </span>
                        <h4 className="text-xl font-black">{dest.name}</h4>
                      </div>
                    </div>

                    {/* Card Content & Match Score Breakdown */}
                    <div className="p-5 space-y-4">
                      {/* Pricing & Duration Banner */}
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Total</div>
                          <div className="text-base font-black text-emerald-700">
                            {formatPrice(item.estimatedTotalCost, currency)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ~{formatPrice(item.estimatedCostPerPerson, currency)} / person
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Trip Length</div>
                          <div className="text-xs font-bold text-slate-800">{item.suggestedDuration}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{dest.bestSeason}</div>
                        </div>
                      </div>

                      {/* 5-Factor Score Bars */}
                      <div className="rounded-xl border border-slate-100 p-3 space-y-2 text-xs">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                          <span>Match Breakdown</span>
                          <span className="text-emerald-700 font-mono font-bold">{item.matchScore}/100</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div>
                            <div className="flex justify-between text-slate-500 mb-0.5">
                              <span>Budget</span>
                              <span>{item.breakdown.budgetMatch}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${item.breakdown.budgetMatch}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-slate-500 mb-0.5">
                              <span>Adventure</span>
                              <span>{item.breakdown.adventureMatch}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${item.breakdown.adventureMatch}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-slate-500 mb-0.5">
                              <span>Season</span>
                              <span>{item.breakdown.seasonMatch}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${item.breakdown.seasonMatch}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-slate-500 mb-0.5">
                              <span>Difficulty</span>
                              <span>{item.breakdown.difficultyMatch}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${item.breakdown.difficultyMatch}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Recommendation Reason */}
                      <div className="rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-950">
                        <strong className="text-emerald-800">Why recommended:</strong> {item.reason}
                      </div>

                      {/* Popular activities pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {dest.popularActivities.slice(0, 3).map((act) => (
                          <span
                            key={act}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/destinations/${dest.slug}`)}
                      className="w-1/2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/itinerary/generate?dest=${dest.id}&from=${fromLocation}&days=${totalDays}&travelers=${adults + children}`
                        )
                      }
                      className="w-1/2 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition text-center shadow-md shadow-emerald-600/20"
                    >
                      <span>Build Itinerary</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
