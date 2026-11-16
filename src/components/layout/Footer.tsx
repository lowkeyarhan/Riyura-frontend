"use client";

import Link from "next/link";
import { Instagram, Linkedin, Phone, Dribbble } from "lucide-react";

const socials = [
  { Icon: Phone, href: "#", label: "Phone" },
  { Icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { Icon: Dribbble, href: "https://dribbble.com/", label: "Dribbble" },
  { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
];

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Explore", href: "/explore" },
  { label: "Search", href: "/search" },
  { label: "Profile", href: "/profile" },
  { label: "Watchlist", href: "/watchlist" },
];

export default function Footer({
  gradientColors,
}: {
  gradientColors?: string[];
}) {
  const colors = gradientColors ?? [];
  const brandGradient =
    colors.length > 0 ? `linear-gradient(135deg, ${colors.join(", ")})` : undefined;

  return (
    <footer
      className="relative w-full overflow-hidden font-sans border-t border-white/10 pt-16 pb-12 rounded-[2rem]"
      style={{
        // Translucent so the page's dynamic gradient background bleeds through.
        backgroundColor: "rgba(5, 5, 5, 0.45)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
    >
      {/* Large blurred brand watermark tinted with the page's colors. */}
      {brandGradient && (
        <div
          className="absolute inset-x-0 bottom-0 h-[260px] pointer-events-none opacity-10 blur-[100px]"
          style={{ background: brandGradient }}
        />
      )}

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
          {/* Left: navigation links */}
          <nav className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Discover
            </h4>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: social icons + credit */}
          <div className="flex flex-col gap-3 lg:items-end w-full lg:w-auto">
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title={s.label}
                >
                  <s.Icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-[10px] text-gray-500">
              © 2025. Built by Arhan Das.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
