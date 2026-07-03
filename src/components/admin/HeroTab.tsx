'use client';

import { useState } from 'react';
import { useHeroPhotos, useUpdateHeroPhoto, useUploadPhoto } from '@/lib/admin-hooks';

export default function HeroTab() {
  const { data: photos, isLoading } = useHeroPhotos();
  const updateMutation = useUpdateHeroPhoto();
  const uploadMutation = useUploadPhoto();

  const [uploadingPosition, setUploadingPosition] = useState<number | null>(null);

  const handleUpload = async (position: number, file: File) => {
    setUploadingPosition(position);
    try {
      const { url } = await uploadMutation.mutateAsync(file);
      await updateMutation.mutateAsync({ position, url });
    } finally {
      setUploadingPosition(null);
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading hero photos...</p>;
  }

  // Positions: 1 = front, 2 = middle, 3 = back
  // In display: middle, front (elevated), back
  const positions: { pos: number; label: string; translate: string; size: string }[] = [
    { pos: 2, label: 'Posisi 2 (Tengah)', translate: '', size: '' },
    { pos: 1, label: 'Posisi 1 (Depan)', translate: '-translate-y-4', size: '' },
    { pos: 3, label: 'Posisi 3 (Belakang)', translate: '', size: '' },
  ];

  return (
    <>
      <div className="mb-6">
        <span className="eyebrow-left">Admin</span>
        <h2 className="font-playfair italic text-2xl text-stone-900">Foto Hero</h2>
        <p className="text-sm text-stone-500 mt-1">
          3 foto yang tampil pada stack kartu di halaman utama.
        </p>
      </div>

      <div className="grid items-end gap-4" style={{ gridTemplateColumns: '1fr 1.2fr 1fr' }}>
        {positions.map(({ pos, label, translate }) => {
          const photo = photos?.[pos - 1];
          const isUploading = uploadingPosition === pos;

          return (
            <div key={pos} className={`hero-tile relative ${translate}`}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-stone-200 group">
                {photo ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                    No photo
                  </div>
                )}

                {/* Upload overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-sm">Uploading...</p>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="hero-overlay absolute inset-0 bg-black/50 flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-stone-900 text-xs font-medium rounded-full px-4 py-2 hover:bg-stone-100 transition-colors">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(pos, file);
                      }}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 mt-4 text-center text-xs text-stone-400 uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 1.2fr 1fr' }}>
        <span>Posisi 2 (Tengah)</span>
        <span>Posisi 1 (Depan)</span>
        <span>Posisi 3 (Belakang)</span>
      </div>
    </>
  );
}
