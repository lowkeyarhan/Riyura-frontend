"use client";

import { useRef } from "react";
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
import SplitText from "@/src/components/ui/SplitText";
import { GlobalSpotlight } from "@/src/components/ui/MagicBento";

const LiquidEther = dynamic<LiquidEtherProps>(
  () => import("@/src/components/ui/LiquidEther"),
  { ssr: false },
);

// ─── Font helpers ────────────────────────────────────────────────────────────
const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

export default function LandingPage() {
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const watchPartyGridRef = useRef<HTMLDivElement>(null);
  const perfGridRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="bg-black min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: SF }}
    >
      {/* NAVBAR */}
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

      {/* HERO */}
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

          {/* Network arcs + whisker lines */}
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

          {/* Center content */}
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
              <SplitText
                text="One click."
                tag="span"
                className="text-white"
                startDelay={0}
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
              <span>&nbsp;</span>
              <SplitText
                text="Everyone's in."
                tag="span"
                className="text-white/20"
                startDelay={0.6}
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
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

            {/* CTA */}
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

      {/* LOGOS STRIP */}
      <section className="py-10 px-4 md:px-5">
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

      {/* FEATURE CARDS (3 × 2 grid) */}
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

          <div ref={featuresGridRef} className="space-y-2 bento-section">
            <GlobalSpotlight
              gridRef={featuresGridRef}
              enabled
              spotlightRadius={100}
              glowColor="255, 255, 255"
            />
            {/* Row 1: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Infinite Stream */}
              <div className="bento-card card card--border-glow h-[460px] apple-glass relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Cinema Display Interface"
                  className="absolute rounded-xl inset-0 w-full h-full object-cover top-[15%]
                  mask-type:linear-[linear]
                  mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
                  -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
                  src="landing-page/feature_card_1.png"
                />

                <div className="absolute inset-x-0 top-0 z-20 p-8">
                  <h3 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                    Endless, uninterrupted.
                  </h3>
                  <p className="font-paragraph text-gray-300 text-base  font-normal">
                    Start watching instantly with no loading delays. Everything
                    is optimized to feel smooth, fast, and completely
                    uninterrupted from the first second.
                  </p>
                </div>
                <div className="absolute inset-0 opacity-45 bg-[linear-gradient(45deg,rgba(255,255,255,0)_0%,transparent_50%,rgba(255,255,255,0.1)_100%)]" />
              </div>

              {/* Neural Curation */}
              <div className="bento-card card card--border-glow h-[460px] apple-glass relative overflow-hidden">
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

            {/* Row 2: Up Next & Ad-Free */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Up Next Stacks - 2/3 width */}
              <div className="bento-card card card--border-glow md:col-span-2 apple-glass min-h-[460px] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="absolute rounded-xl inset-0 w-full h-full object-cover
                  mask-type:linear-[linear]
               mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]
               -webkit-mask-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"
                  src="landing-page/feature_card_3.png"
                  alt="Keep watching preview"
                />

                <div className="absolute inset-x-0 top-0 z-20 p-8 flex items-start justify-between gap-6">
                  <div>
                    <h4 className="font-sans-serif text-[1.5rem] font-bold text-white mb-2">
                      Keep watching.
                    </h4>
                    <p className="font-paragraph text-gray-300 text-base max-w-sm font-normal">
                      Jump back in exactly where you left off.
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full apple-glass flex items-center justify-center shrink-0">
                    <span className="text-white text-xl leading-none">+</span>
                  </button>
                </div>
              </div>

              {/* Ad-Free Metric */}
              <div className="bento-card card card--border-glow apple-glass relative overflow-hidden">
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
            <div className="card card--border-glow apple-glass rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[380px]">
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]" />
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
                  <div className="w-16 h-16 rounded-full apple-glass flex items-center justify-center">
                    <Headphones
                      size={30}
                      className="text-white"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full apple-glass flex items-center justify-center">
                    <span
                      className="text-white text-xl"
                      style={{ fontFamily: SF }}
                    >
                      4K
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full apple-glass flex items-center justify-center">
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

      {/* WATCH PARTY - Apple bento grid */}
      <section className="px-4 md:px-5 py-10" id="watch-parties">
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

          {/* Bento grid */}
          <div
            ref={watchPartyGridRef}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 bento-section"
          >
            <GlobalSpotlight
              gridRef={watchPartyGridRef}
              enabled
              spotlightRadius={100}
              glowColor="255, 255, 255"
            />
            <div className="md:col-span-8 bento-card card card--border-glow apple-glass min-h-[400px] relative overflow-hidden">
              <img
                src="landing-page/watchparty_card_1.jpeg"
                alt="Watch party preview"
                className="absolute rounded-xl inset-0 w-full h-full object-cover
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

            <div className="md:col-span-4 bento-card card card--border-glow apple-glass min-h-[400px] relative overflow-hidden">
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

            <div className="md:col-span-4 bento-card card card--border-glow apple-glass min-h-[300px] relative overflow-hidden">
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

            <div className="md:col-span-4 bento-card card card--border-glow apple-glass min-h-[300px] relative overflow-hidden">
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

            <div className="md:col-span-4 bento-card card card--border-glow apple-glass p-8 flex flex-col justify-between">
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

            <div className="md:col-span-6 bento-card card card--border-glow apple-glass min-h-[150px] relative overflow-hidden">
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

            <div className="md:col-span-6 bento-card card card--border-glow apple-glass min-h-[150px] relative overflow-hidden">
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

      {/* SECURITY & PERFORMANCE */}
      <section className="px-6 md:px-8 py-10 mb-16">
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

          <div
            ref={perfGridRef}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 auto-rows-[160px] bento-section"
          >
            <GlobalSpotlight
              gridRef={perfGridRef}
              enabled
              spotlightRadius={100}
              glowColor="255, 255, 255"
            />
            <div className="bento-card card card--border-glow apple-glass md:col-span-2 md:row-span-2 min-h-[320px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-1 md:row-span-2 min-h-[320px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-1 md:row-span-2 min-h-[320px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-2 md:row-span-1 min-h-[160px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-1 md:row-span-1 min-h-[160px] relative overflow-hidden">
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

            <div className="bento-card card card--border-glow apple-glass md:col-span-1 md:row-span-1 min-h-[160px] relative overflow-hidden">
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

      {/* FOOTER SECTION */}
      <section className="ai-footer">
        <div className="footer-glow glow-left" />
        <div className="footer-glow glow-right" />

        <div className="footer-container">
          <div className="footer-cta">
            <div className="badges">
              <div className="badge">
                <div className="badge-icon">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span>4K HDR streaming</span>
              </div>
              <div className="badge">
                <div className="badge-icon">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <span>Zero buffering</span>
              </div>
              <div className="badge">
                <div className="badge-icon">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <span>Private watch rooms</span>
              </div>
            </div>

            <h2 className="font-heading">
              Watch together <br /> Anything. Effortlessly.
            </h2>

            <a
              href="https://app.riyura.com/welcome"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Start Watching
            </a>
          </div>

          <div className="footer-bottom">
            <div className="footer-nav">
              <div className="brand-group" style={{ gap: "1rem" }}>
                <div className="brand-logo">Riyura</div>
                <div className="lang-selector">
                  <span>🌐</span>
                  <svg
                    viewBox="0 0 14 14"
                    fill="transparent"
                    strokeWidth="2"
                    stroke="#aaa"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 3 5.5 L 7 9.5 L 11 5.5" />
                  </svg>
                </div>
              </div>

              <div className="footer-links">
                <div className="link-item">
                  <span>Company</span>
                  <svg
                    viewBox="0 0 14 14"
                    fill="transparent"
                    strokeWidth="2"
                    stroke="#aaa"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 3 5.5 L 7 9.5 L 11 5.5" />
                  </svg>
                </div>
                <div className="link-item">
                  <span>Learn</span>
                  <svg
                    viewBox="0 0 14 14"
                    fill="transparent"
                    strokeWidth="2"
                    stroke="#aaa"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 3 5.5 L 7 9.5 L 11 5.5" />
                  </svg>
                </div>
                <div className="link-item">
                  <span>Terms</span>
                  <svg
                    viewBox="0 0 14 14"
                    fill="transparent"
                    strokeWidth="2"
                    stroke="#aaa"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 3 5.5 L 7 9.5 L 11 5.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="footer-meta">
              <p className="copyright">
                ©2026 Riyura. Made with love by Arhan Das.
              </p>

              <div className="social-links">
                <a
                  href="https://twitter.com/ailawyerapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@ailawyerapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/ailawyerapp/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
