"use client"

import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArtworkHeaderProps {
  artwork: any
  liked: boolean
  onLikeToggle: () => void
}

export function ArtworkHeader({ artwork, liked, onLikeToggle }: ArtworkHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-card via-background to-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
              <img
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="order-1 md:order-2 flex flex-col justify-between">
            <div>
              <p className="text-sm text-primary font-semibold mb-2">{artwork.period}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">{artwork.title}</h1>
              <p className="text-xl text-foreground/80 mb-4">by {artwork.artist}</p>
              <p className="text-base text-foreground/70 leading-relaxed mb-6">{artwork.description}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onLikeToggle}
                variant={liked ? "default" : "outline"}
                className={liked ? "bg-primary text-primary-foreground" : ""}
              >
                <Heart size={20} className={liked ? "fill-current" : ""} />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button variant="outline">
                <Share2 size={20} />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
