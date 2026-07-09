"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RaalhuLogo } from "@/components/raalhu/RaalhuLogo";
import { buttonVariants } from "@/components/raalhu/ui/button";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "r-glass-deep" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/raalhu" aria-label="Raalhu AI home">
          <RaalhuLogo />
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#agents" className="transition-colors hover:text-foreground">
            The team
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Platform
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/raalhu/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link
            href="/raalhu/register"
            className={buttonVariants({ size: "sm" })}
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
