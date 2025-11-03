"use client"

import { useState } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioGuideProps {
  artwork: any
}

export function AudioGuide({ artwork }: AudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-primary/5 border-2 border-primary rounded-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
            <Volume2 size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground">Audio Guide</h3>
          <p className="text-sm text-foreground/60">Explore this artwork with expert narration</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full h-1 bg-muted rounded-full mb-4"></div>
        <div className="flex justify-between text-xs text-foreground/60">
          <span>00:00</span>
          <span>4:32</span>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? (
            <>
              <Pause size={20} className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Play Audio Guide
            </>
          )}
        </Button>
      </div>

      <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto">
        <p className="text-sm text-foreground/80 leading-relaxed">{artwork.audioTranscript}</p>
      </div>
    </div>
  )
}
