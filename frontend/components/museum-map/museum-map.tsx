"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Loader2 } from "lucide-react"
import { ArtworkPreviewOverlay } from "./artwork-preview-overlay"

interface ArtworkLocation {
  id: string
  title: string
  artist: string
  imageUrl?: string
  model3DUrl?: string
  model3d?: { url: string }
  type?: string
  x: number
  y: number
  floor: number
}

export function MuseumMap() {
  const [artworkLocations, setArtworkLocations] = useState<ArtworkLocation[]>([])
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkLocation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch artworks from backend
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        const response = await fetch(`${backendUrl}/api/artworks`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch artworks")
        }

        const data = await response.json()
        
        // Map API response to ArtworkLocation format with real coordinates/data
        const locations: ArtworkLocation[] = (data.artworks || data || []).map(
          (artwork: any, index: number) => ({
            id: artwork._id || artwork.id || index.toString(),
            title: artwork.title || "Untitled",
            artist: artwork.artist || "Unknown Artist",
            imageUrl: artwork.images?.[0]?.url || artwork.image || artwork.imageUrl,
            // Handle both model3D and model3d
            model3DUrl: artwork.model3D?.url || artwork.model3d?.url,
            model3d: artwork.model3d,
            type: artwork.type || "painting", // painting or sculpture
            x: Math.random() * 80 + 10, // Random 10-90%
            y: Math.random() * 80 + 10, // Random 10-90%
            floor: (index % 2) + 1, // Distribute between floor 1 and 2
          })
        )

        setArtworkLocations(locations)
        setError(null)
      } catch (err) {
        console.error("Error fetching artworks:", err)
        setError("Failed to load artworks")
        // Fallback to sample data
        const sampleLocations: ArtworkLocation[] = [
          { id: "1", title: "Starry Night", artist: "Van Gogh", x: 20, y: 30, floor: 1, type: "painting" },
          { id: "2", title: "Persistence of Memory", artist: "Dalí", x: 60, y: 50, floor: 1, type: "painting" },
          { id: "3", title: "The Kiss", artist: "Klimt", x: 40, y: 70, floor: 2, type: "painting" },
          { id: "4", title: "Girl with Pearl Earring", artist: "Vermeer", x: 80, y: 40, floor: 2, type: "painting" },
          { id: "5", title: "The Son of Man", artist: "Magritte", x: 30, y: 80, floor: 1, type: "painting" },
          { id: "6", title: "The Scream", artist: "Munch", x: 70, y: 20, floor: 2, type: "painting" },
        ]
        setArtworkLocations(sampleLocations)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  const floorArtworks = artworkLocations.filter((a: ArtworkLocation) => a.floor === selectedFloor)

  const handleMarkerClick = (artwork: ArtworkLocation) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-foreground/60">Loading museum map...</p>
      </div>
    )
  }

  return (
    <>
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

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Card className="relative w-full aspect-square bg-card border-2 border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
          <svg 
            className="w-full h-full cursor-pointer absolute inset-0" 
            viewBox="0 0 100 100"
            role="img"
            aria-label="Museum map"
          >
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
            {floorArtworks.map((artwork: ArtworkLocation) => (
              <g 
                key={artwork.id} 
                onClick={() => handleMarkerClick(artwork)}
                className="cursor-pointer hover:opacity-100 transition-opacity"
              >
                {/* Animated outer ring */}
                <circle
                  cx={artwork.x}
                  cy={artwork.y}
                  r="5"
                  fill="none"
                  stroke="#DAA520"
                  strokeWidth="0.5"
                  opacity="0.3"
                  className="animate-pulse"
                />
                {/* Main marker */}
                <circle cx={artwork.x} cy={artwork.y} r="3" fill="#DAA520" opacity="0.9" />
                {/* Hover circle */}
                <circle
                  cx={artwork.x}
                  cy={artwork.y}
                  r="6"
                  fill="none"
                  stroke="#DAA520"
                  strokeWidth="0.8"
                  opacity="0.6"
                  className="hover:opacity-100 transition-opacity"
                />
              </g>
            ))}
          </svg>

          {/* Overlay legend */}
          <div className="absolute bottom-4 right-4 bg-background/95 border border-border rounded-lg p-3 text-xs z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-foreground/70">Click to preview</span>
            </div>
            <p className="text-foreground/60">{floorArtworks.length} artworks on this floor</p>
          </div>

          {/* Artwork Preview Overlay - positioned inside the grid */}
          <ArtworkPreviewOverlay 
            artwork={selectedArtwork} 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Card>

        {/* Thumbnail Grid */}
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground mb-4">Artworks on Floor {selectedFloor}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {floorArtworks.map((artwork: ArtworkLocation) => (
              <div
                key={artwork.id}
                onClick={() => handleMarkerClick(artwork)}
                className="group cursor-pointer"
              >
                <Card className="p-3 hover:border-primary transition-all hover:shadow-md h-full flex flex-col">
                  {/* Thumbnail */}
                  {artwork.imageUrl && (
                    <div className="mb-3 aspect-square rounded-md overflow-hidden bg-foreground/5">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <p className="font-serif font-semibold text-foreground text-sm line-clamp-2">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">{artwork.artist}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
