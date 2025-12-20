"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode
} from "react"
import {
  type AISettings,
  type ProviderConfig,
  type ProviderId,
  DEFAULT_SETTINGS
} from "@/lib/ai/providers"
import { encrypt, decrypt, type EncryptedData } from "@/lib/ai/encryption"

const STORAGE_KEY = "ai_settings"

interface AISettingsContextType {
  settings: AISettings
  isLoading: boolean
  updateProvider: (id: ProviderId, config: Partial<ProviderConfig>) => void
  setActiveProvider: (id: ProviderId | null) => void
  getDecryptedApiKey: (id: ProviderId) => Promise<string>
  saveSettings: () => Promise<void>
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(
  undefined
)

interface StoredSettings {
  providers: Record<
    ProviderId,
    Omit<ProviderConfig, "apiKey"> & { apiKey: EncryptedData | null }
  >
  activeProvider: ProviderId | null
}

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS)
  const [encryptedKeys, setEncryptedKeys] = useState<
    Record<ProviderId, EncryptedData | null>
  >({
    openai: null,
    anthropic: null,
    google: null,
    "anthropic-custom": null,
    cerebras: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setIsLoading(false)
      return
    }

    try {
      const parsed = JSON.parse(stored) as StoredSettings
      const newSettings: AISettings = {
        ...DEFAULT_SETTINGS,
        activeProvider: parsed.activeProvider
      }
      const newEncryptedKeys: Record<ProviderId, EncryptedData | null> = {
        openai: null,
        anthropic: null,
        google: null,
        "anthropic-custom": null,
        cerebras: null
      }

      for (const [id, config] of Object.entries(parsed.providers)) {
        const providerId = id as ProviderId
        newSettings.providers[providerId] = {
          ...DEFAULT_SETTINGS.providers[providerId],
          ...config,
          apiKey: ""
        }
        if (config.apiKey) {
          newEncryptedKeys[providerId] = config.apiKey
        }
      }

      setSettings(newSettings)
      setEncryptedKeys(newEncryptedKeys)
    } catch {
      console.error("Failed to load AI settings")
    }

    setIsLoading(false)
  }

  const updateProvider = useCallback(
    (id: ProviderId, config: Partial<ProviderConfig>) => {
      setSettings((prev) => ({
        ...prev,
        providers: {
          ...prev.providers,
          [id]: {
            ...prev.providers[id],
            ...config
          }
        }
      }))
    },
    []
  )

  const setActiveProvider = useCallback((id: ProviderId | null) => {
    setSettings((prev) => ({
      ...prev,
      activeProvider: id
    }))
  }, [])

  const getDecryptedApiKey = useCallback(
    async (id: ProviderId): Promise<string> => {
      const encrypted = encryptedKeys[id]
      if (!encrypted) return settings.providers[id].apiKey || ""

      try {
        return await decrypt(encrypted)
      } catch {
        return ""
      }
    },
    [encryptedKeys, settings.providers]
  )

  const saveSettings = useCallback(async () => {
    if (typeof window === "undefined") return

    const storedSettings: StoredSettings = {
      providers: {} as StoredSettings["providers"],
      activeProvider: settings.activeProvider
    }

    for (const [id, config] of Object.entries(settings.providers)) {
      const providerId = id as ProviderId
      let encryptedKey: EncryptedData | null = encryptedKeys[providerId]

      if (config.apiKey && config.apiKey.length > 0) {
        encryptedKey = await encrypt(config.apiKey)
        setEncryptedKeys((prev) => ({
          ...prev,
          [providerId]: encryptedKey
        }))
      }

      storedSettings.providers[providerId] = {
        id: providerId,
        baseUrl: config.baseUrl,
        model: config.model,
        enabled: config.enabled,
        apiKey: encryptedKey
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSettings))
  }, [settings, encryptedKeys])

  return (
    <AISettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateProvider,
        setActiveProvider,
        getDecryptedApiKey,
        saveSettings
      }}
    >
      {children}
    </AISettingsContext.Provider>
  )
}

export function useAISettings(): AISettingsContextType {
  const context = useContext(AISettingsContext)
  if (context === undefined) {
    throw new Error("useAISettings must be used within an AISettingsProvider")
  }
  return context
}
