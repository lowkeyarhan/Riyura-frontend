import type { ReactNode } from "react";

interface ErrorScreenProps {
  hero?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-[10%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-[#155f75b5] opacity-40 blur-[130px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-[#9a341299] opacity-30 mix-blend-screen blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {hero && <div className="mb-6">{hero}</div>}
        <h1
          className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {title}
        </h1>
        <p
          className="mt-3 max-w-md text-sm leading-relaxed text-gray-400 md:text-base"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {description}
        </p>
        {actions && (
          <div
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {actions}
          </div>
        )}
        {digest && (
          <p
            className="mt-12 text-[10px] uppercase tracking-[0.2em] text-white/20"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Reference {digest}
          </p>
        )}
      </div>
    </main>
  );
}
