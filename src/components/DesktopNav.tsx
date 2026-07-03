"use client";

import { motion } from "framer-motion";
import { navLinks, navStyles } from "./Navigation";

interface DesktopNavProps {
  activeSection: string | null;
}

export default function DesktopNav({ activeSection }: DesktopNavProps) {
  return (
    <>
      {/* Desktop Links Container */}
      <div
        className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 md:flex"
        aria-label="Primary links"
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`${navStyles.link.base} ${
                isActive ? navStyles.link.active : navStyles.link.inactive
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          );
        })}
      </div>

      {/* Hubungi Kami Button */}
      <a
        href="#kontak"
        className={`ml-auto hidden md:inline-flex ${navStyles.button.primary}`}
      >
        Hubungi Kami
      </a>
    </>
  );
}
