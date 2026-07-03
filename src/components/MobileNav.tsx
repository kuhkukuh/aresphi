"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, navStyles } from "./Navigation";

interface MobileNavProps {
  activeSection: string | null;
}

export default function MobileNav({ activeSection }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu when clicking a link
  const handleLinkClick = () => setIsOpen(false);

  // Animation variants
  const menuVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { type: "tween" as const, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { type: "tween" as const, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    collapsed: { opacity: 0, y: -10 },
    expanded: { opacity: 1, y: 0, transition: { type: "tween" as const, duration: 0.2 } },
  };

  return (
    <div className="md:hidden">
      {/* Floating Pill Container */}
      <motion.div
        className={`${navStyles.container.floating} ${navStyles.container.shadow} rounded-[40px] overflow-hidden`}
        initial={false}
        animate={isOpen ? "expanded" : "collapsed"}
      >
        {/* Header Row - Always Visible */}
        <div className="flex w-full items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="font-playfair text-2xl italic tracking-tight text-white">
            Aresphi<span className="text-orange">®</span>
          </a>

          {/* Hamburger / Close Button */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Expandable Menu Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <motion.div className="flex flex-col gap-1 px-4 pb-4">
                {/* Nav Links */}
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={itemVariants}
                    className={`py-3 text-lg font-medium transition-colors ${
                      activeSection === link.id ? "text-orange" : "text-white"
                    }`}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Katalog Properti Button */}
                <motion.a
                  href="/properti"
                  variants={itemVariants}
                  className={`mt-2 inline-flex justify-center ${navStyles.button.primary}`}
                  onClick={handleLinkClick}
                >
                  Katalog Properti
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
