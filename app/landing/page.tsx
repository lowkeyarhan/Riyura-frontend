"use client";

import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import {
  Play,
  Shield,
  Users,
  Star,
  Zap,
  Sparkles,
  MessageCircle,
  TrendingUp,
  ArrowDown,
  Lock,
  Film,
  Clock,
  Search,
  CheckCircle,
  Headphones,
  Radio,
} from "lucide-react";

// ─── Font helpers ────────────────────────────────────────────────────────────
const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

// ─── Static data ─────────────────────────────────────────────────────────────

const STARS = [
  { top: "5%", left: "9%", size: 2.5, o: 0.28 },
  { top: "11%", left: "28%", size: 1.5, o: 0.18 },
  { top: "7%", left: "52%", size: 2, o: 0.22 },
  { top: "15%", left: "68%", size: 1.5, o: 0.16 },
  { top: "3%", left: "84%", size: 2, o: 0.2 },
  { top: "19%", left: "93%", size: 1.5, o: 0.14 },
  { top: "26%", left: "4%", size: 1.5, o: 0.18 },
  { top: "31%", left: "44%", size: 2, o: 0.11 },
  { top: "38%", left: "18%", size: 1.5, o: 0.16 },
  { top: "42%", left: "75%", size: 2, o: 0.14 },
  { top: "48%", left: "58%", size: 1.5, o: 0.12 },
  { top: "53%", left: "32%", size: 2, o: 0.15 },
  { top: "61%", left: "88%", size: 1.5, o: 0.19 },
  { top: "67%", left: "14%", size: 2, o: 0.2 },
  { top: "72%", left: "49%", size: 1.5, o: 0.13 },
  { top: "78%", left: "71%", size: 2, o: 0.17 },
  { top: "84%", left: "25%", size: 1.5, o: 0.11 },
  { top: "89%", left: "60%", size: 2, o: 0.15 },
  { top: "93%", left: "38%", size: 1.5, o: 0.19 },
  { top: "14%", left: "78%", size: 2, o: 0.26 },
  { top: "44%", left: "8%", size: 1.5, o: 0.13 },
  { top: "57%", left: "97%", size: 2, o: 0.11 },
  { top: "69%", left: "73%", size: 1.5, o: 0.15 },
  { top: "82%", left: "86%", size: 2, o: 0.13 },
  { top: "22%", left: "56%", size: 1.5, o: 0.09 },
  { top: "35%", left: "88%", size: 2, o: 0.17 },
  { top: "74%", left: "3%", size: 1.5, o: 0.21 },
  { top: "91%", left: "17%", size: 2, o: 0.15 },
  { top: "8%", left: "41%", size: 1.5, o: 0.14 },
  { top: "46%", left: "92%", size: 2, o: 0.1 },
  { top: "60%", left: "35%", size: 1.5, o: 0.13 },
  { top: "33%", left: "62%", size: 2, o: 0.1 },
  { top: "17%", left: "15%", size: 1.5, o: 0.16 },
  { top: "55%", left: "47%", size: 2, o: 0.09 },
  { top: "77%", left: "58%", size: 1.5, o: 0.14 },
];

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
          style={{ background: "#090909", minHeight: "calc(100vh - 92px)" }}
        >
          {/* Glow layer 1 — large sage bloom, top-right */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-18%",
              right: "-10%",
              width: "68%",
              height: "95%",
              background:
                "radial-gradient(ellipse 70% 75% at 80% 16%, rgba(192,228,196,0.44) 0%, rgba(158,204,164,0.26) 18%, rgba(122,178,132,0.12) 40%, rgba(82,148,96,0.04) 60%, transparent 76%)",
              filter: "blur(4px)",
            }}
          />
          {/* Glow layer 2 — inner bright core */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "-6%",
              right: "3%",
              width: "38%",
              height: "55%",
              background:
                "radial-gradient(ellipse 52% 56% at 76% 20%, rgba(228,255,232,0.16) 0%, rgba(195,240,200,0.06) 42%, transparent 68%)",
              filter: "blur(1px)",
            }}
          />
          {/* Glow layer 3 — bottom-left counter */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "-6%",
              left: "-10%",
              width: "44%",
              height: "58%",
              background:
                "radial-gradient(ellipse 58% 62% at 14% 90%, rgba(104,144,112,0.24) 0%, rgba(80,120,90,0.10) 42%, transparent 68%)",
              filter: "blur(5px)",
            }}
          />

          {/* Stars */}
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.o,
              }}
            />
          ))}

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

          {/* NODE: top-left */}
          <div className="absolute" style={{ top: "22%", left: "6%" }}>
            <div className="w-8 h-8 rounded-full bg-white/[0.055] border border-white/[0.10] flex items-center justify-center mb-2.5">
              <TrendingUp size={13} className="text-white/48" />
            </div>
            <div className="text-white/65 text-[12px] font-medium">
              • Live Party
            </div>
            <div className="text-white/30 text-[11px] pl-3 mt-0.5">
              47 watching
            </div>
          </div>

          {/* NODE: top-right */}
          <div
            className="absolute text-right"
            style={{ top: "18%", right: "6%" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.055] border border-white/[0.10] flex items-center justify-center mb-2.5 ml-auto">
              <Sparkles size={13} className="text-white/48" />
            </div>
            <div className="text-white/65 text-[12px] font-medium">
              • AI Picks Ready
            </div>
            <div className="text-white/30 text-[11px] pr-0.5 mt-0.5">
              Just for you
            </div>
          </div>

          {/* NODE: bottom-left */}
          <div className="absolute" style={{ bottom: "25%", left: "6%" }}>
            <div className="w-8 h-8 rounded-full bg-white/[0.055] border border-white/[0.10] flex items-center justify-center mb-2.5">
              <Star size={13} className="text-white/48" />
            </div>
            <div className="text-white/65 text-[12px] font-medium">
              • Now Streaming
            </div>
            <div className="text-white/30 text-[11px] pl-3 mt-0.5">In sync</div>
          </div>

          {/* NODE: bottom-right */}
          <div
            className="absolute text-right"
            style={{ bottom: "22%", right: "6%" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.055] border border-white/[0.10] flex items-center justify-center mb-2.5 ml-auto">
              <Zap size={13} className="text-white/48" />
            </div>
            <div className="text-white/65 text-[12px] font-medium">
              • Continue Watching
            </div>
            <div className="text-white/30 text-[11px] pr-0.5 mt-0.5">
              Right where you left
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            {/* Play circle */}
            <div className="w-11 h-11 rounded-full border border-white/[0.14] flex items-center justify-center mb-9 cursor-pointer hover:border-white/[0.28] hover:bg-white/[0.04] transition-all duration-300">
              <Play
                size={13}
                className="text-white/50 ml-0.5"
                fill="rgba(255,255,255,0.5)"
              />
            </div>

            {/* Pill badge */}
            <div className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.09] mb-10 cursor-pointer hover:bg-white/[0.09] hover:border-white/[0.15] transition-all duration-300">
              <div className="w-5 h-5 rounded-full bg-white/[0.10] border border-white/[0.16] flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="R"
                  width={12}
                  height={12}
                  className="opacity-60"
                />
              </div>
              <span className="text-[13px] text-white/55 group-hover:text-white/70 transition-colors duration-300">
                Watch together, right now →
              </span>
            </div>

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
              Stream movies, shows, and anime together.
              <br />
              <span className="text-white/55">
                Instant sync. Zero friction. Just press play.
              </span>
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="px-8 py-3.5 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 text-[14px] font-semibold tracking-tight"
              >
                Start Watching
              </Link>
              <Link
                href="#features"
                className="px-8 py-3.5 rounded-full bg-white/[0.07] border border-white/[0.10] hover:bg-white/[0.12] hover:border-white/[0.18] transition-all duration-300 text-[14px] font-medium text-white/68 hover:text-white"
              >
                Explore Riyura
              </Link>
            </div>
          </div>

          {/* Waveform bars */}
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
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-white/[0.13] flex items-center justify-center">
              <ArrowDown size={11} className="text-white/34" />
            </div>
            <span className="text-[11px] text-white/28">
              02/03 · Scroll down
            </span>
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-bold text-white mb-3"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                fontFamily: SF,
                fontWeight: 700,
              }}
            >
              Everything. Without the effort.
            </h2>
            <p className="text-white/38 text-[15px] max-w-[420px] mx-auto leading-[1.65]">
              From discovery to watch parties, Riyura keeps everything in sync —
              so you can focus on what actually matters. Watching.
            </p>
          </div>

          <div className="space-y-6">
            {/* Row 1: 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Infinite Stream */}
              <div className="bento-card h-[600px] flex flex-col group apple-glass">
                <div className="p-10 relative z-20">
                  <div className="engraved-badge inline-block px-3 py-1 rounded-md mb-6">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono">
                      01 — FLUIDITY
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Infinite Stream.
                  </h3>
                  <p className="text-gray-400 text-lg max-w-sm font-normal">
                    Seamless scrolling with zero latency. Pre-cached content
                    means instant playback the moment you stop.
                  </p>
                </div>
                <div className="relative flex-1 mt-auto flex items-end justify-center overflow-hidden px-8 pb-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent z-10"></div>
                  <div className="relative w-full aspect-video rounded-t-xl overflow-hidden border-x border-t border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] group-hover:scale-[1.02] transition-transform duration-[1500ms] ease-out">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Cinema Display Interface"
                      className="w-full h-full object-cover brightness-110 contrast-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_lPP91Py2fiAfXf2tPeArRpJB2KxCHZfN2kB87M1gRJ39ljWmguQMSJyzoJ_TmgxqWic537eRUM0PtOcAC2y4_eOkWqZSRTmASeeAgK-9sEQuYK-fB0xUHmXNfaDRYTF9LTEafzodJaIehmb5I52Lq8NkORd_L1nuC96W3-4OxudEsX3KGSfQILL2wnbYu1FZxNvhqokKf-GO5AzUCs7NntHnngDVMqdX7Hhh_Bn3m7pUAXvqaw12lWD_wwX8GF7xABm8AD8KUf5V"
                    />
                    <div className="absolute inset-0 glass-reflection opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/60 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Neural Curation */}
              <div className="bento-card h-[600px] flex flex-col group apple-glass">
                <div className="p-10 relative z-20">
                  <div className="engraved-badge inline-block px-3 py-1 rounded-md mb-6">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono">
                      02 — INTELLIGENCE
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Neural Curation.
                  </h3>
                  <p className="text-gray-400 text-lg max-w-sm font-normal">
                    Local ML models analyze your viewing habits to surface
                    hidden gems without tracking data leaving your device.
                  </p>
                </div>
                <div className="relative flex-1 flex items-center justify-center p-12 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_70%)] opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Neural Visualization"
                    className="w-full h-full object-contain mix-blend-screen scale-90 group-hover:scale-100 transition-transform duration-[2000ms] ease-out brightness-125"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0TdrUIDyJj44jAahji5Gcgmb_YkABvRQB23qUqy2vNUTdpzk0x79wJl-JVE6a-y0RQ-8R2B6ReAbed_3FJH6QRQBd7BP4wndr2obU2LlJW_GhbaoCV6w6xN1J-SXkESOH0zUzzW6io8tgCHnsveeeJv85_tpfU6Oa1dsf0sIm6YycV98Gw8bkKJyuMbbQo08EC3TtiuUWJ4BZEDUFvRpfikbCn-S_q5vn_d-LSOKUh59HiqUnreyDM-cSpvmzTJAAvPEejoH6J5su"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1c1e]/60"></div>
                </div>
              </div>
            </div>

            {/* Row 2: Up Next + Ad-Free */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Up Next Stacks - 2/3 width */}
              <div className="bento-card md:col-span-2 h-[380px] group apple-glass flex flex-col">
                <div className="p-10 flex justify-between items-start relative z-20">
                  <div>
                    <h4 className="text-2xl font-bold text-white tracking-tight">
                      Up Next
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 font-normal">
                      Pick up exactly where you left off.
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full apple-glass flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="text-white text-xl leading-none">+</span>
                  </button>
                </div>
                <div className="flex-1 relative flex items-center justify-center overflow-hidden -mt-10">
                  <div className="flex items-center justify-center [&>*:not(:first-child)]:-ml-20 scale-110 group-hover:scale-[1.15] transition-transform duration-700">
                    <div className="w-48 aspect-[3/4] rounded-xl overflow-hidden border border-white/20 shadow-2xl rotate-[-6deg] translate-y-4 blur-[1px] opacity-60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa4EyO6fO5QlXxxYIMtbmqVyfI2JT66vY62DDlKEo4MOKL8m7jtZHs8aR__3ZYXwr2oF9hpRJXgi4J3DUkJ1nLjl0TddPDBmzMsOyKhHJF6CA1RBMuewa2Mv97mIcyeOdofqfCS0rHOgNt2DVa86hZLkQrIiCHai3XeXkm03TUqc3ftB9mquaF2bss9emNlJSK_pztQdV7zFESqj8MyUrjFZFbuH_snUdZAMDY3DhWwAYvNyW70R6XW31Muj_LDNmgKm6M_utHvaeD"
                        alt="Movie poster 1"
                      />
                    </div>
                    <div className="w-56 aspect-[3/4] rounded-xl overflow-hidden border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 scale-105 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFs_izYNlt1BxcsxZJpHzjLWCJJUrdAptaOBOUk5N7UWjtK_erIH-IGDPxHoJqau5xoTyPfXKqnhw_tF1EAPxQ8Icdl3Q7YHrvnSxpge0nMwMKM7sRzoB2CQezrdgcEeoyedKcUvITkYqPi1_Uz-EYGSNB_Oh8LiHEkpeuxr1g0wb4GhQ3wDF8YUiBavJro9-cxhaRZLKwVIo386MImCqYkcEb5HWLTxkl5tkWSEGPr-m4rjs6i_EnDJqp3XcmhGu6tvw2-sFNtmGi"
                        alt="Movie poster 2"
                      />
                      <div className="absolute inset-0 glass-reflection opacity-40"></div>
                    </div>
                    <div className="w-48 aspect-[3/4] rounded-xl overflow-hidden border border-white/20 shadow-2xl rotate-[6deg] translate-y-4 blur-[1px] opacity-60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuALmEqqFld-UZPH2_IN9MhwBiVP0NrOC5B1VROvaaV477AC_3yR06UZEb94NVdW3CBLR8ouO8fhcy1F7m1GQ2-jRmsjWS4r6b7KkuTWg6fPMDOT5NFu7LzY8c2PkacDdVR_VzMCEMiadoHh1luWaIUW-miKANfMe-x7NvCNbeZNPM1CAGcLZC6M9ZAS2KOBcAv1xNFuFuWzxiBqySxJHEkW7nYgSB5bZV2BDsb-qq9lrXdpf_TM72Llz8H4lyBO1JIZKgNyduNblAYx"
                        alt="Movie poster 3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad-Free Metric */}
              <div className="bento-card h-[380px] apple-glass flex flex-col items-center justify-center text-center p-10 group">
                <div className="relative z-10 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform duration-500 relative">
                    <span className="text-4xl select-none">🚫</span>
                    <div className="absolute inset-0 rounded-full glass-reflection"></div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border border-black shadow-lg">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                </div>
                <h4 className="text-8xl font-bold text-white tracking-tighter mb-2 leading-none">
                  0
                  <span className="text-2xl font-normal text-gray-500 ml-1">
                    Ads
                  </span>
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">
                  Pure. Ad-free. Always.
                </p>
              </div>
            </div>

            {/* Row 3: Spatial Audio */}
            <div className="glass-card-pro rounded-3xl p-10 md:p-12 relative overflow-hidden group min-h-[420px]">
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover opacity-20 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa4EyO6fO5QlXxxYIMtbmqVyfI2JT66vY62DDlKEo4MOKL8m7jtZHs8aR__3ZYXwr2oF9hpRJXgi4J3DUkJ1nLjl0TddPDBmzMsOyKhHJF6CA1RBMuewa2Mv97mIcyeOdofqfCS0rHOgNt2DVa86hZLkQrIiCHai3XeXkm03TUqc3ftB9mquaF2bss9emNlJSK_pztQdV7zFESqj8MyUrjFZFbuH_snUdZAMDY3DhWwAYvNyW70R6XW31Muj_LDNmgKm6M_utHvaeD"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full gap-8">
                <div className="max-w-xl">
                  <div className="engraved-badge inline-block px-3 py-1 rounded-md mb-6">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-gray-400">
                      03 — IMMERSION
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Spatial Audio.
                    <br />
                    All around you.
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Dynamic head tracking places sound exactly where it belongs
                    in space. Whisper quiet moments or earth-shattering
                    explosions, calibrated for perfection.
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Headphones
                      size={36}
                      className="text-white"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-white/5">
                    <Radio
                      size={36}
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
      <section className="px-4 md:px-5 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2
              className="font-bold text-white mb-3"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                fontFamily: SF,
                fontWeight: 700,
              }}
            >
              Watch together. Stay in sync.
            </h2>
            <p className="text-white/38 text-[15px] max-w-[400px] mx-auto leading-[1.65]">
              Start a party, invite your friends, and press play.
              <br />
              <span className="text-white/50">
                Everyone sees the same moment — at the same time.
              </span>
            </p>
            <button className="mt-5 px-5 py-2.5 rounded-full border border-white/[0.11] text-[13px] text-white/42 hover:border-white/[0.22] hover:text-white/62 transition-all duration-300 cursor-pointer">
              See How It Works
            </button>
          </div>

          {/* ─── Bento grid ─── */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "auto auto auto",
            }}
          >
            {/* BIG STAT: 47 watching — col 1, rows 1+2 */}
            <div
              className="rounded-[18px] overflow-hidden flex flex-col justify-between p-8"
              style={{
                gridColumn: "1",
                gridRow: "1 / 3",
                background: "#141414",
                minHeight: "300px",
              }}
            >
              <div
                className="text-white/24 text-[10px] tracking-[0.18em] uppercase"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Live now
              </div>
              <div>
                <div
                  className="text-white font-bold leading-none"
                  style={{
                    fontSize: "92px",
                    letterSpacing: "-0.055em",
                    fontFamily: SF,
                    fontWeight: 700,
                  }}
                >
                  47
                </div>
                <div
                  className="text-white/42 text-[17px] font-[400] mt-3"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  watching now
                </div>
              </div>
            </div>

            {/* Playback in sync — col 2, row 1 */}
            <div
              className="rounded-[18px] p-6 flex flex-col justify-between cursor-default transition-colors duration-300 hover:brightness-110"
              style={{ gridColumn: "2", gridRow: "1", background: "#141414" }}
            >
              <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                <Users size={16} className="text-white/46" />
              </div>
              <div>
                <div
                  className="text-white text-[16px] font-[600] mb-1"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Playback in sync
                </div>
                <div className="text-white/36 text-[13px] leading-snug">
                  Every frame. Same moment.
                </div>
              </div>
            </div>

            {/* SYNC RING — col 3, rows 1+2 */}
            <div
              className="rounded-[18px] flex flex-col items-center justify-center gap-5 p-6"
              style={{
                gridColumn: "3",
                gridRow: "1 / 3",
                background: "#141414",
              }}
            >
              <div className="relative w-[152px] h-[152px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="rgba(255,255,255,0.58)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${RING_DASH} ${RING_FULL}`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="rgba(255,255,255,0.036)"
                    strokeWidth="0.8"
                    fill="none"
                    strokeDasharray="2 6"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-white/20 text-[8px] uppercase tracking-[0.22em] mb-1">
                    Sync
                  </div>
                  <div
                    className="text-white font-bold"
                    style={{
                      fontSize: "30px",
                      letterSpacing: "-0.04em",
                      fontFamily: SF,
                    }}
                  >
                    77%
                  </div>
                  <div className="text-white/28 text-[10px] mt-1">matched</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/26 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                Live sync active
              </div>
            </div>

            {/* Friends + Chat — col 2, row 2 */}
            <div
              className="rounded-[18px] p-6 flex flex-col justify-between cursor-default transition-colors duration-300 hover:brightness-110"
              style={{ gridColumn: "2", gridRow: "2", background: "#141414" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                  <Lock size={16} className="text-white/46" />
                </div>
                <div className="w-9 h-9 rounded-[12px] bg-white/[0.055] flex items-center justify-center">
                  <MessageCircle size={16} className="text-white/46" />
                </div>
              </div>
              <div>
                <div
                  className="text-white text-[16px] font-[600] mb-1"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Friends joining
                </div>
                <div className="text-white/36 text-[13px] leading-snug">
                  Chat is live.
                </div>
              </div>
            </div>

            {/* TAGS ROW — full width, row 3 */}
            <div
              className="rounded-[18px] px-6 py-4 flex items-center gap-2 flex-wrap"
              style={{
                gridColumn: "1 / 4",
                gridRow: "3",
                background: "#141414",
              }}
            >
              {PARTY_TAGS.map((tag, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-[11px] border cursor-default transition-all duration-200 hover:-translate-y-px ${
                    tag.h
                      ? "bg-white/[0.08] border-white/[0.14] text-white/68"
                      : "bg-white/[0.032] border-white/[0.06] text-white/34"
                  }`}
                >
                  {tag.label}
                </span>
              ))}
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
              className="font-bold text-white mb-2"
              style={{
                fontSize: "clamp(24px, 3.8vw, 48px)",
                letterSpacing: "-0.03em",
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
                className="rounded-[18px] p-7 flex flex-col justify-between"
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
                className="rounded-[18px] p-7 flex flex-col justify-between"
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
                className="rounded-[18px] p-7 flex flex-col justify-between"
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
                className="rounded-[18px] p-7 flex flex-col justify-between"
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
                className="rounded-[18px] p-7 flex flex-col justify-between"
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
                className="rounded-[18px] px-7 py-4 flex items-center gap-3 flex-wrap"
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
