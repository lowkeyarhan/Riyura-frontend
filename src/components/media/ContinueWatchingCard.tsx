"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { ContinueWatchingOverlayItem } from "@/src/dto/media-ui";

interface ContinueWatchingCardProps {
  item: ContinueWatchingOverlayItem;
  onClick: (item: ContinueWatchingOverlayItem) => void;
}

export default function ContinueWatchingCard({
  item,
  onClick,
}: ContinueWatchingCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-full text-left"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
            <Play className="h-5 w-5 fill-white" />
          </span>
        </div>
      </div>

      {/* Progress Bar below image */}
      <div className="w-full mb-2 mt-4 flex items-center justify-center">
        <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      <p
        className="truncate text-[1.04rem] font-semibold text-white"
        style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
      >
        {item.title}
      </p>
      <p className="mt-0.5 text-sm text-white/60">
        {item.meta} • {item.remaining}
      </p>
    </button>
  );
}
