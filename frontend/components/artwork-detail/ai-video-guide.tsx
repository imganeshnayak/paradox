"use client"

import { useState } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIVideoGuideProps {
  artwork: any
}

export function AIVideoGuide({ artwork }: AIVideoGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-8 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-secondary-foreground">
            <Volume2 size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground">AI Video Guide</h3>
          <p className="text-sm text-foreground/60">AI-generated explanation of this artwork</p>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden mb-6">
        <img src={artwork.image || "/placeholder.svg"} alt={artwork.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </Button>
        </div>
      </div>

      {isPlaying && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            This masterpiece from {artwork.year} created by {artwork.artist} is a remarkable example of {artwork.period}
            . The artwork utilizes {artwork.medium} to create a compelling visual narrative. The composition
            demonstrates sophisticated understanding of color theory and spatial relationships. Notice the intricate
            details in the brushwork and the emotional intensity conveyed through the artist's technique. This piece has
            influenced generations of artists and continues to captivate audiences with its timeless appeal.
          </p>
        </div>
      )}
    </div>
  )
}
