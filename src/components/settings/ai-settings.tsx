"use client"

import { useState } from "react"
import { IconLoader2, IconDeviceFloppy, IconAlertTriangle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "./provider-card"
import { useAISettings } from "@/contexts/ai-settings-context"
import { PROVIDER_LIST } from "@/lib/ai/providers"

export function AISettings() {
  const { saveSettings, isLoading } = useAISettings()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      await saveSettings()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <IconAlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0" />
        <p className="text-xs text-amber-800 dark:text-amber-200">
          API keys are encrypted and stored in your browser. They are never sent to our servers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PROVIDER_LIST.map((provider) => (
          <ProviderCard key={provider.id} providerId={provider.id} />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <IconLoader2 className="h-4 w-4 animate-spin" />
          ) : (
            <IconDeviceFloppy className="h-4 w-4" />
          )}
          Save Settings
        </Button>

        {saveSuccess && (
          <span className="text-xs text-green-600">Settings saved successfully!</span>
        )}
      </div>
    </div>
  )
}
