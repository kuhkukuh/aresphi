"use client";

import { useState, useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/#tentang", label: "Tentang", id: "tentang" },
  { href: "/#layanan", label: "Layanan", id: "layanan" },
  { href: "/#properti", label: "Properti", id: "properti" },
  { href: "/#kontak", label: "Kontak", id: "kontak" },
];

const navStyles = {
  container: {
    base: "fixed left-1/2 top-5 z-[100] flex items-center",
    floating: "border border-white/10 bg-black/50 backdrop-blur-2xl",
    shadow: "shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)]",
  },
  containerRounded: "rounded-full",
  link: {
    base: "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
    inactive: "text-white/80 hover:bg-white/10 hover:text-white",
    active: "text-black",
  },
  button: {
    primary: "rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-white/40 hover:bg-white/20",
  },
};

export { navLinks, navStyles };

export default function Navigation() {
  const [isReady, setIsReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Animation state management
  useEffect(() => {
    const readyTimer = setTimeout(() => setIsReady(true), 100);

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(readyTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Track active section
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile Navigation */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          left: "50%",
          top: 20,
          zIndex: 100,
          width: "calc(100% - 32px)",
          transform: isReady ? "translate(-50%, 0)" : "translate(-50%, -20px)",
          opacity: isReady ? 1 : 0,
          transition: isReady ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease" : "none",
        }}
      >
        <MobileNav activeSection={activeSection} />
      </div>

      {/* Desktop Navigation */}
      <nav
        className={`${navStyles.container.base} ${navStyles.container.floating} ${navStyles.container.shadow} ${navStyles.containerRounded} w-[calc(100%-32px)] px-4 py-3 sm:px-5 md:px-6 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${hasScrolled ? "max-w-[1152px]" : "max-w-[800px]"} hidden md:flex`}
        style={{
          transition: isReady
            ? "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, max-width 0.4s ease"
            : "none",
          transform: isReady ? "translate(-50%, 0) scale(1)" : "translate(-50%, -20px) scale(0.96)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="/" className="group flex items-center gap-3 text-white" aria-label="Aresphi home">
          <span className="font-playfair text-2xl italic tracking-tight">
            Aresphi<span className="text-orange">®</span>
          </span>
        </a>

        <DesktopNav activeSection={activeSection} />
      </nav>
    </>
  );
}
