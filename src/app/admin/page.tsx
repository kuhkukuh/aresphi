'use client';

import { useState, useEffect } from 'react';
import PropertiesTab from '@/components/admin/PropertiesTab';
import HeroTab from '@/components/admin/HeroTab';
import StatsTab from '@/components/admin/StatsTab';

type Tab = 'properties' | 'hero' | 'stats';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('properties');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setIsAuthenticated(true);
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
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setIsAuthenticated(false);
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
              onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
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
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair italic">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-stone-500 hover:text-stone-900 text-sm"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-1 mb-6 border-b border-stone-200">
          {(['properties', 'hero', 'stats'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-stone-900 border-b-2 border-orange'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'properties' && <PropertiesTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </div>
    </div>
  );
}
