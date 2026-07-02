'use client';

import { useState } from 'react';
import PhotoUploader from './PhotoUploader';

type Property = {
  id: number;
  name: string;
  location: string;
  price: string;
  status: 'available' | 'sold' | 'rented';
  showInShowcase: boolean;
  displayOrder: number;
  photos: { id: number; url: string; alt: string }[];
};

type Props = {
  property: Property | null;
  onSave: (property: Property) => void;
  onCancel: () => void;
};

export default function PropertyEditor({ property, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    location: property?.location || '',
    price: property?.price || '',
    status: property?.status || 'available' as const,
    showInShowcase: property?.showInShowcase || false,
  });
  const [photos, setPhotos] = useState(property?.photos || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = property
        ? `/api/admin/properties/${property.id}`
        : '/api/admin/properties';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const savedProperty = await res.json();
      onSave(savedProperty);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
      <h3 className="text-lg font-medium mb-4">
        {property ? 'Edit Property' : 'New Property'}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Price</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
            placeholder="Rp 2.5 M"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as Property['status'] }))}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showInShowcase}
            onChange={(e) => setFormData((f) => ({ ...f, showInShowcase: e.target.checked }))}
            className="w-4 h-4 text-orange focus:ring-orange border-stone-300 rounded"
          />
          <span className="text-sm font-medium text-stone-600">Show in Showcase carousel</span>
        </label>
      </div>

      {property && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-600 mb-2">Photos</label>
          <PhotoUploader propertyId={property.id} photos={photos} onPhotosChange={setPhotos} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-stone-600 hover:text-stone-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
