"use client";

interface PlayerLayoutProps {
  children: React.ReactNode;
}

export function PlayerLayout({ children }: PlayerLayoutProps) {
  return (
    <div className="w-full bg-black text-white font-sans">
      {/* --- ATMOSPHERE --- */}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
