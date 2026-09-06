'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Fuel, Hotel, Utensils, ShieldAlert, Layers } from 'lucide-react';

interface MapMarkerPoint {
  lat: number;
  lng: number;
  title: string;
  type: 'start' | 'end' | 'stop' | 'hotel' | 'food' | 'fuel' | 'emergency';
  details?: string;
}

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarkerPoint[];
  polylineCoords?: [number, number][];
  height?: string;
}

export default function InteractiveMap({
  center = [18.5204, 73.8567], // Default Pune / Maharashtra
  zoom = 7,
  markers = [],
  polylineCoords = [],
  height = '460px'
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    import('leaflet').then((leaflet) => {
      if (isCancelled) return;
      L = leaflet.default;

      // Fix default marker icon issues in React
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        // Initialize map
        const map = L.map(mapContainerRef.current).setView(center, zoom);

        // OpenStreetMap Outdoor / Standard tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors | TRAVELX Maps'
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers & polyline whenever data or filter changes
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old layers except tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof (window as any).L.Marker || layer instanceof (window as any).L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const L = (window as any).L;
    if (!L) return;

    const filtered = markers.filter((m) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'route') return m.type === 'start' || m.type === 'end' || m.type === 'stop';
      if (activeFilter === 'hotel') return m.type === 'hotel';
      if (activeFilter === 'food') return m.type === 'food';
      if (activeFilter === 'fuel') return m.type === 'fuel';
      if (activeFilter === 'emergency') return m.type === 'emergency';
      return true;
    });

    const bounds: any[] = [];

    // Add Markers
    filtered.forEach((m) => {
      let iconColor = '#059669'; // default emerald
      if (m.type === 'start') iconColor = '#2563eb'; // blue
      else if (m.type === 'end') iconColor = '#dc2626'; // red
      else if (m.type === 'fuel') iconColor = '#ea580c'; // amber
      else if (m.type === 'emergency') iconColor = '#b91c1c'; // dark red
      else if (m.type === 'food') iconColor = '#d97706'; // warm yellow

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          background-color: ${iconColor};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">★</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${m.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Type: <strong style="text-transform: uppercase;">${m.type}</strong></div>
          ${m.details ? `<div style="font-size: 11px; color: #334155; margin-top: 4px;">${m.details}</div>` : ''}
        </div>
      `);
      bounds.push([m.lat, m.lng]);
    });

    // Draw Route Polyline
    if (polylineCoords.length > 1) {
      const polyline = L.polyline(polylineCoords, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85,
        smoothFactor: 1
      }).addTo(map);
      bounds.push(...polylineCoords);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [isLoaded, markers, polylineCoords, activeFilter]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
      {/* Map Category Filter Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-md text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          All Points ({markers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('route')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
            activeFilter === 'route'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Navigation className="h-3 w-3" />
          <span>Route Stops</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('fuel')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
            activeFilter === 'fuel'
              ? 'bg-amber-600 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Fuel className="h-3 w-3" />
          <span>Fuel & EV</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('hotel')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
            activeFilter === 'hotel'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Hotel className="h-3 w-3" />
          <span>Stays</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('emergency')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition ${
            activeFilter === 'emergency'
              ? 'bg-red-600 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="h-3 w-3" />
          <span>Emergency</span>
        </button>
      </div>

      {/* The Leaflet Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />
    </div>
  );
}
