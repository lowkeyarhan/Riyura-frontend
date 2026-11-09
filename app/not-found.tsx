import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 max-w-md text-white/60">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/home"
        className="mt-6 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
      >
        Back home
      </Link>
    </div>
  );
}
