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
    <div className="w-full">
      <div className="w-full bg-[#1518215f] border border-white/5 rounded-xl hover:bg-[#15182180] hover:border-white/20 transition-all group text-left shadow-sm p-4 flex flex-col min-h-[80px] justify-center">
        <div className="flex items-center gap-4 w-full">
          <div className="p-2.5 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all flex-shrink-0">
            <item.icon size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
              {item.label}
            </h4>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
