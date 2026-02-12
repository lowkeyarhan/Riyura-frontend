const TABS = [
  { key: "all", label: "ALL" },
  { key: "movies", label: "MOVIE" },
  { key: "tv", label: "TV" },
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
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              : " text-white border border-white hover:text-white cursor-pointer"
          }`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
