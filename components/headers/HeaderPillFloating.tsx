"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site-config";
import { NAV_LINKS } from "./nav-links";
import { useIsMobile, useScrollState } from "./hooks";

export default function HeaderPillFloating() {
  const scrolled = useScrollState(20);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 md:top-5 inset-x-4 md:inset-x-0 z-40 flex justify-center pointer-events-none"
      >
        <div
          className={`pointer-events-auto flex items-center gap-1 md:gap-2 rounded-full border backdrop-blur-2xl transition-all duration-500 ${
            scrolled
              ? "bg-white/75 border-line shadow-[0_10px_40px_-10px_rgba(14,58,71,0.18)]"
              : "bg-white/40 border-line"
          }`}
          style={{ padding: "6px 8px" }}
        >
          <Link
            href="/"
            className="px-3 md:px-4 py-2 font-display font-semibold tracking-[0.12em] uppercase text-xs md:text-sm text-ink-primary"
          >
            {siteConfig.company.name}
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-1 mx-2">
              {NAV_LINKS.slice(1).map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-colors ${
                      active ? "text-ink-primary" : "text-ink-muted hover:text-ink-primary"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="pill-active"
                        className="absolute inset-0 bg-bg-tertiary/60 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {!isMobile ? (
            <Link
              href={siteConfig.ctaPrimary.href}
              className="px-4 py-2 rounded-full bg-brand-deep text-ink-inverse text-xs font-mono uppercase tracking-[0.1em] hover:bg-brand transition-colors"
            >
              {siteConfig.ctaPrimary.label}
            </Link>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 rounded-full flex items-center justify-center text-ink-primary hover:bg-bg-tertiary/40"
            >
              <Menu size={18} />
            </button>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileOverlay onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MobileOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg-primary md:hidden"
    >
      <div className="flex items-center justify-between p-6">
        <div className="font-display font-semibold tracking-[0.12em] uppercase text-sm text-ink-primary">
          {siteConfig.company.name}
        </div>
        <button onClick={onClose} className="text-ink-primary" aria-label="Close menu">
          <X size={22} />
        </button>
      </div>
      <ul className="flex flex-col gap-6 p-6">
        {NAV_LINKS.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              className="font-display text-3xl text-ink-primary hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
      <div className="absolute bottom-6 inset-x-6">
        <Link
          href={siteConfig.ctaPrimary.href}
          onClick={onClose}
          className="block text-center w-full px-5 py-4 rounded-full bg-brand-deep text-ink-inverse font-mono uppercase tracking-[0.1em] text-sm"
        >
          {siteConfig.ctaPrimary.label} →
        </Link>
      </div>
    </motion.div>
  );
}
