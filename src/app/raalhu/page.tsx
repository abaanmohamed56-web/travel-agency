import { LandingNav } from "@/components/raalhu/landing/LandingNav";
import { Hero } from "@/components/raalhu/landing/Hero";
import { LandingSections } from "@/components/raalhu/landing/LandingSections";

export default function RaalhuLandingPage() {
  return (
    <main>
      <LandingNav />
      <Hero />
      <LandingSections />
    </main>
  );
}
