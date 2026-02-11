export default function TrendingSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 h-[320px] animate-pulse">
      <div className="flex flex-col justify-between h-full gap-6">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="w-20 h-6 bg-white/10 rounded-full" />
          <div className="w-12 h-6 bg-white/10 rounded-full" />
        </div>

        {/* Middle Content */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="w-3/4 h-8 bg-white/10 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-2/3 h-4 bg-white/10 rounded" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="w-24 h-4 bg-white/10 rounded" />
          <div className="w-20 h-4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}
