import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Trash2 } from "lucide-react";

interface ContinueWatchingCardProps {
  item: any;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function ContinueWatchingCard({
  item,
  onClick,
  onDelete,
}: ContinueWatchingCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        y: 0,
        scale: 0.95,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      onClick={onClick}
      className="group relative flex items-center gap-3 p-2 md:gap-5 md:p-4 bg-[#1518215f] border border-white/5 rounded-2xl hover:border-white/20 hover:bg-[#15182180] transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:shadow-black/20"
    >
      <div className="relative w-28 md:w-40 aspect-[3/2] md:aspect-video rounded-lg overflow-hidden bg-[#0f1115] flex-shrink-0 shadow-inner">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 112px, 160px"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-3 h-3 md:w-4 md:h-4 fill-black text-black ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 md:py-1 pr-6 sm:pr-0">
        <h4
          className="text-base md:text-lg font-bold text-white truncate mb-1 group-hover:text-orange-600 transition-colors"
          style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
        >
          {item.title}
        </h4>
        <p className="text-xs font-medium text-gray-400 mb-2 md:mb-3 flex items-center gap-2">
          <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">
            {item.type}
          </span>
          {item.type?.toLowerCase().includes("movie") && item.year && (
            <span className="text-gray-600">• {item.year}</span>
          )}
        </p>
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-medium text-gray-500">
          <span className="text-gray-300">{item.progress}% completed</span>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span>{item.remaining}</span>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
        className="absolute top-2 right-2 sm:static flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-gray-400 sm:text-gray-500 bg-black/20 sm:bg-transparent hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer z-10"
        title="Remove from history"
      >
        <Trash2 size={14} className="md:w-4 md:h-4" />
      </div>
    </motion.div>
  );
}
