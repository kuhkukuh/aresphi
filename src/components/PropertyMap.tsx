'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface PropertyMapProps {
  latitude: number | null;
  longitude: number | null;
  location: string;
  propertyName: string;
}

// Dynamically import map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function PropertyMap({ latitude, longitude, location, propertyName }: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [orangeIcon, setOrangeIcon] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Import leaflet CSS and create icon only on client
    Promise.all([
      import('leaflet/dist/leaflet.css'),
      import('leaflet'),
    ]).then(([, L]) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 30px;
          height: 30px;
          background: #f97316;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
      setOrangeIcon(icon);
    });
  }, []);

  // Default to Indonesia center if no coordinates
  const lat = latitude ?? -6.2088;
  const lng = longitude ?? 106.8456;

  if (!isClient) {
    return (
      <div className="rounded-2xl overflow-hidden aspect-[16/7] bg-stone-200 flex items-center justify-center">
        <span className="text-stone-400">Loading map...</span>
      </div>
    );
  }

  // If no coordinates, show placeholder
  if (!latitude || !longitude) {
    return (
      <div className="rounded-2xl overflow-hidden aspect-[16/7] bg-stone-200 relative flex items-center justify-center">
        <i className="ph-fill ph-map-pin text-orange text-4xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}></i>
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm text-stone-700">
          {location}
        </div>
        <div className="absolute top-4 right-4 text-xs text-stone-400 bg-white/80 backdrop-blur-md rounded px-2 py-1">
          Koordinat belum tersedia
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden aspect-[16/7] relative">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {orangeIcon && (
          <Marker position={[lat, lng]} icon={orangeIcon}>
            <Popup>
              <div className="font-medium">{propertyName}</div>
              <div className="text-sm text-stone-500">{location}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 text-sm text-stone-700 z-10">
        {location}
      </div>
    </div>
  );
}
