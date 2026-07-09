import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/raalhu/auth/AuthShell";
import { LoginForm } from "@/components/raalhu/auth/LoginForm";

export const metadata = { title: "Sign in" };

export default function RaalhuLoginPage() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to reach your AI marketing team."
      footer={
        <>
          New to Raalhu?{" "}
          <Link href="/raalhu/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm googleConfigured={googleConfigured} />
      </Suspense>
    </AuthShell>
  );
}
