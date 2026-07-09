import { redirect } from "next/navigation";
import { getOptionalRaalhuContext } from "@/modules/raalhu/auth/context";
import { OnboardingFlow } from "@/components/raalhu/onboarding/OnboardingFlow";

export const metadata = { title: "Set up your workspace" };

export default async function OnboardingPage() {
  // Already in an organization? Straight to the dashboard.
  const ctx = await getOptionalRaalhuContext();
  if (ctx) redirect("/raalhu/dashboard");

  return <OnboardingFlow />;
}
