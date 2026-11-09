"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import ErrorScreen from "@/src/components/ui/ErrorScreen";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest = (error as { digest?: string } | null)?.digest;

  return (
    <ErrorScreen
      hero={
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
          <AlertCircle className="h-7 w-7 text-orange-400" strokeWidth={1.5} />
        </div>
      }
      title="Something went wrong."
      description="The stream hit a snag. Try again, or head back home."
      digest={digest}
      actions={
        <>
          <button
            onClick={() => retry()}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/home"
            className="apple-glass rounded-full px-6 py-3 text-sm font-medium text-white/70 transition hover:text-white active:scale-95"
          >
            Back home
          </Link>
        </>
      }
    />
  );
}
