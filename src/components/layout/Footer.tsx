"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] pt-10 pb-6 overflow-hidden font-sans border-t border-white/5">
      {/* --- ATMOSPHERE (Subtler) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[40vw] h-[300px] bg-gradient-to-t from-red-900/10 via-orange-900/5 to-transparent blur-[80px]" />
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
