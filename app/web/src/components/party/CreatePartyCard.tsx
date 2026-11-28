"use client";

import { useState } from "react";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

const PARTY_AVATARS = [
  { label: "S", color: "#F97316" },
  { label: "N", color: "#6366F1" },
  { label: "B", color: "#22C55E" },
];

interface CreatePartyCardProps {
  /** Human-readable title of the content (movie/show name) */
  title: string;
  /** Subtitle shown under the title in the description, e.g. "this movie" or "S1 · E3" */
  contextLabel: string;
  /** The fully-formed href to navigate to when the user confirms */
  partyHref: string;
}

export function CreatePartyCard({
  title,
  contextLabel,
  partyHref,
}: CreatePartyCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="apple-glass rounded-[32px] p-4 flex-shrink-0 relative overflow-hidden">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white leading-tight">
            Create a party
          </h2>
          <p className="text-xs text-white/50 leading-relaxed mt-1">
            Start a synced room for{" "}
            <span className="text-white/70 font-medium">{title}</span>{" "}
            {contextLabel} and invite your circle.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center">
          {PARTY_AVATARS.map((avatar, index) => (
            <div
              key={avatar.label}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white/80"
              style={{
                backgroundColor: avatar.color,
                marginLeft: index === 0 ? 0 : -9,
                zIndex: PARTY_AVATARS.length - index,
              }}
            >
              {avatar.label}
            </div>
          ))}
          <div className="w-8 h-8 -ml-[9px] rounded-full bg-white/10 flex items-center justify-center text-white/80 text-[13px] font-bold ring-2 ring-white/20">
            +
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          aria-expanded={isConfirming}
          className="bg-[#E8470A] text-white rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all hover:scale-[1.03] hover:bg-[#ff571e] shadow-[0_0_20px_rgba(232,71,10,0.4)] flex items-center gap-2 whitespace-nowrap"
        >
          <LinkIcon size={15} />
          Create
        </button>
      </div>

      <div
        className={`relative z-10 overflow-hidden transition-all duration-300 ease-out ${isConfirming ? "max-h-14 pt-3 opacity-100" : "max-h-0 pt-0 opacity-0"
          }`}
      >
        <div className="flex h-11 items-center justify-between gap-3 rounded-full border border-white/[0.08] bg-black/20 px-3 pl-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold text-white/85">Are you sure?</p>
          <Link
            href={partyHref}
            className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition hover:bg-white/90"
          >
            Yes
          </Link>
        </div>
      </div>
    </div>
  );
}
