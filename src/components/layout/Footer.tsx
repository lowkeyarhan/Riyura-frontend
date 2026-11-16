"use client";

import Link from "next/link";

export default function Footer({
  gradientColors,
}: {
  gradientColors?: string[];
}) {
  const colors = gradientColors ?? [];
  const footerGradient =
    colors.length > 0
      ? `radial-gradient(circle at 0% 0%, ${colors[0]} 0%, transparent 50%),radial-gradient(circle at 100% 0%, ${colors[1]} 0%, transparent 50%),radial-gradient(circle at 0% 100%, ${colors[2]} 0%, transparent 50%),radial-gradient(circle at 100% 100%, ${colors[3]} 0%, transparent 50%)`
      : undefined;

  return (
    <footer
      className="relative w-full pt-10 pb-6 overflow-hidden font-sans border-t border-white/5"
      style={{
        backgroundColor: "#050505",
        backgroundImage: footerGradient,
      }}
    >
      {/* --- ATMOSPHERE (Subtler) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20">
        {/* --- MAIN CONTENT --- */}
        <div className="grid grid-cols-2 gap-4 max-w-md mb-10">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Discover
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/home">Home</FooterLink>
              <FooterLink href="/explore">Explore</FooterLink>
              <FooterLink href="/search">Search</FooterLink>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Account
            </h4>
            <ul className="space-y-1.5">
              <FooterLink href="/profile">Profile</FooterLink>
              <FooterLink href="/watchlist">Watchlist</FooterLink>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 opacity-80">
              <span
                className="text-sm font-bold text-white tracking-wider"
                style={{ fontFamily: "'Bruno Ace', sans-serif" }}
              >
                RIYURA
              </span>
            </div>
            <span className="text-gray-700 text-xs">|</span>
            <p className="text-[10px] text-gray-500">
              © 2025. Built by{" "}
              <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                Arhan Das
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-xs text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-200"
    >
      {children}
    </Link>
  </li>
);
