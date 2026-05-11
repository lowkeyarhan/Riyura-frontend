import { ChevronDown } from "lucide-react";
import { SearchSortBy, SEARCH_SORT_LABELS } from "@/src/props/search/search";

const TABS = [
  { key: "all", label: "ALL" },
  { key: "movies", label: "MOVIE" },
  { key: "tv", label: "TV" },
];

interface FilterTabsProps {
  activeTab: "all" | "movies" | "tv";
  onTabChange: (tab: "all" | "movies" | "tv") => void;
  sortBy: SearchSortBy;
  onSortChange: (sort: SearchSortBy) => void;
  show: boolean;
}

export function FilterTabs({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  show,
}: FilterTabsProps) {
  if (!show) return null;

  return (
    <div className="relative flex items-center justify-center mb-12">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key as "all" | "movies" | "tv")}
            className={`px-7 py-2 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                : "text-white border border-white hover:text-white cursor-pointer"
            }`}
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="absolute right-0">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SearchSortBy)}
          className="appearance-none bg-transparent text-white border border-white hover:text-white cursor-pointer text-sm md:text-base font-bold font-bold uppercase tracking-wider rounded-full px-7 py-2 transition-all duration-300 focus:outline-none"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {Object.values(SearchSortBy).map((value) => (
            <option
              key={value}
              value={value}
              className="bg-[#0a0e1a] text-white"
            >
              {SEARCH_SORT_LABELS[value]}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none"
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
}
