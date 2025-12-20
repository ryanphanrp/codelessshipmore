"use client"

import { useState } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ApiKeyInput({
  value,
  onChange,
  placeholder = "Enter API key...",
  disabled = false
}: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)

  const maskedValue = value ? "•".repeat(Math.min(value.length, 40)) : ""

  return (
    <div className="relative">
      <Input
        type={showKey ? "text" : "password"}
        value={showKey ? value : (value ? maskedValue : "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10 font-mono text-xs"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={disabled}
        >
          {showKey ? (
            <IconEyeOff className="h-4 w-4" />
          ) : (
            <IconEye className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
