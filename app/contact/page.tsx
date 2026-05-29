import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaSplitForm from "@/components/sections/CtaSplitForm";
import { FadeUp } from "@/components/motion";
import { siteConfig, assetUrl } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Contact — start a conversation with our team",
  description:
    "Tell us about your environment and we'll come back with a tailored architecture review within two business days.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let's lock down your patient data."
        image={assetUrl("section-contact")}
        intro="Whether you're consolidating legacy EHRs, launching an AI diagnostic product, or running a HITRUST audit — we should talk."
      />

      <section className="section-pad bg-bg-primary">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-2">
            <FadeUp>
              <div className="glass-card rounded-2xl p-6">
                <p className="eyebrow mb-3">Email</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-lg font-mono text-ink-primary hover:text-brand transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
                <p className="text-xs text-ink-muted font-mono mt-3 leading-relaxed">
                  General enquiries and partnership requests. Replies within two
                  business days.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <div className="glass-card rounded-2xl p-6">
                <p className="eyebrow mb-3">Direct line</p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-lg font-mono text-ink-primary hover:text-brand transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
                <p className="text-xs text-ink-muted font-mono mt-3 leading-relaxed">
                  Monday – Friday, 8 AM – 6 PM Pacific. Voicemail outside hours.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div className="glass-card rounded-2xl p-6">
                <p className="eyebrow mb-3">Where</p>
                <p className="text-lg font-mono text-ink-primary">
                  {siteConfig.contact.location}
                </p>
                <p className="text-xs text-ink-muted font-mono mt-3 leading-relaxed">
                  Engineers across North America, Europe, and APAC. Architecture
                  reviews in your timezone.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <CtaSplitForm />
    </>
  );
}
