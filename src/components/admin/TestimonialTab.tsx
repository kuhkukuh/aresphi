'use client';

import { useState, useEffect } from 'react';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  type Testimonial,
} from '@/lib/admin-hooks';

export default function TestimonialTab() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newData, setNewData] = useState({ quote: '', name: '', title: '' });

  useEffect(() => {
    if (testimonials) setLocalTestimonials(testimonials);
  }, [testimonials]);

  const updateLocal = (id: number, field: 'quote' | 'name' | 'title', value: string) => {
    setLocalTestimonials((t) =>
      t.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveItem = async (id: number) => {
    const item = localTestimonials.find((t) => t.id === id);
    if (!item) return;
    await updateMutation.mutateAsync({ id, data: item });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus testimonial ini?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleCreate = async () => {
    if (!newData.quote || !newData.name || !newData.title) {
      alert('Semua field wajib diisi');
      return;
    }
    await createMutation.mutateAsync(newData);
    setNewData({ quote: '', name: '', title: '' });
    setIsNewOpen(false);
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading testimonials...</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="eyebrow-left">Admin</span>
          <h2 className="font-playfair italic text-2xl text-stone-900">Testimonial</h2>
          <p className="text-sm text-stone-500 mt-1">
            Foto latar bersifat statis (diatur di kode) — hanya teks kutipan yang dikelola di sini.
          </p>
        </div>
        <button
          onClick={() => setIsNewOpen(true)}
          className="inline-flex items-center gap-2 bg-stone-900 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {/* New testimonial form */}
        {isNewOpen && (
          <div className="bg-white/60 rounded-2xl border border-orange/40 p-6 relative">
            <button
              onClick={() => setIsNewOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-red-500 transition-colors"
              aria-label="Batal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pr-10">
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Kutipan
              </label>
              <textarea
                rows={4}
                value={newData.quote}
                onChange={(e) => setNewData((d) => ({ ...d, quote: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange resize-y"
                placeholder="Tulis kutipan di sini..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 max-w-md">
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                  Nama
                </label>
                <input
                  type="text"
                  value={newData.name}
                  onChange={(e) => setNewData((d) => ({ ...d, name: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
                  placeholder="Nama orang"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                  Jabatan
                </label>
                <input
                  type="text"
                  value={newData.title}
                  onChange={(e) => setNewData((d) => ({ ...d, title: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
                  placeholder="FOUNDING PARTNER"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-orange text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )}

        {/* Existing testimonials */}
        {localTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white/60 rounded-2xl border border-stone-200/60 p-6 relative group">
            <button
              onClick={() => handleDelete(testimonial.id)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-red-500 transition-colors"
              aria-label="Hapus testimonial"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <div className="pr-10">
              <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                Kutipan
              </label>
              <textarea
                rows={4}
                value={testimonial.quote}
                onChange={(e) => updateLocal(testimonial.id, 'quote', e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 max-w-md">
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                  Nama
                </label>
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => updateLocal(testimonial.id, 'name', e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
                  Jabatan
                </label>
                <input
                  type="text"
                  value={testimonial.title}
                  onChange={(e) => updateLocal(testimonial.id, 'title', e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleSaveItem(testimonial.id)}
                disabled={updateMutation.isPending}
                className="text-xs text-orange font-medium hover:text-orange-600 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
              </button>
            </div>
          </div>
        ))}

        {localTestimonials.length === 0 && !isNewOpen && (
          <p className="text-center text-stone-400 py-8">
            Belum ada testimonial. Tambahkan yang pertama!
          </p>
        )}
      </div>
    </>
  );
}
