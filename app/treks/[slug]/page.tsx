import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Mountain, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  Radio, 
  FileText, 
  Footprints, 
  CheckCircle2, 
  ArrowRight,
  HeartPulse,
  Share2
} from 'lucide-react';
import { TREKS } from '@/data/treks';
import ElevationProfile from '@/components/elevation-profile';
import SafetyDossier from '@/components/safety-dossier';

interface TrekDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrekDetailPage({ params }: TrekDetailPageProps) {
  const { slug } = await params;
  const trek = TREKS.find((t) => t.slug === slug);

  if (!trek) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Header Banner */}
      <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative bg-slate-900 min-h-[360px] flex items-end">
        <img
          src={trek.heroImage}
          alt={trek.title}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 text-white space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-black uppercase tracking-wider">
              {trek.difficulty} Grade
            </span>
            <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-0.5 text-xs font-bold text-slate-200 border border-white/10">
              {trek.location}, {trek.state}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black">{trek.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 font-medium">
            <span className="flex items-center gap-1.5 font-mono">
              <Mountain className="h-4 w-4 text-emerald-400" />
              Summit: {trek.maxAltitudeM}m
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Footprints className="h-4 w-4 text-emerald-400" />
              Distance: {trek.distanceKm}km
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              Duration: {trek.durationDays} Days
            </span>
            <span className="flex items-center gap-1.5 font-mono text-emerald-300 font-bold">
              Cost: ₹{trek.costPerPerson.toLocaleString('en-IN')} / person
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols): Elevation Chart, Trail Logistics & Packing */}
        <div className="lg:col-span-8 space-y-8">
          {/* Elevation Profile SVG Visualizer */}
          <ElevationProfile
            stages={trek.elevationProfile}
            maxAltitudeM={trek.maxAltitudeM}
            elevationGainM={trek.elevationGainM}
            totalDistanceKm={trek.distanceKm}
          />

          {/* Trail Logistics & Starting Point */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Trailhead & Logistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Starting Point</span>
                <p className="font-bold text-slate-900">{trek.startingPoint}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Best Months</span>
                <p className="font-bold text-emerald-700">{trek.bestSeason}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">How To Reach</span>
              <p className="text-slate-700 leading-relaxed font-medium">{trek.howToReach}</p>
            </div>
          </div>

          {/* Packing List & Gear Checklist */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">What to Carry (Mandatory Packing List)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {trek.packingList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Precautions & Trail Warnings */}
          <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              High-Altitude Precautionary Briefing
            </span>
            <h3 className="text-xl font-black">Trail Safety & Risk Mitigation</h3>
            <div className="space-y-2 text-xs text-slate-300">
              {trek.safetyPrecautions.map((sec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Safety Dossier & Direct Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Action Card */}
          <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Expedition Cost</span>
              <div className="text-3xl font-black text-emerald-700">
                ₹{trek.costPerPerson.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">Per Person (Self-organized / Camp stay)</span>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/itinerary/generate?dest=${trek.slug}&from=Pune&days=${trek.durationDays}&travelers=2&style=Trekking`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
              >
                <span>Generate Full Trek Itinerary</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plan"
                className="w-full block rounded-2xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Customize Group Trip
              </Link>
            </div>
          </div>

          {/* Live Safety Dossier */}
          <SafetyDossier
            riskLevel={trek.difficulty === 'Extreme' ? 'Extreme Caution' : trek.difficulty === 'Difficult' ? 'Adventure Risk' : 'High Safety'}
            emergencyFacilities={{
              nearestHospital: `${trek.location} Community Health Care Centre`,
              hospitalContact: '+91 112 / 108',
              nearestPoliceStation: `${trek.location} Police Post`,
              policeContact: '+91 112',
              touristHelpline: '112 / Forest Dept'
            }}
            trekSafety={{
              difficulty: trek.difficulty,
              amsRisk: trek.amsRisk,
              waterAvailability: trek.waterAvailability,
              mobileNetwork: trek.mobileNetwork,
              permitRequired: trek.permitRequired,
              guideRequired: trek.guideRequired
            }}
          />
        </div>
      </div>
    </div>
  );
}
