import { X } from "lucide-react";

interface EmptyStateProps {
  query: string;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function EmptyState({ query }: EmptyStateProps) {
  if (!query) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <X className="w-16 h-16 text-gray-600" />
      </div>
      <h2 className="text-3xl font-semibold mb-3 text-white" style={FONT_STYLE}>
        No results found
      </h2>
      <p className="text-gray-400 text-lg max-w-md" style={FONT_STYLE}>
        Try adjusting your search or browse our collection.
      </p>
    </div>
  );
}
