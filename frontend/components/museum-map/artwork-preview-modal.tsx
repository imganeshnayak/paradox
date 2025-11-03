"use client"

import { useState } from "react"
import { X, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ArtworkPreviewModalProps {
  artwork: {
    id: string
    title: string
    artist: string
    imageUrl?: string
    floor: number
    x: number
    y: number
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ArtworkPreviewModal({ artwork, isOpen, onClose }: ArtworkPreviewModalProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  if (!isOpen || !artwork) return null

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="sticky top-0 flex justify-end p-4 bg-background/95 border-b border-border z-10">
            <button
              onClick={onClose}
              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image Container with Golden Frame */}
            <div className="flex justify-center">
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-sm shadow-xl max-w-md w-full">
                {/* Inner frame border */}
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-2">
                  {/* Image */}
                  <div className="relative bg-background rounded-sm overflow-hidden aspect-square flex items-center justify-center min-h-[300px]">
                    {imageLoading && !imageError && (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 size={32} className="text-primary animate-spin" />
                        <p className="text-sm text-foreground/60">Loading image...</p>
                      </div>
                    )}

                    {imageError && (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                          <MapPin size={24} className="text-foreground/40" />
                        </div>
                        <p className="text-sm text-foreground/60">Image not available</p>
                      </div>
                    )}

                    {artwork.imageUrl && (
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        className={`w-full h-full object-cover transition-opacity ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork Details */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  {artwork.title}
                </h2>
              </div>

              {/* Artist */}
              <div>
                <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-1">
                  Artist
                </p>
                <p className="text-lg text-foreground">{artwork.artist}</p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 pt-2 border-t border-border">
                <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-foreground">
                    Floor {artwork.floor} • Room ({artwork.x.toFixed(0)}, {artwork.y.toFixed(0)})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Link href={`/artwork/${artwork.id}`} className="flex-1">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View Full Details
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-border text-foreground hover:bg-foreground/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
