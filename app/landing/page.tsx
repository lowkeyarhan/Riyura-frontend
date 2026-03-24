"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "../globals.css";
import {
  Play,
  ArrowUpRight,
  Headphones,
  Radio,
  Linkedin,
  X,
} from "lucide-react";

import type { LiquidEtherProps } from "@/src/components/ui/LiquidEther";

const LiquidEther = dynamic<LiquidEtherProps>(
  () => import("@/src/components/ui/LiquidEther"),
  { ssr: false },
);

// ─── Font helpers ────────────────────────────────────────────────────────────
const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

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
                <div className="relative flex-1 mt-auto flex items-end justify-center overflow-hidden pb-0">
                  <div className="relative w-full rounded-t-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Cinema Display Interface"
                      className="w-full h-full object-cover [mask-image:radial-gradient(135%_120%_at_50%_50%,black_48%,rgba(0,0,0,0.88)_64%,rgba(0,0,0,0.32)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(135%_120%_at_50%_50%,black_48%,rgba(0,0,0,0.88)_64%,rgba(0,0,0,0.32)_82%,transparent_100%)]"
                      src="landing-page/feature_card_1.jpeg"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 opacity-45 bg-[linear-gradient(45deg,rgba(255,255,255,0)_0%,transparent_75%,rgba(255,255,255,0.1)_100%)]" />
              </div>

              {/* Neural Curation */}
              <div className="bento-card h-[460px] apple-glass relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Neural Visualization"
                  className="absolute rounded-xl inset-0 w-full h-full object-cover -translate-x-[-5%]
                  mask-type:linear-[linear]
               mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
               -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
                  src="landing-page/feature_card_2.png"
                />

                <div className="absolute inset-x-0 top-0 z-20 p-8">
                  <h3 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                    Crafted for you.
                  </h3>
                  <p className="font-paragraph text-gray-300 text-base max-w-[250px] font-normal">
                    Smarter recommendations that get better over time.
                  </p>
                </div>
                <div className="absolute inset-0 opacity-45 bg-[linear-gradient(150deg,rgba(255,255,255,0.1)_0%,transparent_50%,rgba(255,255,255,0)_100%)]" />
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
                  className="absolute inset-0 w-full h-full p-2 object-cover scale-[1.12]
                  mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
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
                    With dolby 7.1 spacial audio.
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
      <section className="px-4 md:px-5 py-8 mb-12" id="watch-parties">
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
              <div className="absolute inset-0 opacity-45 bg-[linear-gradient(45deg,rgba(255,255,255,0)_0%,transparent_50%,rgba(255,255,255,0.1)_100%)]" />

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
             absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-top -translate-y-[20%] scale-[1.06]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />
              <div className="absolute inset-0 opacity-45 bg-[linear-gradient(150deg,rgba(255,255,255,0.1)_0%,transparent_50%,rgba(255,255,255,0)_100%)]" />

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

            <div className="md:col-span-6 bento-card apple-glass min-h-[150px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/watchparty_card_6.png"
                alt="Buffering handled preview"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-right -translate-x-[-35%] scale-[1.06]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_56%,rgba(0,0,0,0.72)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 z-20 p-8">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Buffering handled.
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Playback adjusts quietly, so no one misses a moment.
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bento-card apple-glass min-h-[150px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/watchparty_card_7.png"
                alt="Built for real rooms preview"
                className="absolute rounded-xl inset-0 object-cover object-right -translate-y-[15%] -translate-x-[-15%] scale-[1.05]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_56%,rgba(0,0,0,0.72)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 z-20 p-8">
                <h3 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Built for real rooms.
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Private invites. Live chat. Smooth, reliable sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Performance */}
      <section className="px-6 md:px-8 pb-10 pt-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h2
              className="font-heading font-bold text-white leading-[0.98] text-6xl mb-4"
              style={{ letterSpacing: "-0.04em", fontWeight: 700 }}
            >
              <span className="block text-white">
                Fast. Reliable. Invisible.
              </span>
              <span className="block text-white/45">
                Engineered to hold up.
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 auto-rows-[160px]">
            <div className="bento-card apple-glass md:col-span-2 md:row-span-2 min-h-[320px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_1.png"
                alt="Performance card visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover
    mask-type:linear-[linear]
    mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
    -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />
              <div className="absolute inset-0 opacity-45 bg-[linear-gradient(45deg,rgba(255,255,255,0)_0%,transparent_50%,rgba(255,255,255,0.1)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-20 p-8">
                {/* Swapped items-end for items-baseline below 👇 */}
                <h3
                  className="font-heading text-[3rem] md:text-[3.5rem] font-bold text-white mb-2 leading-none inline-flex items-baseline gap-2"
                  style={{ fontFamily: SF, letterSpacing: "-0.04em" }}
                >
                  99.9%
                  <span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.16em] text-white/55 leading-none">
                    uptime
                  </span>
                </h3>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Built to stay available - even when demand spikes.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_2.png"
                alt="Fast by default visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-right -translate-x-[-5%]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />
              <div className="absolute inset-0 opacity-45 bg-[linear-gradient(150deg,rgba(255,255,255,0.1)_0%,transparent_50%,rgba(255,255,255,0)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Fast by default
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Optimized APIs and minimal payloads.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-1 md:row-span-2 min-h-[320px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_4.png"
                alt="Optimized data access visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-top -translate-y-[15%] scale-[1.25]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2 leading-tight">
                  Fast access
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Data retrieval is optimized for speed.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-1 md:row-span-2 min-h-[320px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_5.png"
                alt="Session integrity visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-top -translate-y-[15%] scale-[0.9]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2 leading-tight">
                  Session integrity
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  JWT-based authentication with controlled access.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_3.png"
                alt="Abuse protection visual"
                className="absolute rounded-xl inset-0 w-full h-full object-cover object-right -translate-x-[-37%]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Abuse protection
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Requests are filtered and rate limited.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_6.png"
                alt="Graceful recovery visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-right -translate-x-[-25%]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2">
                  Graceful recovery
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Failures are handled without breaking experience.
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-1 md:row-span-1 min-h-[160px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_7.png"
                alt="Handles real load visual"
                className="absolute p-2 rounded-xl brightness-90 inset-0 w-full h-full object-cover object-top -translate-x-[-10%] -translate-y-[20%]
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2 leading-tight">
                  Handles real load
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal">
                  Scalable backend
                </p>
              </div>
            </div>

            <div className="bento-card apple-glass md:col-span-1 md:row-span-1 min-h-[160px] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="landing-page/perf_card_8.png"
                alt="Stability visual"
                className="absolute p-2 rounded-xl inset-0 w-full h-full object-cover object-right scale-[0.9] translate-x-[10%] translate-y-[-5%] brightness-80
                mask-type:linear-[linear]
             mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
             -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                <h4 className="font-heading text-[1.5rem] font-bold text-white mb-2 leading-tight">
                  Stability
                </h4>
                <p className="font-paragraph text-gray-300 text-base font-normal leading-tight">
                  Always monitored
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-black border-t border-white/[0.08] mt-4">
        <div className="pt-14 pb-10 max-w-5xl mx-auto">
          <div className="apple-glass rounded-2xl p-6 md:p-8 mb-14 border border-white/[0.06]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-md">
                <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-2 tracking-tight">
                  Stay in the loop
                </h3>
                <p className="font-paragraph text-sm text-white/45 leading-relaxed">
                  Product updates and watch-party tips. No spam.
                </p>
              </div>
              <form
                className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-[420px] shrink-0"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email for newsletter
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  className="flex-1 min-w-0 rounded-full bg-black/50 border border-white/[0.1] px-5 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-white/22 focus:ring-1 focus:ring-white/10 transition-colors font-paragraph"
                />
                <button
                  type="submit"
                  className="rounded-full bg-white text-black px-7 py-3 text-[14px] font-semibold tracking-tight hover:bg-white/90 transition-colors duration-300 shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 lg:gap-14">
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-200"
              >
                <Image src="/logo.png" alt="Riyura" width={28} height={28} />
                <span
                  className="text-white font-bold text-[18px]"
                  style={{ fontFamily: "'Bruno Ace', sans-serif" }}
                >
                  RIYURA
                </span>
              </Link>
              <p className="font-paragraph text-[13px] text-white/45 leading-relaxed max-w-[300px]">
                Pro-grade streaming for everyone who loves to watch together.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  aria-label="Riyura on X"
                  className="group w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:border-white/22 hover:bg-white/[0.05] transition-all duration-200"
                >
                  <X size={17} strokeWidth={1.5} aria-hidden />
                </a>
                <a
                  href="#"
                  aria-label="Riyura on LinkedIn"
                  className="group w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:border-white/22 hover:bg-white/[0.05] transition-all duration-200"
                >
                  <Linkedin size={17} strokeWidth={1.5} aria-hidden />
                </a>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
              <div>
                <h4 className="font-heading text-[13px] font-semibold text-white mb-4 tracking-tight">
                  Product
                </h4>
                <ul className="space-y-3 font-paragraph">
                  <li>
                    <a
                      href="#features"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#watch-parties"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Watch parties
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/explore"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Explore
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading text-[13px] font-semibold text-white mb-4 tracking-tight">
                  Company
                </h4>
                <ul className="space-y-3 font-paragraph">
                  <li>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Support
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/auth"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Get started
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-heading text-[13px] font-semibold text-white mb-4 tracking-tight">
                  Legal
                </h4>
                <ul className="space-y-3 font-paragraph">
                  <li>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/[0.06]">
            <p className="font-paragraph text-[12px] text-white/35 text-center sm:text-left">
              © 2026 Riyura. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
