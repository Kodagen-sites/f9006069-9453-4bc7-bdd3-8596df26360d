"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";
import { siteConfig, assetUrl } from "@/content/site-config";

/**
 * AB1 — Editorial Story preview block embedded on the homepage.
 * (Full About page lives at /about with deeper content + values + team.)
 */
export default function AboutPreview() {
  const image = assetUrl(siteConfig.about.imageSlot);

  return (
    <section className="section-pad bg-bg-primary">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden order-2 lg:order-1"
          >
            {image ? (
              <img
                src={image}
                alt={siteConfig.about.heading}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 mesh-bg" />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(170deg, transparent 60%, rgba(14,58,71,0.4) 100%)",
              }}
            />
          </motion.div>

          <div className="order-1 lg:order-2">
            <FadeUp>
              <p className="eyebrow mb-5">{siteConfig.about.eyebrow}</p>
            </FadeUp>
            <FadeUp>
              <h2 className="display-lg text-ink-primary mb-7">
                {siteConfig.about.heading}
              </h2>
            </FadeUp>
            <div className="space-y-5 mb-8">
              {siteConfig.about.body.slice(0, 2).map((para, i) => (
                <FadeUp key={i} delay={0.05 + i * 0.05}>
                  <p className="text-base text-ink-secondary leading-relaxed font-mono">
                    {para}
                  </p>
                </FadeUp>
              ))}
            </div>
            <FadeUp>
              <Link href="/about" className="btn-secondary">
                Read our story →
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
