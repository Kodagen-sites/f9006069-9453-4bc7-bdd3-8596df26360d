"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StaggerChildren, FadeUp, CardTiltLayer } from "@/components/motion";
import { siteConfig, assetUrl } from "@/content/site-config";

/**
 * SV5 — Glassmorphism Tech Grid
 * 3-column gradient/glow cards with numbered labels.
 * Card material variant: image-reveal-mask (each card shows the service image on hover).
 */
export default function ServicesGrid() {
  return (
    <section id="services" className="section-pad bg-bg-secondary relative overflow-hidden">
      {/* subtle mesh accent on the right side */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none mesh-bg" aria-hidden />

      <div className="container-page relative">
        <FadeUp>
          <div className="mb-14 max-w-3xl">
            <p className="eyebrow mb-4">Capabilities</p>
            <h2 className="display-lg text-ink-primary mb-5">
              Six modules. One vault.
            </h2>
            <p className="text-ink-secondary text-lg leading-relaxed font-mono">
              Every Medivault module reads and writes through the same encrypted data layer. No
              shadow databases. No untracked exports. No surprises in your next audit.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {siteConfig.services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof siteConfig.services)[number];
  index: number;
}) {
  const image = assetUrl(service.imageSlot);
  return (
    <CardTiltLayer
      className="group glass-card rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image reveal — masked on hover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary/30">
        {image ? (
          <motion.img
            src={image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05, filter: "saturate(0.7)" }}
            whileHover={{ scale: 1.02, filter: "saturate(1.1)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : (
          <div className="absolute inset-0 mesh-bg opacity-60" />
        )}
        {/* Soft overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 via-transparent to-transparent pointer-events-none" />
        {/* Index numeral */}
        <div className="absolute top-4 left-5 font-mono text-xs uppercase tracking-[0.2em] text-ink-inverse mix-blend-overlay">
          0{index + 1}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="display-md text-ink-primary mb-3">{service.name}</h3>
        <p className="text-sm text-ink-secondary leading-relaxed mb-5 font-mono flex-1">
          {service.description}
        </p>
        <Link
          href={`/services#${service.slug}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-brand-deep hover:text-brand transition-colors mt-auto"
        >
          Learn more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </CardTiltLayer>
  );
}
