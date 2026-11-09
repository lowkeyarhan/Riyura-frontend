"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-md text-white/60">
        An unexpected error occurred. Try again or head back home.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
      >
        Try again
      </button>
    </div>
  );
}
