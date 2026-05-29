"use client";

import { motion } from "framer-motion";
import { FadeUp, TextReveal } from "@/components/motion";
import { siteConfig, assetUrl } from "@/content/site-config";

/**
 * VV3 — Value Prop with imagery panel
 * Two-column on lg+: left = oversized type statement, right = product imagery.
 * Best on Archetype G mid-page.
 */
export default function ValueProp() {
  const image = assetUrl("section-services-hero");

  return (
    <section className="section-pad bg-bg-accent text-ink-inverse relative overflow-hidden">
      {/* Atmospheric mesh */}
      <div className="absolute inset-0 mesh-bg-dark opacity-60 pointer-events-none" aria-hidden />

      <div className="container-page relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <FadeUp>
              <p className="eyebrow text-brand-glow mb-5">{siteConfig.valueProp.eyebrow}</p>
            </FadeUp>
            <TextReveal as="h2" className="display-lg text-ink-inverse mb-7">
              {siteConfig.valueProp.heading}
            </TextReveal>
            <FadeUp>
              <p className="text-lg text-ink-inverse/75 leading-relaxed font-mono max-w-2xl">
                {siteConfig.valueProp.body}
              </p>
            </FadeUp>

            <FadeUp>
              <div className="mt-10 grid grid-cols-2 gap-y-5 gap-x-8 max-w-xl">
                {[
                  "Envelope encryption per record",
                  "FHIR-native integrations",
                  "Signed access trails",
                  "BAA-ready by default",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-glow flex-none" />
                    <span className="text-sm font-mono text-ink-inverse/85 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[5/6] rounded-3xl overflow-hidden glass-card-dark"
          >
            {image ? (
              <img
                src={image}
                alt={siteConfig.valueProp.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 mesh-bg-dark" />
            )}
            {/* Soft brand wash */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(170deg, transparent 50%, rgba(14,58,71,0.7) 100%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
