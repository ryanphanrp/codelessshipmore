export type ProviderId = "openai" | "anthropic" | "google" | "anthropic-custom" | "cerebras"

export interface ProviderDefinition {
  id: ProviderId
  name: string
  description: string
  models: string[]
  supportsCustomEndpoint: boolean
  fixedBaseUrl?: string
  defaultModel: string
  placeholder: string
}

export const PROVIDERS: Record<ProviderId, ProviderDefinition> = {
  openai: {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, GPT-4 Turbo, GPT-3.5, or OpenAI-compatible APIs",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    supportsCustomEndpoint: true,
    defaultModel: "gpt-4o-mini",
    placeholder: "sk-..."
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic (Claude)",
    description: "Claude 3.5 Sonnet, Opus, and Haiku models",
    models: [
      "claude-sonnet-4-20250514",
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229",
      "claude-3-haiku-20240307"
    ],
    supportsCustomEndpoint: false,
    defaultModel: "claude-sonnet-4-20250514",
    placeholder: "sk-ant-..."
  },
  google: {
    id: "google",
    name: "Google (Gemini)",
    description: "Gemini 1.5 Pro, Flash, and 2.0 models",
    models: [
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b"
    ],
    supportsCustomEndpoint: false,
    defaultModel: "gemini-1.5-flash",
    placeholder: "AIza..."
  },
  "anthropic-custom": {
    id: "anthropic-custom",
    name: "Claude (Custom Endpoint)",
    description: "Claude via custom API endpoint or proxy",
    models: [
      "claude-sonnet-4-20250514",
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229",
      "claude-3-haiku-20240307"
    ],
    supportsCustomEndpoint: true,
    defaultModel: "claude-sonnet-4-20250514",
    placeholder: "sk-ant-..."
  },
  cerebras: {
    id: "cerebras",
    name: "Cerebras",
    description: "Ultra-fast Llama inference via Cerebras Cloud",
    models: [
      "llama-3.3-70b",
      "llama3.1-70b",
      "llama3.1-8b",
      "deepseek-r1-distill-llama-70b"
    ],
    supportsCustomEndpoint: false,
    fixedBaseUrl: "https://api.cerebras.ai/v1",
    defaultModel: "llama-3.3-70b",
    placeholder: "csk-..."
  }
}

export const PROVIDER_LIST = Object.values(PROVIDERS)

export interface ProviderConfig {
  id: ProviderId
  apiKey: string
  baseUrl?: string
  model: string
  enabled: boolean
}

export interface AISettings {
  providers: Record<ProviderId, ProviderConfig>
  activeProvider: ProviderId | null
}

export const DEFAULT_SETTINGS: AISettings = {
  providers: {
    openai: {
      id: "openai",
      apiKey: "",
      baseUrl: "",
      model: PROVIDERS.openai.defaultModel,
      enabled: false
    },
    anthropic: {
      id: "anthropic",
      apiKey: "",
      model: PROVIDERS.anthropic.defaultModel,
      enabled: false
    },
    google: {
      id: "google",
      apiKey: "",
      model: PROVIDERS.google.defaultModel,
      enabled: false
    },
    "anthropic-custom": {
      id: "anthropic-custom",
      apiKey: "",
      baseUrl: "",
      model: PROVIDERS["anthropic-custom"].defaultModel,
      enabled: false
    },
    cerebras: {
      id: "cerebras",
      apiKey: "",
      model: PROVIDERS.cerebras.defaultModel,
      enabled: false
    }
  },
  activeProvider: null
}
