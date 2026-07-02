'use client';

import { useState, useEffect } from 'react';

interface Stat {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
}

export default function StatsTab() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setStats(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveMessage('');
    const res = await fetch('/api/admin/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });

    if (res.ok) {
      setSaveMessage('Stats saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessage('Failed to save stats');
    }
  };

  if (isLoading) {
    return <p className="text-stone-500">Loading stats...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Company Stats</h2>
        <button
          onClick={handleSave}
          className="bg-orange text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <p className="text-green-600 mb-4">{saveMessage}</p>
      )}

      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={stat.id} className="bg-stone-50 p-6 rounded-xl">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Value</label>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].value = parseInt(e.target.value) || 0;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Suffix</label>
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].suffix = e.target.value;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].label = e.target.value;
                    setStats(newStats);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
