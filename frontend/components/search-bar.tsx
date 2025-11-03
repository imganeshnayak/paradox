"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  resultCount: number
}

export function SearchBar({ query, onQueryChange, resultCount }: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40" size={20} />
        <Input
          type="text"
          placeholder="Search artworks, artists..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-12 py-3 bg-card border-border text-foreground placeholder:text-foreground/40"
        />
      </div>
      {query && (
        <p className="text-sm text-foreground/60 mt-2">
          Found {resultCount} artwork{resultCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
