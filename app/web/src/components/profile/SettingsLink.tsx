import { LucideIcon } from "lucide-react";

export interface SettingsLinkItem {
  label: string;
  icon: LucideIcon;
  desc: string;
  hasInput?: boolean;
}

interface SettingsLinkProps {
  item: SettingsLinkItem;
}

export function SettingsLink({ item }: SettingsLinkProps) {
  return (
    <button className="apple-glass rounded-3xl flex flex-col items-start justify-center p-4 transition-all hover:bg-white/5 text-left h-full">
      <div className="w-[40px] h-[40px] rounded-full flex flex-shrink-0 items-center justify-center bg-white/10 mb-3">
        <item.icon size={20} className="text-white/80" />
      </div>
      <h4 className="text-[13px] md:text-sm font-bold text-white leading-tight mb-1">
        {item.label}
      </h4>
      <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider font-medium truncate w-full">
        {item.desc}
      </p>
    </button>
  );
}
