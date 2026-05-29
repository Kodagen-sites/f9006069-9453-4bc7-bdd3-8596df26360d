"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import ScrollCanvas from "@/components/ScrollCanvas";
import { MagneticButton } from "@/components/motion";
import { siteConfig, assetUrl, videoUrl } from "@/content/site-config";
import framesManifest from "@/content/frames-manifest.json";

/**
 * Hero — Archetype G + Mode 3 (scrub-assemble)
 * The exploded medical data vault reassembles as the user scrolls.
 *
 * Per motion-banks.md: ScrollCanvas reads frames from frames-manifest.json
 * If frames haven't been extracted yet, falls back to the assembled end-frame
 * stillage with a subtle Ken-Burns + gradient overlay (still on-brand).
 *
 * HO4 — floating glass card overlay (matches ocean-mint liquid glass aesthetic)
 * H3 — gradient text on the H1 (cyan→deep-navy gradient)
 * E3 — two-tone fade entrance
 */
export default function HeroScrollAssemble() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  const frameCount = framesManifest.frameCount ?? 0;
  const framePattern = framesManifest.frameUrlTemplate
    ? framesManifest.frameUrlTemplate.replace("{NNNN}", "{n}")
    : "/frames/frame-{n}.jpg";

  const startImage = assetUrl("scene-1-start");
  const endImage = assetUrl("scene-1-end");
  const heroVideo = videoUrl("scene-1");

  const hasFrames = frameCount > 0;

  return (
    <section
      className="relative bg-bg-primary"
      style={{ height: hasFrames ? `${siteConfig.scrollHero.scrollDistance * 100}vh` : "100vh" }}
    >
      {/* Frame-scrub assembly OR fallback */}
      {hasFrames ? (
        <ScrollCanvas
          frameCount={frameCount}
          pattern={framePattern}
          padLength={4}
          scrollDistance={siteConfig.scrollHero.scrollDistance}
          onProgress={setProgress}
        />
      ) : (
        <FallbackHero startImage={startImage} endImage={endImage} videoUrl={heroVideo} />
      )}

      {/* HO4 — Floating glass card overlay */}
      <div className="fixed inset-0 z-20 flex items-center pointer-events-none">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto max-w-2xl glass-card rounded-3xl p-8 md:p-10"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="eyebrow mb-5"
            >
              {siteConfig.hero.eyebrow}
            </motion.p>

            <h1 className="display-xl text-ink-primary mb-6">
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {siteConfig.hero.h1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block"
                style={{
                  background: "linear-gradient(120deg, #2E7F8C 0%, #0E3A47 70%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {siteConfig.hero.h1Accent}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="text-base md:text-lg text-ink-secondary leading-relaxed mb-8 font-mono"
            >
              {siteConfig.hero.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.15 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton
                as="a"
                href={siteConfig.ctaPrimary.href}
                className="btn-primary"
              >
                {siteConfig.ctaPrimary.label} →
              </MagneticButton>
              <Link href={siteConfig.ctaSecondary.href} className="btn-secondary">
                {siteConfig.ctaSecondary.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll-progress hint, only when frames mode is active */}
      {hasFrames && !reduceMotion && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 text-ink-muted text-xs font-mono uppercase tracking-[0.2em] pointer-events-none">
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <span>Scroll to assemble</span>
            <span className="text-brand">{Math.round(progress * 100)}%</span>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function FallbackHero({
  startImage,
  endImage,
  videoUrl,
}: {
  startImage: string;
  endImage: string;
  videoUrl: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          poster={endImage || startImage}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : endImage ? (
        <motion.img
          src={endImage}
          alt={siteConfig.hero.h1}
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 mesh-bg" />
      )}
      {/* Subtle wash to keep glass card readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, rgba(234,247,245,0.42) 0%, rgba(168,217,208,0.15) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
