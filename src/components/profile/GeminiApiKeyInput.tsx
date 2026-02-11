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
    <div className="w-full">
      <div className="w-full bg-[#1518215f] border border-white/5 rounded-xl hover:bg-[#15182180] hover:border-white/20 transition-all group text-left shadow-sm p-4 flex flex-col min-h-[80px] justify-center">
        <div className="flex items-start gap-4 w-full">
          <div className="p-2.5 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all flex-shrink-0">
            <Key size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
              Gemini API Key
            </h4>
            <p className="text-xs text-gray-500">Manage AI Integration</p>
            <div className="relative mt-4">
              <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={isLoading ? "Loading..." : "Enter Gemini API Key"}
                disabled={isLoading || isSaving}
                className="w-full rounded-lg bg-transparent border border-white/5 text-white px-3 py-2.5 pr-12 focus:outline-none focus:border-white/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-[10px] text-gray-600 mt-2">
              Changes auto-save after 3 seconds. Clear input to delete key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
