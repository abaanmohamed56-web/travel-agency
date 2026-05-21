import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080A0F]" />}>
      <RegisterForm />
    </Suspense>
  );
}
