"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface JsonViewerProps {
  data: unknown
  initialExpanded?: boolean
  className?: string
}

interface JsonNodeProps {
  keyName?: string
  value: unknown
  depth?: number
  isLast?: boolean
  initialExpanded?: boolean
}

function getValueType(value: unknown): string {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  return typeof value
}

function getValueColor(type: string): string {
  switch (type) {
    case "string":
      return "text-emerald-500 dark:text-emerald-400"
    case "number":
      return "text-blue-500 dark:text-blue-400"
    case "boolean":
      return "text-amber-500 dark:text-amber-400"
    case "null":
      return "text-rose-500 dark:text-rose-400"
    default:
      return "text-foreground"
  }
}

function JsonNode({ keyName, value, depth = 0, isLast = true, initialExpanded = true }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(initialExpanded)
  const type = getValueType(value)
  const isExpandable = type === "object" || type === "array"

  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    }
  }

  const renderValue = () => {
    if (type === "string") {
      return <span className={getValueColor(type)}>&quot;{String(value)}&quot;</span>
    }
    if (type === "null") {
      return <span className={getValueColor(type)}>null</span>
    }
    if (type === "boolean") {
      return <span className={getValueColor(type)}>{String(value)}</span>
    }
    if (type === "number") {
      return <span className={getValueColor(type)}>{String(value)}</span>
    }
    return null
  }

  const renderExpandable = () => {
    if (!isExpandable) return null

    const entries = type === "array" 
      ? (value as unknown[]).map((v, i) => [i, v] as const)
      : Object.entries(value as Record<string, unknown>)

    const bracketOpen = type === "array" ? "[" : "{"
    const bracketClose = type === "array" ? "]" : "}"
    const isEmpty = entries.length === 0

    if (isEmpty) {
      return (
        <span className="text-muted-foreground">
          {bracketOpen}{bracketClose}
        </span>
      )
    }

    return (
      <>
        <span className="text-muted-foreground">{bracketOpen}</span>
        {!isExpanded && (
          <span className="text-muted-foreground/60 text-xs ml-1">
            {entries.length} {type === "array" ? "items" : "keys"}
          </span>
        )}
        {isExpanded && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {entries.map(([key, val], index) => (
              <JsonNode
                key={String(key)}
                keyName={type === "array" ? undefined : String(key)}
                value={val}
                depth={depth + 1}
                isLast={index === entries.length - 1}
                initialExpanded={depth < 1}
              />
            ))}
          </div>
        )}
        <span className="text-muted-foreground">{bracketClose}</span>
      </>
    )
  }

  return (
    <div className="leading-relaxed">
      <div className="flex items-start gap-1 group">
        {isExpandable ? (
          <button
            onClick={toggleExpand}
            className="p-0.5 -ml-5 hover:bg-muted rounded transition-colors flex-shrink-0 mt-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        <span className="flex-1">
          {keyName !== undefined && (
            <>
              <span className="text-purple-500 dark:text-purple-400">&quot;{keyName}&quot;</span>
              <span className="text-muted-foreground mx-1">:</span>
            </>
          )}
          {isExpandable ? renderExpandable() : renderValue()}
          {!isLast && <span className="text-muted-foreground">,</span>}
        </span>
      </div>
    </div>
  )
}

export function JsonViewer({ data, initialExpanded = true, className }: JsonViewerProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="bg-muted/30 border border-border/50 rounded-lg p-4 pl-6 overflow-x-auto font-mono text-sm">
        <JsonNode value={data} initialExpanded={initialExpanded} />
      </div>
    </div>
  )
}
