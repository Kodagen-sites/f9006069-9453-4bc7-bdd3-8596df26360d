"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/motion";
import { siteConfig, assetUrl } from "@/content/site-config";

/**
 * CTA2 — Split with Form on Right
 * Left side: oversized heading + supporting copy + contact details.
 * Right side: contact form (the site's primary conversion surface).
 */
export default function CtaSplitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const bgImage = assetUrl(siteConfig.cta.backgroundSlot);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Static landing build — no backend wired. Simulate a friendly success.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-pad bg-bg-accent text-ink-inverse relative overflow-hidden">
      {/* Background imagery */}
      {bgImage && (
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="absolute inset-0 mesh-bg-dark opacity-80 pointer-events-none" aria-hidden />

      <div className="container-page relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-20">
          {/* Left — manifesto + contact details */}
          <div className="flex flex-col justify-center">
            <FadeUp>
              <p className="eyebrow text-brand-glow mb-5">{siteConfig.cta.eyebrow}</p>
            </FadeUp>
            <FadeUp>
              <h2 className="display-xl text-ink-inverse mb-6 leading-[1.02]">
                {siteConfig.cta.heading}
              </h2>
            </FadeUp>
            <FadeUp>
              <p className="text-lg text-ink-inverse/75 leading-relaxed font-mono mb-10 max-w-md">
                {siteConfig.cta.body}
              </p>
            </FadeUp>
            <FadeUp>
              <ul className="space-y-4 text-sm font-mono">
                <li className="flex items-center gap-3 text-ink-inverse/80">
                  <span className="text-brand-glow">→</span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-ink-inverse transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-ink-inverse/80">
                  <span className="text-brand-glow">→</span>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-ink-inverse transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-ink-inverse/60">
                  <span className="text-brand-glow">→</span>
                  {siteConfig.contact.location}
                </li>
              </ul>
            </FadeUp>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-dark rounded-3xl p-7 md:p-10"
          >
            {submitted ? (
              <SuccessState onReset={() => setSubmitted(false)} />
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                {siteConfig.cta.formFields.map((field) => (
                  <FormField key={field.name} field={field} />
                ))}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-primary text-ink-primary text-sm font-mono uppercase tracking-[0.1em] hover:bg-brand-muted transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send message →"}
                  </motion.button>
                </div>
                <p className="text-xs text-ink-inverse/40 font-mono pt-2 leading-relaxed">
                  By submitting you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-ink-inverse">
                    Privacy Policy
                  </a>
                  . We reply within two business days.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  field,
}: {
  field: (typeof siteConfig.cta.formFields)[number];
}) {
  const baseInput =
    "w-full bg-ink-primary/40 border border-line-inverse rounded-xl px-4 py-3 text-sm font-mono text-ink-inverse placeholder-ink-inverse/40 focus:outline-none focus:border-brand-glow transition-colors";

  if (field.type === "textarea") {
    return (
      <label className="block">
        <span className="block text-xs font-mono uppercase tracking-[0.15em] text-ink-inverse/60 mb-2">
          {field.label}
          {field.required && <span className="text-brand-glow"> *</span>}
        </span>
        <textarea
          name={field.name}
          required={field.required}
          rows={4}
          className={`${baseInput} resize-none`}
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="block">
        <span className="block text-xs font-mono uppercase tracking-[0.15em] text-ink-inverse/60 mb-2">
          {field.label}
          {field.required && <span className="text-brand-glow"> *</span>}
        </span>
        <select name={field.name} required={field.required} className={baseInput}>
          <option value="">Select…</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-[0.15em] text-ink-inverse/60 mb-2">
        {field.label}
        {field.required && <span className="text-brand-glow"> *</span>}
      </span>
      <input
        type={field.type}
        name={field.name}
        required={field.required}
        className={baseInput}
      />
    </label>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-full bg-brand-glow/20 text-brand-glow flex items-center justify-center mx-auto mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <h3 className="display-md text-ink-inverse mb-3">Message received.</h3>
      <p className="text-sm text-ink-inverse/70 font-mono mb-7 leading-relaxed">
        We'll come back with a tailored architecture review within two business days.
      </p>
      <button
        onClick={onReset}
        className="text-xs font-mono uppercase tracking-[0.15em] text-brand-glow hover:text-ink-inverse transition-colors"
      >
        Send another →
      </button>
    </div>
  );
}
