import type { Metadata } from "next";
import "./raalhu.css";

export const metadata: Metadata = {
  title: {
    default: "Raalhu AI — Your Autonomous Marketing Team",
    template: "%s · Raalhu AI",
  },
  description:
    "Raalhu AI researches your business, builds strategy, creates campaigns and content, and improves continuously — like a full marketing department on demand.",
  openGraph: {
    title: "Raalhu AI — Your Autonomous Marketing Team",
    description:
      "An AI growth operating system: research, strategy, campaigns, content, analytics — orchestrated by a team of AI agents.",
    type: "website",
    siteName: "Raalhu AI",
  },
};

export default function RaalhuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="raalhu dark min-h-dvh bg-background font-sans text-foreground antialiased">
      {children}
    </div>
  );
}
