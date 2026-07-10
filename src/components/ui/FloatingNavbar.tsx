"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const islandVariants = {
    top: {
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "rgba(255,255,255,0)",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      y: 0,
    },
    scrolled: {
      backgroundColor: "rgba(255,255,255,0.06)", // Slight white tint for glassmorphism
      borderColor: "rgba(255,255,255,0.1)",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      paddingLeft: "1.25rem",
      paddingRight: "1.25rem",

      y: 16, // Drop down slightly
    },
  };

  return (
    <motion.header
      className="fixed pt-10 md:pt-0 top-0 left-0 right-0 z-[100] flex justify-center w-full pointer-events-none"
      initial={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
      }}
      animate={{
        background: isScrolled
          ? "linear-gradient(to bottom, rgba(0,0,0,0), transparent)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`px-4 md:px-5 flex items-center pointer-events-auto ${
          isScrolled ? "justify-center gap-2 w-auto" : "justify-between w-full"
        }`}
      >
        {/* Left Island (Logo) */}
        <motion.div
          layout
          variants={islandVariants}
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`border border-[0.5px] backdrop-blur-md rounded-full flex items-center shrink-0 ${
            isScrolled ? "apple-glass-navbar-pill" : ""
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-75 transition-opacity duration-200"
          >
            <Image src="/logo.png" alt="Riyura Logo" width={28} height={28} />
            <span
              className="text-white font-bold text-[18px]"
              style={{ fontFamily: "'Bruno Ace', sans-serif" }}
            >
              RIYURA
            </span>
          </Link>
        </motion.div>

        {/* Middle Island (Links) */}
        <motion.div
          layout
          variants={islandVariants}
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`hidden md:flex border-[0.5px] rounded-full h-full backdrop-blur-md items-center gap-8 ${
            isScrolled ? "apple-glass-navbar-pill" : ""
          }`}
        >
          {["Features", "Explore", "Pricing", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[13px] text-white/46 hover:text-white/78 transition-colors duration-200"
            >
              {l}
            </a>
          ))}
        </motion.div>

        {/* Right Island (Sign In) */}
        <motion.div
          layout
          variants={islandVariants}
          initial="top"
          animate={isScrolled ? "scrolled" : "top"}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`border border-[0.5px] backdrop-blur-md rounded-full h-full flex items-center shrink-0 ${
            isScrolled ? "apple-glass-navbar-pill" : ""
          }`}
        >
          <Link
            href="/auth"
            className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
