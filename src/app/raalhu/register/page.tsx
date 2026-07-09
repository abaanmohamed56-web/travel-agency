import Link from "next/link";
import { AuthShell } from "@/components/raalhu/auth/AuthShell";
import { RegisterForm } from "@/components/raalhu/auth/RegisterForm";

export const metadata = { title: "Create account" };

export default function RaalhuRegisterPage() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  return (
    <AuthShell
      title="Create your account"
      subtitle="Two minutes of setup, then your AI team gets to work."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/raalhu/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm googleConfigured={googleConfigured} />
    </AuthShell>
  );
}
