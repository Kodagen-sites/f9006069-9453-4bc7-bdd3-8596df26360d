import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/headers/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/motion/FilmGrain";
import EditorBridge from "@/components/__kodagen/EditorBridge";
import { siteConfig, assetUrl } from "@/content/site-config";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  title: {
    default: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    template: `%s — ${siteConfig.company.name}`,
  },
  description: siteConfig.company.description,
  openGraph: {
    title: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    description: siteConfig.company.description,
    url: siteConfig.seo.siteUrl,
    siteName: siteConfig.company.name,
    locale: siteConfig.seo.locale,
    type: "website",
    images: assetUrl(siteConfig.seo.ogImageSlot)
      ? [{ url: assetUrl(siteConfig.seo.ogImageSlot), width: 1200, height: 630 }]
      : [],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.company.name} — ${siteConfig.company.tagline}`,
    description: siteConfig.company.description,
    images: assetUrl(siteConfig.seo.ogImageSlot) ? [assetUrl(siteConfig.seo.ogImageSlot)] : [],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.seo.siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bg-primary text-ink-primary antialiased">
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <FilmGrain opacity={0.025} blendMode="overlay" />
        <EditorBridge />
      </body>
    </html>
  );
}
