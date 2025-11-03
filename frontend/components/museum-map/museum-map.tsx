"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface ArtworkLocation {
  id: string
  title: string
  artist: string
  x: number
  y: number
  floor: number
}

const artworkLocations: ArtworkLocation[] = [
  { id: "1", title: "Starry Night", artist: "Van Gogh", x: 20, y: 30, floor: 1 },
  { id: "2", title: "Persistence of Memory", artist: "Dalí", x: 60, y: 50, floor: 1 },
  { id: "3", title: "The Kiss", artist: "Klimt", x: 40, y: 70, floor: 2 },
  { id: "4", title: "Girl with Pearl Earring", artist: "Vermeer", x: 80, y: 40, floor: 2 },
  { id: "5", title: "The Son of Man", artist: "Magritte", x: 30, y: 80, floor: 1 },
  { id: "6", title: "The Scream", artist: "Munch", x: 70, y: 20, floor: 2 },
]

export function MuseumMap() {
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkLocation | null>(null)

  const floorArtworks = artworkLocations.filter((a) => a.floor === selectedFloor)

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2].map((floor) => (
          <Button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            variant={selectedFloor === floor ? "default" : "outline"}
            className={selectedFloor === floor ? "bg-primary" : ""}
          >
            Floor {floor}
          </Button>
        ))}
      </div>

      <Card className="relative w-full aspect-square bg-card border-2 border-border rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Floor background */}
          <rect width="100" height="100" fill="#f5f1e8" />

          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e0ddd5" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Artworks as interactive markers */}
          {floorArtworks.map((artwork) => (
            <g key={artwork.id} onClick={() => setSelectedArtwork(artwork)} className="cursor-pointer">
              <circle cx={artwork.x} cy={artwork.y} r="3" fill="#DAA520" opacity="0.8" />
              <circle
                cx={artwork.x}
                cy={artwork.y}
                r="5"
                fill="none"
                stroke="#DAA520"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Overlay legend */}
        <div className="absolute bottom-4 right-4 bg-background/95 border border-border rounded-lg p-3 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Click to select</span>
          </div>
          <p className="text-foreground/60">{floorArtworks.length} artworks on this floor</p>
        </div>
      </Card>

      {selectedArtwork && (
        <Card className="p-6 bg-card border-2 border-primary">
          <h3 className="text-lg font-serif font-bold text-foreground mb-2">{selectedArtwork.title}</h3>
          <p className="text-foreground/70 mb-4">by {selectedArtwork.artist}</p>
          <Link href={`/artwork/${selectedArtwork.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              <MapPin size={16} className="mr-2" />
              View Artwork Details
            </Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {floorArtworks.map((artwork) => (
          <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
            <Card
              onClick={() => setSelectedArtwork(artwork)}
              className="p-4 cursor-pointer hover:border-primary transition-colors"
            >
              <p className="font-serif font-semibold text-foreground text-sm">{artwork.title}</p>
              <p className="text-xs text-foreground/60">{artwork.artist}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
