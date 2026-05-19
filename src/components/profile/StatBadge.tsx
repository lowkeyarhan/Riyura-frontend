import { Film, Tv, Clock, LucideIcon } from "lucide-react";

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface StatBadgeProps {
  stat: Stat;
}

export function StatBadge({ stat }: StatBadgeProps) {
  const Icon = stat.icon;
  return (
    <div className="apple-glass rounded-full flex items-center justify-start p-2 gap-3 transition-all hover:bg-white/5 cursor-default">
      <div className="w-[50px] h-[50px] rounded-full flex flex-shrink-0 items-center justify-center bg-white/10">
        <Icon size={24} className="text-white/80" />
      </div>
      <div className="flex flex-col text-left justify-center flex-1 min-w-0 pr-2">
        <span className="text-xl md:text-2xl text-white font-bold leading-tight tracking-wide truncate">
          {stat.value}
        </span>
        <span className="text-[10px] md:text-[11px] text-white/50 font-medium uppercase tracking-wider mt-0.5 truncate">
          {stat.label}
        </span>
      </div>
    </div>
  );
}
