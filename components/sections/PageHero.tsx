import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  image: string;
  intro?: string;
};

export default function PageHero({ eyebrow, title, image, intro }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-bg-accent md:min-h-[64vh]">
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "contrast(1.05) saturate(0.95) brightness(0.78)" }}
        />
      ) : (
        <div className="absolute inset-0 mesh-bg-dark" />
      )}
      {/* Dark gradient — darker at the bottom for title legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-accent via-bg-accent/65 to-bg-accent/30" />

      <div className="relative w-full px-5 pb-14 pt-44 md:px-10 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-glow">
            <span className="mr-3 inline-block h-px w-10 align-middle bg-brand-glow/60" />
            {eyebrow}
          </div>
          <h1 className="max-w-[18ch] font-display text-[clamp(40px,7vw,92px)] font-medium leading-[1.0] tracking-[-0.02em] text-ink-inverse">
            {title}
          </h1>
          {intro ? (
            <p className="mt-8 max-w-[640px] text-lg leading-relaxed text-ink-inverse/80 font-mono">
              {intro}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
