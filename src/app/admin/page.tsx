'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PropertiesTab from '@/components/admin/PropertiesTab';
import HeroTab from '@/components/admin/HeroTab';
import StatsTab from '@/components/admin/StatsTab';
import TestimonialTab from '@/components/admin/TestimonialTab';
import SocialsTab from '@/components/admin/SocialsTab';

type Tab = 'property' | 'hero' | 'stats' | 'testimonial' | 'socials';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('property');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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

  // Flashlight effect for login card
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isAuthenticated) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card!.getBoundingClientRect();
      card!.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card!.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [isAuthenticated]);

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
      setLoginError('Username atau password salah.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    queryClient.clear();
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d1f] via-[#0e1228] to-[#0a0d1f]" />

        <div className="relative z-10 w-full max-w-sm">
          <div
            ref={cardRef}
            className="flashlight-card !bg-white/[0.04] !border-white/10 backdrop-blur-2xl"
          >
            <div className="flashlight-card-content p-8 md:p-10">
              <div className="text-center mb-8">
                <span className="font-playfair text-3xl italic tracking-tight text-white">
                  Aresphi<span className="text-orange">®</span>
                </span>
                <p className="text-white/40 text-xs uppercase tracking-[0.25em] mt-3">
                  Admin Dashboard
                </p>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg px-4 py-3 mb-5 text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-white text-black font-semibold py-3 text-sm mt-2 hover:bg-white/90 transition-colors"
                >
                  Masuk
                </button>
              </form>
            </div>
          </div>
          <p className="text-center text-white/25 text-xs mt-6 tracking-wide">
            © 2025 Aresphi Property — Internal Use Only
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-xl italic tracking-tight text-stone-900">
              Aresphi<span className="text-orange">®</span>
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-stone-400 hidden sm:inline">
              Admin Dashboard
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-stone-300/50 overflow-x-auto no-scrollbar">
          {(['property', 'hero', 'stats', 'testimonial', 'socials'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`subtab-btn pb-3 text-sm whitespace-nowrap ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'property' && 'Property'}
              {tab === 'hero' && 'Hero Photos'}
              {tab === 'stats' && 'Stats'}
              {tab === 'testimonial' && 'Testimonial'}
              {tab === 'socials' && 'Socials'}
            </button>
          ))}
          <button disabled className="subtab-btn disabled pb-3 text-sm whitespace-nowrap inline-flex items-center gap-2">
            Blog
            <span className="text-[9px] uppercase tracking-wider bg-stone-200 text-stone-500 rounded-full px-2 py-0.5">
              Segera
            </span>
          </button>
        </div>

        {/* Tab Panel */}
        <div className="flashlight-card">
          <div className="flashlight-card-content p-6 md:p-8">
            {activeTab === 'property' && <PropertiesTab />}
            {activeTab === 'hero' && <HeroTab />}
            {activeTab === 'stats' && <StatsTab />}
            {activeTab === 'testimonial' && <TestimonialTab />}
            {activeTab === 'socials' && <SocialsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
