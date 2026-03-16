import type { ReactNode } from "react";

const FONT = "Be Vietnam Pro, sans-serif";

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="text-white/60 flex-shrink-0" style={{ fontFamily: FONT }}>
          {label}
        </span>
        <span className="text-white text-right" style={{ fontFamily: FONT }}>
          {value}
        </span>
      </div>
      <div className="h-px bg-white/10" />
    </>
  );
}
