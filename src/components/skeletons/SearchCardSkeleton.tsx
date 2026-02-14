
import React from "react";

export const SearchCardSkeleton = () => {
    return (
        <div
            className="
        group flex flex-col h-full rounded-2xl overflow-hidden
        bg-[#0f111536]
        border border-white/5 
        shadow-md
      "
        >
            {/* Poster Image Section */}
            <div className="relative aspect-[2/3] overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20 animate-pulse" />

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f111536] via-[#0f111536]/60 to-transparent" />
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col gap-2 p-4 md:p-5">
                {/* Title */}
                <div className="h-5 md:h-6 bg-white/10 rounded w-3/4 mb-1 animate-pulse" />

                {/* Metadata */}
                <div className="h-3 md:h-4 bg-white/5 rounded w-1/2 animate-pulse" />

                {/* Overview */}
                <div className="flex-1 mt-2 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
                    <div className="h-3 bg-white/5 rounded w-4/6 animate-pulse" />
                </div>
            </div>
        </div>
    );
};
