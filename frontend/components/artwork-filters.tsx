"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ArtworkFiltersProps {
  periods: string[]
  mediums: string[]
  selectedPeriod: string | null
  selectedMedium: string | null
  onPeriodChange: (period: string | null) => void
  onMediumChange: (medium: string | null) => void
}

export function ArtworkFilters({
  periods,
  mediums,
  selectedPeriod,
  selectedMedium,
  onPeriodChange,
  onMediumChange,
}: ArtworkFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Filters</h3>

        {/* Period Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Period</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPeriod === null ? "default" : "outline"}
              size="sm"
              className="rounded-full px-3 py-1 text-sm"
              onClick={() => onPeriodChange(null)}
            >
              All Periods
            </Button>
            {periods.map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                className="rounded-full px-3 py-1 text-sm"
                onClick={() => onPeriodChange(selectedPeriod === period ? null : period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Medium Filter */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Medium</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedMedium === null ? "default" : "outline"}
              size="sm"
              className="rounded-full px-3 py-1 text-sm"
              onClick={() => onMediumChange(null)}
            >
              All Mediums
            </Button>
            {mediums.map((medium) => (
              <Button
                key={medium}
                variant={selectedMedium === medium ? "default" : "outline"}
                size="sm"
                className="rounded-full px-3 py-1 text-sm"
                onClick={() => onMediumChange(selectedMedium === medium ? null : medium)}
              >
                {medium}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedPeriod || selectedMedium) && (
        <div className="bg-secondary/20 border border-secondary rounded-lg p-4">
          <div className="text-sm font-medium text-foreground mb-3">Active Filters</div>
          <div className="flex flex-wrap gap-2">
            {selectedPeriod && (
              <button
                onClick={() => onPeriodChange(null)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
              >
                {selectedPeriod}
                <X size={14} />
              </button>
            )}
            {selectedMedium && (
              <button
                onClick={() => onMediumChange(null)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
              >
                {selectedMedium}
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
