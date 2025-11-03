"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MuseumMap } from "@/components/museum-map/museum-map"

export default function MuseumMapPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Museum Map</h1>
            <p className="text-lg text-foreground/70">
              Navigate through the museum and discover artworks by location. Click on artworks to view details.
            </p>
          </div>

          <MuseumMap />
        </div>
      </div>
      <Footer />
    </>
  )
}
