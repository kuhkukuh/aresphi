'use client';

import { useState, useEffect } from 'react';
import PropertyEditor from './PropertyEditor';

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

export default function PropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/properties');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        console.error('Unexpected response:', data);
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this property?')) return;
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
    setProperties((p) => p.filter((prop) => prop.id !== id));
  };

  const handleSave = (property: Property) => {
    setProperties((p) => {
      const exists = p.find((prop) => prop.id === property.id);
      if (exists) {
        return p.map((prop) => (prop.id === property.id ? property : prop));
      }
      return [...p, property];
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading properties...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Property Listings</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
          }}
          className="bg-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          + Add Property
        </button>
      </div>

      {isCreating && (
        <PropertyEditor
          property={null}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id}>
            {editingId === property.id ? (
              <PropertyEditor
                property={property}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {property.photos[0] && (
                    <img
                      src={property.photos[0].url}
                      alt={property.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{property.name}</h3>
                    <p className="text-sm text-stone-500">{property.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : property.status === 'sold'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {property.status}
                  </span>
                  {property.showInShowcase && (
                    <span className="px-2 py-1 bg-stone-200 text-stone-600 rounded text-xs">
                      Showcase
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(property.id);
                      setIsCreating(false);
                    }}
                    className="text-stone-500 hover:text-stone-900 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {properties.length === 0 && !isCreating && (
          <p className="text-center text-stone-400 py-8">No properties yet. Add your first one!</p>
        )}
      </div>
    </div>
  );
}
