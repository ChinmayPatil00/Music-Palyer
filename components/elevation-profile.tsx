'use client';

import React, { useState } from 'react';
import { Mountain, ArrowUpRight, Footprints, Flag } from 'lucide-react';

interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  stageName: string;
}

interface ElevationProfileProps {
  stages: ElevationPoint[];
  maxAltitudeM: number;
  elevationGainM: number;
  totalDistanceKm: number;
}

export default function ElevationProfile({
  stages,
  maxAltitudeM,
  elevationGainM,
  totalDistanceKm
}: ElevationProfileProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ElevationPoint | null>(null);

  if (!stages || stages.length === 0) return null;

  const minElevation = Math.min(...stages.map((s) => s.elevationM));
  const maxElevation = Math.max(...stages.map((s) => s.elevationM));
  const elevationRange = Math.max(100, maxElevation - minElevation);

  const chartWidth = 700;
  const chartHeight = 220;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Convert (distance, elevation) to SVG (x, y) coordinates
  const points = stages.map((s) => {
    const x = padding.left + (s.distanceKm / Math.max(1, totalDistanceKm)) * innerWidth;
    const y = padding.top + innerHeight - ((s.elevationM - minElevation) / elevationRange) * innerHeight;
    return { ...s, x, y };
  });

  // Construct SVG path strings
  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
      {/* Top Metric Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-lg">Trail Elevation Profile</h3>
          </div>
          <p className="text-xs text-slate-500">
            Interactive elevation profile from starting trailhead to summit
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 text-slate-700">
            <span className="text-slate-400 uppercase text-[10px] block">Max Altitude</span>
            <span className="text-emerald-700 font-mono text-sm">{maxAltitudeM} m</span>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 text-slate-700">
            <span className="text-slate-400 uppercase text-[10px] block">Elevation Gain</span>
            <span className="text-blue-700 font-mono text-sm">+{elevationGainM} m</span>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 text-slate-700">
            <span className="text-slate-400 uppercase text-[10px] block">Distance</span>
            <span className="text-indigo-700 font-mono text-sm">{totalDistanceKm} km</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto select-none"
        >
          <defs>
            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal elevations) */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const ele = Math.round(minElevation + ratio * elevationRange);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {ele}m
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#elevationGradient)" />

          {/* Elevation Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="elevation-path"
          />

          {/* Interactive Stage Points */}
          {points.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-150"
              />
              {/* Stage Pin Label */}
              <text
                x={pt.x}
                y={padding.top + innerHeight + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#64748b"
              >
                {pt.distanceKm}km
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Information Tooltip */}
        {hoveredPoint && (
          <div className="rounded-2xl bg-slate-900 text-white p-3 shadow-xl text-xs space-y-1 max-w-xs mt-2 border border-slate-700">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <Flag className="h-3.5 w-3.5" />
              <span>{hoveredPoint.stageName}</span>
            </div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px]">
              <span>Altitude: {hoveredPoint.elevationM} m</span>
              <span>Distance: {hoveredPoint.distanceKm} km</span>
            </div>
          </div>
        )}
      </div>

      {/* Stage Walkthrough Legend */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Key Waypoints on Trail
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs border border-slate-200"
            >
              <span className="font-semibold text-slate-800 truncate pr-2">
                {idx + 1}. {stage.stageName}
              </span>
              <span className="font-mono font-bold text-emerald-700 shrink-0">
                {stage.elevationM}m ({stage.distanceKm}km)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
