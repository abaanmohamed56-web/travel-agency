import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary diagnostic route for the deployed-environment login failure.
// Bypasses NextAuth (which masks every authorize() failure mode behind the
// same "CredentialsSignin" code) to show the real Prisma/Postgres error.
// Delete once the deployed login is confirmed working.
export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "demo@raalhu.ai" },
      select: { id: true, email: true, password: true },
    });
    return NextResponse.json({
      ok: true,
      found: !!user,
      hasPassword: !!user?.password,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        name: err instanceof Error ? err.name : typeof err,
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
