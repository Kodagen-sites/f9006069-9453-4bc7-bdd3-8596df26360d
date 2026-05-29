/**
 * Generation manifest (Variation Manifest — Step 2.5 lock):
 *   archetype: G                          g_render_mode: scrub-assemble  (LOCKED — Mode 3)
 *   style: S11 (Architectural Product)    color_variant: ocean-mint     (LOCKED palette)
 *   voice_family: V6 (Systems)            card_variant: CV4 (Liquid Glass)
 *   cta_variant: CTA2 (Split Form-Right)  header_variant: pill-floating
 *   footer_variant: FT2 (Asymmetric Editorial)
 *   hero_overlay: HO4 (glass card)        hero_text: H3 gradient        hero_entrance: E3 two-tone fade
 *   scene_variant: SC3                    motion_variant: M9 (mandatory for scrub-assemble)
 *   services_variant: SV5 (glassmorphism tech grid)
 *   value_prop_variant: VV3               process_variant: PRV2
 *   stats_variant: ST1 (3-across counters)  testimonials_variant: n/a
 *   about_variant: AB1                    contact_variant: CT3 (no map, global)
 *   benefits_variant: n/a (covered by services)
 *   inspiration:
 *     hero_treatment: scrubbed-frames     glass_material: liquid-glass-minimal
 *     motion_vocabulary: frame-scrub      background_treatment: radial-gradient-mesh
 *     card_material_variant: image-reveal-mask
 *     motion_bg_pattern: gradient-mesh-flow  motion_bg_density: subtle
 *   video-prompt:
 *     narrative_shape: object-reveal      camera_vocabulary: static-hold + push-in-macro
 *     composition_pattern: centered-earned (assembly reveal — justified)
 *     subject_position: mid               lighting_temperature: studio-controlled
 *     industry_video_tone: fallback-warm-slow (med-tech cool-modified)
 *   industry: healthcare-tech (SaaS)      auth_strategy: none  subscribers_enabled: false
 *   build_mode: landing                   asset_mode: live-generate
 *
 * Pre-locked from intake wizard:
 *   archetype = G, gRenderMode = scrub-assemble
 *   colorPalette = ocean-mint  (#EAF7F5,#A8D9D0,#2E7F8C,#0E3A47)
 *   typographyPair = Space Grotesk + Space Mono
 */

import assetManifest from "./asset-manifest.json";

export type SocialKey = "twitter" | "linkedin" | "github" | "youtube";

export interface Service {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  imageSlot: string;
}

export interface SiteConfig {
  company: {
    name: string;
    legalName: string;
    tagline: string;
    description: string;
    foundedYear: number;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    h1Accent: string;
    subhead: string;
    bodyLead: string;
  };
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  services: Service[];
  valueProp: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string[];
    imageSlot: string;
  };
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  stats: Array<{
    value: number;
    suffix: string;
    label: string;
    decimals?: number;
  }>;
  manifesto: {
    eyebrow: string;
    text: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    backgroundSlot: string;
    formFields: Array<{ name: string; label: string; type: "text" | "email" | "textarea" | "select"; required?: boolean; options?: string[] }>;
  };
  footer: {
    variant: string;
    brandStatement: string;
    ctaHeadline: string;
  };
  legal: Array<{ label: string; href: string }>;
  socials: Record<SocialKey, string>;
  headerVariant: string;
  scrollHero: {
    archetype: string;
    styleId: string;
    assetMode: "live-generate" | "prompt-only";
    imageUrl: string;
    videoUrl: string;
    frameCount: number;
    scrollDistance: number;
  };
  seo: {
    siteUrl: string;
    locale: string;
    ogImageSlot: string;
  };
}

const manifest = assetManifest as {
  images: Record<string, string>;
  videos: Record<string, string>;
  frames: Record<string, string[]>;
};

