'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const PROPERTY_TYPES = [
  { value: 'rumah', label: 'Rumah' },
  { value: 'apartemen', label: 'Apartemen' },
  { value: 'villa', label: 'Villa' },
  { value: 'ruko', label: 'Ruko' },
];

interface PropertyFiltersProps {
  distinctLocations: string[];
  selectedTypes: string[];
  selectedLocations: string[];
}

export default function PropertyFilters({
  distinctLocations,
  selectedTypes,
  selectedLocations,
}: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for instant UI feedback
  const [localTypes, setLocalTypes] = useState<string[]>(selectedTypes);
  const [localLocations, setLocalLocations] = useState<string[]>(selectedLocations);

  // Update URL when filters change
  const updateFilters = (types: string[], locations: string[]) => {
    const params = new URLSearchParams();
    if (types.length > 0) {
      params.set('tipe', types.join(','));
    }
    if (locations.length > 0) {
      params.set('lokasi', locations.join(','));
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const toggleType = (type: string) => {
    const newTypes = localTypes.includes(type)
      ? localTypes.filter((t) => t !== type)
      : [...localTypes, type];
    setLocalTypes(newTypes);
    updateFilters(newTypes, localLocations);
  };

  const toggleLocation = (location: string) => {
    const newLocations = localLocations.includes(location)
      ? localLocations.filter((l) => l !== location)
      : [...localLocations, location];
    setLocalLocations(newLocations);
    updateFilters(localTypes, newLocations);
  };

  const resetFilters = () => {
    setLocalTypes([]);
    setLocalLocations([]);
    router.push(pathname, { scroll: false });
  };

  // Sync local state with URL on mount/change
  useEffect(() => {
    setLocalTypes(selectedTypes);
    setLocalLocations(selectedLocations);
  }, [selectedTypes, selectedLocations]);

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div className="filter-panel rounded-2xl p-6 lg:sticky lg:top-32 space-y-8">
        {/* Property Type Filter */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="eyebrow-left">Tipe Properti</span>
          </div>
          <div className="space-y-3">
            {PROPERTY_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-3 text-sm text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="filter-check"
                  checked={localTypes.includes(type.value)}
                  onChange={() => toggleType(type.value)}
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        {distinctLocations.length > 0 && (
          <div className="pt-8 border-t border-stone-300/40">
            <span className="eyebrow-left block mb-4">Lokasi</span>
            <div className="space-y-3">
              {distinctLocations.map((location) => (
                <label key={location} className="flex items-center gap-3 text-sm text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="filter-check"
                    checked={localLocations.includes(location)}
                    onChange={() => toggleLocation(location)}
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Reset Filter */}
        <div className="pt-6 border-t border-stone-300/40 text-right">
          <button
            onClick={resetFilters}
            className="text-xs text-stone-400 hover:text-orange underline underline-offset-2"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </aside>
  );
}
