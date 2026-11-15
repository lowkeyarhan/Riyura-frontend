"use client";

import { Component, ReactNode } from "react";
import ErrorScreen from "@/src/components/ui/ErrorScreen";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a chunk loading error
    const isChunkError =
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to load");

    if (isChunkError) {
      return { hasError: true, error };
    }

    // Re-throw non-chunk errors
    throw error;
  }

  componentDidCatch(error: Error) {
    const isChunkError =
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("ChunkLoadError") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to load");

    if (isChunkError) {
      console.error("Chunk loading error detected, reloading page...", error);
      // Reload the page to fetch fresh chunks
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          hero={
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          }
          title="Reloading"
          description="Fetching the latest version of Riyura."
        />
      );
    }

    return this.props.children;
  }
}
