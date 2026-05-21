import { useEffect, useRef } from "react";
import { Key } from "lucide-react";

interface GeminiApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (key: string) => void;
  onDelete: () => void;
  isLoading: boolean;
  isSaving: boolean;
  keyPreview: string | null;
  hasKey: boolean;
}

export function GeminiApiKeyInput({
  value,
  onChange,
  onSave,
  onDelete,
  isLoading,
  isSaving,
  keyPreview,
  hasKey,
}: GeminiApiKeyInputProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer (3 seconds)
    debounceTimerRef.current = setTimeout(() => {
      if (newValue.trim() === "" && hasKey) {
        // Empty input with existing key = delete
        onDelete();
      } else if (newValue.trim() !== "") {
        // Non-empty input = save
        onSave(newValue.trim());
      }
    }, 3000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="apple-glass rounded-3xl flex flex-col p-4 transition-all w-full group">
      <div className="flex items-center gap-3 w-full mb-3">
        <div className="w-[40px] h-[40px] rounded-full flex flex-shrink-0 items-center justify-center bg-white/10">
          <Key size={20} className="text-white/80" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-[13px] md:text-sm font-bold text-white leading-tight mb-0.5 truncate">
            Gemini API Key
          </h4>
          <p className="text-[10px] md:text-[11px] text-white/50 uppercase tracking-wider font-medium truncate">
            Manage AI Integration
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={isLoading ? "Loading..." : "Enter Gemini API Key"}
          disabled={isLoading || isSaving}
          className="w-full rounded-2xl bg-white/5 border border-white/10 text-white px-4 py-3 pr-12 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          )}
          {hasKey && !isSaving && (
            <div className="text-green-500 text-xs font-bold">✓</div>
          )}
        </div>
      </div>
      <p className="text-[10px] text-white/30 font-medium tracking-wide mt-3 text-center">
        Changes auto-save after 3 seconds. Clear input to delete key.
      </p>
    </div>
  );
}
