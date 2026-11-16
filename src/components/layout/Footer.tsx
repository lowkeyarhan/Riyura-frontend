"use client";

import Link from "next/link";
import { MessageCircle, Instagram, Dribbble, Linkedin } from "lucide-react";

const socials = [
  { Icon: MessageCircle, href: "#", label: "Contact" },
  { Icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { Icon: Dribbble, href: "https://dribbble.com/", label: "Dribbble" },
  { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
];

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Explore", href: "/explore" },
  { label: "Search", href: "/search" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Profile", href: "/profile" },
];

const FALLBACK_BRAND = ["#ff8a4c", "#c25a2a", "#7a2f16", "#2a0f06"];

// Extracted colors carry alpha 0.15; strip it so the glow stays visible.
const toSolid = (color: string) =>
  color.replace(
    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
    "rgb($1, $2, $3)",
  );

export default function Footer({
  gradientColors,
}: {
  gradientColors?: string[];
}) {
  const colors = gradientColors ?? [];
  const brand =
    colors.length >= 4 ? colors.map(toSolid) : FALLBACK_BRAND;

  return (
    <footer className="w-full px-4 pb-4 pt-6 sm:px-8">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#161616] px-6 pt-10 sm:px-10 sm:pt-12">
        {/* Top content */}
        <div className="relative z-20 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Navigation */}
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-medium text-white/95 transition-colors hover:text-white sm:text-3xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials + contact */}
          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-colors hover:text-white/60"
                  title={s.label}
                >
                  <s.Icon size={24} strokeWidth={1.75} />
                </a>
              ))}
            </div>
            <div className="space-y-1 text-sm text-white/70 sm:text-base md:text-right">
              <p>E-mail: hello@riyura.co</p>
              <p>© 2025. Built by Arhan Das.</p>
            </div>
          </div>
        </div>

        {/* Brand watermark */}
        <div className="relative z-10 mt-8 h-[20vw] min-h-[96px] overflow-hidden">
          {/* Bottom glow wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[85%] opacity-60 blur-[70px]"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${brand[0]}, transparent 72%)`,
            }}
          />
          {/* Gradient brand text */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <span
              aria-hidden
              className="select-none whitespace-nowrap bg-clip-text text-[30vw] font-semibold leading-[0.64] tracking-[-0.06em] text-transparent blur-[3px]"
              style={{
                backgroundImage: `linear-gradient(to top, ${brand[0]} 0%, ${brand[1]} 40%, ${brand[2]} 70%, transparent 100%)`,
              }}
            >
              Riyura
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
