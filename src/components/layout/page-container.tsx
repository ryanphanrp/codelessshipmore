"use client"

import { ReactNode, useEffect } from "react"
import { usePageHeader } from "@/components/layout/page-header-context"

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageContainer({ title, description, children }: PageContainerProps) {
  const { setPageHeader } = usePageHeader()

  useEffect(() => {
    setPageHeader({ title, description })
  }, [title, description, setPageHeader])

  return (
    <div className="flex flex-1 flex-col gap-4">
      {children}
    </div>
  )
}