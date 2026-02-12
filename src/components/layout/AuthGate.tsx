"use client";

import { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import Navbar from "@/src/components/layout/Navbar";
import MobileNavbar from "@/src/components/layout/MobileNavbar";
import { supabase } from "@/src/lib/auth/supabase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = Boolean(
    pathname === "/" ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/auth"),
  );

  useEffect(() => {
    const checkOnboarded = async () => {
      if (user) {
        // Fetch profile from supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", user.id)
          .single();
        if (error) {
          setOnboarded(null);
        } else {
          setOnboarded(data?.onboarded ?? null);
        }
      } else {
        setOnboarded(null);
      }
    };
    if (!loading) {
      checkOnboarded();
      if (!user && !isPublic) {
        router.prefetch("/auth");
        startTransition(() => {
          router.replace("/auth");
        });
      }
    }
  }, [loading, user, isPublic, router]);

  useEffect(() => {
    if (!loading && user && onboarded !== null) {
      if (isPublic) {
        const targetRoute = !onboarded ? "/onboarding" : "/home";

        // Prefetch the target route first
        router.prefetch(targetRoute);

        // Use startTransition to avoid race conditions during navigation
        startTransition(() => {
          // Add a small delay to ensure chunks are loaded
          setTimeout(() => {
            router.replace(targetRoute);
          }, 100);
        });
      }
    }
  }, [loading, user, onboarded, isPublic, router]);

  const shouldShowNavbar = !isPublic && pathname !== "/onboarding";

  if (loading) {
    return (
      <>
        {shouldShowNavbar && (
          <>
            <div className="hidden md:block">
              <Navbar />
            </div>
            <div className="block md:hidden">
              <MobileNavbar />
            </div>
          </>
        )}
        {children}
      </>
    );
  }

  if (!user && !isPublic) {
    return null;
  }

  return shouldShowNavbar ? (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      {children}
    </>
  ) : (
    <>{children}</>
  );
}
