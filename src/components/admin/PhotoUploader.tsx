'use client';

import { useState, useRef } from 'react';

type Props = {
  propertyId: number;
  photos: { id: number; url: string; alt: string }[];
  onPhotosChange: (photos: { id: number; url: string; alt: string }[]) => void;
};

export default function PhotoUploader({ propertyId, photos, onPhotosChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/admin/photos', {
          method: 'POST',
          body: formData,
        });
        const { url } = await uploadRes.json();

        const photoRes = await fetch(`/api/admin/properties/${propertyId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, alt: '' }),
        });
        const newPhoto = await photoRes.json();
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Delete this photo?')) return;
    await fetch(`/api/admin/photos/${photoId}`, { method: 'DELETE' });
    onPhotosChange(photos.filter((p) => p.id !== photoId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-orange bg-orange/5' : 'border-stone-200 hover:border-stone-400'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        {isUploading ? (
          <p className="text-stone-500">Uploading...</p>
        ) : (
          <div>
            <p className="text-stone-500 mb-1">Drop images here or click to upload</p>
            <p className="text-xs text-stone-400">JPEG, PNG, WebP</p>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
