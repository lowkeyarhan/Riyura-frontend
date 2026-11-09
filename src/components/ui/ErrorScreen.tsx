import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorScreenProps {
  hero?: ReactNode;
  title: string;
  description: string;
  actions: ReactNode;
  digest?: string;
}

export default function ErrorScreen({
  hero,
  title,
  description,
  actions,
  digest,
}: ErrorScreenProps) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0e1a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-[55vh] w-[55vw] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute -right-24 bottom-0 h-[60vh] w-[50vw] rounded-full bg-orange-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <header className="relative z-10 px-6 py-6 md:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
        >
          <Image src="/logo.png" alt="Riyura" width={28} height={28} />
          <span
            className="text-sm font-bold tracking-[0.2em]"
            style={{ fontFamily: "'Bruno Ace', sans-serif" }}
          >
            RIYURA
          </span>
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        {hero && <div className="mb-6">{hero}</div>}
        <h1
          className="text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-md text-sm leading-relaxed text-white/45 md:text-base"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {actions}
        </div>
        {digest && (
          <p className="mt-12 text-[10px] uppercase tracking-[0.2em] text-white/20">
            Reference {digest}
          </p>
        )}
      </div>

      <p
        className="relative z-10 pb-6 text-center text-[10px] uppercase tracking-[0.25em] text-white/20"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Stream anything, anywhere, anytime.
      </p>
    </main>
  );
}
