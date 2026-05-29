import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { FadeUp, StaggerChildren } from "@/components/motion";
import CtaSplitForm from "@/components/sections/CtaSplitForm";
import Process from "@/components/sections/Process";
import { siteConfig, assetUrl } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Services — EHR integration, AI diagnostics, secure data vault",
  description:
    "Six modules running off a single encrypted vault. Built for healthcare providers who can't compromise on data security.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we build"
        title="The encrypted data layer behind modern healthcare."
        image={assetUrl("section-services-hero")}
        intro="Six discrete modules. One shared vault. Pick the ones you need today; plug in the rest as you scale."
      />

      <section className="section-pad bg-bg-primary">
        <div className="container-page">
          <StaggerChildren staggerDelay={0.06} className="space-y-16 md:space-y-24">
            {siteConfig.services.map((service, i) => {
              const image = assetUrl(service.imageSlot);
              const reverse = i % 2 === 1;
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card">
                    {image ? (
                      <img
                        src={image}
                        alt={service.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 mesh-bg" />
                    )}
                  </div>
                  <div>
                    <p className="eyebrow mb-4">
                      {String(i + 1).padStart(2, "0")} / {String(siteConfig.services.length).padStart(2, "0")}
                    </p>
                    <h2 className="display-lg text-ink-primary mb-5">{service.name}</h2>
                    <p className="text-lg text-ink-secondary font-mono leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <p className="text-base text-ink-muted leading-relaxed font-mono">
                      {service.longDescription}
                    </p>
                  </div>
                </article>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <Process />
      <CtaSplitForm />
    </>
  );
}
