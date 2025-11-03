"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Settings, Plus } from "lucide-react"

interface AdminHeaderProps {
  timeRange: string
  onTimeRangeChange: (range: string) => void
  onUploadClick?: () => void
}

export function AdminHeader({ timeRange, onTimeRangeChange, onUploadClick }: AdminHeaderProps) {
  const timeRanges = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ]

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <BarChart3 size={28} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-foreground/60">Real-time museum visitor insights</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeRangeChange(range.value)}
                className={timeRange === range.value ? "bg-primary text-primary-foreground" : ""}
              >
                {range.label}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUploadClick}
              className="gap-2"
            >
              <Plus size={16} />
              Upload
            </Button>
            <Button variant="outline" size="sm">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
