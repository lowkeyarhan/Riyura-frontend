"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

interface ContextMenuProps {
    x: number;
    y: number;
    onRemove: () => void;
    onClose: () => void;
}

export function ContextMenu({ x, y, onRemove, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Adjust position to prevent menu from going off-screen
    const adjustedX = Math.min(x, window.innerWidth - 220); // 220px = menu width
    const adjustedY = Math.min(y, window.innerHeight - 60); // 60px = menu height

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-[#1a1d26] border border-white/10 rounded-lg shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{
                top: `${adjustedY}px`,
                left: `${adjustedX}px`,
            }}
        >
            <button
                onClick={() => {
                    onRemove();
                    onClose();
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors min-w-[200px]"
            >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">
                    Remove from Watchlist
                </span>
            </button>
        </div>
    );
}