export const siteConfig: SiteConfig = {
  company: {
    name: "Medivault AI",
    legalName: "Medivault AI Inc.",
    tagline: "Healthcare data, secured at the source.",
    description:
      "Medivault unifies EHR systems, audit trails, and AI insights into one HIPAA-compliant infrastructure for healthcare providers.",
    foundedYear: 2024,
  },
  contact: {
    email: "hello@medivault.ai",
    phone: "+1 (415) 555-0142",
    location: "Global · Remote-first",
  },
  hero: {
    eyebrow: "Patient data infrastructure",
    h1: "Healthcare data,",
    h1Accent: "secured at the source.",
    subhead:
      "Medivault unifies EHR systems, audit trails, and AI insights into one HIPAA-compliant infrastructure.",
    bodyLead:
      "Built for providers handling the most sensitive records. Engineered for compliance teams who can't afford ambiguity.",
  },
  ctaPrimary: { label: "Request access", href: "/contact" },
  ctaSecondary: { label: "How it works", href: "#process" },
  services: [
    {
      slug: "ehr-integration",
      name: "EHR Integration",
      description:
        "Connect Epic, Cerner, Athenahealth, and 40+ EHR systems through a single FHIR-native API.",
      longDescription:
        "Drop-in adapters for the major EHR vendors plus a typed FHIR R4 client. Field-level mapping, write-back support, and a versioned schema registry mean integrations stop being a six-month project.",
      imageSlot: "service-ehr-integration",
    },
    {
      slug: "ai-diagnostics",
      name: "AI Diagnostics",
      description:
        "Run validated diagnostic models against your patient data without the data ever leaving the vault.",
      longDescription:
        "Bring-your-own-model and a curated library of FDA-cleared inference packs. All execution happens inside the Medivault enclave — model weights touch data, not the other way round.",
      imageSlot: "service-ai-diagnostics",
    },
    {
      slug: "data-vault",
      name: "Encrypted Data Vault",
      description:
        "PHI stored under envelope encryption with per-record key isolation and signed access trails.",
      longDescription:
        "Each patient record sits behind its own data-encryption key, wrapped by a tenant-scoped KEK. Access is gated by attribute-based policies; every read produces a signed entry in a tamper-evident log.",
      imageSlot: "service-data-vault",
    },
    {
      slug: "compliance",
      name: "Compliance & Privacy",
      description:
        "HIPAA, HITECH, SOC 2 Type II, and GDPR controls running as code — not as a spreadsheet.",
      longDescription:
        "Continuous compliance posture monitoring with auto-generated evidence for auditors. BAA-ready by default. Regional residency, breach notification workflows, and DSAR tooling all built in.",
      imageSlot: "service-compliance",
    },
    {
      slug: "clinical-workflow",
      name: "Clinical Workflow Automation",
      description:
        "Trigger downstream actions on lab results, intake completions, and prior-auth decisions.",
      longDescription:
        "A typed event bus over your patient timeline. Build automations for referrals, follow-ups, and care-gap alerts without writing glue services or fighting interface engines.",
      imageSlot: "service-clinical-workflow",
    },
    {
      slug: "provider-analytics",
      name: "Provider Analytics",
      description:
        "De-identified population analytics with row-level lineage back to the source EHR.",
      longDescription:
        "A read-optimised OMOP layer over Medivault data with safe-harbor de-identification, cohort builders, and dashboards for population health, utilization, and outcomes — all auditable.",
      imageSlot: "service-provider-analytics",
    },
  ],
  valueProp: {
    eyebrow: "Why providers choose Medivault",
    heading: "Infrastructure that earns its place in your security review.",
    body: "Encryption at every layer. Audit trails you can actually defend. AI inference inside the vault, not against it. Built by engineers who shipped at Epic, Verily, and Mount Sinai.",
  },
  about: {
    eyebrow: "About",
    heading: "We build the boring, important plumbing of modern medicine.",
    body: [
      "Medivault started inside a hospital incident-response group. The team had spent twelve months reconciling a single EHR migration and decided the tooling itself was the problem.",
      "Today we run the data layer for clinics, telehealth networks, and AI diagnostic startups across four continents. Every record sits behind envelope encryption. Every access leaves a signed trail. Every model runs inside the vault, not against it.",
      "We don't sell hype. We sell the unglamorous infrastructure that lets clinical teams focus on patients instead of integration tickets.",
    ],
    imageSlot: "section-about",
  },
  process: [
    {
      step: "01",
      title: "Map your data surface",
      description:
        "We catalogue every EHR, lab feed, imaging archive, and consent store you currently touch. No black boxes.",
    },
    {
      step: "02",
      title: "Stand up the vault",
      description:
        "Per-tenant Medivault instance provisioned in your chosen region. Encryption keys you can rotate, revoke, or escrow.",
    },
    {
      step: "03",
      title: "Wire integrations",
      description:
        "FHIR-native adapters connect your existing systems. Field mapping, write-back rules, and audit hooks all versioned in code.",
    },
    {
      step: "04",
      title: "Activate workflows",
      description:
        "Turn on AI models, automation rules, and provider analytics — auditable from day one, BAA in place.",
    },
  ],
  stats: [
    { value: 14, suffix: "M+", label: "Patient records protected" },
    { value: 99.97, suffix: "%", label: "Uptime SLA delivered", decimals: 2 },
    { value: 42, suffix: "+", label: "EHR systems supported" },
  ],
  manifesto: {
    eyebrow: "What we believe",
    text:
      "Patient data is the most sensitive infrastructure in healthcare. It deserves to be treated as such — encrypted at rest, encrypted in transit, audited end-to-end, and accessible only to the people and models with explicit authorisation. Everything else is theatre.",
  },
  cta: {
    eyebrow: "Get in touch",
    heading: "Start a conversation with our team.",
    body: "Tell us a little about your environment and we'll come back with a tailored architecture review within two business days.",
    backgroundSlot: "section-cta",
    formFields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Work email", type: "email", required: true },
      { name: "organization", label: "Organisation", type: "text", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        required: true,
        options: ["Clinical leadership", "IT / Security", "Compliance", "Engineering", "Operations", "Other"],
      },
      { name: "message", label: "What are you trying to solve?", type: "textarea", required: true },
    ],
  },
  footer: {
    variant: "FT2",
    brandStatement:
      "Medivault is the encrypted data layer behind clinics, telehealth networks, and AI diagnostic teams. Built by engineers who lived inside hospital incident response.",
    ctaHeadline: "Ready to lock down your patient data?",
  },
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  socials: {
    twitter: "https://twitter.com/medivault",
    linkedin: "https://linkedin.com/company/medivault",
    github: "https://github.com/medivault",
    youtube: "",
  },
  headerVariant: "pill-floating",
  scrollHero: {
    archetype: "G",
    styleId: "S11",
    assetMode: "live-generate",
    imageUrl: "",
    videoUrl: "",
    frameCount: 0,
    scrollDistance: 6,
  },
  seo: {
    siteUrl: "https://medivault.ai",
    locale: "en_US",
    ogImageSlot: "og-image",
  },
};

export const assetUrl = (slot: string, fallback = ""): string =>
  manifest.images?.[slot] ?? fallback;

export const videoUrl = (slot: string, fallback = ""): string =>
  manifest.videos?.[slot] ?? fallback;

export const frameUrls = (sceneId: string): string[] =>
  manifest.frames?.[sceneId] ?? [];
