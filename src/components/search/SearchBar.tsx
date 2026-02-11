import { Search, X } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholderText: string;
  placeholderOpacity: number;
  isLoading: boolean;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function SearchBar({
  query,
  onChange,
  onSearch,
  onClear,
  onKeyPress,
  placeholderText,
  placeholderOpacity,
  isLoading,
}: SearchBarProps) {
  return (
    <div className="max-w-3xl mx-auto mb-16">
      <div className="flex items-center gap-4 rounded-full bg-[#1a2332]/80 border border-white/10 px-4 py-3 md:px-6 md:py-4 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_25px_60px_rgba(0,255,255,0.15)]">
        <Search className="w-5 h-5 text-cyan-400" />
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder=""
            className="w-full bg-transparent text-sm md:text-lg text-white placeholder-transparent focus:outline-none"
            style={FONT_STYLE}
          />
          {!query && (
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none transition-opacity duration-500 ${
                placeholderOpacity === 1 ? "opacity-100" : "opacity-0"
              }`}
              style={FONT_STYLE}
            >
              {placeholderText}
            </span>
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={onClear}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onSearch}
          className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-xs md:text-base font-bold text-white shadow-[0_0_24px_rgba(255,80,0,0.35)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,80,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          disabled={!query.trim() || isLoading}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Search
        </button>
      </div>
    </div>
  );
}
