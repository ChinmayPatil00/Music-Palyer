'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, Clock, Compass, ArrowRight } from 'lucide-react';
import { Destination } from '@/types';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist: string[] = getFromStorage(STORAGE_KEYS.WISHLIST, []);
    setIsWishlisted(wishlist.includes(destination.id));
  }, [destination.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist: string[] = getFromStorage(STORAGE_KEYS.WISHLIST, []);
    let updated: string[];
    if (wishlist.includes(destination.id)) {
      updated = wishlist.filter((id) => id !== destination.id);
      setIsWishlisted(false);
    } else {
      updated = [...wishlist, destination.id];
      setIsWishlisted(true);
    }
    setToStorage(STORAGE_KEYS.WISHLIST, updated);
  };

  let diffColor = 'bg-emerald-500/90 text-white';
  if (destination.difficulty === 'Moderate') diffColor = 'bg-blue-500/90 text-white';
  else if (destination.difficulty === 'Difficult') diffColor = 'bg-amber-500/90 text-white';
  else if (destination.difficulty === 'Extreme') diffColor = 'bg-red-500/90 text-white';

  return (
    <div className="group rounded-3xl bg-white overflow-hidden shadow-md border border-slate-200 hover:shadow-2xl transition duration-300 flex flex-col justify-between">
      <div>
        {/* Top Image Container with Badges */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Difficulty & Region Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`rounded-full backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${diffColor}`}>
              {destination.difficulty}
            </span>
            <span className="rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
              {destination.region}
            </span>
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition shadow-md"
            title="Add to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
              <span>{destination.state ? `${destination.state}, ` : ''}{destination.country}</span>
            </div>
            <h3 className="text-xl font-black">{destination.name}</h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Price and Rating Strip */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting from</span>
              <span className="text-lg font-black text-emerald-700">
                ₹{destination.startingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">/ person</span>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-black text-slate-900">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{destination.rating}</span>
                <span className="text-slate-400 font-normal">({destination.reviewCount})</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                <Clock className="h-2.5 w-2.5" />
                {destination.idealDurationDays} Days ideal
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          {/* Activity Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.popularActivities.slice(0, 3).map((act) => (
              <span
                key={act}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600"
              >
                {act}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <Link
          href={`/destinations/${destination.slug}`}
          className="w-1/2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center"
        >
          Explore Guide
        </Link>
        <button
          type="button"
          onClick={() => router.push(`/plan?to=${destination.name}`)}
          className="w-1/2 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition text-center shadow-sm"
        >
          <span>Plan Trip</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
