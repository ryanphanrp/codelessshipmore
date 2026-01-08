import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBraces, IconDatabase, IconFileCode, IconAdjustments, IconArrowRight } from "@tabler/icons-react"

const features = [
  {
    title: "JSON Viewer",
    description: "Format and explore JSON data with interactive viewing capabilities including pretty print and tree view modes",
    href: "/json-viewer",
    icon: IconBraces,
    color: "text-green-600"
  },
  {
    title: "SQL Placeholder",
    description: "Fill SQL query placeholders with parameter values from logs, converting JDBC-style ? placeholders to actual values",
    href: "/sql-placeholder",
    icon: IconDatabase,
    color: "text-blue-600"
  },
  {
    title: "Properties Converter",
    description: "Convert between YAML, Properties, Spring @Value annotations, and Environment variables formats",
    href: "/properties-converter",
    icon: IconAdjustments,
    color: "text-purple-600"
  },
  {
    title: "Record to Protobuf",
    description: "Convert Java record classes to Protocol Buffer definitions with multiple conversion options",
    href: "/record-protobuf",
    icon: IconFileCode,
    color: "text-orange-600"
  }
]

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          CodelessShipMore
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          A collection of developer utilities for JSON, SQL, Protobuf, and Properties conversion
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/json-viewer">
              Get Started <IconArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                {feature.title}
              </CardTitle>
              <CardDescription>
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={feature.href}>
                  Try Now <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">🎨 Modern UI</h3>
            <p className="text-sm text-muted-foreground">Clean, responsive interface with dark mode support</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">⚡ Fast & Efficient</h3>
            <p className="text-sm text-muted-foreground">Built with Next.js 16 and optimized for performance</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">📋 Clipboard Support</h3>
            <p className="text-sm text-muted-foreground">Seamless copy/paste functionality across all tools</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">💾 Export Options</h3>
            <p className="text-sm text-muted-foreground">Download results in various formats for later use</p>
          </div>
        </div>
      </div>
    </div>
  )
}