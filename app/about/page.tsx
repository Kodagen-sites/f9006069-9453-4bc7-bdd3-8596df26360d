import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { FadeUp } from "@/components/motion";
import Stats from "@/components/sections/Stats";
import Manifesto from "@/components/sections/Manifesto";
import CtaSplitForm from "@/components/sections/CtaSplitForm";
import { siteConfig, assetUrl } from "@/content/site-config";

export const metadata: Metadata = {
  title: "About — the team rebuilding healthcare data plumbing",
  description: siteConfig.about.heading,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={siteConfig.about.eyebrow}
        title={siteConfig.about.heading}
        image={assetUrl(siteConfig.about.imageSlot)}
        intro="Medivault started inside a hospital incident response group. Today we run the data layer for clinics, telehealth networks, and AI diagnostic startups across four continents."
      />

      <section className="section-pad bg-bg-primary">
        <div className="container-tight">
          <div className="space-y-7">
            {siteConfig.about.body.map((para, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <p className="text-lg text-ink-secondary leading-[1.7] font-mono">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section className="section-pad bg-bg-secondary">
        <div className="container-page">
          <FadeUp>
            <p className="eyebrow mb-5">What guides us</p>
          </FadeUp>
          <FadeUp>
            <h2 className="display-lg text-ink-primary mb-12 max-w-3xl">
              Three principles, applied without exception.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div className="glass-card rounded-2xl p-7">
                  <div className="font-mono text-brand text-xs uppercase tracking-[0.2em] mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="display-md text-ink-primary mb-3">{v.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed font-mono">
                    {v.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Manifesto />
      <CtaSplitForm />
    </>
  );
}

const VALUES = [
  {
    title: "Encryption is non-negotiable.",
    body: "Every record is wrapped in a key only the customer's KMS can unwrap. No exceptions, no debug bypasses, no shared secrets.",
  },
  {
    title: "Every read is logged.",
    body: "Access to a patient record produces a signed, tamper-evident audit entry. If it's not in the log, it didn't happen.",
  },
  {
    title: "Plumbing is invisible.",
    body: "Clinicians shouldn't notice we exist. When the data layer works, the work disappears into the background.",
  },
];
