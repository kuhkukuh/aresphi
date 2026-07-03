'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // province/state
  admin2?: string; // city/regency
  admin3?: string; // district
};

type AddressInputProps = {
  value: string;
  onChange: (value: string, coords?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function AddressInput({
  value,
  onChange,
  placeholder = 'Cari alamat...',
  className = '',
  disabled = false,
}: AddressInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=id&format=json`
      );
      const data = await response.json();
      
      // Filter for Indonesia results primarily
      const indonesiaResults = (data.results || []).filter(
        (r: GeocodingResult) => r.country_code === 'ID'
      );
      
      setResults(indonesiaResults.length > 0 ? indonesiaResults : data.results || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Geocoding error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSelectResult = (result: GeocodingResult) => {
    // Build formatted address
    const parts = [result.name];
    if (result.admin3) parts.push(result.admin3);
    if (result.admin2) parts.push(result.admin2);
    if (result.admin1) parts.push(result.admin1);
    
    const formattedAddress = parts.join(', ');
    
    setQuery(formattedAddress);
    setIsOpen(false);
    onChange(formattedAddress, {
      lat: result.latitude,
      lng: result.longitude,
    });
  };

  const formatResultLabel = (result: GeocodingResult) => {
    const parts = [result.name];
    if (result.admin3) parts.push(result.admin3);
    if (result.admin2) parts.push(result.admin2);
    if (result.admin1) parts.push(result.admin1);
    return parts.join(', ');
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (query.length >= 3 && results.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-xl border border-stone-200/50 rounded-xl shadow-xl shadow-stone-900/10 overflow-hidden"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-stone-400">Mencari...</div>
            ) : results.length > 0 ? (
              <ul>
                {results.map((result, index) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className={`w-full text-left px-4 py-3 hover:bg-stone-100 transition-colors cursor-pointer ${
                        index !== results.length - 1 ? 'border-b border-stone-100' : ''
                      }`}
                    >
                      <div className="text-sm text-stone-900">{result.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {formatResultLabel(result).replace(result.name + ', ', '')}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-stone-400">
                Tidak ada hasil ditemukan
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
