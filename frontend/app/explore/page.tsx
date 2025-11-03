"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkGrid } from "@/components/artwork-grid"
import { ArtworkFilters } from "@/components/artwork-filters"
import { SearchBar } from "@/components/search-bar"

// Mock artwork data
const mockArtworks = [
  {
    id: "1",
    title: "Starry Night",
    artist: "Vincent van Gogh",
    year: 1889,
    medium: "Oil on canvas",
    period: "Post-Impressionism",
    image: "/starry-night-painting.jpg",
    description: "A swirling night sky over a sleeping village, one of the most iconic paintings in art history.",
    audioUrl: "https://example.com/audio/starry-night.mp3",
    tags: ["landscape", "night", "famous"],
  },
  {
    id: "2",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: 1931,
    medium: "Oil on canvas",
    period: "Surrealism",
    image: "/persistence-of-memory-dali.jpg",
    description: "Melting clocks in a dreamlike landscape, exploring the nature of time and reality.",
    audioUrl: "https://example.com/audio/persistence-of-memory.mp3",
    tags: ["surrealism", "abstract", "famous"],
  },
  {
    id: "3",
    title: "The Kiss",
    artist: "Gustav Klimt",
    year: 1908,
    medium: "Oil and gold leaf on canvas",
    period: "Art Nouveau",
    image: "/the-kiss-klimt-painting.jpg",
    description: "An intimate moment depicted in gold and precious materials, embodying romantic love.",
    audioUrl: "https://example.com/audio/the-kiss.mp3",
    tags: ["romance", "decorative", "famous"],
  },
  {
    id: "4",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: 1665,
    medium: "Oil on canvas",
    period: "Dutch Golden Age",
    image: "/girl-with-pearl-earring-vermeer.jpg",
    description: "A mysterious portrait of a girl wearing an exotic pearl earring, capturing a fleeting moment.",
    audioUrl: "https://example.com/audio/pearl-earring.mp3",
    tags: ["portrait", "classical", "famous"],
  },
  {
    id: "5",
    title: "The Son of Man",
    artist: "René Magritte",
    year: 1964,
    medium: "Oil on canvas",
    period: "Surrealism",
    image: "/the-son-of-man-magritte.jpg",
    description: "A man in a bowler hat with an apple covering his face, a symbol of mystery and paradox.",
    audioUrl: "https://example.com/audio/son-of-man.mp3",
    tags: ["surrealism", "portrait", "famous"],
  },
  {
    id: "6",
    title: "The Scream",
    artist: "Edvard Munch",
    year: 1893,
    medium: "Oil, tempera, pastel on cardboard",
    period: "Expressionism",
    image: "/the-scream-munch.jpg",
    description: "An anguished figure against a tumultuous orange sky, expressing existential anxiety.",
    audioUrl: "https://example.com/audio/the-scream.mp3",
    tags: ["expressionism", "emotion", "famous"],
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null)

  const filteredArtworks = useMemo(() => {
    return mockArtworks.filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPeriod = !selectedPeriod || artwork.period === selectedPeriod
      const matchesMedium = !selectedMedium || artwork.medium === selectedMedium

      return matchesSearch && matchesPeriod && matchesMedium
    })
  }, [searchQuery, selectedPeriod, selectedMedium])

  const periods = Array.from(new Set(mockArtworks.map((a) => a.period)))
  const mediums = Array.from(new Set(mockArtworks.map((a) => a.medium)))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Explore Artworks</h1>
            <p className="text-lg text-foreground/70">Discover masterpieces from around the world</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <ArtworkFilters
                periods={periods}
                mediums={mediums}
                selectedPeriod={selectedPeriod}
                selectedMedium={selectedMedium}
                onPeriodChange={setSelectedPeriod}
                onMediumChange={setSelectedMedium}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} resultCount={filteredArtworks.length} />
              <ArtworkGrid artworks={filteredArtworks} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
