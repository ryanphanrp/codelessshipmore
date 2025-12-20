"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClipboard } from "@/hooks/use-clipboard"
import { useAI } from "@/hooks/use-ai"
import { useAISettings } from "@/contexts/ai-settings-context"
import { toast } from "sonner"
import { IconCopy, IconCheck, IconSparkles, IconSettings } from "@tabler/icons-react"
import type { ProviderId } from "@/lib/ai/providers"

interface PromptEnhancerProps {
  className?: string
}

export default function PromptEnhancer({ className }: PromptEnhancerProps) {
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [target, setTarget] = useState("General Tasks")
  const [providerId, setProviderId] = useState<ProviderId | undefined>(undefined)
  const [model, setModel] = useState<string>("")
  const [outputFormat, setOutputFormat] = useState("Step-by-step")
  const [principles, setPrinciples] = useState<string[]>([])
  const [tone, setTone] = useState("Professional")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [showExplanation, setShowExplanation] = useState(false)
  const { copy, isCopying } = useClipboard()
  const { generate, isLoading, error } = useAI({ providerId })
  const { settings } = useAISettings()

  const targets = [
    "Creative Writing",
    "Coding",
    "Analysis",
    "Research",
    "General Tasks",
    "Business",
    "Education"
  ]

  // Dynamic output formats based on target use case
  const outputFormatsByTarget: Record<string, string[]> = useMemo(() => ({
    "Creative Writing": ["Narrative", "Descriptive", "Dialogue-focused", "Scene-by-scene", "Character-driven"],
    "Coding": ["Step-by-step", "Code-first", "Explained", "With comments", "Documented"],
    "Analysis": ["Structured", "Comparative", "Critical", "Data-driven", "Executive summary"],
    "Research": ["Academic", "Annotated", "Systematic review", "Literature review", "Detailed findings"],
    "General Tasks": ["Step-by-step", "Concise", "Detailed", "Structured", "Conversational"],
    "Business": ["Executive summary", "Action-oriented", "Strategic", "Presentation-ready", "ROI-focused"],
    "Education": ["Tutorial-style", "ELI5", "Progressive difficulty", "With exercises", "Interactive"]
  }), [])

  const outputFormats = outputFormatsByTarget[target] || outputFormatsByTarget["General Tasks"]

  const availablePrinciples = [
    "Think step-by-step",
    "Use examples",
    "Be specific",
    "Chain of thought",
    "Role-play expert"
  ]
  const tones = ["Professional", "Casual", "Technical", "Friendly"]

  // Get provider name for display
  const getProviderName = (id: ProviderId) => {
    const names: Record<ProviderId, string> = {
      openai: "OpenAI",
      anthropic: "Anthropic (Claude)",
      google: "Google (Gemini)",
      "anthropic-custom": "Anthropic Custom",
      cerebras: "Cerebras"
    }
    return names[id] || id
  }

  const handleTargetChange = (newTarget: string) => {
    setTarget(newTarget)
    const formats = outputFormatsByTarget[newTarget]
    if (formats && !formats.includes(outputFormat)) {
      setOutputFormat(formats[0])
    }
  }

  const togglePrinciple = (principle: string) => {
    setPrinciples(prev =>
      prev.includes(principle)
        ? prev.filter(p => p !== principle)
        : [...prev, principle]
    )
  }

  const enhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast.error("Please enter a prompt to enhance.")
      setEnhancedPrompt("")
      return
    }

    try {
      // Build the enhancement instruction
      const systemPrompt = `You are an expert prompt engineer. Your task is to enhance prompts for AI models to get better results.

Target Use Case: ${target}
Target AI Model: ${providerId ? getProviderName(providerId) : "Default AI Model"}
Desired Output Format: ${outputFormat}
Tone: ${tone}
${principles.length > 0 ? `Enhancement Principles: ${principles.join(", ")}` : ""}

Enhance the user's prompt by:
1. Adding clear context and role-based framing appropriate for ${target}
2. Incorporating the desired output format (${outputFormat})
3. Applying the selected tone (${tone})
4. Including any selected enhancement principles
5. Optimizing for the ${providerId ? getProviderName(providerId) : "selected AI model"}
6. Making the instructions clear, specific, and actionable

IMPORTANT: Keep the core intent of the original prompt intact. Only enhance and clarify, don't change what the user is asking for.

Return ONLY the enhanced prompt, nothing else.`

      const fullPrompt = `Original prompt to enhance:\n\n${originalPrompt.trim()}`

      const enhanced = await generate({
        prompt: `${systemPrompt}\n\n${fullPrompt}`,
        temperature: 0.3
      })

      setEnhancedPrompt(enhanced)
      toast.success("Prompt enhanced successfully!")
    } catch (err) {
      console.error("Enhancement error:", err)
      toast.error(error || "Failed to enhance prompt. Please try again.")
    }
  }

  const handleCopyPrompt = () => {
    if (enhancedPrompt) {
      copy(enhancedPrompt, "Enhanced prompt copied to clipboard!")
    }
  }

  return (
    <div className={`grid md:grid-cols-2 gap-6 h-full ${className || ""}`}>
      {/* Input Section */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div>
            <Label htmlFor="original-prompt" className="font-semibold mb-2 block">Your Prompt</Label>
            <Textarea
              id="original-prompt"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="min-h-[160px] resize-none"
            />
          </div>

          <div>
            <Label>Target Use Case</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {targets.map(t => (
                <Badge
                  key={t}
                  variant={target === t ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    target === t
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-transparent shadow-lg"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 text-blue-800 hover:from-blue-100 hover:to-blue-200"
                  }`}
                  onClick={() => handleTargetChange(t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ai-provider">AI Provider</Label>
                <Select
                  value={providerId || settings.activeProvider || ""}
                  onValueChange={(value: ProviderId) => {
                    setProviderId(value)
                    // Reset model when provider changes
                    const config = settings.providers[value]
                    if (config) {
                      setModel(config.model)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider">
                      {providerId ? getProviderName(providerId) : settings.activeProvider ? getProviderName(settings.activeProvider) : "No provider"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(settings.providers)
                      .filter(([, config]) => config.enabled)
                      .map(([id]) => (
                        <SelectItem key={id} value={id}>
                          {getProviderName(id as ProviderId)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ai-model">Model</Label>
                <Select
                  value={model || (providerId || settings.activeProvider) ? settings.providers[providerId || settings.activeProvider!]?.model || "" : ""}
                  onValueChange={setModel}
                  disabled={!providerId && !settings.activeProvider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model">
                      {(providerId || settings.activeProvider)
                        ? settings.providers[providerId || settings.activeProvider!]?.model || "No model"
                        : "Select provider first"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(providerId || settings.activeProvider) && (
                      <SelectItem value={settings.providers[providerId || settings.activeProvider!]?.model || ""}>
                        {settings.providers[providerId || settings.activeProvider!]?.model || "No model"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!settings.activeProvider && (
              <p className="text-sm text-muted-foreground mt-2">
                <IconSettings className="inline h-3 w-3 mr-1" />
                Configure AI providers in{" "}
                <a href="/settings" className="underline">
                  Settings
                </a>
              </p>
            )}
          </div>

          <div>
            <Label>Output Format</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {outputFormats.map(f => (
                <Badge
                  key={f}
                  variant={outputFormat === f ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    outputFormat === f
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-transparent shadow-lg"
                      : "bg-gradient-to-r from-emerald-50 to-green-100 border-emerald-300 text-emerald-800 hover:from-emerald-100 hover:to-green-200"
                  }`}
                  onClick={() => setOutputFormat(f)}
                >
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Enhancement Principles</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availablePrinciples.map(p => (
                <Badge
                  key={p}
                  variant={principles.includes(p) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    principles.includes(p)
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-transparent shadow-lg"
                      : "bg-gradient-to-r from-amber-50 to-orange-100 border-amber-300 text-amber-800 hover:from-amber-100 hover:to-orange-200"
                  }`}
                  onClick={() => togglePrinciple(p)}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tones.map(t => (
                <Badge
                  key={t}
                  variant={tone === t ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    tone === t
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-transparent shadow-lg"
                      : "bg-gradient-to-r from-violet-50 to-purple-100 border-violet-300 text-violet-800 hover:from-violet-100 hover:to-purple-200"
                  }`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={enhancePrompt}
            disabled={isLoading || !originalPrompt.trim() || !settings.activeProvider}
            className="w-full"
          >
            {isLoading ? (
              <>
                <IconSparkles className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <IconSparkles className="mr-2 h-4 w-4" />
                Enhance Prompt
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Enhanced Prompt</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPrompt}
              disabled={!enhancedPrompt || isCopying}
            >
              {isCopying ? (
                <>
                  <IconCheck className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <IconCopy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto">
            {enhancedPrompt ? (
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {enhancedPrompt}
              </pre>
            ) : (
              <p className="text-muted-foreground text-center mt-20">
                Your enhanced prompt will appear here...
              </p>
            )}
          </div>

          {enhancedPrompt && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-explanation"
                  checked={showExplanation}
                  onChange={(e) => setShowExplanation(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="show-explanation" className="text-sm">
                  Show explanation of changes
                </Label>
              </div>

              {showExplanation && (
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold text-sm mb-2">What was enhanced:</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Added role-based context for <strong>{target}</strong></li>
                    <li>Optimized for <strong>{providerId ? getProviderName(providerId) : "selected AI model"}</strong></li>
                    <li>Applied <strong>{outputFormat}</strong> formatting</li>
                    <li>Set tone to <strong>{tone}</strong></li>
                    {principles.length > 0 && (
                      <li>Included principles: {principles.join(", ")}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}