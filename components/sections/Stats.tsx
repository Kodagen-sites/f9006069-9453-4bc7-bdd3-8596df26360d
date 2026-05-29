"use client";

import { FadeUp, NumberCounter } from "@/components/motion";
import { siteConfig } from "@/content/site-config";

/**
 * ST1 — Three-across counters band
 * Clean horizontal stat row, animated count-up on scroll-into-view.
 */
export default function Stats() {
  return (
    <section className="section-pad-tight bg-bg-secondary border-y border-line">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {siteConfig.stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.1}>
              <div>
                <div className="display-xl text-brand-deep font-mono leading-none mb-3">
                  <NumberCounter
                    to={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </div>
                <p className="eyebrow text-ink-muted">{stat.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
