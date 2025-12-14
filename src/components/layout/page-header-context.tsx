"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface PageHeaderContextType {
    title: string
    description?: string
    setPageHeader: (header: { title: string; description?: string }) => void
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState<string | undefined>()

    const setPageHeader = ({ title, description }: { title: string; description?: string }) => {
        setTitle(title)
        setDescription(description)
    }

    return (
        <PageHeaderContext.Provider value={{ title, description, setPageHeader }}>
            {children}
        </PageHeaderContext.Provider>
    )
}

export function usePageHeader() {
    const context = useContext(PageHeaderContext)
    if (!context) {
        throw new Error("usePageHeader must be used within PageHeaderProvider")
    }
    return context
}
