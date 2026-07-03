'use client';

import { useState, useEffect } from 'react';
import { useSocials, useUpdateSocials, type Social } from '@/lib/admin-hooks';
import { PhoneInput } from '@/components/PhoneInput';

export default function SocialsTab() {
  const { data: socials, isLoading } = useSocials();
  const updateMutation = useUpdateSocials();

  const [formData, setFormData] = useState<Partial<Social>>({
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    instagram: '',
    linkedin: '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (socials) {
      setFormData({
        phone: socials.phone || '',
        email: socials.email || '',
        addressLine1: socials.addressLine1 || '',
        addressLine2: socials.addressLine2 || '',
        instagram: socials.instagram || '',
        linkedin: socials.linkedin || '',
      });
    }
  }, [socials]);

  const handleSave = async () => {
    setSaveMessage('');
    try {
      await updateMutation.mutateAsync(formData);
      setSaveMessage('Socials saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save socials');
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading socials...</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="eyebrow-left">Admin</span>
          <h2 className="font-playfair italic text-2xl text-stone-900">Socials & Kontak</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-stone-900 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {saveMessage && (
        <p className={`text-sm mb-4 ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
          {saveMessage}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <PhoneInput
          value={formData.phone || ''}
          onChange={(value) => setFormData((f) => ({ ...f, phone: value }))}
          label="Telepon"
        />
        <div>
          <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
            placeholder="info@aresphi.com"
            className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
          />
        </div>
        <div>
          <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
            Alamat Baris 1
          </label>
          <input
            type="text"
            value={formData.addressLine1 || ''}
            onChange={(e) => setFormData((f) => ({ ...f, addressLine1: e.target.value }))}
            placeholder="Jl. Sudirman No. 123"
            className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
          />
        </div>
        <div>
          <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
            Alamat Baris 2
          </label>
          <input
            type="text"
            value={formData.addressLine2 || ''}
            onChange={(e) => setFormData((f) => ({ ...f, addressLine2: e.target.value }))}
            placeholder="Jakarta Selatan, 12190"
            className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
          />
        </div>
        <div>
          <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
            Instagram URL
          </label>
          <input
            type="text"
            value={formData.instagram || ''}
            onChange={(e) => setFormData((f) => ({ ...f, instagram: e.target.value }))}
            placeholder="https://instagram.com/aresphi"
            className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
          />
        </div>
        <div>
          <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">
            LinkedIn URL
          </label>
          <input
            type="text"
            value={formData.linkedin || ''}
            onChange={(e) => setFormData((f) => ({ ...f, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/company/aresphi"
            className="w-full rounded-lg border border-stone-300 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:border-orange"
          />
        </div>
      </div>
    </>
  );
}
