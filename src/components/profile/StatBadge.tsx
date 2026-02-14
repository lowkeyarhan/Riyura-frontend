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
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl bg-[#29292930] border border-white/5 flex-1 group hover:border-white/10 hover:bg-[#29292950] transition-colors">
      <span className="text-xl font-bold text-white leading-none mb-1">
        {stat.value}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold group-hover:text-gray-400 transition-colors">
        {stat.label}
      </span>
    </div>
  );
}
