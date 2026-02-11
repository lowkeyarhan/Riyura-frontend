import { User, CreditCard, Key, Shield } from "lucide-react";
import { SettingsLink, SettingsLinkItem } from "./SettingsLink";
import { GeminiApiKeyInput } from "./GeminiApiKeyInput";

const SETTINGS_LINKS: SettingsLinkItem[] = [
  { label: "Account Settings", icon: User, desc: "Personal info, Email" },
  { label: "Subscription Plan", icon: CreditCard, desc: "Manage Premium" },
  {
    label: "Gemini API Key",
    icon: Key,
    desc: "Manage AI Integration",
    hasInput: true,
  },
  { label: "Privacy & Security", icon: Shield, desc: "Password, 2FA" },
];

interface SettingsSectionProps {
  apiKeyInput: string;
  onApiKeyInputChange: (value: string) => void;
  onApiKeySave: (key: string) => void;
  onApiKeyDelete: () => void;
  isLoadingApiKey: boolean;
  isSavingApiKey: boolean;
  apiKeyPreview: string | null;
  hasApiKey: boolean;
}

export function SettingsSection({
  apiKeyInput,
  onApiKeyInputChange,
  onApiKeySave,
  onApiKeyDelete,
  isLoadingApiKey,
  isSavingApiKey,
  apiKeyPreview,
  hasApiKey,
}: SettingsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
        Preferences
      </h3>
      {SETTINGS_LINKS.map((link) =>
        link.hasInput ? (
          <GeminiApiKeyInput
            key={link.label}
            value={apiKeyInput}
            onChange={onApiKeyInputChange}
            onSave={onApiKeySave}
            onDelete={onApiKeyDelete}
            isLoading={isLoadingApiKey}
            isSaving={isSavingApiKey}
            keyPreview={apiKeyPreview}
            hasKey={hasApiKey}
          />
        ) : (
          <SettingsLink key={link.label} item={link} />
        ),
      )}
    </div>
  );
}
