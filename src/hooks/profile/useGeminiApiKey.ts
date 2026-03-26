import { useState, useEffect, useRef, useCallback } from "react";
import { getSupabaseSession } from "@/src/lib/auth/getSession";
import { useNotification } from "@/src/lib/contexts/NotificationContext";
export interface ApiKeyProp {
  apiKeyInput: string;
  apiKeyPreview: string | null;
  hasApiKey: boolean;
  isLoading: boolean;
  isSaving: boolean;
  setApiKeyInput: (value: string) => void;
  saveApiKey: (key: string) => Promise<void>;
  deleteApiKey: () => Promise<void>;
}

export function useGeminiApiKey(userId: string | undefined): ApiKeyProp {
  const { addNotification } = useNotification();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeyPreview, setApiKeyPreview] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!userId || isFetchingRef.current) return;

    const fetchApiKeyStatus = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        setIsLoading(true);

        const session = await getSupabaseSession();
        if (!session) return;

        const res = await fetch("/api/profile/key", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setHasApiKey(data.hasKey);
          setApiKeyPreview(data.keyPreview ?? null);
          if (data.keyPreview) setApiKeyInput(data.keyPreview);
        }
      } catch (error) {
        console.error("Failed to fetch API key status:", error);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchApiKeyStatus();
  }, [userId]);

  const saveApiKey = async (key: string) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const session = await getSupabaseSession();
      if (!session) return;

      const res = await fetch("/api/profile/key", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: key }),
      });

      if (res.ok) {
        const data = await res.json();
        setHasApiKey(data.hasKey);
        setApiKeyPreview(data.keyPreview ?? null);
        setApiKeyInput(data.keyPreview ?? key);
      } else {
        const error = await res.json();
        addNotification(`Failed to save API key: ${error.error}`, "error");
      }
    } catch {
      addNotification("Failed to save API key. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteApiKey = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const session = await getSupabaseSession();
      if (!session) return;

      const res = await fetch("/api/profile/key", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        setHasApiKey(false);
        setApiKeyPreview(null);
        setApiKeyInput("");
      } else {
        const error = await res.json();
        addNotification(`Failed to delete API key: ${error.error}`, "error");
      }
    } catch {
      addNotification("Failed to delete API key. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    apiKeyInput,
    apiKeyPreview,
    hasApiKey,
    isLoading,
    isSaving,
    setApiKeyInput,
    saveApiKey,
    deleteApiKey,
  };
}
