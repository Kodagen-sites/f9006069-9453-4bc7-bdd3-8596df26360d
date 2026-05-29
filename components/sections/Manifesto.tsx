"use client";

import { motion } from "framer-motion";
import { TextReveal } from "@/components/motion";
import { siteConfig } from "@/content/site-config";

/**
 * T7 — Oversized type reveal (Manifesto / brand statement)
 * Uses the V6 voice's signature direct register.
 */
export default function Manifesto() {
  return (
    <section className="section-pad bg-bg-tertiary/40 relative overflow-hidden">
      {/* subtle teal vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(46,127,140,0.12) 100%)",
        }}
        aria-hidden
      />
      <div className="container-tight relative text-center">
        <p className="eyebrow mb-7">{siteConfig.manifesto.eyebrow}</p>
        <TextReveal
          as="p"
          className="display-lg text-ink-primary leading-[1.15] tracking-[-0.012em]"
        >
          {siteConfig.manifesto.text}
        </TextReveal>
      </div>
    </section>
  );
}
