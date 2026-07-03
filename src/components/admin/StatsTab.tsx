'use client';

import { useState, useEffect } from 'react';
import { useStats, useUpdateStats, type Stat } from '@/lib/admin-hooks';

export default function StatsTab() {
  const { data: stats, isLoading } = useStats();
  const updateMutation = useUpdateStats();

  const [localStats, setLocalStats] = useState<Stat[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (stats) setLocalStats(stats);
  }, [stats]);

  const handleSave = async () => {
    setSaveMessage('');
    try {
      await updateMutation.mutateAsync(localStats);
      setSaveMessage('Stats saved successfully!');
      setEditingId(null);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save stats');
    }
  };

  const updateStat = (id: number, field: keyof Stat, value: string | number) => {
    setLocalStats((s) =>
      s.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat))
    );
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading stats...</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="eyebrow-left">Admin</span>
          <h2 className="font-playfair italic text-2xl text-stone-900">Stats</h2>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {localStats.map((stat) => (
          <div
            key={stat.id}
            className={`rounded-2xl p-6 border transition-all ${
              editingId === stat.id
                ? 'bg-white/70 border-orange/40 ring-1 ring-orange/20'
                : 'bg-white/60 border-stone-200/60 relative group'
            }`}
          >
            {editingId === stat.id ? (
              <>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs uppercase tracking-wider text-orange font-medium">
                    Sedang diedit
                  </span>
                  <button
                    onClick={() => setEditingId(null)}
                    className="cursor-pointer w-7 h-7 rounded-full bg-stone-100 hover:bg-orange/10 flex items-center justify-center text-stone-400 hover:text-orange transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, 'value', parseInt(e.target.value) || 0)}
                    className="w-full text-2xl font-semibold rounded-lg border border-stone-200 px-3 py-1.5 focus:outline-none focus:border-orange"
                  />
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                    className="w-full text-sm rounded-lg border border-stone-200 px-3 py-1.5 focus:outline-none focus:border-orange"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-200 px-3 py-1.5 focus:outline-none focus:border-orange"
                  />
                </div>
              </>
            ) : (
              <button
                onClick={() => setEditingId(stat.id)}
                className="w-full text-left cursor-pointer"
              >
                <span className="absolute top-4 right-4 text-stone-300 group-hover:text-orange transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
                <div className="text-4xl font-semibold text-stone-900 mb-2">
                  {stat.value}
                  <span className="text-orange">{stat.suffix}</span>
                </div>
                <p className="text-xs font-bold uppercase text-stone-400 tracking-widest">
                  {stat.label}
                </p>
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
