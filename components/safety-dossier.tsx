'use client';

import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  Radio, 
  Droplet, 
  FileCheck, 
  AlertTriangle,
  HeartPulse,
  Signal
} from 'lucide-react';

interface SafetyDossierProps {
  riskLevel?: 'High Safety' | 'Moderate Risk' | 'Adventure Risk' | 'Extreme Caution';
  emergencyFacilities: {
    nearestHospital: string;
    hospitalContact: string;
    nearestPoliceStation: string;
    policeContact: string;
    touristHelpline: string;
  };
  trekSafety?: {
    difficulty: string;
    amsRisk: string;
    waterAvailability: string;
    mobileNetwork: string;
    permitRequired: string;
    guideRequired: boolean;
  };
  weatherWarning?: string | null;
  layout?: 'sidebar' | 'full' | 'adaptive';
}

export default function SafetyDossier({
  riskLevel = 'High Safety',
  emergencyFacilities,
  trekSafety,
  weatherWarning,
  layout = 'adaptive'
}: SafetyDossierProps) {
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (riskLevel === 'Moderate Risk') badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  else if (riskLevel === 'Adventure Risk') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  else if (riskLevel === 'Extreme Caution') badgeColor = 'bg-red-100 text-red-800 border-red-300';

  const isSidebar = layout === 'sidebar';

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-xl border border-slate-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            Safety Dossier
          </span>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${badgeColor}`}>
            {riskLevel}
          </span>
        </div>
        <h3 className="text-xl font-black text-slate-900 leading-tight">Emergency Protocols & Risk Matrix</h3>
      </div>

      {/* Weather Warning Banner if active */}
      {weatherWarning && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-3.5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-0.5">Live Weather Hazard Warning:</strong>
            {weatherWarning}
          </div>
        </div>
      )}

      {/* Primary Emergency Hotlines */}
      <div className={isSidebar ? 'flex flex-col gap-2.5' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}>
        <a
          href="tel:112"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5 flex items-center gap-3 hover:border-red-300 hover:bg-red-50/40 transition shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-sm shadow-sm group-hover:scale-105 transition">
            112
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between gap-1">
              <span className="truncate">National Emergency</span>
              <span className="shrink-0 text-[10px] text-red-600 font-semibold uppercase tracking-wider group-hover:underline">Call ➔</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate">Police, Fire & Rescue</div>
          </div>
        </a>

        <a
          href="tel:108"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5 flex items-center gap-3 hover:border-blue-300 hover:bg-blue-50/40 transition shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm group-hover:scale-105 transition">
            108
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between gap-1">
              <span className="truncate">Medical Ambulance</span>
              <span className="shrink-0 text-[10px] text-blue-600 font-semibold uppercase tracking-wider group-hover:underline">Call ➔</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate">Immediate Trauma Response</div>
          </div>
        </a>

        <a
          href={`tel:${emergencyFacilities.touristHelpline.replace(/[^0-9+]/g, '') || '1363'}`}
          className={`group rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5 flex items-center gap-3 hover:border-emerald-300 hover:bg-emerald-50/40 transition shadow-sm ${!isSidebar ? 'sm:col-span-2 lg:col-span-1' : ''}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm group-hover:scale-105 transition">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between gap-1">
              <span className="truncate">Tourist Helpline</span>
              <span className="shrink-0 text-[10px] text-emerald-600 font-semibold uppercase tracking-wider group-hover:underline">Call ➔</span>
            </div>
            <div className="text-[11px] font-mono font-bold text-emerald-700 truncate">
              {emergencyFacilities.touristHelpline}
            </div>
          </div>
        </a>
      </div>

      {/* Local Health & Law Enforcement Facilities */}
      <div className={isSidebar ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        <div className="rounded-2xl border border-slate-200 p-3.5 bg-gradient-to-br from-white to-slate-50 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <div className="p-1 rounded-lg bg-red-100 text-red-600 shrink-0">
              <Hospital className="h-3.5 w-3.5" />
            </div>
            <span className="truncate">Nearest Medical Facility</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
            {emergencyFacilities.nearestHospital}
          </div>
          <a
            href={`tel:${emergencyFacilities.hospitalContact.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-between gap-1 text-xs font-mono text-slate-800 hover:text-red-700 bg-slate-100/90 hover:bg-red-50 px-3 py-2 rounded-xl transition border border-slate-200/60"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <PhoneCall className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span className="truncate font-semibold">{emergencyFacilities.hospitalContact}</span>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-red-600 uppercase">Dial ➔</span>
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 p-3.5 bg-gradient-to-br from-white to-slate-50 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <div className="p-1 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <Radio className="h-3.5 w-3.5" />
            </div>
            <span className="truncate">Nearest Police Post</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
            {emergencyFacilities.nearestPoliceStation}
          </div>
          <a
            href={`tel:${emergencyFacilities.policeContact.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-between gap-1 text-xs font-mono text-slate-800 hover:text-blue-700 bg-slate-100/90 hover:bg-blue-50 px-3 py-2 rounded-xl transition border border-slate-200/60"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <PhoneCall className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate font-semibold">{emergencyFacilities.policeContact}</span>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-blue-600 uppercase">Dial ➔</span>
          </a>
        </div>
      </div>

      {/* Trek / High Altitude Specific Safety Matrix */}
      {trekSafety && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            High-Altitude & Trail Readiness
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white p-2 border border-slate-100 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 truncate">
                <HeartPulse className="h-3 w-3 text-red-500 shrink-0" />
                AMS Risk
              </span>
              <span className="font-bold text-slate-800 text-[11px] block truncate">{trekSafety.amsRisk}</span>
            </div>

            <div className="rounded-xl bg-white p-2 border border-slate-100 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 truncate">
                <Droplet className="h-3 w-3 text-blue-500 shrink-0" />
                Water
              </span>
              <span className="font-bold text-slate-800 text-[11px] block truncate">{trekSafety.waterAvailability}</span>
            </div>

            <div className="rounded-xl bg-white p-2 border border-slate-100 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 truncate">
                <Signal className="h-3 w-3 text-emerald-500 shrink-0" />
                Signal
              </span>
              <span className="font-bold text-slate-800 text-[11px] block truncate">{trekSafety.mobileNetwork}</span>
            </div>

            <div className="rounded-xl bg-white p-2 border border-slate-100 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 truncate">
                <FileCheck className="h-3 w-3 text-amber-500 shrink-0" />
                Permit
              </span>
              <span className="font-bold text-slate-800 text-[11px] block truncate">{trekSafety.permitRequired}</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Legal Notice */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[10px] text-slate-500 leading-relaxed">
        <strong>Official Advisory:</strong> Verify live weather, permits, and trail condition with local checkpoints or forest offices before departure.
      </div>
    </div>
  );
}

