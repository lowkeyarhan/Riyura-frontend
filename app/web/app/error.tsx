"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import ErrorScreen from "@riyura/ui-web/ErrorScreen";
import { shouldRedirectErrorPage } from "@/src/lib/error-page-behavior";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
        </div>
      }
      title="Something went wrong"
      description="We ran into an unexpected error. Try again, or head back home."
      digest={error?.digest}
      actions={
        <>
          <button
            onClick={() => retry()}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Try again
          </button>
          <Link
            href="/home"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20 active:scale-95"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Back to Home
          </Link>
        </>
      }
    />
  );
}
