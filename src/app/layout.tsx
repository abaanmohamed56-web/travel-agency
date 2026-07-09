import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raalhu AI — Your AI Growth Operating System",
  description:
    "Raalhu AI is an autonomous AI marketing platform: a team of specialist agents that research, strategize, create, publish, and optimize your growth — all from one command.",
  keywords: [
    "AI marketing",
    "autonomous marketing agents",
    "AI growth platform",
    "marketing automation",
  ],
  openGraph: {
    title: "Raalhu AI — Your AI Growth Operating System",
    description:
      "An AI marketing team that researches, creates, publishes, and optimizes your growth autonomously.",
    type: "website",
    locale: "en_US",
    siteName: "Raalhu AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raalhu AI — Your AI Growth Operating System",
    description:
      "An AI marketing team that researches, creates, publishes, and optimizes your growth autonomously.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#080A0F" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
