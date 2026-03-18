import { useState, useEffect, useRef } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { useNotification } from "@/src/lib/contexts/NotificationContext";

interface GeminiApiKeyData {
  apiKeyInput: string;
  apiKeyPreview: string | null;
  hasApiKey: boolean;
  isLoading: boolean;
  isSaving: boolean;
  setApiKeyInput: (value: string) => void;
  saveApiKey: (key: string) => Promise<void>;
  deleteApiKey: () => Promise<void>;
}

export function useGeminiApiKey(userId: string | undefined): GeminiApiKeyData {
  const { addNotification } = useNotification();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeyPreview, setApiKeyPreview] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const apiKeyFetchingRef = useRef(false);

  // Fetch API Key Status on mount
  useEffect(() => {
    if (!userId || apiKeyFetchingRef.current) return;

    const fetchApiKeyStatus = async () => {
      if (apiKeyFetchingRef.current) return;
      apiKeyFetchingRef.current = true;

      try {
        setIsLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const res = await fetch("/api/profile/gemini", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setHasApiKey(data.hasKey);
            setApiKeyPreview(data.keyPreview);
            if (data.keyPreview) {
              setApiKeyInput(data.keyPreview);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch API key status:", error);
      } finally {
        setIsLoading(false);
        apiKeyFetchingRef.current = false;
      }
    };

    fetchApiKeyStatus();
  }, [userId]);

  // Handler: Save API Key
  const saveApiKey = async (key: string) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const res = await fetch("/api/profile/gemini", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiKey: key }),
        });

        if (res.ok) {
          const data = await res.json();
          setHasApiKey(true);
          setApiKeyPreview(data.keyPreview);
          setApiKeyInput(data.keyPreview);
        } else {
          const error = await res.json();
          console.error(`❌ [API Key] Failed to save:`, error.error);
          addNotification(`Failed to save API key: ${error.error}`, "error");
        }
      }
    } catch (error) {
      console.error(`🔥 [API Key] Error saving API key:`, error);
      addNotification("Failed to save API key. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete API Key
  const deleteApiKey = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const res = await fetch("/api/profile/gemini", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          setHasApiKey(false);
          setApiKeyPreview(null);
          setApiKeyInput("");
        } else {
          const error = await res.json();
          console.error(`❌ [API Key] Failed to delete:`, error.error);
        }
      }
    } catch (error) {
      console.error(`🔥 [API Key] Error deleting API key:`, error);
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
