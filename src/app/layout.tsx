import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillPips — Master Forex. Trade With Precision.",
  description:
    "Join SkillPips and learn professional trading strategies, live mentorship, signals, and market psychology.",
  keywords: [
    "forex education",
    "trading signals",
    "forex mentorship",
    "trading strategies",
  ],
  openGraph: {
    title: "SkillPips — Master Forex. Trade With Precision.",
    description: "Professional forex education, signals, and mentorship.",
    type: "website",
    locale: "en_US",
    siteName: "SkillPips",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillPips — Master Forex. Trade With Precision.",
    description: "Professional forex education, signals, and mentorship.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#080A0F" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
