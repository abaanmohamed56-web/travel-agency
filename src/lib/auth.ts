import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        // Raalhu AI: seed the active organization from the user's first membership.
        const membership = await prisma.membership.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
        });
        if (membership) {
          token.raalhuOrgId = membership.organizationId;
          token.raalhuRole = membership.role;
        }
      }
      // Raalhu AI: org switcher / onboarding calls session.update({ raalhuOrgId }).
      // The claim is only written after re-verifying membership in the database.
      if (trigger === "update" && session?.raalhuOrgId && token.id) {
        const membership = await prisma.membership.findFirst({
          where: {
            userId: token.id as string,
            organizationId: session.raalhuOrgId as string,
          },
        });
        if (membership) {
          token.raalhuOrgId = membership.organizationId;
          token.raalhuRole = membership.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
        session.user.raalhuOrgId = token.raalhuOrgId;
        session.user.raalhuRole = token.raalhuRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/raalhu/login",
    error: "/raalhu/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
