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
