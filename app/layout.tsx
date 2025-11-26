import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";

export const metadata: Metadata = {
  title: "Vi The Ngo | Software Developer",
  description: "Full-stack developer specializing in React, TypeScript, and modern web technologies. Based in Odense, Denmark.",
  keywords: ["software developer", "frontend", "React", "TypeScript", "Angular", "full-stack", "Denmark"],
  authors: [{ name: "Vi The Ngo" }],
  openGraph: {
    title: "Vi The Ngo | Software Developer",
    description: "Full-stack developer specializing in React, TypeScript, and modern web technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <LanguageProvider>
          <div className="noise-overlay" />
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
