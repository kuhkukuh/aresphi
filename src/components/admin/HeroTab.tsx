'use client';

import { useState, useEffect } from 'react';

type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
} | null;

export default function HeroTab() {
  const [photos, setPhotos] = useState<[HeroPhoto, HeroPhoto, HeroPhoto]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);

  useEffect(() => {
    loadHeroPhotos();
  }, []);

  const loadHeroPhotos = async () => {
    setIsLoading(true);
    const res = await fetch('/api/admin/hero');
    const data = await res.json();
    setPhotos(data);
    setIsLoading(false);
  };

  const handleUpload = async (position: number, file: File) => {
    setUploadingPosition(position);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      });
      const { url } = await uploadRes.json();

      await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, url, alt: '' }),
      });

      await loadHeroPhotos();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload hero photo');
    } finally {
      setUploadingPosition(null);
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading hero photos...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Hero Photos</h2>
      <p className="text-sm text-stone-500 mb-6">
        These photos appear in the stacked card animation on the homepage.
        Position 1 is the front card, 3 is the back.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((position) => {
          const photo = photos[position - 1];
          const isUploading = uploadingPosition === position;

          return (
            <div key={position} className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                {photo ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400">
                    No photo
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white">Uploading...</p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Position {position}</span>
                <label className="cursor-pointer text-sm text-orange hover:text-orange-600">
                  Change
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(position, file);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
