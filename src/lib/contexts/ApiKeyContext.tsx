"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useGeminiApiKey } from "@/src/hooks/profile/useGeminiApiKey";
import type { ApiKeyProp } from "@/src/props/profile/apiKey";

const ApiKeyContext = createContext<ApiKeyProp | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const apiKey = useGeminiApiKey(user?.id);

  return (
    <ApiKeyContext.Provider value={apiKey}>{children}</ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyProp => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
