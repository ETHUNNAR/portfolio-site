import type { Metadata } from "next";
import { Cormorant_Garamond, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { AdminProvider } from "@/lib/admin-context";
import { LanguageToggle } from "@/components/language-toggle";
import { EditModeToolbar } from "@/components/admin/edit-mode-toolbar";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/smooth-scroll";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vi The Ngo | Software Developer",
  description:
    "Full-stack developer specializing in React, TypeScript, and modern web technologies. Based in Odense, Denmark.",
  keywords: [
    "software developer",
    "frontend",
    "React",
    "TypeScript",
    "Angular",
    "full-stack",
    "Denmark",
  ],
  authors: [{ name: "Vi The Ngo" }],
  metadataBase: new URL("https://vithengo.com"),
  openGraph: {
    title: "Vi The Ngo | Software Developer",
    description:
      "Full-stack developer specializing in React, TypeScript, and modern web technologies.",
    type: "website",
    locale: "en_US",
    siteName: "Vi The Ngo Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vi The Ngo | Software Developer",
    description:
      "Full-stack developer specializing in React, TypeScript, and modern web technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      en: "/",
      da: "/?lang=da",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vi The Ngo",
  jobTitle: "Software Developer",
  url: "https://vithengo.com",
  email: "vithe.ngo@gmail.com",
  telephone: "+4551901737",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Odense",
    addressCountry: "DK",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Southern Denmark",
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Angular",
    "Next.js",
    "Full-Stack Development",
  ],
  sameAs: ["https://www.linkedin.com/in/vi-the-ngo/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${cormorant.variable} ${sora.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://fdcetspaxgscoanjivwt.supabase.co" />
        <link rel="dns-prefetch" href="https://fdcetspaxgscoanjivwt.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <LanguageProvider>
            <AdminProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
              >
                Skip to main content
              </a>
              <div className="noise-overlay" aria-hidden="true" />
              <LanguageToggle />
              {children}
              <EditModeToolbar />
              <Analytics />
            </AdminProvider>
          </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
