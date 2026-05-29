import Link from "next/link";
import { siteConfig } from "@/content/site-config";
import { SocialLinks } from "@/components/social-icons";
import { NAV_LINKS } from "@/components/headers/nav-links";

/**
 * FT2 — Asymmetric Editorial Footer
 * Left half: brand statement + socials. Right half: nav columns + legal.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-accent text-ink-inverse pt-24 pb-10 relative overflow-hidden">
      {/* Decorative atmospheric gradient mesh */}
      <div className="absolute inset-0 mesh-bg-dark opacity-50 pointer-events-none" aria-hidden />

      <div className="container-page relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-12 lg:gap-16 mb-16">
          {/* Left — brand statement + socials */}
          <div>
            <Link
              href="/"
              className="font-display text-3xl tracking-[0.04em] font-semibold inline-block mb-6"
            >
              {siteConfig.company.name}
            </Link>
            <p className="text-base text-ink-inverse/70 leading-relaxed max-w-md mb-8">
              {siteConfig.footer.brandStatement}
            </p>
            <SocialLinks socials={siteConfig.socials} className="text-ink-inverse/60 hover:text-ink-inverse" />
          </div>

          {/* Middle — navigation */}
          <div>
            <div className="eyebrow text-brand-glow mb-4">Navigate</div>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-inverse/70 hover:text-ink-inverse transition-colors font-mono"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — contact + CTA */}
          <div>
            <div className="eyebrow text-brand-glow mb-4">Contact</div>
            <ul className="space-y-3 text-sm font-mono text-ink-inverse/70 mb-8">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-ink-inverse transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-ink-inverse transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-ink-inverse/55">{siteConfig.contact.location}</li>
            </ul>
            <Link
              href={siteConfig.ctaPrimary.href}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-bg-primary text-ink-primary text-xs font-mono uppercase tracking-[0.12em] hover:bg-brand-muted transition-colors"
            >
              {siteConfig.ctaPrimary.label} →
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-line-inverse/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs font-mono text-ink-inverse/50">
            © {year} {siteConfig.company.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {siteConfig.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs font-mono text-ink-inverse/50 hover:text-ink-inverse transition-colors uppercase tracking-[0.1em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
