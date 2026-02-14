export function TrendingCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-3 md:p-6 aspect-[16/9] md:aspect-auto animate-pulse">
      <div className="flex flex-col h-full">
        {/* Empty spacer between on mobile */}
        <div className="flex-1" />

        {/* Title at top */}
        <div className="mb-4">
          <div className="h-6 md:h-7 bg-white/10 rounded w-3/4 md:w-1/2" />
        </div>

        {/* Overview and metadata at bottom */}
        <div className="space-y-3 md:space-y-4">
          {/* Overview - 2-3 lines */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-3/4 md:block hidden" />
          </div>

          {/* Bottom metadata row */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-white/10 rounded w-24" />
            <div className="h-4 bg-white/10 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

