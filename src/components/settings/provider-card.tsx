"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  IconLoader2,
  IconCheck,
  IconX,
  IconPlugConnected,
  IconRefresh
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ApiKeyInput } from "./api-key-input"
import { useAISettings } from "@/contexts/ai-settings-context"
import { testConnection, type TestResult } from "@/lib/ai/test-connection"
import { fetchModels, type FetchModelsResult } from "@/lib/ai/fetch-models"
import { PROVIDERS, type ProviderId, type ProviderConfig } from "@/lib/ai/providers"

interface ProviderCardProps {
  providerId: ProviderId
}

export function ProviderCard({ providerId }: ProviderCardProps) {
  const provider = PROVIDERS[providerId]
  const { settings, updateProvider, setActiveProvider } = useAISettings()
  const config = settings.providers[providerId]

  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [fetchedModels, setFetchedModels] = useState<string[]>([])
  const [isFetchingModels, setIsFetchingModels] = useState(false)
  const [fetchModelsResult, setFetchModelsResult] = useState<FetchModelsResult | null>(null)

  const isActive = settings.activeProvider === providerId

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    const result = await testConnection(providerId, config)
    setTestResult(result)

    if (result.success) {
      toast.success(`${provider.name} connected`, {
        description: result.message
      })
    } else {
      toast.error(`${provider.name} connection failed`, {
        description: result.message
      })
    }

    setIsTesting(false)
  }

  const handleToggleEnabled = () => {
    const newEnabled = !config.enabled
    updateProvider(providerId, { enabled: newEnabled })

    if (newEnabled && !settings.activeProvider) {
      setActiveProvider(providerId)
    } else if (!newEnabled && isActive) {
      setActiveProvider(null)
    }
  }

  const handleSetActive = () => {
    if (config.enabled) {
      setActiveProvider(providerId)
    }
  }

  const handleFetchModels = async () => {
    const baseUrlToUse = config.baseUrl || provider.fixedBaseUrl
    if (!baseUrlToUse || !config.apiKey) return

    setIsFetchingModels(true)
    setFetchModelsResult(null)

    const result = await fetchModels(baseUrlToUse, config.apiKey)
    setFetchModelsResult(result)

    if (result.success && result.models.length > 0) {
      setFetchedModels(result.models)
      if (!result.models.includes(config.model)) {
        updateProvider(providerId, { model: result.models[0] })
      }
      toast.success("Models fetched", {
        description: result.message
      })
    } else {
      toast.error("Failed to fetch models", {
        description: result.message
      })
    }

    setIsFetchingModels(false)
  }

  const canFetchModels = provider.fixedBaseUrl || (provider.supportsCustomEndpoint && config.baseUrl)
  const modelsToShow = canFetchModels && fetchedModels.length > 0
    ? fetchedModels
    : provider.models

  return (
    <Card
      className={`p-4 transition-all ${
        isActive ? "ring-2 ring-primary" : ""
      } ${config.enabled ? "" : "opacity-60"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-sm">{provider.name}</h3>
          <p className="text-xs text-muted-foreground">{provider.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {config.enabled && !isActive && (
            <Button
              variant="outline"
              size="xs"
              onClick={handleSetActive}
            >
              Set Active
            </Button>
          )}
          <Button
            variant={config.enabled ? "default" : "outline"}
            size="xs"
            onClick={handleToggleEnabled}
          >
            {config.enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {provider.supportsCustomEndpoint && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateProvider(providerId, { baseUrl: "" })}
              disabled={!config.enabled}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                !config.baseUrl
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              } disabled:opacity-50`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => updateProvider(providerId, { baseUrl: config.baseUrl || "https://" })}
              disabled={!config.enabled}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                config.baseUrl
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              } disabled:opacity-50`}
            >
              Custom
            </button>
          </div>
        )}

        <div>
          <Label className="text-xs mb-1.5 block">API Key</Label>
          <ApiKeyInput
            value={config.apiKey}
            onChange={(apiKey) => updateProvider(providerId, { apiKey })}
            placeholder={provider.placeholder}
            disabled={!config.enabled}
          />
        </div>

        {provider.supportsCustomEndpoint && config.baseUrl && (
          <div>
            <Label className="text-xs mb-1.5 block">Custom Endpoint URL</Label>
            <Input
              value={config.baseUrl || ""}
              onChange={(e) =>
                updateProvider(providerId, { baseUrl: e.target.value })
              }
              placeholder="https://api.example.com/v1"
              disabled={!config.enabled}
              className="text-xs"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs">Model</Label>
            {canFetchModels && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleFetchModels}
                disabled={!config.enabled || !config.apiKey || isFetchingModels}
                className="h-5 px-1.5 text-xs"
              >
                {isFetchingModels ? (
                  <IconLoader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <IconRefresh className="h-3 w-3" />
                )}
                Fetch
              </Button>
            )}
          </div>
          <Select
            value={config.model}
            onValueChange={(model) => updateProvider(providerId, { model })}
            disabled={!config.enabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelsToShow.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fetchModelsResult && (
            <p className={`text-xs mt-1 ${fetchModelsResult.success ? "text-green-600" : "text-destructive"}`}>
              {fetchModelsResult.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={!config.enabled || !config.apiKey || isTesting}
          >
            {isTesting ? (
              <IconLoader2 className="h-3 w-3 animate-spin" />
            ) : (
              <IconPlugConnected className="h-3 w-3" />
            )}
            Test Connection
          </Button>

          {testResult && (
            <div
              className={`flex items-center gap-1 text-xs ${
                testResult.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {testResult.success ? (
                <IconCheck className="h-3 w-3" />
              ) : (
                <IconX className="h-3 w-3" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
