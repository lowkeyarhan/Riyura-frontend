import { User, CreditCard, Key, Shield } from "lucide-react";
import { SettingsLink, SettingsLinkItem } from "./SettingsLink";
import { GeminiApiKeyInput } from "./GeminiApiKeyInput";
import type { ApiKeyProp } from "@/src/props/profile/apiKey";

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

export function SettingsSection({ apiKey }: { apiKey: ApiKeyProp }) {
  return (
    <div className="space-y-3">
      <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
        Preferences
      </h3>
      {SETTINGS_LINKS.map((link) =>
        link.hasInput ? (
          <GeminiApiKeyInput
            key={link.label}
            value={apiKey.apiKeyInput}
            onChange={apiKey.setApiKeyInput}
            onSave={apiKey.saveApiKey}
            onDelete={apiKey.deleteApiKey}
            isLoading={apiKey.isLoading}
            isSaving={apiKey.isSaving}
            keyPreview={apiKey.apiKeyPreview}
            hasKey={apiKey.hasApiKey}
          />
        ) : (
          <SettingsLink key={link.label} item={link} />
        ),
      )}
    </div>
  );
}
