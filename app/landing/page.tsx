"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "../globals.css";
import {
  Play,
  Shield,
  Users,
  Sparkles,
  MessageCircle,
  ArrowUpRight,
  ArrowDown,
  Lock,
  Film,
  Clock,
  Search,
  CheckCircle,
  Headphones,
  Radio,
  Video,
} from "lucide-react";

import type { LiquidEtherProps } from "@/src/components/ui/LiquidEther";

const LiquidEther = dynamic<LiquidEtherProps>(
  () => import("@/src/components/ui/LiquidEther"),
  { ssr: false },
);

// ─── Font helpers ────────────────────────────────────────────────────────────
const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

// ─── Static data ─────────────────────────────────────────────────────────────

const WAVEFORM = [18, 32, 52, 74, 96, 118, 145, 118, 96, 74, 52, 32, 18];

const FEATURE_CARDS = [
  {
    Icon: Film,
    title: "Discover Content",
    desc: "Discover what's worth watching.\nNot just what's trending.",
  },
  {
    Icon: Clock,
    title: "Watch Later",
    desc: "Save it. Come back anytime.\nYour queue, always ready.",
  },
  {
    Icon: Users,
    title: "Live Watch Parties",
    desc: "Watch together. Like you're in the same room.\nPerfect sync. Every time.",
  },
  {
    Icon: Sparkles,
    title: "AI Recommendations",
    desc: "Smarter picks. No endless scrolling.\nPowered by AI that actually gets your taste.",
  },
  {
    Icon: Search,
    title: "Search Everything",
    desc: "Find anything. Instantly.\nTitles, actors, studios — all in one search.",
  },
  {
    Icon: Play,
    title: "Continue Watching",
    desc: "Pick up exactly where you left off.\nNo thinking required.",
  },
];

const PARTY_TAGS = [
  { label: "2.7k watching", h: false },
  { label: "Live now", h: false },
  { label: "✦ In sync", h: true },
  { label: "Chat open", h: true },
  { label: "✦ Any device", h: false },
  { label: "AI picks", h: false },
  { label: "Party mode", h: false },
];

const RING_DASH = 2 * Math.PI * 45 * 0.77;
const RING_FULL = 2 * Math.PI * 45;

