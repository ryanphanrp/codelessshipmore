"use client"

import { PageContainer } from "@/components/layout/page-container"
import { AuthGate } from "@/components/auth/auth-gate"
import { PromptEnhancer } from "@/components/features/enhance-prompt"

export default function EnhancePromptPage() {
  return (
    <AuthGate>
      <PageContainer
        title="AI Prompt Enhancer"
        description="Transform your prompts into powerful, optimized instructions"
      >
        <PromptEnhancer className="h-full" />
      </PageContainer>
    </AuthGate>
  )
}
