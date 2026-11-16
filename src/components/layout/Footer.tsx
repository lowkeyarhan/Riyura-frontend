"use client";

import Link from "next/link";
import { MessageCircle, Instagram, Dribbble, Linkedin } from "lucide-react";

const socials = [
  { Icon: MessageCircle, href: "#", label: "Contact" },
  { Icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { Icon: Dribbble, href: "https://dribbble.com/", label: "Dribbble" },
  { Icon: Linkedin, href: "https://linkedin.com/", label: "LinkedIn" },
];

const linkGroups = [
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "mailto:hello@riyura.co" },
      { label: "Report a Problem", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-4 pt-6 sm:px-8">
      <div className="apple-glass rounded-[1.5rem] px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-xs space-y-3">
            <span
              className="text-sm font-bold tracking-wider text-white"
              style={{ fontFamily: "'Bruno Ace', sans-serif" }}
            >
              RIYURA
            </span>
            <p className="text-xs leading-relaxed text-white/50">
              Stream anything, anywhere, anytime. Movies, TV shows and watch
              parties in one place.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                  title={s.label}
                >
                  <s.Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {linkGroups.map((group) => (
              <nav key={group.title} className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/40">
            © 2025 Riyura. Built by Arhan Das.
          </p>
          <p className="text-[11px] text-white/40">Made for movie lovers.</p>
        </div>
      </div>
    </footer>
  );
}
