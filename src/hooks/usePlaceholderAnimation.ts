import { useState, useEffect, useRef } from "react";

interface PlaceholderAnimation {
  currentPlaceholder: string;
  opacity: number;
}

const PLACEHOLDER_TEXTS = [
  'Search "Interstellar"',
  'Try "Top trending anime"',
  'Find "Christopher Nolan"',
  'Search by genre "Cyberpunk"',
];

export function usePlaceholderAnimation(): PlaceholderAnimation {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1);
  const placeholderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (PLACEHOLDER_TEXTS.length <= 1) return;

    const interval = setInterval(() => {
      setPlaceholderOpacity(0);
      placeholderTimeoutRef.current = setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
        setPlaceholderOpacity(1);
      }, 200);
    }, 4000);

    return () => {
      clearInterval(interval);
      if (placeholderTimeoutRef.current)
        clearTimeout(placeholderTimeoutRef.current);
    };
  }, []);

  return {
    currentPlaceholder: PLACEHOLDER_TEXTS[placeholderIndex],
    opacity: placeholderOpacity,
  };
}
