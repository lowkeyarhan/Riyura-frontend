const TABS = [
  { key: "all", label: "A L L" },
  { key: "movies", label: "M O V I E" },
  { key: "tv", label: "T V" },
];

interface FilterTabsProps {
  activeTab: "all" | "movies" | "tv";
  onTabChange: (tab: "all" | "movies" | "tv") => void;
  show: boolean;
}

export function FilterTabs({ activeTab, onTabChange, show }: FilterTabsProps) {
  if (!show) return null;

  return (
    <div className="flex justify-center gap-2 mb-12">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key as "all" | "movies" | "tv")}
          className={`px-7 py-2 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === tab.key
              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_24px_rgba(255,80,0,0.35)]"
              : "bg-[#1a2332]/80 text-gray-400 border border-white/10 hover:border-cyan-500/50 hover:text-white hover:bg-[#1a2332]"
          }`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