const SEC_TAGS = [
  "Supabase JWT",
  "TLS Encrypted",
  "2FA Ready",
  "Rate Limited",
  "Health Checked",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      className="bg-black min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: SF }}
    >
      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="px-8 md:px-16 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-75 transition-opacity duration-200 shrink-0"
          >
            <Image src="/logo.png" alt="Riyura Logo" width={28} height={28} />
            <span
              className="text-white font-bold text-[18px]"
              style={{ fontFamily: "'Bruno Ace', sans-serif" }}
            >
              RIYURA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-white/46 flex-1 justify-center">
            {["Features", "Explore", "Pricing", "FAQ"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-white/78 transition-colors duration-200"
              >
                {l}
              </a>
            ))}
          </div>

          <Link
            href="/auth"
            className="text-[13px] text-white/50 hover:text-white transition-colors duration-200 shrink-0"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="px-4 md:px-5 pt-[72px] pb-4">
        <div
          className="relative overflow-hidden rounded-[20px] border border-white/[0.055]"
          style={{
            background: "#06080a",
            minHeight: "calc(100vh - 92px)",
          }}
        >
          {/* LiquidEther fluid simulation background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <LiquidEther
              colors={["#3d9a60", "#8fd4a8", "#dff5e8"]}
              mouseForce={25}
              cursorSize={155}
              isViscous
              viscous={50}
              iterationsViscous={32}
              iterationsPoisson={40}
              resolution={0.5}
              isBounce
              autoDemo
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* SVG: network arcs + whisker lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1440 820"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,292 C 125,276 290,304 435,322 C 560,336 655,344 726,350"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="0.85"
              fill="none"
            />
            <path
              d="M 0,306 C 132,290 298,315 444,332 C 568,346 662,352 730,357"
              stroke="rgba(255,255,255,0.044)"
              strokeWidth="0.7"
              fill="none"
            />
            <path
              d="M 0,278 C 116,263 278,292 424,312 C 548,328 644,338 718,346"
              stroke="rgba(255,255,255,0.026)"
              strokeWidth="0.55"
              fill="none"
            />
            <path
              d="M 1440,282 C 1316,268 1152,296 1006,314 C 882,330 788,340 716,350"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="0.85"
              fill="none"
            />
            <path
              d="M 1440,296 C 1308,282 1142,308 996,326 C 874,342 780,350 710,355"
              stroke="rgba(255,255,255,0.044)"
              strokeWidth="0.7"
              fill="none"
            />
            <path
              d="M 1440,268 C 1326,255 1164,284 1018,304 C 894,322 802,334 706,344"
              stroke="rgba(255,255,255,0.026)"
              strokeWidth="0.55"
              fill="none"
            />
            <line
              x1="82"
              y1="198"
              x2="0"
              y2="198"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="0.7"
              strokeDasharray="5 9"
            />
            <line
              x1="1358"
              y1="170"
              x2="1440"
              y2="170"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="0.7"
              strokeDasharray="5 9"
            />
            <line
              x1="82"
              y1="480"
              x2="0"
              y2="480"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="0.7"
              strokeDasharray="5 9"
            />
            <line
              x1="1358"
              y1="454"
              x2="1440"
              y2="454"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="0.7"
              strokeDasharray="5 9"
            />
          </svg>

          {/* CENTER CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {/* Headline */}
            <h1
              className="font-bold leading-[1.0] mb-5"
              style={{
                fontSize: "clamp(38px, 6.2vw, 84px)",
                letterSpacing: "-0.038em",
                fontFamily: SF,
                fontWeight: 700,
              }}
            >
              <span className="text-white">One click. </span>
              <span style={{ color: "rgba(255,255,255,0.20)" }}>
                Everyone&apos;s in.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/40 max-w-[400px] leading-[1.7] mb-12"
              style={{
                fontSize: "16px",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Watch together. Instantly. No setup. No delays.
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2.5 pl-5 pr-1 py-1 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 text-[14px] font-semibold tracking-tight"
              >
                <span>Start Watching</span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 ease-in-out group-hover:rotate-45"
                  />
                </span>
              </Link>
              <Link
                href="#features"
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/[0.12] backdrop-blur-lg transition-all duration-300 text-[14px] font-medium text-white/68 hover:text-white"
              >
                Explore Riyura
              </Link>
            </div>
          </div>

          {/* Waveform bars
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-end gap-[3.5px] pointer-events-none"
            style={{ bottom: "14%" }}
          >
            {WAVEFORM.map((h, i) => (
              <div
                key={i}
                className="w-[1.5px] rounded-full"
                style={{
                  height: `${h}px`,
                  background: `rgba(255,255,255,${i === 6 ? 0.28 : i === 5 || i === 7 ? 0.12 : 0.06})`,
                }}
              />
            ))}
          </div> */}

          {/* Stream Horizons */}
          <div className="absolute bottom-6 right-6 text-right">
            <span className="text-[11px] text-white/34 block mb-1.5">
              Stream Horizons
            </span>
            <div className="w-[68px] h-[2px] bg-white/[0.08] rounded-full ml-auto">
              <div className="w-9 h-full bg-white/46 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOGOS STRIP
      ══════════════════════════════════════════ */}
      <section className="py-7 px-4 md:px-5">
        <div className="flex items-center justify-between max-w-5xl mx-auto px-4 select-none opacity-[0.32]">
          {[
            { sym: "▲", name: "Vercel" },
            { sym: "✳", name: "loom" },
            { sym: "S", name: "Cash App" },
            { sym: "◎", name: "Loops" },
            { sym: "⌁", name: "zapier" },
            { sym: "↗", name: "ramp" },
            { sym: "⌘", name: "Raycast" },
          ].map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-white/60 text-[13px] font-medium"
            >
              <span className="text-white/45 text-[10px]">{logo.sym}</span>
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE CARDS  (3 × 2 grid)
      ══════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-10" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2
              className="font-heading font-bold text-white leading-[0.98] text-6xl"
              style={{
                letterSpacing: "-0.04em",
                fontWeight: 700,
              }}
            >
              <span className="block text-white">Pro-grade features.</span>
              <span className="block text-white/45">
                Built for the enthusiast.
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            {/* Row 1: 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Infinite Stream */}
              <div className="bento-card h-[460px] flex flex-col apple-glass">
                <div className="p-8 relative z-20">
                  <h3 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                    Endless, uninterrupted.
                  </h3>
                  <p className="font-paragraph text-gray-400 text-base max-w-sm font-normal">
                    Start watching instantly with no loading delays. Everything
                    is optimized to feel smooth, fast, and completely
                    uninterrupted from the first second.
                  </p>
                </div>
                <div className="relative flex-1 mt-auto flex items-end justify-center overflow-hidden px-6 pb-0">
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent z-10"></div> */}
                  <div className="relative w-full aspect-video rounded-t-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Cinema Display Interface"
                      className="w-full h-full object-cover contrast-110 [mask-image:radial-gradient(135%_120%_at_50%_50%,black_48%,rgba(0,0,0,0.88)_64%,rgba(0,0,0,0.32)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(135%_120%_at_50%_50%,black_48%,rgba(0,0,0,0.88)_64%,rgba(0,0,0,0.32)_82%,transparent_100%)]"
                      src="landing-page/feature_card_1.jpeg"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(150%_120%_at_50%_58%,transparent_50%,rgba(0,0,0,0.24)_76%,rgba(0,0,0,0.56)_100%)]" />
                    <div className="absolute inset-0 glass-reflection opacity-50"></div>
                  </div>
                </div>
              </div>

              {/* Neural Curation */}
              <div className="bento-card h-[460px] flex flex-col apple-glass">
                <div className="p-8 relative z-20">
                  <h3 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                    Crafted for you.
                  </h3>
                  <p className="font-paragraph text-gray-400 text-base max-w-sm font-normal">
                    Discover content that actually matches your taste. No
                    endless scrolling, no random picks, just smarter
                    recommendations that get better over time.
                  </p>
                </div>
                <div className="relative flex-1 flex items-center justify-center p-10 overflow-hidden">
                  <img
                    alt="Neural Visualization"
                    className="w-full h-full object-contain mix-blend-screen brightness-125"
                    src="landing-page/feature_card_2.jpeg"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Up Next + Ad-Free */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Up Next Stacks - 2/3 width */}
              <div className="bento-card md:col-span-2 apple-glass flex flex-col">
                <div className="p-8 flex justify-between items-start relative z-20">
                  <div>
                    <h4 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                      Keep watching.
                    </h4>
                    <p className="font-paragraph text-gray-400 text-base max-w-sm font-normal">
                      Jump back in exactly where you left off.
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full apple-glass flex items-center justify-center">
                    <span className="text-white text-xl leading-none">+</span>
                  </button>
                </div>
                <div className="flex-1 relative flex items-end justify-center overflow-hidden px-6 pb-0 -mt-4">
                  <div className="relative w-full max-w-[620px] aspect-[16/9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent_100%)]"
                      src="landing-page/feature_card_3.jpeg"
                      alt="Keep watching preview"
                    />
                  </div>
                </div>
              </div>

              {/* Ad-Free Metric */}
              <div className="bento-card apple-glass relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="landing-page/feature_card_4.jpeg"
                  alt="Zero ads visual"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.12]"
                />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(140%_120%_at_50%_50%,transparent_46%,rgba(0,0,0,0.22)_72%,rgba(0,0,0,0.64)_100%)]" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.04)_34%,rgba(0,0,0,0.06)_64%,rgba(0,0,0,0.44)_100%)]" />
                <div className="relative z-10 h-full flex flex-col justify-end p-7 text-left">
                  <h4 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                    No ads.
                  </h4>
                  <p className="font-paragraph text-gray-300/85 text-base max-w-[220px] font-normal leading-snug">
                    Just uninterrupted viewing, always.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3: Spatial Audio */}
            <div className="glass-card-pro rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[380px]">
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover opacity-20 mix-blend-screen"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa4EyO6fO5QlXxxYIMtbmqVyfI2JT66vY62DDlKEo4MOKL8m7jtZHs8aR__3ZYXwr2oF9hpRJXgi4J3DUkJ1nLjl0TddPDBmzMsOyKhHJF6CA1RBMuewa2Mv97mIcyeOdofqfCS0rHOgNt2DVa86hZLkQrIiCHai3XeXkm03TUqc3ftB9mquaF2bss9emNlJSK_pztQdV7zFESqj8MyUrjFZFbuH_snUdZAMDY3DhWwAYvNyW70R6XW31Muj_LDNmgKm6M_utHvaeD"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-8">
                <div className="max-w-xl">
                  <h3
                    className="font-sans-serif text-[1.5rem] md:text-[2.5rem] font-bold text-white mb-3 leading-tight"
                    style={{ lineHeight: "1" }}
                  >
                    4K HDR playback
                    <br />
                    With dolby spacial audio.
                  </h3>
                  <p className="font-paragraph text-gray-400 text-base">
                    Select titles available in 4K HDR, with rich color, deep
                    contrast, and immersive audio that brings every scene to
                    life.
                  </p>
                </div>
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Headphones
                      size={30}
                      className="text-white"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <span
                      className="text-white text-xl"
                      style={{ fontFamily: SF }}
                    >
                      4K
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Radio
                      size={30}
                      className="text-white"
                      strokeWidth={1.25}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WATCH PARTY  — Apple bento grid
      ══════════════════════════════════════════ */}
      <section className="px-4 md:px-5 py-8 mb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2
              className="font-heading font-bold text-white leading-[0.98] text-6xl"
              style={{
                letterSpacing: "-0.04em",
                fontWeight: 700,
              }}
            >
              <span className="block text-white">Watch together.</span>
              <span className="block text-white/45">Perfectly in sync.</span>
            </h2>
          </div>

          {/* ─── Bento grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-8 bento-card apple-glass min-h-[400px] relative overflow-hidden">
              <img
                src="landing-page/watchparty_card_1.jpeg"
                alt="Watch party preview"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover
             mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(150%_120%_at_50%_58%,transparent_50%,rgba(0,0,0,0.24)_76%,rgba(0,0,0,0.56)_100%)]" />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.18)_40%,rgba(0,0,0,0.44)_100%)]" />
              <div className="absolute inset-0 glass-reflection opacity-50" />

              <div className="relative z-20 p-8">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  47 watching now
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Start a party in one tap. Invite your circle and begin
                  together, instantly.
                </p>
              </div>

              <button className="group absolute right-4 bottom-4 z-20 inline-flex items-center gap-2.5 pl-5 pr-1 py-1 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 text-[14px] font-semibold tracking-tight">
                <span>Join now</span>
                <span className="w-10 h-10 rounded-full bg-black text-white inline-flex items-center justify-center">
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 ease-in-out group-hover:rotate-45"
                  />
                </span>
              </button>
            </div>

            <div className="md:col-span-4 bento-card apple-glass min-h-[400px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/watchparty_card_2.jpeg"
                alt="Playback sync preview"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover
             object-top -translate-y-[20%]
             mask-[radial-gradient(ellipse at center,white_70%,transparent_100%)]
             -webkit-mask-[radial-gradient(ellipse at center,white_70%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-8 text-center">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Playback in sync
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Every frame. Same moment.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bento-card apple-glass min-h-[300px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/watchparty_card_3.png"
                alt="Friends joining preview"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-top
             mask-type:linear-[linear] object-top -translate-y-[15%]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Friends joining
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Invites are live. Chat is open.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bento-card apple-glass min-h-[300px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/watchparty_card_4.png"
                alt="Back in sync preview"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-top -translate-y-[20%] scale-[1.06]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-8">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Back in sync.
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Resync in one tap. No interruptions.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bento-card apple-glass p-8 flex flex-col justify-between">
              <div className="flex justify-center gap-4 py-8">
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                  ◀◀
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
                  <Play size={18} fill="currentColor" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70">
                  ▶▶
                </button>
              </div>
              <div>
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Host controls
                </h3>
                <p className="font-paragraph text-gray-400 text-base font-normal">
                  Play, pause, and keep everyone aligned.
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bento-card apple-glass p-8 flex items-center gap-8">
              <div className="flex-1">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Buffering handled.
                </h3>
                <p className="font-paragraph text-gray-400 text-base font-normal">
                  Playback adjusts quietly, so no one misses a moment.
                </p>
              </div>
              <div className="flex gap-1 items-end h-12">
                <div className="w-1.5 bg-sky-400 h-8 rounded-full" />
                <div className="w-1.5 bg-sky-400 h-12 rounded-full animate-pulse" />
                <div className="w-1.5 bg-sky-400/30 h-6 rounded-full" />
                <div className="w-1.5 bg-sky-400 h-10 rounded-full" />
              </div>
            </div>

            <div className="md:col-span-6 bento-card apple-glass p-8 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Built for real rooms.
                </h3>
                <p className="font-paragraph text-gray-400 text-base font-normal">
                  Private invites. Live chat. Smooth, reliable sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECURITY & PERFORMANCE — Apple bento grid
      ══════════════════════════════════════════ */}
      <section className="px-4 md:px-5 pb-4">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#0c0c0c] border border-white/[0.06] overflow-hidden">
          <div className="p-10 pb-8">
            <h2
              className="font-bold text-white mb-2 leading-[0.98]"
              style={{
                fontSize: "clamp(34px, 5.5vw, 92px)",
                letterSpacing: "-0.04em",
                fontFamily: SF,
                fontWeight: 700,
              }}
            >
              Fast. Reliable. Invisible.
            </h2>
            <p className="text-white/34 text-[15px] mb-9 max-w-sm leading-[1.65]">
              Everything just works — exactly when you need it.
            </p>

            {/* ─── Bento grid ─── */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {/* 99.9% uptime — col 1 */}
              <div
                className="rounded-[18px] p-7 flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a", minHeight: "172px" }}
              >
                <div
                  className="text-white/24 text-[10px] tracking-[0.18em] uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Uptime
                </div>
                <div>
                  <div
                    className="text-white font-bold leading-none"
                    style={{
                      fontSize: "52px",
                      letterSpacing: "-0.055em",
                      fontFamily: SF,
                      fontWeight: 700,
                    }}
                  >
                    99.9<span style={{ fontSize: "26px" }}>%</span>
                  </div>
                  <div className="text-white/35 text-[12px] leading-[1.55] mt-2.5">
                    Because interruptions
                    <br />
                    ruin everything.
                  </div>
                </div>
              </div>

              {/* Secure Auth — spans 2 cols */}
              <div
                className="rounded-[18px] p-7 flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a", gridColumn: "span 2" }}
              >
                <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                  <Shield size={16} className="text-white/46" />
                </div>
                <div>
                  <div
                    className="text-white text-[19px] font-[600] mb-2"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    Secure Authentication
                  </div>
                  <div className="text-white/38 text-[14px] leading-[1.62]">
                    Your account, protected.
                    <br />
                    No friction. No compromises.
                  </div>
                </div>
              </div>

              {/* Near-zero delay — col 4 */}
              <div
                className="rounded-[18px] p-7 flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a" }}
              >
                <div
                  className="text-white/24 text-[10px] tracking-[0.18em] uppercase"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Latency
                </div>
                <div>
                  <div
                    className="text-white font-bold leading-none"
                    style={{
                      fontSize: "52px",
                      letterSpacing: "-0.055em",
                      fontFamily: SF,
                      fontWeight: 700,
                    }}
                  >
                    ~0
                  </div>
                  <div className="text-white/35 text-[12px] mt-2.5">
                    Near-zero delay
                  </div>
                </div>
              </div>

              {/* Smooth streaming — spans 2 cols */}
              <div
                className="rounded-[18px] p-7 flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a", gridColumn: "span 2" }}
              >
                <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                  <Play size={16} className="text-white/46" />
                </div>
                <div>
                  <div
                    className="text-white text-[19px] font-[600] mb-2"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    High Performance Streaming
                  </div>
                  <div className="text-white/38 text-[14px] leading-[1.62]">
                    Smooth playback.
                    <br />
                    Even when everyone joins at once.
                  </div>
                </div>
              </div>

              {/* Always on — spans 2 cols */}
              <div
                className="rounded-[18px] p-7 flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a", gridColumn: "span 2" }}
              >
                <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                  <CheckCircle size={16} className="text-white/46" />
                </div>
                <div>
                  <div
                    className="text-white text-[19px] font-[600] mb-2"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    Always on. Always ready.
                  </div>
                  <div className="text-white/38 text-[14px] leading-[1.62]">
                    So you never have to think about it.
                  </div>
                </div>
              </div>

              {/* Tags row — full width */}
              <div
                className="rounded-[18px] px-7 py-4 flex items-center gap-3 flex-wrap border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                style={{ background: "#1a1a1a", gridColumn: "span 4" }}
              >
                {SEC_TAGS.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.045] border border-white/[0.07] text-[12px] text-white/46 cursor-default hover:bg-white/[0.07] transition-colors duration-200"
                  >
                    <CheckCircle size={10} className="text-white/34" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section footer */}
          <div className="px-10 py-5 border-t border-white/[0.052] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-white/32 text-[12px] hover:text-white/52 transition-colors duration-200"
              >
                Support
              </a>
              <a
                href="/auth"
                className="text-white/32 text-[12px] hover:text-white/52 transition-colors duration-200"
              >
                Register
              </a>
            </div>
            <p className="text-white/18 text-[11px]">
              © 2026 Riyura. All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-white/[0.18] transition-colors duration-200">
                <span className="text-[11px] text-white/32">𝕏</span>
              </div>
              <div className="w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-white/[0.18] transition-colors duration-200">
                <span className="text-[10px] text-white/32">in</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="px-8 md:px-16 py-12 mt-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-200"
          >
            <Image src="/logo.png" alt="Riyura" width={28} height={28} />
            <span
              className="text-white font-bold text-[18px]"
              style={{ fontFamily: "'Bruno Ace', sans-serif" }}
            >
              RIYURA
            </span>
          </Link>

          <div className="flex items-center gap-6 text-[13px] text-white/36">
            {["About", "Explore", "Watch Parties", "Privacy", "Support"].map(
              (l, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:text-white/60 transition-colors duration-200"
                >
                  {l}
                </a>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            {["𝕏", "in"].map((icon, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-white/[0.09] flex items-center justify-center cursor-pointer hover:border-white/[0.20] hover:bg-white/[0.04] transition-all duration-200"
              >
                <span
                  className={`text-white/34 ${i === 0 ? "text-[12px]" : "text-[11px]"}`}
                >
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-white/20 text-[12px]">
            © 2026 Riyura. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
