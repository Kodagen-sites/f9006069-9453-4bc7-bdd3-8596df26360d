"use client";

import { motion } from "framer-motion";
import { FadeUp, StickyScrollSection } from "@/components/motion";
import { siteConfig } from "@/content/site-config";

/**
 * PRV2 — Universal sticky-scroll process section
 * Left column pins (heading + intro), right column scrolls (step cards).
 */
export default function Process() {
  return (
    <section id="process" className="section-pad bg-bg-primary">
      <div className="container-page">
        <StickyScrollSection
          sticky={
            <div className="pr-0 lg:pr-12">
              <p className="eyebrow mb-5">How it works</p>
              <h2 className="display-lg text-ink-primary mb-6">
                Four steps from kickoff to clinical use.
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed font-mono">
                Every Medivault rollout follows the same disciplined sequence. No mystery
                phases, no scope expansion mid-flight — just a clean handoff into a vault
                your team owns.
              </p>
            </div>
          }
          scrolling={siteConfig.process.map((step, i) => (
            <FadeUp key={step.step} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-7 md:p-8 mb-5"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-none w-12 h-12 rounded-full bg-brand-deep text-ink-inverse flex items-center justify-center font-mono text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="display-md text-ink-primary mb-3">{step.title}</h3>
                    <p className="text-sm text-ink-secondary leading-relaxed font-mono">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        />
      </div>
    </section>
  );
}
