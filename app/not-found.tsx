import Link from "next/link";
import ErrorScreen from "@/src/components/ui/ErrorScreen";

export default function NotFound() {
  return (
    <ErrorScreen
      hero={
        <span
          className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-8xl font-semibold tracking-[-0.06em] text-transparent md:text-9xl"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          404
        </span>
      }
      title="This page doesn't exist."
      description="The link may be broken, or the page may have moved."
      actions={
        <>
          <Link
            href="/home"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
          >
            Back home
          </Link>
          <Link
            href="/explore"
            className="apple-glass rounded-full px-6 py-3 text-sm font-medium text-white/70 transition hover:text-white active:scale-95"
          >
            Explore
          </Link>
        </>
      }
    />
  );
}
