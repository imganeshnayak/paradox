"use client"

import React, { useState } from "react"
import { X, Loader2, Cuboid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Model3DViewer } from "@/components/artwork-detail/3d-model-viewer"

interface ArtworkPreviewOverlayProps {
  artwork: {
    id: string
    title: string
    artist: string
    imageUrl?: string
    model3DUrl?: string
    model3d?: { url: string }
    type?: string
    floor: number
    x: number
    y: number
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ArtworkPreviewOverlay({ artwork, isOpen, onClose }: ArtworkPreviewOverlayProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  if (!isOpen || !artwork) return null

  // Determine if this is a 3D model (sculpture) or image (painting)
  const model3DUrl = artwork.model3DUrl || artwork.model3d?.url
  const is3DModel = artwork.type === "sculpture" || !!model3DUrl
  const isSculpture = artwork.type === "sculpture"

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Position the overlay relative to the marker (centered on marker with offset)
  // Using CSS to position absolutely within the SVG container
  const overlayStyle = {
    left: `${artwork.x}%`,
    top: `${artwork.y}%`,
    transform: 'translate(-50%, -50%)',
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={overlayStyle}
    >
      {/* Card positioned absolutely */}
      <div
        className="absolute bg-background rounded-lg shadow-2xl w-80 pointer-events-auto"
        style={{
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onClose}
            className="p-1.5 bg-background/80 hover:bg-foreground/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-foreground" />
          </button>
        </div>

        {/* Image/Model Container with Golden Frame */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-sm">
          {/* Inner frame border */}
          <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-1.5">
            {/* 3D Model or Image */}
            <div className="relative bg-background rounded-sm overflow-hidden aspect-square flex items-center justify-center min-h-[180px]">
              {/* 3D Model Viewer */}
              {is3DModel && model3DUrl ? (
                <div className="w-full h-full">
                  <Model3DViewer modelUrl={model3DUrl} title={artwork.title} />
                </div>
              ) : (
                <>
                  {/* Image Loading */}
                  {imageLoading && !imageError && (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Loader2 size={20} className="text-primary animate-spin" />
                      <p className="text-xs text-foreground/60">Loading...</p>
                    </div>
                  )}

                  {/* Image Error */}
                  {imageError && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <span className="text-xs">📷</span>
                      </div>
                      <p className="text-xs text-foreground/60">No image</p>
                    </div>
                  )}

                  {/* Image */}
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Artwork Details */}
        <div className="p-3 space-y-2">
          {/* Title with 3D Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-serif font-bold text-foreground line-clamp-2 flex-1">
              {artwork.title}
            </h3>
            {isSculpture && (
              <div className="flex-shrink-0 bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold flex items-center gap-1">
                <Cuboid size={12} />
                3D
              </div>
            )}
          </div>

          {/* Artist */}
          <p className="text-xs text-foreground/60">{artwork.artist}</p>

          {/* Action Button */}
          <Link href={`/artwork/${artwork.id}`} className="block mt-3">
            <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
