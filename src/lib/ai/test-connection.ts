import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import type { ProviderId, ProviderConfig } from "./providers"

export interface TestResult {
  success: boolean
  message: string
  latencyMs?: number
}

export async function testConnection(
  providerId: ProviderId,
  config: ProviderConfig
): Promise<TestResult> {
  if (!config.apiKey) {
    return { success: false, message: "API key is required" }
  }

  const startTime = Date.now()

  try {
    let model

    switch (providerId) {
      case "openai": {
        const openai = createOpenAI({
          apiKey: config.apiKey,
          baseURL: config.baseUrl || undefined
        })
        model = openai(config.model)
        break
      }
      case "anthropic": {
        const anthropic = createAnthropic({ apiKey: config.apiKey })
        model = anthropic(config.model)
        break
      }
      case "google": {
        const google = createGoogleGenerativeAI({ apiKey: config.apiKey })
        model = google(config.model)
        break
      }
      case "anthropic-custom": {
        if (!config.baseUrl) {
          return { success: false, message: "Base URL is required for custom endpoint" }
        }
        const anthropic = createAnthropic({
          apiKey: config.apiKey,
          baseURL: config.baseUrl
        })
        model = anthropic(config.model)
        break
      }
      case "cerebras": {
        const cerebras = createOpenAICompatible({
          name: "cerebras",
          baseURL: "https://api.cerebras.ai/v1",
          apiKey: config.apiKey
        })
        model = cerebras(config.model)
        break
      }
      default:
        return { success: false, message: "Unknown provider" }
    }

    await generateText({
      model,
      prompt: "Say 'ok' in one word."
    })

    const latencyMs = Date.now() - startTime

    return {
      success: true,
      message: `Connection successful (${latencyMs}ms)`,
      latencyMs
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Connection failed"
    return { success: false, message }
  }
}
