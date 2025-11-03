"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkGrid } from "@/components/artwork-grid"
import { ArtworkFilters } from "@/components/artwork-filters"
import { SearchBar } from "@/components/search-bar"

interface Artwork {
  _id: string
  title: string
  artist: string
  yearCreated: number
  description: string
  tags: string[]
  images: Array<{ url: string }>
  medium?: string
  period?: string
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const response = await fetch(`${backendUrl}/api/artworks`, {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.artworks) {
            setArtworks(data.artworks)
          }
        }
      } catch (error) {
        console.error('Failed to fetch artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPeriod = !selectedPeriod || artwork.period === selectedPeriod
      const matchesMedium = !selectedMedium || artwork.medium === selectedMedium

      return matchesSearch && matchesPeriod && matchesMedium
    })
  }, [searchQuery, selectedPeriod, selectedMedium, artworks])

  const periods = Array.from(new Set(artworks.filter(a => a.period).map((a) => a.period)))
  const mediums = Array.from(new Set(artworks.filter(a => a.medium).map((a) => a.medium)))

  const gridArtworks = filteredArtworks.map(artwork => ({
    id: artwork._id,
    title: artwork.title,
    artist: artwork.artist,
    year: artwork.yearCreated,
    image: artwork.images?.[0]?.url || '/placeholder.svg',
    tags: artwork.tags || [],
  }))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Explore Artworks</h1>
            <p className="text-lg text-foreground/70">Discover masterpieces from our collection</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/60">Loading artworks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters */}
              <div className="lg:col-span-1">
                <ArtworkFilters
                  periods={periods as string[]}
                  mediums={mediums as string[]}
                  selectedPeriod={selectedPeriod}
                  selectedMedium={selectedMedium}
                  onPeriodChange={setSelectedPeriod}
                  onMediumChange={setSelectedMedium}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <SearchBar query={searchQuery} onQueryChange={setSearchQuery} resultCount={filteredArtworks.length} />
                <ArtworkGrid artworks={gridArtworks} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
