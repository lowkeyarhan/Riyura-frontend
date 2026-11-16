"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorScreen from "@/src/components/ui/ErrorScreen";
import { shouldRedirectErrorPage } from "@/src/lib/error-page-behavior";

export default function NotFound() {
  const router = useRouter();
  const redirect = shouldRedirectErrorPage();

  useEffect(() => {
    if (redirect) {
      router.replace("/home");
    }
  }, [redirect, router]);

  if (redirect) {
    return null;
  }

  return (
    <ErrorScreen
      hero={
        <span
          className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-7xl font-semibold tracking-[-0.06em] text-transparent md:text-8xl"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          404
        </span>
      }
      title="Page not found"
      description="The page you're looking for doesn't exist or may have been moved."
      actions={
        <>
          <Link
            href="/home"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20 active:scale-95"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Explore
          </Link>
        </>
      }
    />
  );
}
