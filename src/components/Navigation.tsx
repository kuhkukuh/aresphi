"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#properti", label: "Properti" },
  { href: "#layanan", label: "Layanan" },
  { href: "#tentang", label: "Tentang" },
];

export default function Navigation() {
  const [isReady, setIsReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animation state management
  useEffect(() => {
    // Trigger entrance animation after mount
    const readyTimer = setTimeout(() => setIsReady(true), 100);

    // Scroll listener for width expansion
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(readyTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed left-1/2 top-5 z-[100] flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-2xl sm:px-5 md:px-6 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${hasScrolled ? "max-w-[1152px]" : "max-w-[800px]"}`}
        style={{
          boxShadow: "0 24px 90px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)",
          transition: isReady
            ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, max-width 0.4s ease"
            : "none",
          transform: isReady ? "translate(-50%, 0) scale(1)" : "translate(-50%, -20px) scale(0.96)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#" className="group flex items-center gap-3 text-white" aria-label="Aresphi home">
          <span className="font-playfair text-2xl italic tracking-tight">
            Aresphi<span className="text-orange">®</span>
          </span>
        </a>

        {/* Desktop Links Container */}
        <div
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 md:flex"
          aria-label="Primary links"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm"
          >
            Kontak
          </a>
        </div>

        {/* Hubungi Kami Button */}
        <a
          href="#kontak"
          className="hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-white/40 hover:bg-white/20 md:inline-flex"
        >
          Hubungi Kami
        </a>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl md:hidden"
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 z-[95] h-full w-[280px] bg-stone-900 pt-20 px-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl"
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {/* Drawer Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-white text-lg font-medium py-3 border-b border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#kontak"
                  className="text-white text-lg font-medium py-3 border-b border-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kontak
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
