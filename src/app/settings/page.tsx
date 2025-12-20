"use client"

import { PageContainer } from "@/components/layout/page-container"
import { AuthGate } from "@/components/auth/auth-gate"
import { AISettingsProvider } from "@/contexts/ai-settings-context"
import { AISettings } from "@/components/settings/ai-settings"

export default function SettingsPage() {
  return (
    <AuthGate>
      <AISettingsProvider>
        <PageContainer
          title="Settings"
          description="Configure AI providers and application preferences"
        >
          <div className="max-w-4xl">
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-1">AI Providers</h2>
              <p className="text-xs text-muted-foreground">
                Configure your AI provider API keys and select your preferred model.
              </p>
            </div>
            <AISettings />
          </div>
        </PageContainer>
      </AISettingsProvider>
    </AuthGate>
  )
}
