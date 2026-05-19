import { User, CreditCard, Key, Shield } from "lucide-react";
import { SettingsLink, SettingsLinkItem } from "./SettingsLink";
import { GeminiApiKeyInput } from "./GeminiApiKeyInput";
import type { ApiKeyProp } from "@/src/hooks/profile/useGeminiApiKey";

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
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        {SETTINGS_LINKS.map((link) =>
          link.hasInput ? (
            <div key={link.label} className="col-span-2">
              <GeminiApiKeyInput
                value={apiKey.apiKeyInput}
                onChange={apiKey.setApiKeyInput}
                onSave={apiKey.saveApiKey}
                onDelete={apiKey.deleteApiKey}
                isLoading={apiKey.isLoading}
                isSaving={apiKey.isSaving}
                keyPreview={apiKey.apiKeyPreview}
                hasKey={apiKey.hasApiKey}
              />
            </div>
          ) : (
            <SettingsLink key={link.label} item={link} />
          ),
        )}
      </div>
    </div>
  );
}
