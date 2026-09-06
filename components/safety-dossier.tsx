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
}

export default function SafetyDossier({
  riskLevel = 'High Safety',
  emergencyFacilities,
  trekSafety,
  weatherWarning
}: SafetyDossierProps) {
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (riskLevel === 'Moderate Risk') badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  else if (riskLevel === 'Adventure Risk') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  else if (riskLevel === 'Extreme Caution') badgeColor = 'bg-red-100 text-red-800 border-red-300';

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            Active Adventure Safety Dossier
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Emergency Protocols & Risk Matrix</h3>
        </div>
        <div className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider ${badgeColor}`}>
          {riskLevel}
        </div>
      </div>

      {/* Weather Warning Banner if active */}
      {weatherWarning && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-0.5">Live Weather Hazard Warning:</strong>
            {weatherWarning}
          </div>
        </div>
      )}

      {/* Primary Emergency Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-black text-sm">
            112
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">National Emergency</div>
            <div className="text-[11px] text-slate-500">Police, Fire & General Rescue</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
            108
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Medical Ambulance</div>
            <div className="text-[11px] text-slate-500">Immediate Trauma Response</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Tourist Police Helpline</div>
            <div className="text-[11px] font-mono text-emerald-700 font-bold">{emergencyFacilities.touristHelpline}</div>
          </div>
        </div>
      </div>

      {/* Local Health & Law Enforcement Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 p-4 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Hospital className="h-4 w-4 text-red-500" />
            <span>Nearest Medical Facility</span>
          </div>
          <div className="text-sm font-black text-slate-900">{emergencyFacilities.nearestHospital}</div>
          <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
            <span>Direct Line: {emergencyFacilities.hospitalContact}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Radio className="h-4 w-4 text-blue-500" />
            <span>Nearest Police Post</span>
          </div>
          <div className="text-sm font-black text-slate-900">{emergencyFacilities.nearestPoliceStation}</div>
          <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
            <span>Direct Line: {emergencyFacilities.policeContact}</span>
          </div>
        </div>
      </div>

      {/* Trek / High Altitude Specific Safety Matrix */}
      {trekSafety && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            High-Altitude & Wilderness Readiness
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-red-500" />
                AMS Altitude Risk
              </span>
              <span className="font-bold text-slate-800">{trekSafety.amsRisk}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Droplet className="h-3 w-3 text-blue-500" />
                Water Springs
              </span>
              <span className="font-bold text-slate-800">{trekSafety.waterAvailability}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Signal className="h-3 w-3 text-emerald-500" />
                Cell Signal
              </span>
              <span className="font-bold text-slate-800">{trekSafety.mobileNetwork}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <FileCheck className="h-3 w-3 text-amber-500" />
                Mandatory Permits
              </span>
              <span className="font-bold text-slate-800">{trekSafety.permitRequired}</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Legal & Authority Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 text-[11px] text-slate-500 leading-relaxed">
        <strong>Important Official Verification Notice:</strong> The information, routes, risk indicators, and phone numbers shown above are curated for logistical preparation and guidance. Weather conditions, landslide status, avalanche risks, and wildlife movements change rapidly. TRAVELX strongly urges all travelers and trekkers to verify ground conditions with local district administration, police checkpoints, or State Forest Departments before setting out.
      </div>
    </div>
  );
}
