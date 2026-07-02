'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Stat {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setIsAuthenticated(true);
          setStats(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      const statsRes = await fetch('/api/admin/stats');
      const data = await statsRes.json();
      setStats(data);
    } else {
      setLoginError('Invalid credentials');
    }
  };

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-playfair italic mb-6 text-center">Admin Login</h1>
          {loginError && (
            <p className="text-red-600 text-sm mb-4 text-center">{loginError}</p>
          )}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair italic">Manage Stats</h1>
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
            <div key={stat.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-stone-500 uppercase tracking-wider">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={e => {
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
                    onChange={e => {
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
                    onChange={e => {
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
    </div>
  );
}
