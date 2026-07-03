'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  useProperties,
  useCreateProperty,
  useUpdateProperty,
  useUploadPhoto,
  useAddPropertyPhoto,
  useDeletePhoto,
  type Property,
} from '@/lib/admin-hooks';
import { appToast } from '@/lib/toast';
import { AddressInput } from '@/components/AddressInput';

export default function PropertiesTab() {
  const { data: properties, isLoading } = useProperties();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const uploadMutation = useUploadPhoto();
  const addPhotoMutation = useAddPropertyPhoto();
  const deletePhotoMutation = useDeletePhoto();

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]);

  const openCreateForm = () => {
    setEditingProperty(null);
    setShowForm(true);
    document.body.style.overflow = 'hidden';
  };

  const openEditForm = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
    document.body.style.overflow = 'hidden';
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProperty(null);
    setPendingPhotos([]);
    document.body.style.overflow = '';
  };

  const toggleFeatured = async (property: Property) => {
    const newFeaturedState = !property.showInShowcase;
    try {
      await updateMutation.mutateAsync({
        id: property.id,
        data: { showInShowcase: newFeaturedState },
      });
      
      if (newFeaturedState) {
        appToast.success('Ditambahkan ke showcase', { description: property.name });
      } else {
        appToast.removed('Dihapus dari showcase', { description: property.name });
      }
    } catch {
      appToast.error('Gagal mengubah status', { description: 'Terjadi kesalahan, silakan coba lagi.' });
    }
  };

  const handlePhotoUpload = async (files: FileList | null, propertyId: number | null) => {
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      for (const file of Array.from(files)) {
        const { url } = await uploadMutation.mutateAsync(file);
        if (propertyId) {
          await addPhotoMutation.mutateAsync({ propertyId, url });
        } else {
          setPendingPhotos((prev) => [...prev, url]);
        }
      }
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photoId: number | null, photoUrl?: string) => {
    if (photoId) {
      if (!confirm('Hapus foto ini?')) return;
      await deletePhotoMutation.mutateAsync(photoId);
    } else if (photoUrl) {
      setPendingPhotos((prev) => prev.filter((url) => url !== photoUrl));
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading properties...</p>;
  }

  return (
    <>
      <div className="mb-6">
        <span className="eyebrow-left">Admin</span>
        <h2 className="font-playfair italic text-2xl text-stone-900">Properti</h2>
        <p className="text-sm text-stone-500 mt-1">
          Kelola seluruh properti dari sini — tambah baru, urutkan, dan pilih mana yang tampil di seksi Koleksi Properti Unggulan.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add new property tile */}
        <button
          onClick={openCreateForm}
          className="h-64 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-orange hover:text-orange cursor-pointer transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wider">Tambah Properti</span>
        </button>

        {/* Property cards */}
        {properties?.map((property) => (
          <div
            key={property.id}
            onClick={() => openEditForm(property)}
            className="fp-card group relative rounded-2xl overflow-hidden shadow-lg h-64 cursor-pointer"
          >
            {property.photos[0] ? (
              <img
                src={property.photos[0].url}
                alt={property.name}
                className="fp-img w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <span className="text-stone-400">No photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Featured toggle (star) */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                toggleFeatured(property);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300"
              aria-label="Tandai sebagai featured"
            >
              <motion.svg 
                className={`w-5 h-5 transition-colors duration-300 ${
                  property.showInShowcase ? 'text-orange' : 'text-white'
                }`}
                fill="currentColor" 
                viewBox="0 0 24 24"
                initial={false}
                animate={{ 
                  rotate: property.showInShowcase ? [0, -15, 15, -10, 10, 0] : 0,
                  scale: property.showInShowcase ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </motion.svg>
            </motion.button>



            {/* Edit button (shown on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditForm(property);
              }}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-stone-700 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-white cursor-pointer transition-opacity"
              aria-label="Edit properti"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>

            {/* Property info */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-white pointer-events-none">
              <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium inline-block mb-2">
                {property.price}
              </div>
              <h3 className="font-playfair text-lg italic">{property.name}</h3>
              <p className="text-white/70 text-xs">{property.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Property Form — portaled to document.body so its
          `position: fixed` isn't contained by an ancestor's backdrop-filter
          (flashlight-card), which would otherwise scope "fixed" to that card. */}
      {showForm &&
        createPortal(
          <PropertyForm
            property={editingProperty}
            pendingPhotos={pendingPhotos}
            onClose={closeForm}
            onSave={async (data) => {
              if (editingProperty) {
                await updateMutation.mutateAsync({ id: editingProperty.id, data });
              } else {
                const newProperty = await createMutation.mutateAsync(data);
                // Upload pending photos after property is created
                for (const url of pendingPhotos) {
                  await addPhotoMutation.mutateAsync({ propertyId: newProperty.id, url });
                }
                setPendingPhotos([]);
              }
              closeForm();
            }}
            onUploadPhoto={handlePhotoUpload}
            onDeletePhoto={handleDeletePhoto}
            uploadingPhotos={uploadingPhotos}
            fileInputRef={fileInputRef}
          />,
          document.body
        )}
    </>
  );
}

// Full-screen Property Form Component
function PropertyForm({
  property,
  pendingPhotos,
  onClose,
  onSave,
  onUploadPhoto,
  onDeletePhoto,
  uploadingPhotos,
  fileInputRef,
}: {
  property: Property | null;
  pendingPhotos: string[];
  onClose: () => void;
  onSave: (data: Partial<Property>) => Promise<void>;
  onUploadPhoto: (files: FileList | null, propertyId: number | null) => Promise<void>;
  onDeletePhoto: (photoId: number | null, photoUrl?: string) => Promise<void>;
  uploadingPhotos: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    location: property?.location || '',
    latitude: property?.latitude || null as number | null,
    longitude: property?.longitude || null as number | null,
    price: property?.price || '',
    propertyType: property?.propertyType || 'rumah' as const,
    landArea: property?.landArea || '',
    buildingArea: property?.buildingArea || '',
    description: property?.description || '',
    showInShowcase: property?.showInShowcase ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Flashlight effect for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sidebar!.getBoundingClientRect();
      sidebar!.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      sidebar!.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    sidebar.addEventListener('mousemove', handleMouseMove);
    return () => sidebar.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        landArea: formData.landArea ? parseInt(String(formData.landArea)) : null,
        buildingArea: formData.buildingArea ? parseInt(String(formData.buildingArea)) : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="property-form-overlay open">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            aria-label="Kembali"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-playfair italic text-2xl text-stone-900">
            {property ? 'Edit Properti' : 'Tambah Properti Baru'}
          </h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 md:px-12 py-10 grid lg:grid-cols-3 gap-8">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
              Nama Properti
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              placeholder="mis. Rumah Modern Pondok Indah"
              className="w-full bg-transparent border-0 border-b-2 border-stone-200 px-0 py-2 text-3xl font-playfair italic text-stone-900 focus:outline-none focus:border-orange transition-colors"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Tipe Properti
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData((f) => ({ ...f, propertyType: e.target.value as Property['propertyType'] }))}
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
              >
                <option value="rumah">Rumah</option>
                <option value="apartemen">Apartemen</option>
                <option value="villa">Villa</option>
                <option value="ruko">Ruko</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Harga
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                placeholder="Rp 2.5 M"
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
              Lokasi / Alamat
            </label>
            <AddressInput
              value={formData.location}
              onChange={(value, coords) => setFormData((f) => ({ 
                ...f, 
                location: value,
                latitude: coords?.lat ?? f.latitude,
                longitude: coords?.lng ?? f.longitude,
              }))}
              placeholder="Cari alamat..."
              className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Luas Tanah (m²)
              </label>
              <input
                type="text"
                value={formData.landArea}
                onChange={(e) => setFormData((f) => ({ ...f, landArea: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Luas Bangunan (m²)
              </label>
              <input
                type="text"
                value={formData.buildingArea}
                onChange={(e) => setFormData((f) => ({ ...f, buildingArea: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2.5 text-sm focus:outline-none focus:border-orange"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
              Deskripsi
            </label>
            <div className="rounded-lg border border-stone-300 bg-white/70 overflow-hidden">
              <div className="flex items-center gap-1 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => document.execCommand('bold')}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Tebal"
                >
                  <span className="font-bold text-sm">B</span>
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('italic')}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Miring"
                >
                  <span className="italic text-sm">I</span>
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('underline')}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Garis bawah"
                >
                  <span className="underline text-sm">U</span>
                </button>
                <span className="w-px h-5 bg-stone-200 mx-1" />
                <button
                  type="button"
                  onClick={() => document.execCommand('insertUnorderedList')}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Daftar poin"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('insertOrderedList')}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Daftar bernomor"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </button>
                <span className="w-px h-5 bg-stone-200 mx-1" />
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('URL tautan:', 'https://');
                    if (url) document.execCommand('createLink', false, url);
                  }}
                  className="w-8 h-8 rounded hover:bg-stone-200 flex items-center justify-center text-stone-600"
                  aria-label="Sisipkan tautan"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: formData.description || '' }}
                onInput={(e) => setFormData((f) => ({ ...f, description: e.currentTarget.innerHTML }))}
                data-placeholder="Tulis deskripsi properti..."
                className="rte-body p-3 text-sm text-stone-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Photo gallery */}
          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-2 block">
              Foto Properti
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* Existing photos from property */}
              {property?.photos.map((photo, idx) => (
                <div key={photo.id} className="thumb relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={photo.url}
                    alt={photo.alt || `Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Hapus foto"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {/* Pending photos (new property) */}
              {pendingPhotos.map((url, idx) => (
                <div key={url} className="thumb relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(null, url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Hapus foto"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-orange hover:text-orange transition-colors"
              >
                {uploadingPhotos ? (
                  <span className="text-[9px] uppercase tracking-wider">Uploading...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-wider">Tambah</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => onUploadPhoto(e.target.files, property?.id ?? null)}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div
            ref={sidebarRef}
            className="flashlight-card sticky top-24"
          >
            <div className="flashlight-card-content p-6 space-y-5">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.showInShowcase}
                  onChange={(e) => setFormData((f) => ({ ...f, showInShowcase: e.target.checked }))}
                  className="switch"
                />
                <span className="text-sm text-stone-600">Tampilkan di Property Showcase</span>
              </label>

              <div className="pt-4 border-t border-stone-200/60 space-y-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-stone-900 text-white rounded-full py-3 text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Properti'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border border-stone-300 rounded-full py-3 text-sm font-medium hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                Properti baru otomatis muncul di halaman Properti setelah disimpan.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
